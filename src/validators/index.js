import Joi from 'joi';

// Schemas take the shape of the validate middleware input { body, params, query, headers }

export const auth = {
  register: Joi.object({
    body: Joi.object({
      name: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      role: Joi.string().valid('admin', 'operator', 'user').optional(),
    }).required(),
    params: Joi.object({}).unknown(true),
    query: Joi.object({}).unknown(true),
    headers: Joi.object().unknown(true),
  }),
  login: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
    }).required(),
    params: Joi.object({}).unknown(true),
    query: Joi.object({}).unknown(true),
    headers: Joi.object().unknown(true),
  }),
};

export const bus = {
  create: Joi.object({
    body: Joi.object({
      plateNumber: Joi.string().trim().required(),
      capacity: Joi.number().integer().min(1).required(),
      assignedRoute: Joi.string().optional(),
    }).required(),
    params: Joi.object({}).unknown(true),
    query: Joi.object({}).unknown(true),
    headers: Joi.object().unknown(true),
  }),
  postLocation: Joi.object({
    body: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required(),
      speed_kmph: Joi.number().min(0).max(200).optional(),
      heading: Joi.number().min(0).max(360).optional(),
    }).required(),
    params: Joi.object({ id: Joi.string().required() }).required(),
    query: Joi.object({}).unknown(true),
    headers: Joi.object().unknown(true),
  }),
};

export const route = {
  create: Joi.object({
    body: Joi.object({
      code: Joi.string().alphanum().min(2).max(20).required(),
      name: Joi.string().min(2).max(200).required(),
      stops: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().required(),
            lat: Joi.number().min(-90).max(90).required(),
            lng: Joi.number().min(-180).max(180).required(),
          })
        )
        .min(2)
        .optional(),
    }).required(),
    params: Joi.object({}).unknown(true),
    query: Joi.object({}).unknown(true),
    headers: Joi.object().unknown(true),
  }),
};

export const trip = {
  create: Joi.object({
    body: Joi.object({
      route: Joi.string().required(),
      bus: Joi.string().required(),
      departureTime: Joi.date().iso().required(),
      arrivalTime: Joi.date().iso().optional(),
      status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'cancelled').optional(),
    }).required(),
    params: Joi.object({}).unknown(true),
    query: Joi.object({}).unknown(true),
    headers: Joi.object().unknown(true),
  }),
  updateStatus: Joi.object({
    body: Joi.object({
      status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'cancelled').required(),
      arrivalTime: Joi.date().iso().optional(),
    }).required(),
    params: Joi.object({ id: Joi.string().required() }).required(),
    query: Joi.object({}).unknown(true),
    headers: Joi.object().unknown(true),
  }),
};

export default { auth, bus, route, trip };


