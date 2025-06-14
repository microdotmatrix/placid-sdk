import { Icon } from "@/components/ui/icon";
import { fetchImage } from "@/lib/api/placid";
import { getSession } from "@/lib/auth/server";
import { getUserGeneratedImages } from "@/lib/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export async function UserEpitaphs() {
  const { session } = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  const userId = session.user.id;
  const images = await getUserGeneratedImages(userId);
  return (
    <div className="flex flex-col gap-2 min-h-80 lg:min-h-[calc(100vh-200px)]">
      <h3>Recent Epitaphs</h3>
      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 flex-1">
          <Icon icon="ph:image-thin" className="size-12" />
          <p className="text-muted-foreground">
            Click the + button to create an epitaph
          </p>
        </div>
      )}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {images.map((image) => (
          <li key={image.id}>
            <Suspense
              fallback={
                <div className="size-full aspect-square bg-muted animate-pulse" />
              }
            >
              <EpitaphThumbnail epitaphId={image.epitaphId} />
            </Suspense>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function EpitaphThumbnail({ epitaphId }: { epitaphId: number }) {
  const image = await fetchImage(epitaphId);
  return (
    <figure className="relative overflow-hidden aspect-square">
      <Image
        src={image.image_url}
        alt={image.id.toString()}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover size-full"
      />
    </figure>
  );
}
