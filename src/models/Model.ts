import mongoose from "mongoose";
import { connectMDB } from "@/db/connectMDB";
const timeSeriesCollections = ["file_contents"];

export const getMDBModel = async (collectionName: string) => {
  await connectMDB();

  const schema = new mongoose.Schema({}, {
    strict: false,
    timestamps: true,
  });

  const Model = mongoose.models[collectionName] || mongoose.model(collectionName, schema, collectionName);

  if (timeSeriesCollections.includes(collectionName)) {
    try {
      await Model.collection.createIndex({ timestamp: 1 });
    } catch (error) {
    }
  }

  return Model;
};
