"use client";

import type { PlacidImage } from "@/lib/api/placid";
import { downloadImage } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ImagePollerProps {
  initialImageData: PlacidImage;
  id: number;
}

export function ImageResult({ initialImageData, id }: ImagePollerProps) {
  const [imageData, setImageData] = useState<PlacidImage | undefined>(
    initialImageData
  );
  const [isPolling, setIsPolling] = useState(
    initialImageData.status === "queued"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const pollImage = async () => {
      try {
        const response = await fetch(`/api/image/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch image data");
        }

        const data = await response.json();
        setImageData(data);

        if (data.status !== "queued") {
          setIsPolling(false);
        }
      } catch (err) {
        console.error("Error polling image:", err);
        setError("Failed to update image status");
        setIsPolling(false);
      }
    };

    if (isPolling) {
      // Poll every second
      intervalId = setInterval(pollImage, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id, isPolling]);

  if (error) {
    return (
      <Alert variant="destructive">
        <Icon icon="carbon:warning-alt" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (imageData?.status === "queued") {
    return (
      <Alert>
        <Icon icon="mdi:loading" className="animate-spin" />
        <AlertTitle>Image is still processing</AlertTitle>
        <AlertDescription>
          {isPolling ? "..." : " (polling paused)"}
        </AlertDescription>
      </Alert>
    );
  }

  if (imageData?.status === "error") {
    return (
      <Alert variant="destructive">
        <Icon icon="carbon:warning-alt" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Error generating image</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mx-auto">
      {imageData?.image_url ? (
        <div className="border rounded-md overflow-hidden relative">
          <Image
            src={imageData.image_url}
            alt="Generated Epitaph"
            width={1200}
            height={1200}
            priority
            className="w-full h-auto object-contain"
          />
          <Tooltip>
            <TooltipTrigger className="absolute top-2 right-2 z-10">
              <Button
                asChild
                size="icon"
                variant="outline"
                onClick={() =>
                  downloadImage(
                    imageData?.image_url,
                    `epitaph-${imageData?.id}`
                  )
                }
                className="p-2.5 lg:p-2 bg-secondary/50"
              >
                <Icon icon="carbon:download" className="size-full" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Download Image</span>
            </TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <div className="p-4 bg-gray-100">Image URL not available</div>
      )}
    </div>
  );
}
