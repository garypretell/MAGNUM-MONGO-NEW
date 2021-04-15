import { Injectable } from "@angular/core";
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

@Injectable({
  providedIn: "root",
})
export class TemplateService {
  constructor() {}

  loadDocuments = async() => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("templates", {
        returnNonCachedInstance: true,
      });
      const documents = await collection.find().sort({ name: 1 }).toArray();
      return documents;
    } finally {
      await client.close();
    }
  }

  createTemplate = async(template) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("templates", {
        returnNonCachedInstance: true,
      });
      await collection.insertOne(template);
    } finally {
      await client.close();
    }
  };
  
  crearPlantilla = async(plantilla) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("plantilla", {
        returnNonCachedInstance: true,
      });
      await collection.insertOne(plantilla);
    } finally {
      await client.close();
    }
  };

  crearmiPlantilla = async(plantilla) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("miplantilla", {
        returnNonCachedInstance: true,
      });
      await collection.insertOne(plantilla);
    } finally {
      await client.close();
    }
  };

  findTemplatebyDocument = async(document) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("templates");
      const template = await collection.findOne(
        { document },
        { returnNonCachedInstance: true }
      );
      return template;
    } finally {
      await client.close();
    }
  };

  

  findTemplatebyDocumento = async(documento) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("plantilla");
      const plantilla = await collection.findOne(
        { documento },
        { returnNonCachedInstance: true }
      );
      return plantilla;
    } finally {
      await client.close();
    }
  };

  findmiTemplatebyDocumento = async(documento) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("miplantilla");
      const plantilla = await collection.findOne(
        { documento },
        { returnNonCachedInstance: true }
      );
      return plantilla;
    } finally {
      await client.close();
    }
  };

  searchTemplate = async(data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("templates");
      const template = await collection.findOne(
        data,
        { returnNonCachedInstance: true }
      );
      return template;
    } finally {
      await client.close();
    }
  };

  searchmiPlantilla = async(data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("miplantilla");
      const template = await collection.findOne(
        data,
        { returnNonCachedInstance: true }
      );
      return template;
    } finally {
      await client.close();
    }
  };

  findTemplatebyId = async(_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("templates");
      const template = await collection.findOne(
        { _id },
        { returnNonCachedInstance: true }
      );
      return template;
    } finally {
      await client.close();
    }
  };

  deleteTemplate = async(_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("templates", {
        returnNonCachedInstance: true,
      });
      await collection.deleteOne({ _id });
    } finally {
      await client.close();
    }
  };

  updateTemplate = async(_id, newData) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("templates", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne({ _id }, { $set: newData });
    } finally {
      await client.close();
    }
  };

  actualizarTemplate = async(_id, newData) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("plantilla", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne({ _id }, { $set: newData });
    } finally {
      await client.close();
    }
  };

  actualizarmiTemplate = async(_id, newData) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("miplantilla", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne({ _id }, { $set: newData });
    } finally {
      await client.close();
    }
  };

}