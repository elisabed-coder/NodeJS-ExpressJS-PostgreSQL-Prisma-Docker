import express from "express";
import db from "../db.js";

const router = express.Router();

//Get all todos for logged-in user

router.get("/", (req, res) => {
  const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id=?`);
  const todos = getTodos.all(req.userId);
  res.json(todos);
});

router.post("/", (req, res) => {
  const { task } = req.body;
  const insertTodo = db.prepare(
    `INSERT INTO todos(user_id, task) VALUES(?, ?)`
  );
  const result = insertTodo.run(req.userId, task);

  res.json({ id: result.lastInsertRowid, task, completed: 0 });
});

router.put("/:id", (res, req) => {
  const { completed } = req.body;
  const { id } = req.params;
  const { page } = req.query;

  const updatedTodo = db.prepare(`UPDATE todos SET completed=?`);
  updatedTodo.run(completed, id);
  res.josn({ message: "todo Completed" });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const deletedTodo = db.prepare("DELETE FROM todos WHERE id=? AND user_id=? ");
  deletedTodo.run(id, userId);
  res.send({ message: "Todo deleted" });
});

export default router;
