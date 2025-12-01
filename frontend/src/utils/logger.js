export const logAction = (message, data = null) => {
  console.log(`[${new Date().toISOString()}] ${message}`, data || "");
};
