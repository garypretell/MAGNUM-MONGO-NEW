import { Injectable } from "@angular/core";
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

@Injectable({
  providedIn: "root",
})
export class ImageService {
  constructor() {}

  loadImages = async() => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("images");
      const images = await collection.find({})
      .toArray();
      return images;
    } finally {
      await client.close();
    }
  }

  createImage = async(image) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db('sindex');
      const collection = database.collection('images');
      await collection.insertOne(image);
    }
    finally {
      await client.close();
    }
  };

  searchImage = async(data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("images");
      const image = await collection.findOne(data);
      return image;
    } finally {
      await client.close();
    }
  };

  findImages = async(data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("images");
      const images = await collection.find(data).toArray();
      return images;
    } finally {
      await client.close();
    }
  };

  findImageOne = async(data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("images");
      const image = await collection.find(data).sort({ date: 1 }).limit(1).toArray();
      return image[0];
    } finally {
      await client.close();
    }
  };

  findImagebyId = async(_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("images");
      const image = await collection.findOne({ _id });
      return image;
    } finally {
      await client.close();
    }
  }

  deleteImage = async(_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db('sindex');
      const collection = database.collection('images',  {returnNonCachedInstance : true});
      await collection.deleteOne({_id});
    }
    finally {
      await client.close();
    }
  }

  updateImage = async(_id, newData) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db('sindex');
      const collection = database.collection('images',  {returnNonCachedInstance : true});
      await collection.updateOne({_id}, { $set: newData });
    }
    finally {
      await client.close();
    }
  }

}