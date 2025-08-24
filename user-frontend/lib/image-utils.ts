/**
 * Get the full URL for user profile images
 * @param profilePhoto - The profile photo path from the user object
 * @returns Full URL to the profile photo or undefined if no photo
 */
export function getImageUrl(profilePhoto: string | null | undefined): string | undefined {
    if (!profilePhoto) {
        return undefined;
    }
    
    // Get the base URL from environment variable
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8001";
    
    return `${baseUrl}/storage/${profilePhoto}`;
}