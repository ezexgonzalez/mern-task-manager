export const getErrorMessage = (error, fallback = "Ocurrió un error") => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  return fallback;
};
