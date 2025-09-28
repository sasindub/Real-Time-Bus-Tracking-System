import Trip from '../models/trip.model.js';
import Bus from '../models/bus.model.js';

export const createTrip = async (req, res) => {
  try {
    const t = await Trip.create(req.body);
    res.status(201).json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listTrips = async (req, res) => {
  try {
    const q = {};
    if (req.query.route) q.route = req.query.route;
    if (req.query.status) q.status = req.query.status;
    const trips = await Trip.find(q).populate('bus').populate('route').sort({ departureTime: 1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTrip = async (req, res) => {
  try {
    const t = await Trip.findById(req.params.id).populate('bus').populate('route');
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// mark trip ongoing/completed
export const updateTripStatus = async (req, res) => {
  try {
    const t = await Trip.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Not found' });
    t.status = req.body.status || t.status;
    if (req.body.arrivalTime) t.arrivalTime = req.body.arrivalTime;
    await t.save();
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
