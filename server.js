const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Home route (for testing in browser)
app.get("/", (req, res) => {
  res.send("✅ Event Registration API is running!");
});

// POST /events → save event
app.post("/events", (req, res) => {
  const { name, description, date, capacity } = req.body;

  if (!name || !description || !date || !capacity) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  // In real project → save to DB (SQLite, Prisma, etc.)
  console.log(" New Event:", req.body);

  res.json({
    success: true,
    message: "Event created successfully!",
    data: req.body
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});