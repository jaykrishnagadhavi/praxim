import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const redirectUrl = `${origin}${next}`;
      const response = NextResponse.redirect(redirectUrl);
      
      // Explicitly copy cookies to the redirect response to prevent Next.js from dropping them
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      allCookies.forEach(cookie => {
        response.cookies.set({
          name: cookie.name,
          value: cookie.value,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 31536000,
        });
      });

      return response;
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/?error=auth_failed`);
}
