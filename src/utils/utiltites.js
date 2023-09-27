export const handleNumberInputChange = (input) => {
  const newValue = input.replace(/^[0]+/g, '').replace(/[^\d.]/g, '');
  const pointData = newValue.indexOf('.');
  if (pointData !== -1 && newValue.indexOf('.', pointData + 1) !== -1) {
    return newValue.slice(0, -1);
  }
  return newValue;
};
