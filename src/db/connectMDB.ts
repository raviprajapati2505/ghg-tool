import mongoose from "mongoose";

export const connectMDB = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGO_URI!, {});
    const connection = mongoose.connection;
    connection.on("connected", () => {});

    connection.on("error", (err) => {
      process.exit();
    });
  } catch (error: any) {
    throw new Error("Error connecting to Mongoose: " + error);
  }
};
