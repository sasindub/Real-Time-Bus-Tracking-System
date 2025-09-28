import Bus from '../models/bus.model.js';
import Location from '../models/location.model.js';

export const createBus = async (req, res) => {
  try {
    const b = await Bus.create(req.body);
    res.status(201).json(b);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate('assignedRoute').populate('currentLocation');
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate('assignedRoute').populate('currentLocation');
    if (!bus) return res.status(404).json({ message: 'Not found' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Endpoint to post real-time location update from devices/operators
export const postLocation = async (req, res) => {
  try {
    const { lat, lng, speed_kmph, heading } = req.body;
    const { id } = req.params; // bus id
    const bus = await Bus.findById(id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    const loc = await Location.create({ bus: bus._id, lat, lng, speed_kmph, heading });
    // update bus currentLocation ref
    bus.currentLocation = loc._id;
    bus.status = 'enroute';
    await bus.save();
    res.status(201).json(loc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get locations for a bus
export const getBusLocations = async (req, res) => {
  try {
    const busId = req.params.id;
    const locs = await Location.find({ bus: busId }).sort({ timestamp: -1 }).limit(100);
    res.json(locs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
