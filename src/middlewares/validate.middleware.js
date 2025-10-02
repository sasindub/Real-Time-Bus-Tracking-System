import ApiError from '../utils/ApiError.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const data = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
    };

    const { error, value } = schema.validate(data, { abortEarly: false, allowUnknown: true, stripUnknown: false });
    if (error) {
      const details = error.details?.map((d) => ({ message: d.message, path: d.path })) ?? undefined;
      return next(new ApiError(400, 'Validation failed', details));
    }

    // Optionally attach sanitized value for downstream usage without changing existing handlers
    req.validated = value;
    return next();
  };
};

export default validate;


