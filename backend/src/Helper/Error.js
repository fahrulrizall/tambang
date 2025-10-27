const ApiError = (res, error) => {
  if (error != null && error instanceof Error) {
    return res.status(500).send({
      status: 500,
      message: error.message,
      errors: error,
    });
  }

  return res.status(500).send({
    status: 500,
    message: "Internal server error",
    errors: error,
  });
};

module.exports = { ApiError };
