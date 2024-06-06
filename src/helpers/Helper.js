/**
 * Get dynamic image path
 */
export function getImagePath(image) {
    return new URL(`../assets/${image}`, import.meta.url).href;
}
