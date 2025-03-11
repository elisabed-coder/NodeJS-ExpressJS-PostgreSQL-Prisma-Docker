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
      `INSERT INTO tod os(user_id, task) VALUES(?,?)`
    );
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    // create a token

    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: "24hr" }
    );

    //send JSON to user
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.sendStatus(503);
  }
  res.sendStatus(201);
});

router.post("/login", (req, res) => {});

export default router;
