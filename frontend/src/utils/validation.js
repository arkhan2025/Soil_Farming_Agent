export const isRequired = (value) => value && value.trim() !== "";
export const isEmail = (value) => /\S+@\S+\.\S+/.test(value);
export const minLength = (value, length) => value.length >= length;
