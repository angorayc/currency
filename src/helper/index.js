
export const validateInput = value => {
  return (
    value === '' ||
    /^[0-9]+$/.test(value) ||
    /^[0-9]*[.]$/.test(value) ||
    /^[0-9]*[.][0-9]{1,2}$/.test(value)
  );
};
