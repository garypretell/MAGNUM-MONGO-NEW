import { Injectable } from "@angular/core";
const { MongoClient } = require("mongodb");

@Injectable({
  providedIn: "root",
})
export class CloudService {
  constructor() {}

  searchRecord = async (uri, data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("gpsoft");
      const collection = database.collection("records");
      const document = await collection.find(data).toArray();
      return document;
    } finally {
      await client.close();
    }
  };

}