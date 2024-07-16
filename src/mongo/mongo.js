import { MongoClient, ObjectId } from "mongodb";

const mongoURL = process.env.MONGO_URL;

const client = new MongoClient(mongoURL);
const db = client.db("shop-sample");
const users = db.collection("users");
const products = db.collection("products");

//----------------------------------------//

async function fixArrayId(data) {
  return data.map((element) => {
    const newId = element._id.toString();
    const newElement = { ...element, _id: newId, id: newId };
    return newElement;
  });
}

async function fixId(data) {
  const newId = data._id.toString();
  const newData = { ...data, _id: newId, id: newId };
  return newData;
}

//----------------------------------------//

export async function getAllProducts() {
  const data = await products.find().toArray();
  const fixData = await fixArrayId(data);
  return fixData;
}

export async function getProductByProductName(name) {
  const data = await products.findOne({ name });
  if (!data) return;
  const fixData = await fixId(data);
  return fixData;
}

export async function getProductByProductId(id) {
  const data = await products.findOne({ _id: new ObjectId(id) });
  if (!data) return;
  const fixData = await fixId(data);
  return fixData;
}

//----------------------------------------//

export async function getUserByUserEmail(email) {
  const data = await users.findOne({ email });
  if (!data) return;
  const fixData = await fixId(data);
  return fixData;
}

export async function getUserByUserId(id) {
  const data = await users.findOne({ _id: new ObjectId(id) });
  if (!data) return;
  const fixData = await fixId(data);
  return fixData;
}

export async function insertUser(newUser) {
  await users.insertOne(newUser);
}

export async function updateUserByUserId(id, newUser) {
  await users.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name: newUser.name,
        phone: newUser.phone,
        password: newUser.password,
      },
    },
    { upsert: true }
  );
}
//----------------------------------------//

export async function updateUserCartByUserId(id, newCart) {
  await users.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        cart: newCart,
      },
    },
    { upsert: true }
  );
}
