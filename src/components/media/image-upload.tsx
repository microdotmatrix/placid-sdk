"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadDropzone } from "./utils";

/**
 * Polling is required if we want to be sure the serverside
 * `onUploadComplete` handler has finished processing the file.
 *
 * This is useful if you want the client to have additional information
 * regarding the file than just the metadata returned from UploadThing.
 */
async function pollForServerComplete(fileKey: string): Promise<File> {
  const res = await fetch(`/api/file/${fileKey}`);
  if (res.status === 200) {
    // file exists in our db => server has completed processing
    return await res.json();
  }
  // Simple polling, you can do exponential backoff or whatever technique you want
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await pollForServerComplete(fileKey);
}

export function UploadImage() {
  const router = useRouter();
  return (
    <UploadDropzone
      endpoint="imageUploader"
      onClientUploadComplete={async (res) => {
        console.log("Upload complete", res);
        const [fileRes] = res ?? [];
        if (!fileRes) return;

        const file = await pollForServerComplete(fileRes.key);
        console.log("File", file);
        router.refresh();
      }}
      onUploadBegin={() => {
        toast("Uploading...");
      }}
      onUploadError={(error) => {
        toast("Upload failed", {
          description: error.message,
        });
      }}
    />
  );
}
