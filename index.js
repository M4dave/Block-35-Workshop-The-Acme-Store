import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";
import {
  createTables,
  createUser,
  createProduct,
  createFavorite,
  getProducts,
  getFavorites,
  getUser,
  getProduct,
  getFavorite,
} from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await createTables();
    app.listen(port, () => {
      console.log(chalk.green(`Server started on http://localhost:${port}`));
    });
  } catch (error) {
    console.error(chalk.red(`Error starting server`, error));
  }
};

start();

app.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    res.send(users);
  } catch (error) {
    console.error(chalk.red(`Error fetching users`, error));
    res.status(400).send({ error: "An error occurred. Please try again." });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await getProducts();
    res.send(products);
  } catch (error) {
    console.error(chalk.red(`Error fetching products`, error));
    res.status(400).send({ error: "An error occurred. Please try again." });
  }
});

app.pos("/api/users/:id/favorites", async (req, res) => {
  try {
    const favorites = await getFavorites(req.params.id);
    res.send(favorites);
  } catch (error) {
    console.error(chalk.red(`Error fetching favorites`, error));
    res.status(400).send({ error: "An error occurred. Please try again." });
  }
});

app.post("/api/users/username", async (req, res) => {
  try {
    const user = await getUser(req.query.username);
    res.send(user);
  } catch (error) {
    console.error(chalk.red(`Error fetching user`, error));
    res.status(400).send({ error: "An error occurred. Please try again." });
  }
});

app.post("/api/product/name", async (req, res) => {
  try {
    const product = await getProduct(req.query.name);
    res.send(product);
  } catch (error) {
    console.error(chalk.red(`Error fetching product`, error));
    res.status(400).send({ error: "An error occurred. Please try again." });
  }
});

app.post("/api/user/:id/favorite/:id", async (req, res) => {
  try {
    const favorite = await getFavorite(req.params.id);
    res.send(favorite);
  } catch (error) {
    console.error(chalk.red(`Error fetching favorite`, error));
    res.status(400).send({ error: "An error occurred. Please try again." });
  }
});

app.delete("/api/user/:id/favorite/:id", async (req, res) => {
  try {
    await destroyFavorite(req.params.id);
    res.send({ success: true });
  } catch (error) {
    console.error(chalk.red(`Error deleting favorite`, error));
    res.status(400).send({ error: "An error occurred. Please try again." });
  }
});
