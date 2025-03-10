import express from "express";
import db from "../db.js";

const router = express.Router();

//Get all todos for logged-in user

router.get("/", (req, res) => {});

router.post("/", (req, res) => {});

router.put("/:id", (res, req) => {});

router.delete("/:id", (req, res) => {});

export default router;
