import { Injectable } from "@angular/core";
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  constructor() {}

  createSetting = async(setting) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("configuracion", {
        returnNonCachedInstance: true,
      });
      await collection.insertOne(setting);
    } finally {
      await client.close();
    }
  };

  loadSettings = async() => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db('sindex');
      const collection = database.collection('configuracion',  {returnNonCachedInstance : true});
      const dato = await collection.findOne({});
      return dato;
    }
    finally {
      await client.close();
    }
  };

  loadSettingbyID = async(data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db('sindex');
      const collection = database.collection('configuracion',  {returnNonCachedInstance : true});
      const dato = await collection.findOne(data);
      return dato;
    }
    finally {
      await client.close();
    }
  };

  async updateConfig(_id, record) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("configuracion", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne({_id}, {$set: record}, { upsert: true });
    } finally {
      await client.close();
    }
  }
}