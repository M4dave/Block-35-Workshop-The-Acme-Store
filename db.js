// Each of these method can be tested in a setup function (we named ours init in guided practice) in server/index.js. Make sure each one function works before moving on to the next. Use the guided practice as a reference.

// client - a node pg client
// createTables method - drops and creates the tables for your application
// createProduct - creates a product in the database and returns the created record
// createUser - creates a user in the database and returns the created record. The password of the user should be hashed using bcrypt.
// fetchUsers - returns an array of users in the database
// fetchProducts - returns an array of products in the database
// createFavorite - creates a favorite in the database and returns the created record
// fetchFavorites - returns an array favorites for a user
// destroyFavorite - deletes a favorite in the database

import pg from "pg";
import bcrypt from "bcrypt";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_store"
);

const createTables = async () => {
  await client.connect();

  const SQL = `
    CREATE TABLE IF NOT EXISTS "uuid-ossp";

    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;


    CREATE TABLE users(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL

    );

    CREATE TABLE products(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    category VARCHAR(255) NOT NULL
    );

    CREATE TABLE favorites(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id)
    CONSTRAINT unique_favorite UNIQUE(user_id, product_id)
    );
 
    `;

  await client.query(SQL);
  console.log(chalk.green("Tables created!"));
};

const createUser = async ({ username, password }) => {
  const SQL = `
        INSERT INTO users(username, password)
        VALUES($1, $2)
        RETURNING *;
        `;

  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  return (await client.query(SQL, [username, hashedPassword])).rows[0];
};

const createProduct = async ({ name, price, category }) => {
  const SQL = `
        INSERT INTO products(name, price, category)
        VALUES($1, $2, $3)
        RETURNING *;
        `;

  return (await client.query(SQL, [name, price, category])).rows[0];
};

const fetchUsers = async () => {
  return (await client.query("SELECT * FROM users")).rows;
};

const fetchProducts = async () => {
  return (await client.query("SELECT * FROM products")).rows;
};

const createFavorite = async ({ user_id, product_id }) => {
  const SQL = `
            INSERT INTO favorites(user_id, product_id)
            VALUES($1, $2)
            RETURNING *;
            `;

  return (await client.query(SQL, [user_id, product_id])).rows[0];
};

const fetchFavorites = async (user_id) => {
  const SQL = `
                SELECT * FROM favorites
                WHERE user_id = $1;
                `;

  return (await client.query(SQL, [user_id])).rows;
};

const destroyFavorite = async (id) => {
  const SQL = `
                    DELETE FROM favorites
                    WHERE id = $1
                    RETURNING *;
                    `;

  return (await client.query(SQL, [id])).rows[0];
};

export {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
};
