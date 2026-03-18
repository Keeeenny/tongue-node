import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
) => {
  return res.status(statusCode).json({
    status: statusCode < 400 ? "success" : "error",
    message,
    ...(data !== undefined && { data }),
  });
};

export const handleError = (
  res: Response,
  error: unknown,
  customMessage: string = "Internal Server Error",
  statusCode: number = 500,
) => {
  if (error instanceof Error) {
    console.error(`[Error]: ${error.message}`);
  } else {
    console.error("[Unknown Error]:", error);
  }

  return sendResponse(res, statusCode, customMessage);
};
