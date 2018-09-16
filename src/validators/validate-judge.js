// @flow

export default (judge: Judge): boolean => {
  return (
    judge.name.length !== 0 &&
    (judge.judgeType === 'normal' ||
      judge.judgeType === 'sanctioner' ||
      judge.judgeType === 'president')
  );
};
