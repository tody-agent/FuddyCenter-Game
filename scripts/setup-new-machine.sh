#!/usr/bin/env bash
# ==============================================================================
# FULLDY CENTER — ONE-CLICK SETUP SCRIPT FOR NEW MACHINES
# ==============================================================================
set -e

echo ""
echo "======================================================================"
echo "📦 FULLDY CENTER — THIẾT LẬP MÁY MỚI CHO ANTIGRAVITY CLI"
echo "======================================================================"
echo ""

# 1. Kiểm tra Node.js
echo "🔍 1. Kiểm tra môi trường Node.js..."
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Lỗi: Node.js chưa được cài đặt. Vui lòng cài đặt Node.js >= 20.0.0."
    exit 1
fi
NODE_VERSION=$(node -v)
echo "   ✅ Node.js: $NODE_VERSION"

# 2. Kiểm tra Python
echo "🔍 2. Kiểm tra môi trường Python 3..."
if ! command -v python3 >/dev/null 2>&1; then
    echo "❌ Lỗi: Python 3 chưa được cài đặt. Vui lòng cài đặt Python 3 >= 3.10 để chạy security scanner."
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo "   ✅ Python: $PYTHON_VERSION"

# 3. Cài đặt các gói phụ thuộc (bitECS)
echo ""
echo "📦 3. Cài đặt các gói phụ thuộc npm (bitECS)..."
npm install --no-audit --no-fund
echo "   ✅ Các gói phụ thuộc đã sẵn sàng."

# 4. Chạy toàn bộ Unit Tests TDD
echo ""
echo "🧪 4. Chạy kiểm tra bộ 14 Unit Tests TDD..."
npm test

# 5. Chạy quét an ninh
echo ""
echo "🛡️ 5. Quét an ninh toàn diện mã nguồn..."
npm run audit

# 6. Kiểm tra quyền thực thi của CLI binary
chmod +x bin/fulldy-cli.js scripts/audit-gamedev-skills.py

echo ""
echo "======================================================================"
echo "🎉 THIẾT LẬP HOÀN TẤT 100%! MÁY ĐÃ SẴN SÀNG CHO ANTIGRAVITY CLI"
echo "======================================================================"
echo ""
echo "Các bước tiếp theo:"
echo "1. Mở Antigravity CLI trong thư mục này:"
echo "   agy"
echo ""
echo "2. Dán đoạn Master Prompt từ file MASTER_PROMPT.md vào cửa sổ chat."
echo ""
echo "3. Để mở giao diện Terminal Dashboard trực quan, gõ lệnh:"
echo "   npm run dashboard"
echo ""
echo "======================================================================"
