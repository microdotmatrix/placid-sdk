"use server";

import { utapi } from "@/lib/api/uploads";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userUpload } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { UploadThingError } from "uploadthing/server";
import type { UploadFileResult } from "uploadthing/types";
import {
  fetchImage,
  fetchTemplates,
  generateImage,
  type PlacidRequest,
} from "./placid";

export type ActionState = {
  result?: number | number[];
  error?: string;
  success?: string;
  [key: string]: any; // This allows for additional properties
};

export async function createEpitaph(
  formData: PlacidRequest
): Promise<ActionState> {
  try {
    // Prepare data for Placid API
    const variables = {
      portrait: formData.portrait.toString(),
      name: formData.name.toString(),
      epitaph: formData.epitaph.toString(),
      birth: formData.birth.toString(),
      death: formData.death.toString(),
    };

    // Generate image using Placid API
    const response = await generateImage({
      templateId: "vjufc92a1lfq9",
      variables: variables,
    });

    console.log("Response from Placid API", response);

    return { result: response.id };
  } catch (error) {
    console.error("Error creating epitaph:", error);
    return { error: "Failed to create epitaph" };
  }
}

export async function getEpitaphImage(id: number) {
  try {
    if (!id) return null;

    const imageData = await fetchImage(id);
    return imageData;
  } catch (error) {
    console.error("Error fetching epitaph image:", error);
    return null;
  }
}

export async function createEpitaphs(
  formData: PlacidRequest
): Promise<ActionState> {
  try {
    const templates = await fetchTemplates();
    const variables = {
      portrait: formData.portrait.toString(),
      name: formData.name.toString(),
      epitaph: formData.epitaph.toString(),
      birth: formData.birth.toString(),
      death: formData.death.toString(),
    };

    const epitaphs = templates.data.map((template) => {
      return generateImage({
        templateId: template.uuid,
        variables: variables,
      });
    });

    const results = await Promise.allSettled(epitaphs);

    const successfulResults = results.filter(
      (result) => result.status === "fulfilled"
    );

    const epitaphIds = successfulResults.map((result) => {
      if (result.status === "fulfilled") {
        return result.value.id;
      }
      return null;
    });

    console.log("Successful results", successfulResults);
    console.log("Epitaph IDs", epitaphIds);

    return { result: epitaphIds.filter((id) => id !== null) as number[] };
  } catch (error) {
    console.error("Error creating epitaphs:", error);
    return { error: "Failed to create epitaphs" };
  }
}

export async function deleteFile(key: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new UploadThingError("Unauthorized");
  }
  try {
    await utapi.deleteFiles(key);
    await db.delete(userUpload).where(eq(userUpload.storageKey, key));

    revalidatePath("/auth");
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Error deleting file");
  }
}

const CACHE_TAGS = {
  LIST_FILES: "list_files",
};

export async function uploadFile(prevState: unknown, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new UploadThingError("Unauthorized");
  }

  const files = formData.getAll("files") as File[] | string[];
  let uploadResults: UploadFileResult[];
  if (files.some((file) => typeof file === "string")) {
    uploadResults = await utapi.uploadFilesFromUrl(files as string[]);
  } else {
    uploadResults = await utapi.uploadFiles(files as File[]);
  }

  if (uploadResults.every((result) => result.error !== null)) {
    return {
      success: false as const,
      error: "Failed to upload some files",
    };
  }

  revalidateTag(CACHE_TAGS.LIST_FILES);

  const uploadedCount = uploadResults.filter(
    (result) => result.data != null
  ).length;

  return {
    success: uploadedCount === uploadResults.length,
    uploadedCount,
  };
}
