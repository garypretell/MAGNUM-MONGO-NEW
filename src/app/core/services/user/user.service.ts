import { Injectable } from "@angular/core";
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const uri2 =
  "mongodb+srv://garypretell:qwerty24.24@cluster0.qephl.mongodb.net/gpsoft";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor() {}

  async loadUsers() {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("users", {
        returnNonCachedInstance: true,
      });
      const users = await collection.find({}).toArray();
      return users;
    } finally {
      await client.close();
    }
  }

  async loadUsuarios() {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("users", {
        returnNonCachedInstance: true,
      });
      const users = await collection.find({}).project({nickname: 1, dni: 1}).toArray();
      return users;
    } finally {
      await client.close();
    }
  }

  async createUser(user) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("users", {
        returnNonCachedInstance: true,
      });
      await collection.insertOne(user);
    } finally {
      await client.close();
    }
  }

  searchUser = async (data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("users", {
        returnNonCachedInstance: true,
      });
      const users = await collection.find(data).toArray();
      return users;
    } finally {
      await client.close();
    }
  };

  findUser = async (dni) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("users");
      const user = await collection.findOne(
        { dni },
        { returnNonCachedInstance: true }
      );
      return user;
    } finally {
      await client.close();
    }
  };

  findUsuario = async (dni) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("miusuario");
      const user = await collection.findOne(
        { dni },
        { returnNonCachedInstance: true }
      );
      return user;
    } finally {
      await client.close();
    }
  };

  findUserbyId = async (_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("users");
      const user = await collection.findOne(
        { _id },
        { returnNonCachedInstance: true }
      );
      return user;
    } finally {
      await client.close();
    }
  };

  findUserbyUid = async (uid) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("users");
      const user = await collection.findOne(
        { uid },
        { returnNonCachedInstance: true }
      );
      return user;
    } finally {
      await client.close();
    }
  };

  async deleteUser(_id) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("users", {
        returnNonCachedInstance: true,
      });
      await collection.deleteOne({ _id });
    } finally {
      await client.close();
    }
  }

  async updateUser(_id, newData) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("users", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne({ _id }, { $set: newData });
    } finally {
      await client.close();
    }
  }

  filterUserProject = async (data) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("users");
      const users = await collection.aggregate([
        { $unwind: "$proyectos" },
        { $match: { "proyectos.id": data.id } },
      ]).toArray();
      return users;
    } finally {
      await client.close();
    }
  };
}
