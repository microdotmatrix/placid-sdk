"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { client } from "@/lib/auth/client";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={client}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => {
        // Clear router cache (protected routes)
        router.refresh();
      }}
      viewPaths={{
        signIn: "login",
        signOut: "logout",
        signUp: "register",
        forgotPassword: "forgot",
        resetPassword: "reset",
        magicLink: "magic",
        settings: "settings",
      }}
      additionalFields={{
        company: {
          label: "Company",
          placeholder: "Your company name",
          description: "The name of your company",
          required: false,
          type: "string",
        },
      }}
      providers={["github", "google", "discord"]}
      magicLink
      avatar
      Link={Link}
    >
      {children}
    </AuthUIProvider>
  );
}
