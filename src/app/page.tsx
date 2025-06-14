import { UserEpitaphs } from "@/components/auth/user/epitaphs";
import { UserUploads } from "@/components/auth/user/uploads";
import { buttonVariants } from "@/components/ui/button";
import { getSession } from "@/lib/auth/server";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  const { session } = await getSession();

  return (
    <div className="flex flex-col justify-center px-2 lg:px-4">
      {session ? (
        <>
          <section className="flex flex-col lg:flex-row items-center gap-4">
            <div className="flex-1 flex flex-col justify-center items-center space-y-6 py-24 lg:py-0">
              <p>Welcome back, {session.user.name}</p>

              <Link
                href="/create"
                className={buttonVariants({
                  variant: "default",
                  size: "icon",
                })}
              >
                <Icon icon="mdi:plus" />
              </Link>
            </div>
            <div className="flex-2">
              <UserEpitaphs />
            </div>
          </section>
          <section className="py-12 max-w-5xl mx-auto">
            <h5>Recent uploads:</h5>
            <Suspense fallback={<div>Loading...</div>}>
              <UserUploads userId={session.user.id} />
            </Suspense>
          </section>
        </>
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
