import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

/**
 * 1. Create Event
 */
app.post("/events", async (req, res) => {
  try {
    const { name, description, date, capacity } = req.body;
    const eventDate = new Date(date);

    if (eventDate <= new Date()) {
      return res.status(400).json({ error: "Event date must be in the future" });
    }

    const event = await prisma.event.create({
      data: { name, description, date: eventDate, capacity },
    });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 2. List Events (with filters + sorting)
 */
app.get("/events", async (req, res) => {
  try {
    const { sortBy = "date", order = "asc", keyword } = req.query;
    const events = await prisma.event.findMany({
      where: keyword ? { name: { contains: keyword } } : {},
      orderBy: { [sortBy]: order },
      include: { attendees: true },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 3. Register Attendee
 */
app.post("/events/:id/register", async (req, res) => {
  try {
    const { name, email } = req.body;
    const eventId = parseInt(req.params.id);

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { attendees: true },
    });

    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ error: "Event is full" });
    }

    const attendee = await prisma.attendee.create({
      data: { name, email, eventId },
    });

    res.json(attendee);
  } catch (err) {
    if (err.code === "P2002") {
      res.status(400).json({ error: "Email already registered for this event" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

/**
 * 4. Event Stats
 */
app.get("/events/:id/stats", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { attendees: true },
    });

    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json({
      event: event.name,
      capacity: event.capacity,
      registered: event.attendees.length,
      remaining: event.capacity - event.attendees.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
