/**
 * Helper to safely resolve image paths.
 * Honors the ./assets/[filename].[extension] convention,
 * falls back to remoteUrl, and provides an SVG fallback to ensure zero broken images.
 */

export function resolveImage(assetPath: string, remoteUrl?: string): string {
  // If remoteUrl is provided and valid, it can be used directly or as fallback
  if (assetPath && !assetPath.startsWith('./assets/')) {
    return assetPath;
  }
  // In web environment, if the local file exists in public/assets or if remote is available:
  if (remoteUrl) {
    return remoteUrl;
  }
  return assetPath;
}

/**
 * Fallback image handler for <img> tags
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl?: string) {
  const target = e.currentTarget;
  if (fallbackUrl && target.src !== fallbackUrl) {
    target.src = fallbackUrl;
  } else {
    // Generate a branded VietinBank SVG placeholder
    target.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="none">
        <rect width="400" height="250" fill="#F0F4F8"/>
        <rect x="20" y="20" width="360" height="210" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="6 6"/>
        <path d="M185 110L200 95L215 110M200 95V140" stroke="#00529C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="200" y="165" font-family="sans-serif" font-size="14" font-weight="600" fill="#00529C" text-anchor="middle">VietinBank Chi Nhánh Cần Thơ</text>
        <text x="200" y="185" font-family="sans-serif" font-size="12" fill="#64748B" text-anchor="middle">Hình ảnh đang được tải...</text>
      </svg>
    `);
  }
}
