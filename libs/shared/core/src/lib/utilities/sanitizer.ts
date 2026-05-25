export const sanitizeInput = (
  input: string,
  options: { numericOnly?: boolean; emailFormat?: boolean } = {},
): string => {
  if (options.numericOnly) {
    return input.replace(/[^0-9]/g, '');
  }

  return input.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters, keep letters and numbers
  // return input.replace(/[^a-zA-Z0-9\s]/g, ''); // Allow spaces as well
};

export const removeSpecialCharacters = (input: string): string => {
  return sanitizeInput(input, { numericOnly: false });
};

export const acceptOnlyNumbers = (input: string): string => {
  return sanitizeInput(input, { numericOnly: true });
};
