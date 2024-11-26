const knex = require("../database/knex");
const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');
const Paginator = require("./paginator");
const cartservice = require("../services/carts.services");
function userRepository() {
  return knex("users");
}

function readUser(payload) {
  return {
    U_username: payload.U_username, // Maps to U_username
    U_password: payload.U_password, // Maps to U_password (note: should be hashed before storing)
    U_role: payload.U_role || "user", // Maps to U_role; default to 'user' if not provided
    U_created_at: new Date(), // Sets current timestamp for U_created_at
    U_phone: payload.U_phone, // Maps to U_phone
    U_address: payload.U_address, // Maps to U_address
  };
}

async function getUserById(id) {
  return userRepository().where("U_id", id).select("*").first();
}

async function getUsersByFilter(query) {
  const { name, role, page = 1, limit = 5 } = query;

  const paginator = new Paginator(page, limit);

  let results = await knex("users")
    .where((builder) => {
      if (name) {
        builder.where("U_username", "like", `%${name}%`);
      }
      if (role !== undefined) {
        builder.where("U_role", role);
      }
    })
    .select(
      knex.raw("count(U_id) OVER() AS recordCount"),
      "U_id",
      "U_username",
      "U_address",
      "U_phone",
      "U_role",
      "U_created_at"
    )
    .limit(paginator.limit)
    .offset(paginator.offset);

  let totalRecords = 0;
  results = results.map((result) => {
    totalRecords = result.recordCount;
    delete result.recordCount;
    return result;
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    users: results,
  };
}

async function register(userData) {
  try {
    // Check if the username already exists in the database
    const existingUser = await userRepository()
      .select("U_ID")
      .where("U_username", userData.U_username)
      .first(); // Fetch the user with the same username

    if (existingUser) {
      throw new Error(
        "Username already exists. Please choose a different one."
      ); // Handle duplicate username
    }

    // Insert user data
    const [newUserId] = await userRepository().insert(userData); // Insert user data without returning fields
    console.log(newUserId);
    await cartservice.createCart(newUserId);
    // Fetch the newly created user using the ID
    const newUser = await userRepository()
      .select([
        "U_ID",
        "U_username",
        "U_role",
        "U_phone",
        "U_address",
        "U_created_at",
      ])
      .where("U_ID", newUserId)
      .first(); // Get the newly created user record

    return newUser; // Return the newly created user
  } catch (error) {
    throw new Error("User creation failed: " + error.message);
  }
}

async function findUserByUsername(U_username) {
  try {
    const user = await knex("users").where({ U_username }).first();
    return user;
  } catch (error) {
    console.error("Error finding user by username:", error);
    throw new Error("Error finding user by username");
  }
}

async function updateUser(id, updatedData) {
  try {
    // Kiểm tra xem mật khẩu có được cập nhật không và mã hóa nó
    if (updatedData.U_password) {
      updatedData.U_password = await bcrypt.hash(updatedData.U_password, 10);
    }

    // Cập nhật thông tin người dùng trong cơ sở dữ liệu
    await userRepository().where("U_ID", id).update(updatedData); // Thực hiện cập nhật mà không cần trả về các trường

    // Lấy thông tin người dùng đã cập nhật
    const updatedUser = await userRepository()
      .select([
        "U_ID",
        "U_username",
        "U_role",
        "U_phone",
        "U_address",
        "U_created_at",
      ])
      .where("U_ID", id)
      .first(); // Lấy bản ghi người dùng đã cập nhật

    return updatedUser; // Trả về thông tin người dùng đã cập nhật
  } catch (error) {
    throw new Error("Database update failed: " + error.message);
  }
}

async function deleteUser(id) {
  const deletedUser = await userRepository().where("U_id", id).first();

  if (!deletedUser) {
    return null;
  }

  await userRepository().where("U_id", id).del();
  return deletedUser;
}

module.exports = {
  getUserById,
  getUsersByFilter,
  register,
  updateUser,
  deleteUser,
  findUserByUsername,
};
