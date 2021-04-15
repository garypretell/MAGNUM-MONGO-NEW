import { Injectable } from "@angular/core";
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  constructor() {}

  loadDocuments = async() => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documents", {
        returnNonCachedInstance: true,
      });
      const documents = await collection.find().sort({ name: 1 }).toArray();
      return documents;
    } finally {
      await client.close();
    }
  };

  loadmiDocumento = async() => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("midocumento", {
        returnNonCachedInstance: true,
      });
      const documents = await collection.find().sort({ name: 1 }).toArray();
      return documents;
    } finally {
      await client.close();
    }
  };

  loadDocumentoProyecto = async(proyecto) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documento", {
        returnNonCachedInstance: true,
      });
      const documents = await collection.find({proyecto}).sort({ name: 1 }).toArray();
      return documents;
    } finally {
      await client.close();
    }
  };

  loadmiDocumentoProyecto = async(proyecto) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("midocumento", {
        returnNonCachedInstance: true,
      });
      const documents = await collection.find({proyecto}).sort({ name: 1 }).toArray();
      return documents;
    } finally {
      await client.close();
    }
  };

  async createDocument(document) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documents", {
        returnNonCachedInstance: true,
      });
      await collection.insertOne(document);
    } finally {
      await client.close();
    }
  }

  async createDocumento(documento) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documento", {
        returnNonCachedInstance: true,
      });
      await collection.insertOne(documento);
    } finally {
      await client.close();
    }
  }

  async createmiDocumento(documento) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("midocumento", {
        returnNonCachedInstance: true,
      });
      await collection.insertOne(documento);
    } finally {
      await client.close();
    }
  }

  findDocument = async (name) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documents");
      const document = await collection.findOne(
        { name },
        { returnNonCachedInstance: true }
      );
      return document;
    } finally {
      await client.close();
    }
  };

  findDocumento = async (codigo) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documento");
      const document = await collection.findOne(
        { codigo },
        { returnNonCachedInstance: true }
      );
      return document;
    } finally {
      await client.close();
    }
  };

  findmiDocumento = async (codigo, proyecto) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("midocumento");
      const document = await collection.findOne(
        { codigo, proyecto },
        { returnNonCachedInstance: true }
      );
      return document;
    } finally {
      await client.close();
    }
  };

  searchDocument = async (data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documents", {
        returnNonCachedInstance: true,
      });
      const document = await collection.findOne(data);
      return document;
    } finally {
      await client.close();
    }
  };

  searchDocumento = async (data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documento", {
        returnNonCachedInstance: true,
      });
      const document = await collection.findOne(data);
      return document;
    } finally {
      await client.close();
    }
  };

  searchmiDocumento = async (data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("midocumento", {
        returnNonCachedInstance: true,
      });
      const document = await collection.findOne(data);
      return document;
    } finally {
      await client.close();
    }
  };

  findDocumentbyId = async (_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documents", {
        returnNonCachedInstance: true,
      });
      const document = await collection.findOne({ _id });
      return document;
    } finally {
      await client.close();
    }
  };

  findDocumentobyId = async (_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documento", {
        returnNonCachedInstance: true,
      });
      const document = await collection.findOne({ _id });
      return document;
    } finally {
      await client.close();
    }
  };

  findmiDocumentobyId = async (_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("midocumento", {
        returnNonCachedInstance: true,
      });
      const document = await collection.findOne({ _id });
      return document;
    } finally {
      await client.close();
    }
  };

  async deleteDocument(_id) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documents", {
        returnNonCachedInstance: true,
      });
      await collection.deleteOne({ _id });
    } finally {
      await client.close();
    }
  }

  async deleteDocumento(_id) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documento", {
        returnNonCachedInstance: true,
      });
      await collection.deleteOne({ _id });
    } finally {
      await client.close();
    }
  }

  async deletemiDocumento(_id) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("midocumento", {
        returnNonCachedInstance: true,
      });
      await collection.deleteOne({ _id });
    } finally {
      await client.close();
    }
  }

  async updateDocument(_id, newData) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documents", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne({ _id }, { $set: newData });
    } finally {
      await client.close();
    }
  }

  async updateDocumento(_id, newData) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documento", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne({ _id }, { $set: newData });
    } finally {
      await client.close();
    }
  }

  async updatemiDocumento(_id, newData) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("midocumento", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne({ _id }, { $set: newData });
    } finally {
      await client.close();
    }
  }

  async removeAfterUpdate(_id) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documents", {
        returnNonCachedInstance: true,
      });
      await collection.deleteOne({ _id: _id, plantilla: false });
    } finally {
      await client.close();
    }
  }

  async removeAfterActualizar(_id) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documento", {
        returnNonCachedInstance: true,
      });
      await collection.deleteOne({ _id: _id, plantilla: false });
    } finally {
      await client.close();
    }
  }

  async removemiAfterActualizar(_id) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("midocumento", {
        returnNonCachedInstance: true,
      });
      await collection.deleteOne({ _id: _id, plantilla: false });
    } finally {
      await client.close();
    }
  }

  async documentoExport(array: any[]): Promise<any> {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("documento", {
        returnNonCachedInstance: true,
      });
      const documentos = await collection.find({ proyecto: { $in: array } } ).project({_id: 1}).toArray();
      return documentos;
    } finally {
      await client.close();
    }
  }
}
