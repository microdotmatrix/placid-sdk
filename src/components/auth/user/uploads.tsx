// In a server component
import { getUserUploads } from "@/lib/db/queries";
import { UserThumbnails } from "./thumbnails";

export async function UserUploads({ userId }: { userId: string }) {
  const files = await getUserUploads(userId);

  if (files.length === 0) {
    return <p>You have no images saved</p>;
  }

  return (
    <div className="columns-3 gap-2">
      {files.map((file) => (
        <UserThumbnails
          key={file.id}
          file={{
            id: file.id,
            url: file.url,
            name: file.fileName,
            createdAt: file.createdAt,
            key: file.storageKey,
          }}
        />
      ))}
    </div>
  );
}
