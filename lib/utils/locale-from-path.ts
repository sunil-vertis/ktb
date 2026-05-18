/** True when the URL path is under the Thai locale segment (e.g. `/th/...`). */
export function isThaiPath(pathname: string): boolean {
  return pathname === '/th' || pathname.startsWith('/th/')
}
