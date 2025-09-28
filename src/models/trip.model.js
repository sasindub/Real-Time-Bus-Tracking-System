import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date },
  status: { type: String, enum: ['scheduled','ongoing','completed','cancelled'], default: 'scheduled' }
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);
