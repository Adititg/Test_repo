module.exports = {
  success: (data, message) => {
    const response = {
      statusCode: 200,
      error: false,
      success: true,
      message,
      data,
    };
    return response;
  },
  error: err => {
    const response = {
      statusCode: 400,
      error: true,
      success: false,
      message: err,
      data: null,
    };
    return response;
  },
  sendError: err => {
    const response = {
      statusCode: 412,
      message: err,
      error: true,
      errorType: 'VALIDATION_ERROR',
      data: null,
      success: false,
    };
    return response;
  },
};
