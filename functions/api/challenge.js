// Cryptographic Challenge Endpoint
// Generates a one-time signed nonce for Challenge-Response Authentication
const SERVER_SECRET = "fulldy_sec_chal_8f3a9b1c7d2e4f0a6b5c8d1e3f7a9b2c";
const SALT = "fulldy-center-auth-salt-2026";
const ITERATIONS = 100000;

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function hmacSign(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return bytesToHex(new Uint8Array(sig));
}

export async function onRequestGet() {
  const ts = Date.now().toString();
  const rnd = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  const sig = await hmacSign(SERVER_SECRET, `${ts}:${rnd}`);
  const nonce = `${ts}:${rnd}:${sig}`;

  return new Response(
    JSON.stringify({
      nonce,
      salt: SALT,
      iterations: ITERATIONS
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    }
  );
}
