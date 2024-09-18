export function useMediaType(mimeType?: string) {
  return {
    isVideo: mimeType?.startsWith('video'),
    isAudio: mimeType?.startsWith('audio'),
    isImage: mimeType?.startsWith('image'),
    isSvg: mimeType?.startsWith('image/svg+xml'),
  }
}