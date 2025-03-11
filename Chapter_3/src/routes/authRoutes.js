import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  // encrypt the password
  const hashedPassword = bcrypt.hashSync(password, 8);

  // save the new user and hashed password to the db
  try {
    // prepare method -  prepares a SQL query
    const inserUser = db.prepare(
      `INSERT INTO users (username, password) VALUES(?,?)`
    );
    // Run SQL command
    const result = inserUser.run(username, hashedPassword);

    // now that we have a user, I want to add their first todo for them.
    const defaultTodo = "add your first todo";
    const insertTodo = db.prepare(
      "INSERT INTO todos(user_id, task) VALUES(?,?)"
    );
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    // create a token

    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    //send JSON to user
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.sendStatus(503);
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  try {
    const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`);
    const user = getUser.get(username);
    // if we can not find a user associated with that username, return the function
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    // ifpassword does not match. return out the function
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password" });
    }
    console.log(user);
    //successfull authentication
    const token = jwt.sign({ id: user.id }.process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

export default router;
