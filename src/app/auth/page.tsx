import { UserUploads } from "@/components/auth/user/uploads";
import { UploadImage } from "@/components/media/image-upload";
import { Icon } from "@/components/ui/icon";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AuthPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/login?redirectTo=/auth");

  return (
    <main className="container mx-auto">
      <div className="flex flex-col lg:flex-row gap-4 items-center px-8">
        <div className="flex-1 divide-y">
          <header className="py-4">
            <h4>Welcome back, {session.user.name}</h4>
          </header>
          <div className="py-4">
            <UploadImage />
            <p>To add new images to your collection, drag and drop them here</p>
          </div>
        </div>
        <div className="flex-2 border p-4">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <Icon icon="mdi:loading" className="animate-spin" />
              </div>
            }
          >
            <UserUploads userId={session.user.id} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
