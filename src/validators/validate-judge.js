// @flow

export default (judge: Judge): boolean => {
  return (
    judge.name.length !== 0 &&
    (judge.type === 'normal' || judge.type === 'sanctioner')
  );
};
