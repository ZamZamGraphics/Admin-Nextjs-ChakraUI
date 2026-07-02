const PUBLIC_URL = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/$/, "");

/**
 * Build a permanent public URL for an object key.
 * Requires the bucket to have public access enabled in the R2 dashboard.
 */
export const getImageUrl = (key) => {
    if (!key) return key;

    if (!PUBLIC_URL) {
        throw new Error("NEXT_PUBLIC_IMAGE_URL is not set in environment variables.");
    }

    const imagePath = key.startsWith("uploads/")
        ? `${PUBLIC_URL}/${key}`
        : `${PUBLIC_URL}/uploads/${key}`;

    return imagePath;
}
