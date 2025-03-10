const express = require("express");
const app = express();
const PORT = 3000;

//HTTP VERBS  && Routes (or paths)

let data = ["James"];

//Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<body>
    <h1>
    ${JSON.stringify(data)}</h1>
    </body>`);
});

app.get("/dashboard/", (req, res) => {
  res.send("<h1>dashboard</h1>");
});

app.get("/api/data", (req, res) => {
  console.log("data");
  res.send(data);
});

app.post("/api/data", (req, res) => {
  const newEntry = req.body;
  data.push(newEntry.name);
  res.sendStatus(201);
});

app.delete("api/data", (req, res) => {
  data.pop();
  console.log("We deleted the element");
  res.sendStatus(203);
});

app.listen(PORT, () => console.log(`server has started on : ${PORT}`));
