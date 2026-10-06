const AUTH_COOKIE = "bmwms_auth";

export async function onRequest(context) {
  const cookieHeader = `${AUTH_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
  return new Response(
    JSON.stringify({ success: true, message: "Đã đăng xuất" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieHeader,
      },
    }
  );
}
