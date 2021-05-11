import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

@Injectable({
  providedIn: "root",
})
export class RecordService {
  private mensajero = new ReplaySubject<number>(1);
  constructor() {}

  public get recibir() {
    return this.mensajero.asObservable();
  }

  public enviar(id: number): void {
    this.mensajero.next(id);
  }

  loadRecords = async () => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records");
      const records = await collection.find({}).sort({ name: 1 }).toArray();
      return records;
    } finally {
      await client.close();
    }
  };

  countRecords = async () => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records");
      const countrecords = await collection.countDocuments({
        createdAt: Date.parse(new Date().toISOString().substring(0, 10)),
      });
      return countrecords;
    } finally {
      await client.close();
    }
  };

  async createRecord(record) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records", {
        returnNonCachedInstance: true,
      });
      await collection.insertOne(record);
    } finally {
      await client.close();
    }
  }

  findRecordbyBook_Document = async (documento, libro) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records");
      const document = await collection.find({ documento, libro }).toArray();
      return document;
    } finally {
      await client.close();
    }
  };

  findRecordbyBook_DocumentTwo = async (documento, proyectoid, numlibro) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records");
      const document = await collection.find({documento, proyectoid, numlibro  }).toArray();
      return document;
    } finally {
      await client.close();
    }
  };

  searchRecord = async (data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records");
      const document = await collection.find(data).toArray();
      return document;
    } finally {
      await client.close();
    }
  };

  searchRecordOne = async (data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records");
      const document = await collection.findOne(data);
      return document;
    } finally {
      await client.close();
    }
  };

  limitRecords = async (documento, libro, n) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records");
      const records = await collection
        .find({ documento, libro })
        .sort({ mifecha: -1 })
        .limit(n)
        .toArray();
      return records;
    } finally {
      await client.close();
    }
  };

  limitRecordsTwo = async (documento, proyectoid, numlibro, n) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records");
      const records = await collection
        .find({ documento, proyectoid, numlibro })
        .sort({ mifecha: -1 })
        .limit(n)
        .toArray();
      return records;
    } finally {
      await client.close();
    }
  };

  findRecordbyId = async (_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records");
      const record = await collection.findOne({ _id });
      return record;
    } finally {
      await client.close();
    }
  };

  async deleteRecord(_id) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records", {
        returnNonCachedInstance: true,
      });
      await collection.deleteOne({ _id });
    } finally {
      await client.close();
    }
  }

  async updateRecord(_id, newData) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne({ _id }, { $set: newData });
    } finally {
      await client.close();
    }
  }

  async updateRecordManage(obj, newData) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne(obj, { $set: newData });
    } finally {
      await client.close();
    }
  }

  async getChartUser(usuarioid) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records");
      const records = await collection
        .aggregate([
          {
            $match: {
              usuarioid: usuarioid,
              CODIGO: "1234"
            },
          },
          { $unwind: "$documento" },
          { $sortByCount: "$documento" },
        ])
        .toArray();
      const data = [];
      records.forEach((element) => {
        data.push({ name: element._id, value: element.count });
      });
      return data;
    } finally {
      await client.close();
    }
  }

  async grafica(usuarioid, proyectoid) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records");
      const records = await collection
        .aggregate([
          {
            $match: {
              usuarioid: usuarioid,
              proyectoid: proyectoid
            },
          },
          { $unwind: "$documento" },
          { $sortByCount: "$documento" },
        ])
        .toArray();
      const data = [];
      records.forEach((element) => {
        data.push({ name: element._id, value: element.count });
      });
      return data;
    } finally {
      await client.close();
    }
  }

  async getChart() {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records");
      const records = await collection
        .aggregate([{ $unwind: "$documento" }, { $sortByCount: "$documento" }])
        .toArray();
      const data = [];
      records.forEach((element) => {
        data.push({ name: element._id, value: element.count });
      });
      return data;
    } finally {
      await client.close();
    }
  }

  findRecordbyBook_Folder =  async (libro) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("records");
      const records = await collection.find({ libro }) .toArray();
      return records;
    } finally {
      await client.close();
    }
  };
}
