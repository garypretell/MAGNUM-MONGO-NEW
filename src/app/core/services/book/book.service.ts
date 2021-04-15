import { Injectable } from "@angular/core";
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

@Injectable({
  providedIn: "root",
})
export class BookService {
  constructor() {}

  loadBooks = async() => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("books", {
        returnNonCachedInstance: true,
      });
      const books = await collection.find().sort({ name: 1 }).toArray();
      return books;
    } finally {
      await client.close();
    }
  };

  limitBooks = async(nomdoc, proyectoid, n) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("books", {
        returnNonCachedInstance: true,
      });
      const books = await collection.find({state: 0, nomdoc, proyectoid }).sort({ createdAt: 1 }).limit(n).toArray();
      return books;
    } finally {
      await client.close();
    }
  }

  showBooks = async(nomdoc, proyectoid) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("books", {
        returnNonCachedInstance: true,
      });
      const books = await collection.find({state: 0, nomdoc, proyectoid }).sort({ createdAt: 1 }).toArray();
      return books;
    } finally {
      await client.close();
    }
  }

  createBook = async(book) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("books", {
        returnNonCachedInstance: true,
      });
      collection.createIndex( { "id": 1 }, { unique: true } );
      await collection.insertOne(book);
    } finally {
      await client.close();
    }
  };

  findBookbyBook_Document = async(numLibro, documento, proyectoid) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("books", {
        returnNonCachedInstance: true,
      });
      const book = await collection.findOne({ numLibro, documento, proyectoid });
      return book;
    } finally {
      await client.close();
    }
  }

  findBookbyId = async(_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("books", {
        returnNonCachedInstance: true,
      });
      const book = await collection.findOne({ _id });
      return book;
    } finally {
      await client.close();
    }
  }

  deleteBook = async(_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("books", {
        returnNonCachedInstance: true,
      });
      await collection.deleteOne({ _id });
    } finally {
      await client.close();
    }
  }

  updateBook = async(_id, newData) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("books", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne({ _id }, { $set: newData });
    } finally {
      await client.close();
    }
  };

  searchRecordFolder = async(data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("folders", {
        returnNonCachedInstance: true,
      });
      const book = await collection.findOne(data);
      return book;
    } finally {
      await client.close();
    }
  };

  searchBookID = async(id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("books", {
        returnNonCachedInstance: true,
      });
      const book = await collection.findOne({id});
      return book;
    } finally {
      await client.close();
    }
  };
}