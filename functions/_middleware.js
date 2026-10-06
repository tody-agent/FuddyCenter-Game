// Edge Middleware: Cryptographic Session Validation
const JWT_SECRET = "boxme_jwt_secret_99887766554433221100aabbccddeeff";
const AUTH_COOKIE = "bmwms_auth";

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

function base64UrlDecode(str) {
  try {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    const binary = atob(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    return null;
  }
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

async function verifyToken(token) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [header, payload, sig] = parts;
  const expectedSig = await hmacSign(JWT_SECRET, `${header}.${payload}`);
  if (!timingSafeEqual(sig, expectedSig)) return false;

  const decoded = base64UrlDecode(payload);
  if (!decoded) return false;

  try {
    const data = JSON.parse(decoded);
    const now = Math.floor(Date.now() / 1000);
    if (!data.exp || data.exp < now) return false;
    return true;
  } catch (e) {
    return false;
  }
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // 1. Whitelist API endpoints and static assets
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".ttf")
  ) {
    return next();
  }

  // 2. Extract cookie
  const cookieHeader = request.headers.get("Cookie") || "";
  let authToken = null;
  for (const c of cookieHeader.split(";")) {
    const trimmed = c.trim();
    if (trimmed.startsWith(`${AUTH_COOKIE}=`)) {
      authToken = trimmed.substring(`${AUTH_COOKIE}=`.length);
      break;
    }
  }

  const isAuthenticated = await verifyToken(authToken);

  // 3. Login routes
  if (url.pathname === "/login" || url.pathname === "/login.html") {
    if (isAuthenticated) {
      return Response.redirect(new URL("/", request.url), 302);
    }
    return next();
  }

  // 4. Protect root & all other paths
  if (!isAuthenticated) {
    return Response.redirect(new URL("/login", request.url), 302);
  }

  // 5. Authorized
  return next();
}
