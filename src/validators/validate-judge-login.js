// @flow
export default function validateJudgeLogin(accessKey: string) {
  return accessKey.length === 10;
}
