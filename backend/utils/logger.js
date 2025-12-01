import fs from "fs";
import path from "path";

const logFilePath = path.join("logs", "app.log");

export const logAction = (message) => {
  const logEntry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFilePath, logEntry); // writes to logs/app.log
  console.log(logEntry);
};
