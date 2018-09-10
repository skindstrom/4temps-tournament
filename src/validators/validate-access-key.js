// @flow
export default function validateAccessKey(accessKey: ?string) {
  return accessKey != null && accessKey.length === 10;
}
