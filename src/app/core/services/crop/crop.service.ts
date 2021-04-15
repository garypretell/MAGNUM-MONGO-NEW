import { Injectable } from "@angular/core";
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

@Injectable({
  providedIn: "root",
})
export class CropService {
  constructor() {}

  loadCrops = async() => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("crops", {
        returnNonCachedInstance: true,
      });
      const crops = await collection.find({}).sort({ nombre: 1 }).toArray();
      return crops;
    } finally {
      await client.close();
    }
  }

  cropsbyUid = async(uid) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("crops", {
        returnNonCachedInstance: true,
      });
      const crops = await collection.find({ uid }).sort({ nombre: 1 }).toArray();
      return crops;
    } finally {
      await client.close();
    }
  }

  createCrop = async(crop) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("crops", {
        returnNonCachedInstance: true,
      });
      await collection.insert(crop);
    } finally {
      await client.close();
    }
  }

  deleteCrop = async(_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("crops", {
        returnNonCachedInstance: true,
      });
      await collection.deleteOne({ _id });
    } finally {
      await client.close();
    }
  }

  updateCrop = async(_id, newData) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("crops", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne({ _id }, { $set: newData });
    } finally {
      await client.close();
    }
  }

}