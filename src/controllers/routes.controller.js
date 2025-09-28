import Route from '../models/route.model.js';

export const createRoute = async (req, res) => {
  try {
    const body = req.body;
    const existing = await Route.findOne({ code: body.code });
    if (existing) return res.status(409).json({ message: 'Route code exists' });
    const r = await Route.create(body);
    res.status(201).json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listRoutes = async (req, res) => {
  try {
    const list = await Route.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRoute = async (req, res) => {
  try {
    const r = await Route.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
