import { Injectable } from "@angular/core";
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

@Injectable({
  providedIn: "root",
})
export class FolderService {
  constructor() {}

  loadFolders = async () => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("folders");
      const folders = await collection.find({}).toArray();
      return folders;
    } finally {
      await client.close();
    }
  };

  findFolder = async (data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("folders");
      const folders = await collection.find(data).sort({ date: -1 }).toArray();
      return folders;
    } finally {
      await client.close();
    }
  };

  findCarpeta = async (data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("folders");
      const folders = await collection.find(data).sort({ date: -1 }).toArray();
      return folders;
    } finally {
      await client.close();
    }
  };

  findFolderOne = async (data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("folders");
      const folder = await collection.findOne(data);
      return folder;
    } finally {
      await client.close();
    }
  };

  createFolder = async(folder) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db('sindex');
      const collection = database.collection('folders',  {returnNonCachedInstance : true});
      await collection.insertOne(folder);
    }
    finally {
      await client.close();
    }
  }

  findFolderbyId = async(_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("folders");
      const folder = await collection.findOne({ _id });
      return folder;
    } finally {
      await client.close();
    }
  }

  deleteFolder = async(_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db('sindex');
      const collection = database.collection('folders',  {returnNonCachedInstance : true});
      await collection.deleteOne({_id});
    }
    finally {
      await client.close();
    }
  }

  updateFolder = async(_id, newData) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db('sindex');
      const collection = database.collection('folders',  {returnNonCachedInstance : true});
      await collection.updateOne({_id}, { $set: newData });
    }
    finally {
      await client.close();
    }
  }

}
