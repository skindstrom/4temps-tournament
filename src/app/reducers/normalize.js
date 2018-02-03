// @flow

function normalize(array: Array<{ id: string, [string]: mixed }>) {
  const acc: { [string]: mixed } = {};
  array.forEach(t => {
    acc[t.id] = t;
  });

  return acc;
}

export default normalize;