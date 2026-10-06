#!/usr/bin/env python3
"""
Audit GameDev Agent Skills & Hooks
Scanner an ninh chuyên dụng cho các bộ Skill, Hook và Plugin AI Agent trong phát triển Game.
Phát hiện:
- Dynamic context command execution (`!cmd`)
- Wildcard tool execution (Bash(*))
- Credential harvesting (.ssh, .env, cloud tokens)
- Dangerous shell execution (reverse shells, piping to sh, unsanitized eval)
- Copyleft contamination (AGPL-3.0 / GPL-3.0)
- Hidden hooks and auto-running scripts
"""

import os
import sys
import re
import json
from pathlib import Path

# Danh mục các mẫu Regex kiểm tra an ninh
SECURITY_RULES = [
    {
        "id": "DYN_CTX_EXEC",
        "severity": "CRITICAL",
        "description": "Dynamic context command execution: Chạy lệnh shell trước khi LLM xem xét skill",
        "regex": re.compile(r"!`[^`]+`|`![^`]+`"),
        "exts": [".md", ".json", ".yaml", ".yml", ".txt"]
    },
    {
        "id": "UNCONSTRAINED_BASH",
        "severity": "HIGH",
        "description": "Cấp quyền Bash wildcard không giới hạn (Bash(*))",
        "regex": re.compile(r"allowed-tools:.*Bash\(\*\)|tools:\s*\[\s*\"Bash\(\*\)\"\s*\]", re.IGNORECASE),
        "exts": [".md", ".json", ".yaml", ".yml"]
    },
    {
        "id": "ENV_SCRIPT_EXEC",
        "severity": "CRITICAL",
        "description": "Thực thi file .env như shell script (Arbitrary Code Execution qua set -a; . .env)",
        "regex": re.compile(r"set\s+-a;\s*\.\s+\.env|source\s+\.env|\.\s+\.env"),
        "exts": [".sh", ".bash", ".zsh", ".js", ".ts", ".py", ".md"]
    },
    {
        "id": "PIPE_TO_SHELL",
        "severity": "CRITICAL",
        "description": "Tải script từ mạng và pipe thẳng vào shell (curl | sh, wget | bash)",
        "regex": re.compile(r"(curl|wget|fetch|Invoke-WebRequest)[^|\n]+?\|\s*(sh|bash|zsh|powershell|pwsh)", re.IGNORECASE),
        "exts": [".sh", ".bash", ".js", ".ts", ".py", ".md", ".json"]
    },
    {
        "id": "CREDENTIAL_SNOOPING",
        "severity": "HIGH",
        "description": "Truy cập đường dẫn credential nhạy cảm (~/.ssh, ~/.aws, token, id_rsa)",
        "regex": re.compile(r"(~|\$HOME|/root|/home/\w+)/(\.ssh|\.aws|\.gnupg|\.claude|\.herenow|\.docker)|\bgh\s+auth\s+token\b|\bid_rsa\b|\bid_ed25519\b"),
        "exts": [".sh", ".bash", ".js", ".ts", ".py", ".md", ".json"]
    },
    {
        "id": "REVERSE_SHELL",
        "severity": "CRITICAL",
        "description": "Mã thực thi reverse shell hoặc kết nối socket mạng trái phép",
        "regex": re.compile(r"nc(\.traditional|\.openbsd)?\s+-[el]|/dev/tcp/\d+\.\d+\.\d+\.\d+|socket\.connect|mkfifo\s+/tmp/"),
        "exts": [".sh", ".bash", ".py", ".js", ".ts"]
    },
    {
        "id": "DESTRUCTIVE_COMMANDS",
        "severity": "HIGH",
        "description": "Lệnh xóa file phá hủy hệ thống hoặc git force push",
        "regex": re.compile(r"rm\s+-rf\s+(/|/\*|~|\$HOME|\.\./)|git\s+push\s+--force|git\s+reset\s+--hard\s+HEAD"),
        "exts": [".sh", ".bash", ".py", ".js", ".ts", ".md"]
    },
    {
        "id": "VIRAL_COPYLEFT_LICENSE",
        "severity": "MEDIUM",
        "description": "Phát hiện giấy phép lây nhiễm AGPL-3.0 hoặc GPL-3.0 (Rủi ro pháp lý cho game thương mại)",
        "regex": re.compile(r"AGPL-3\.0|Affero\s+General\s+Public\s+License|GPL-3\.0", re.IGNORECASE),
        "exts": [".json", ".md", ".txt", "LICENSE", "LICENCE"]
    }
]

def scan_target(target_path):
    target = Path(target_path)
    if not target.exists():
        print(f"[!] Đường dẫn không tồn tại: {target_path}")
        return 1

    findings = []
    total_files_scanned = 0

    print(f"\n" + "="*70)
    print(f"🛡️  BẮT ĐẦU AUDIT AN NINH SKILLS & HOOKS CHO GAME DEVELOPMENT")
    print(f"📂 Mục tiêu quét: {target.resolve()}")
    print("="*70 + "\n")

    # Kiểm tra git submodule nếu có
    gitmodules = target / ".gitmodules"
    if gitmodules.exists():
        findings.append({
            "id": "TRANSITIVE_SUBMODULE",
            "severity": "HIGH",
            "file": str(gitmodules),
            "line": 1,
            "snippet": "Phát hiện .gitmodules: Repo phụ thuộc bắc cầu sang repo bên thứ ba không kiểm soát.",
            "description": "Rủi ro chuỗi cung ứng mở rộng (Transitive Dependency Attack)"
        })

    # Duyệt file
    for root, dirs, files in os.walk(target):
        # Bỏ qua các thư mục venv, node_modules, .git
        dirs[:] = [d for d in dirs if d not in [".git", "node_modules", ".venv", "__pycache__", "dist", "build"]]
        
        for file in files:
            file_path = Path(root) / file
            # Bỏ qua chính file scanner
            if file_path.resolve() == Path(__file__).resolve():
                continue
            suffix = file_path.suffix.lower()
            name = file_path.name.upper()

            total_files_scanned += 1
            
            try:
                content = file_path.read_text(encoding="utf-8", errors="ignore")
            except Exception as e:
                continue

            lines = content.splitlines()

            for rule in SECURITY_RULES:
                # Kiểm tra định dạng file khớp rule
                applies = any(suffix == ext or name == ext for ext in rule["exts"])
                if not applies and not (name.startswith("LICENSE") or name.startswith("LICENCE")):
                    continue

                for line_idx, line in enumerate(lines, 1):
                    match = rule["regex"].search(line)
                    if match:
                        snippet = line.strip()
                        if len(snippet) > 120:
                            snippet = snippet[:117] + "..."
                        findings.append({
                            "id": rule["id"],
                            "severity": rule["severity"],
                            "file": str(file_path.relative_to(target) if target.is_dir() else file_path),
                            "line": line_idx,
                            "snippet": snippet,
                            "description": rule["description"]
                        })

    # Tổng kết kết quả
    critical_count = sum(1 for f in findings if f["severity"] == "CRITICAL")
    high_count = sum(1 for f in findings if f["severity"] == "HIGH")
    medium_count = sum(1 for f in findings if f["severity"] == "MEDIUM")

    print(f"📊 Đã quét: {total_files_scanned} files.")
    print(f"🚨 Phát hiện: {critical_count} CRITICAL | {high_count} HIGH | {medium_count} MEDIUM\n")

    if not findings:
        print("✅ KẾT QUẢ: TUYỆT VỜI! Không phát hiện lỗ hổng an ninh hoặc mẫu mã độc phổ biến.")
        print("   (Lưu ý: Luôn ghim commit hash và chạy trong devcontainer để an toàn tuyệt đối).")
        return 0

    print("--- CHI TIẾT CÁC ĐIỂM CẦN LƯU Ý / CHẶN ---")
    for idx, f in enumerate(findings, 1):
        color = "🔴" if f["severity"] == "CRITICAL" else ("🟠" if f["severity"] == "HIGH" else "🟡")
        print(f"{idx}. {color} [{f['severity']}] {f['id']} - {f['file']}:{f['line']}")
        print(f"   Mô tả: {f['description']}")
        print(f"   Code:  {f['snippet']}\n")

    if critical_count > 0 or high_count > 0:
        print("🚫 KHUYẾN NGHỊ: CHẶN CÀI ĐẶT TRỰC TIẾP!")
        print("   Hãy trích xuất nội dung Prompt thủ công và loại bỏ file hook/script trước khi nạp vào agent.")
        return 2

    return 0

if __name__ == "__main__":
    scan_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    sys.exit(scan_target(scan_dir))
