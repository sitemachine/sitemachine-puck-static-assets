import MimeMatcher from "mime-matcher";

export function isMimeTypeMatch(needle: string, haystack: string[]) {
  return new MimeMatcher(...haystack).match(needle);
}

export function isImageMimeType(mimeType: string) {
  return isMimeTypeMatch(mimeType, ["image/*"]);
}
