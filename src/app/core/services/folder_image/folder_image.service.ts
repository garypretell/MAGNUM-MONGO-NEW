import { Injectable } from "@angular/core";
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

@Injectable({
  providedIn: "root",
})
export class FolderImageService {
  constructor() {}

  loadFolderImage = async() => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db('sindex');
      const collection = database.collection('folder_image',  {returnNonCachedInstance : true});
      const datos = await collection.find().toArray();
      return datos;
    }
    finally {
      await client.close();
    }
  }

  LisFolderImage = async(data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db('sindex');
      const collection = database.collection('folder_image',  {returnNonCachedInstance : true});
      const datos = await collection.find(data).sort({ createdAt: 1 }).toArray();
      return datos;
    }
    finally {
      await client.close();
    }  
  }

  countFolderImage = async(data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("folder_image");
      const countrecords = await collection.countDocuments(data);
      return countrecords;
    } finally {
      await client.close();
    }
  }

  createFolderImage = async(folderimage) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db('sindex');
      const collection = database.collection('folder_image',  {returnNonCachedInstance : true});
      await collection.insertOne(folderimage);
    }
    finally {
      await client.close();
    }
  }

}