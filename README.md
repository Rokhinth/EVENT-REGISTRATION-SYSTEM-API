Event Registration API

A simple **Event Registration System** built with **Node.js (Express)** and **SQLite (via Prisma ORM)**.  
This project is developed as part of a coding assignment.  

---

## Features
- Create events (only with **future dates**)  
- List events with **filters & sorting**  
- Register attendees with:
  - **Duplicate email check** (per event)  
  - **Capacity validation** (no overbooking)  
- View event statistics (**capacity, registered, remaining seats**)  
- Uses **SQLite** (lightweight database)  

---

## Tech Stack
- **Node.js** + **Express** → REST API  
- **SQLite** → Persistent storage  
- **Prisma** → ORM for database access  
- **Body-Parser** + **CORS** → Middleware  

---

## Project Structure
```
event-registration-api/
│── server.js             # Main server file
│── prisma/schema.prisma  # Database schema
│── package.json
│── README.md
```

---

## ⚡ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/your-username/event-registration-api.git
cd event-registration-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
```bash
npx prisma migrate dev --name init
```

### 4. Run Server
```bash
npm start
```
Server runs at: **http://localhost:3000**

---

## API Endpoints

### Create Event
```http
POST /events
```
**Request Body**
```json
{
  "name": "Tech Conference",
  "description": "Developer Meetup",
  "date": "2025-12-01",
  "capacity": 100
}
```

### List Events (with filters & sorting)
```http
GET /events?sortBy=date&order=asc&keyword=Tech
```

### Register Attendee
```http
POST /events/:id/register
```
**Request Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### View Event Stats
```http
GET /events/:id/stats
```
**Sample Response**
```json
{
  "event": "Tech Conference",
  "capacity": 100,
  "registered": 2,
  "remaining": 98
}