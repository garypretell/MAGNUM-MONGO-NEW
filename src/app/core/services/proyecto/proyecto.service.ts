import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
@Injectable({
  providedIn: "root",
})
export class ProyectoService {
  private proyecto = new ReplaySubject<any>(1);
  constructor() {}

  public get recibir() {
    return this.proyecto.asObservable();
  }

  public enviar(p: any): void {
    this.proyecto.next(p);
  }

  loadProyecto: any = async () => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("proyectos", {
        returnNonCachedInstance: true,
      });
      const crops = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return crops;
    } finally {
      await client.close();
    }
  };

  loadmiProyecto: any = async () => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("miproyecto", {
        returnNonCachedInstance: true,
      });
      const crops = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return crops;
    } finally {
      await client.close();
    }
  };

  // loadmiProyecto: any = async (dni) => {
  //   const client = new MongoClient(uri, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });
  //   try {
  //     await client.connect();
  //     const database = client.db("sindex");
  //     const collection = database.collection("miproyecto", {
  //       returnNonCachedInstance: true,
  //     });
  //     const crops = await collection.find({users: {$elemMatch: {dni}}}).sort({ createdAt: -1 }).toArray();
  //     return crops;
  //   } finally {
  //     await client.close();
  //   }
  // };

  createProyecto: any = async (proyecto) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      // const server_time = database.admin();
      // proyecto.createdAt =
      //   server_time.s.db.serverConfig.clusterTime.clusterTime.high_ * 1000;
      proyecto.createdAt = Date.now();
      const collection = database.collection("proyectos", {
        returnNonCachedInstance: true,
      });
      const result = await collection.insertOne(proyecto);
      return result;
    } finally {
      await client.close();
    }
  };

  findProyecto = async(_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("proyectos", {
        returnNonCachedInstance: true,
      });
      const proyecto = await collection.findOne(
        { _id },
        { returnNonCachedInstance: true }
      );
      return proyecto;
    } finally {
      await client.close();
    }
  };

  findmiProyecto = async(_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("miproyecto", {
        returnNonCachedInstance: true,
      });
      const proyecto = await collection.findOne(
        { _id },
        { returnNonCachedInstance: true }
      );
      return proyecto;
    } finally {
      await client.close();
    }
  };

  deleteProyecto = async(_id) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("proyectos", {
        returnNonCachedInstance: true,
      });
      await collection.deleteOne({ _id });
    } finally {
      await client.close();
    }
  };

  updateProyecto = async(_id, newData) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("proyectos", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne({ _id }, { $set: newData });
    } finally {
      await client.close();
    }
  };

  updateProyectoUsuarios = async(codigo, newData) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("proyectos", {
        returnNonCachedInstance: true,
      });
      await collection.updateOne({ codigo }, { $set: newData });
    } finally {
      await client.close();
    }
  };

  usuarioProyectos: any = async (dni) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("proyectos", {
        returnNonCachedInstance: true,
      });
      const proyectos = await collection.find({users: {$elemMatch: {dni}}}).sort({ createdAt: -1 }).toArray();
      return proyectos;
    } finally {
      await client.close();
    }
  };

  async proyectoExport(dni): Promise<any> {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const database = client.db("sindex");
      const collection = database.collection("proyectos", {
        returnNonCachedInstance: true,
      });
      const proyectos = await collection.find({users: {$elemMatch: {dni}}}).project({_id: 1}).toArray();
      return proyectos;
    } finally {
      await client.close();
    }
  }
}
