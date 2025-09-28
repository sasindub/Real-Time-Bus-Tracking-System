import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  timestamp: { type: Date, default: Date.now },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  speed_kmph: Number,
  heading: Number
}, { timestamps: true });

export default mongoose.model('Location', locationSchema);
