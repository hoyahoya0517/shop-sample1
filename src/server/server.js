"use server";

import {
  getAllProducts,
  getProductByProductName,
  getProductByProductId,
  getUserByUserEmail,
  getUserByUserId,
  insertUser,
  updateUserCartByUserId,
  updateUserByUserId,
} from "@/mongo/mongo";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { revalidatePath, unstable_cache } from "next/cache";

const secretKey = process.env.JWT_SECRET_KEY;

async function hashPassword(password) {
  const saltRounds = Number(process.env.SALT_ROUND);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
}

async function createJWTToken(userId) {
  const jwtToken = jwt.sign({ userId }, secretKey, {
    expiresIn: 3600,
  });
  return jwtToken;
}

//----------------------------------------//

export async function getProducts() {
  const data = await getAllProducts();
  return data;
}

export async function getProduct(name) {
  const data = await getProductByProductName(name);
  return data;
}

//----------------------------------------//

export async function signup(prevState, formData) {
  const name = formData.get("name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const password = formData.get("password");

  const findUser = await getUserByUserEmail(email);
  if (findUser)
    return {
      errorMessage: "중복된 이메일",
    };

  const hashedPassword = await hashPassword(password);
  const newUser = { name, phone, email, password: hashedPassword, cart: [] };

  try {
    await insertUser(newUser);
  } catch (error) {
    return {
      errorMessage: "회원가입 오류",
    };
  }

  return {
    successMessage: "회원가입 성공",
  };
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const findUser = await getUserByUserEmail(email);
  if (!findUser)
    return {
      errorMessage: "사용자를 찾을 수 없음",
    };

  const verifyResult = await verifyPassword(password, findUser.password);

  if (!verifyResult)
    return {
      errorMessage: "비밀번호 틀림",
    };

  const userId = findUser.id;
  const jwtToken = await createJWTToken(userId);
  cookies().set("token", jwtToken, {
    maxAge: 3600,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  redirect("/");
}

export async function getUserInfo(user) {
  if (!user) return;
  const data = await getUserByUserId(user.id);
  if (!data) return;
  return data;
}

export async function me() {
  const cookie = cookies().get("token");
  if (!cookie) return;
  const token = cookie.value;
  let result;
  try {
    result = jwt.verify(token, secretKey);
  } catch (error) {
    return;
  }
  if (!result) return;

  const findUser = await getUserByUserId(result.userId);
  if (!findUser) return;
  return { id: findUser.id, email: findUser.email, cart: findUser.cart };
}

export async function logout() {
  const cookie = cookies().get("token");
  if (!cookie.value) return;

  cookies().set("token", "");
}

export async function updateUserInfo(updateUser, oldPassword, newPassword) {
  let hashedPassword = updateUser.password;
  if (oldPassword && !newPassword) return;
  else if (!oldPassword && newPassword) return;
  else if (oldPassword && newPassword) {
    const verifyResult = await verifyPassword(oldPassword, updateUser.password);
    if (!verifyResult) return;
    hashedPassword = await hashPassword(newPassword);
  }
  const newUser = { ...updateUser, password: hashedPassword };
  await updateUserByUserId(updateUser.id, newUser);
  revalidatePath("/user");
}
//----------------------------------------//

export async function getCart(user) {
  if (!user || user.cart?.length === 0) return;
  const cart = await Promise.all(
    user.cart.map(async (product) => {
      const data = await getProductByProductId(product.id);
      return { ...data, myQty: product.myQty };
    })
  );
  return cart;
}

export async function addCart(productId, user) {
  let oldCart;
  if (!user) return;
  if (!user.cart || user.cart?.length === 0) oldCart = [];
  else {
    if (user.cart.find((product) => product.id === productId)) return;
  }

  const product = await getProductByProductId(productId);
  if (product.qty < 1) return;

  oldCart = user.cart;

  const newCart = [...oldCart, { id: productId, myQty: 1 }];
  await updateUserCartByUserId(user.id, newCart);
  revalidatePath("/", "layout");
}

export async function updateCartQty(productId, user, number) {
  if (!user) return;
  let newCart = user.cart;
  const findCart = newCart.find((product) => product.id === productId);
  const product = await getProductByProductId(productId);
  if (number === 1) {
    if (findCart.myQty + 1 >= product.qty) findCart.myQty = product.qty;
    else findCart.myQty += 1;
  } else if (number === -1) {
    if (findCart.myQty - 1 >= product.qty) findCart.myQty = product.qty;
    else if (findCart.myQty - 1 === 0) {
      newCart = newCart.filter((product) => product.id !== productId);
    } else {
      findCart.myQty -= 1;
    }
  }

  await updateUserCartByUserId(user.id, newCart);
  revalidatePath("/", "layout");
}
