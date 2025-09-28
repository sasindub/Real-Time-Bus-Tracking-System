import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // e.g. KANDY-COLOMBO-1
  name: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  stops: [{ name: String, lat: Number, lng: Number }],
  distance_km: Number,
}, { timestamps: true });

export default mongoose.model('Route', routeSchema);
