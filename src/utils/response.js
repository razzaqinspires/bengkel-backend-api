// src/utils/response.js

export const successResponse = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message, statusCode = 500, error = null) => {
  const response = {
    success: false,
    message
  };

  // Tampilkan detail error hanya di mode development/test
  if (error && process.env.NODE_ENV !== 'production') {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};
