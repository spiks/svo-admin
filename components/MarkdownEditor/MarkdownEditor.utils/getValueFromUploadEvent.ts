export function getValueFromEvent(e: any) {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
}
