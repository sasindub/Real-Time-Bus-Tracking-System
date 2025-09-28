import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI; 

  if (!mongoURI) {
    console.error("MONGO_URI is not defined!");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
