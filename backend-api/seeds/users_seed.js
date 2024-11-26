const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

/**
 * Generates a new user with fake data
 * @returns {Object} A new user object
 */
async function createUser() {
  const hashedPassword = await bcrypt.hash(faker.internet.password(), 10);

  return {
    U_username: faker.internet.userName(),
    U_password: hashedPassword,
    U_role: faker.helpers.arrayElement(['user', 'admin']),
    U_created_at: new Date(),
    U_phone: faker.string.numeric('09########'), // Generates a 10-digit phone number
    U_address: faker.location.streetAddress(),
  };
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  // Generates and inserts 100 new users
  const users = await Promise.all(Array(20).fill().map(createUser));

  await knex('users').insert(users);
};
