import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

app.get("/data", async (req, res) => {
  const data = await prisma.record.findMany({ orderBy: { id: "asc" } });
  res.json(data);
});

app.post("/data", async (req, res) => {
  const { name, value } = req.body;
  const record = await prisma.record.create({ data: { name, value } });
  io.emit("dataUpdated"); // Notifies all connected clients
  res.json(record);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
