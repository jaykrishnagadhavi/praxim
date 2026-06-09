"use client";

import * as React from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoginButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  showError?: boolean;
}

export function LoginButton({ children, className, variant, showError = true }: LoginButtonProps) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("Auth error:", error);
        setErrorMessage(`Login failed: ${error.message}. Please make sure Google Auth is enabled and redirect URLs include ${window.location.origin}`);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setErrorMessage(`An unexpected error occurred: ${err.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button 
        onClick={handleGoogleLogin}
        disabled={isLoading}
        variant={variant}
        className={className}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Connecting...
          </>
        ) : (
          children
        )}
      </Button>
      
      {showError && errorMessage && (
        <div className="text-red-400 text-sm max-w-md bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-in fade-in zoom-in-95 duration-200 text-center">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
