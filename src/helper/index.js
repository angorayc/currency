export const checkStartsWithPlusOrMinus = value => {
  const stringifiedValue = typeof value !== 'string' ? value.toString() : value;
  const firstSymbol = stringifiedValue.charAt(0);
  return firstSymbol === '+' || firstSymbol === '-';
}

export const extractValue = value => {
  const stringifiedValue = value.toString();
  if (checkStartsWithPlusOrMinus(value)) {
    return stringifiedValue.length > 1
      ? stringifiedValue.substring(1, value.length)
      : '';
  } else {
    return stringifiedValue;
  }
}

export const validateInput = value => {
  return (
    value === '' ||
    /^[0-9]+$/.test(value) ||
    /^[0-9]*[.]$/.test(value) ||
    /^[0-9]*[.][0-9]{1,2}$/.test(value)
  );
};
