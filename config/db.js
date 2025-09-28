import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  console.log("MONGO_URI =", process.env.MONGO_URI);

  if (!mongoURI) {
    console.error("MONGO_URI is not defined! Check your Railway service variables.");
    process.exit(1); 
  }

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
