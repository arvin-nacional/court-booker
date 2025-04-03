"use server";

import User from "@/database/user.model";
import { CreateUserParams, DeleteUserParams } from "./shadred.types";
import dbConnect from "../mongoose";

export async function createUser(userData: CreateUserParams) {
  try {
    dbConnect();

    const newUser = await User.create(userData);
    const stringUser = JSON.stringify(newUser);
    return stringUser;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating user");
  }
}

export async function testUser() {
  try {
    dbConnect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    dbConnect();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // delete address from database
    // delete orders from database

    return { user };
  } catch (error) {
    console.log(error);
    throw new Error("Error deleting user");
  }
}
