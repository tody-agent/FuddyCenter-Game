// Secure Authentication API with Challenge-Response & Zero Plaintext Password
const SERVER_SECRET = "fulldy_sec_chal_8f3a9b1c7d2e4f0a6b5c8d1e3f7a9b2c";
const JWT_SECRET = "fulldy_jwt_secret_99887766554433221100aabbccddeeff";
const AUTH_COOKIE = "bmwms_auth";

// 100,000 rounds PBKDF2-HMAC-SHA256 hash of password with custom salt
// Original password never exists in codebase
const EXPECTED_CLIENT_KEY_HEX = "53e5f0df8a43293754ddf58afc66cd4047e5344fa178d60362d2cf43da79507a";

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacSign(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    typeof secret === "string" ? new TextEncoder().encode(secret) : secret,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return bytesToHex(new Uint8Array(sig));
}

function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function onRequestPost(context) {
  const { request } = context;

  try {
    const body = await request.json();
    const { nonce, proof } = body || {};

    if (!nonce || !proof) {
      return new Response(
        JSON.stringify({ success: false, message: "Dữ liệu xác thực không đầy đủ" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Verify Nonce structure and HMAC signature
    const parts = nonce.split(":");
    if (parts.length !== 3) {
      return new Response(
        JSON.stringify({ success: false, message: "Nonce không hợp lệ" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const [ts, rnd, nonceSig] = parts;
    const now = Date.now();
    const nonceTime = parseInt(ts, 10);

    // Expire challenge after 90 seconds
    if (isNaN(nonceTime) || now - nonceTime > 90000 || nonceTime > now + 10000) {
      return new Response(
        JSON.stringify({ success: false, message: "Phiên xác thực đã hết hạn, vui lòng thử lại" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const expectedNonceSig = await hmacSign(SERVER_SECRET, `${ts}:${rnd}`);
    if (!timingSafeEqual(nonceSig, expectedNonceSig)) {
      return new Response(
        JSON.stringify({ success: false, message: "Chữ ký nonce không hợp lệ" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Verify Challenge Proof with Stored Hash
    const expectedProof = await hmacSign(hexToBytes(EXPECTED_CLIENT_KEY_HEX), nonce);
    const isValid = timingSafeEqual(expectedProof, proof);

    if (!isValid) {
      // Artificial delay to prevent timing and brute-force attacks
      await new Promise(r => setTimeout(r, 400));
      return new Response(
        JSON.stringify({ success: false, message: "Mật khẩu không chính xác" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Issue Cryptographically Signed Session Token (JWT)
    const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const exp = Math.floor(now / 1000) + (30 * 86400); // 30 days
    const payload = base64UrlEncode(JSON.stringify({
      sub: "fulldy-operator",
      aud: "fulldy-center",
      iat: Math.floor(now / 1000),
      exp
    }));

    const sig = await hmacSign(JWT_SECRET, `${header}.${payload}`);
    const token = `${header}.${payload}.${sig}`;

    const maxAge = 60 * 60 * 24 * 30;
    const cookieHeader = `${AUTH_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;

    return new Response(
      JSON.stringify({ success: true, message: "Xác thực thành công", token }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieHeader
        }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: "Lỗi xử lý xác thực: " + err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
