import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Download image
export function downloadImage(url: string, filename: string) {
  if (!url) {
    throw new Error("Image URL is required");
  }

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      if (filename && filename.length) {
        a.download = `${filename.replace(" ", "_")}.png`;
      }
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error downloading image:", error);
    });
}
