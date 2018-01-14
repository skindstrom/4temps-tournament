// @flow

function normalize(array: Array<{ _id: string, [string]: mixed }>) {
  const acc: { [string]: mixed } = {};
  array.forEach(t => {
    acc[t._id] = t;
  });

  return acc;
}

export default normalize;