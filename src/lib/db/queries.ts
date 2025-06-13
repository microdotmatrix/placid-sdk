import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "../auth";
import { db } from "./index";
import { userUpload } from "./schema";
/**
 * Fetches user uploads from the database
 * @returns Array of user uploads or null if user is not authenticated
 */
export const getUserUploads = cache(async (userId: string) => {
  // Fetch all uploads for this user
  const uploads = await db.query.userUpload.findMany({
    where: eq(userUpload.userId, userId),
    orderBy: (uploads) => uploads.createdAt,
  });

  return uploads;
});

/**
 * Fetches user uploads from the database, redirects to login if not authenticated
 * @param redirectUrl URL to redirect to if user is not authenticated
 * @returns Array of user uploads
 */
export const getUserUploadsOrRedirect = cache(
  async (redirectUrl = "/auth/login") => {
    // Get the current user session
    const session = await auth.api.getSession({ headers: await headers() });

    // If no session exists, redirect to login
    if (!session) {
      redirect(redirectUrl);
    }

    // Get the user ID from the session
    const userId = session.user.id;

    // Fetch all uploads for this user
    const uploads = await db.query.userUpload.findMany({
      where: eq(userUpload.userId, userId),
      orderBy: (uploads) => uploads.createdAt,
    });

    return uploads;
  }
);
