import { UserUploads } from "@/components/auth/user/uploads";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      {session ? (
        <div className="space-y-6">
          <p>Logged in as {session.user.name}</p>

          <Link
            href="/create"
            className={buttonVariants({ variant: "default" })}
          >
            Create a new epitaph
          </Link>

          <h4>Saved uploads:</h4>
          <UserUploads userId={session.user.id} />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p>Please login or register to create an epitaph</p>
          <div className="flex gap-2">
            <Link
              href="/auth/login"
              className={buttonVariants({ variant: "default" })}
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className={buttonVariants({ variant: "secondary" })}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
