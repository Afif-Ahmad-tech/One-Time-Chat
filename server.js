const crypto = require("crypto");
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 5 * 1024 * 1024
});

const PORT = process.env.PORT || 3000;
const rooms = new Map();

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function createId(bytes = 8) {
  return crypto.randomBytes(bytes).toString("hex");
}

function publicRoom(room) {
  return {
    id: room.id,
    title: room.title,
    createdAt: room.createdAt,
    users: room.users.size
  };
}

app.post("/api/rooms", (req, res) => {
  const title = String(req.body.title || "One Time Chat").trim().slice(0, 60);
  const id = createId(6);
  const creatorToken = createId(18);

  rooms.set(id, {
    id,
    title,
    creatorToken,
    createdAt: Date.now(),
    messages: [],
    users: new Map()
  });

  res.json({
    room: { id, title },
    creatorToken,
    roomPath: `/room/${id}`
  });
});

app.get("/api/rooms/:roomId", (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) {
    res.status(404).json({ error: "Room not found or already ended." });
    return;
  }

  res.json({ room: publicRoom(room) });
});

app.get("/room/:roomId", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, name, creatorToken }, reply) => {
    const room = rooms.get(roomId);
    if (!room) {
      reply?.({ ok: false, error: "This room has ended or does not exist." });
      return;
    }

    const cleanName = String(name || "Guest").trim().slice(0, 32) || "Guest";
    const isCreator = creatorToken === room.creatorToken;
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.name = cleanName;
    socket.data.isCreator = isCreator;
    room.users.set(socket.id, { id: socket.id, name: cleanName, isCreator });

    reply?.({
      ok: true,
      room: publicRoom(room),
      messages: room.messages,
      isCreator
    });

    io.to(roomId).emit("presence", Array.from(room.users.values()));
    socket.to(roomId).emit("system-message", `${cleanName} joined`);
  });

  socket.on("send-message", ({ text, image }, reply) => {
    const roomId = socket.data.roomId;
    const room = rooms.get(roomId);
    if (!room) {
      reply?.({ ok: false, error: "Room ended." });
      return;
    }

    const cleanText = String(text || "").trim().slice(0, 1200);
    const cleanImage = image && typeof image === "object" ? image : null;

    if (!cleanText && !cleanImage) {
      reply?.({ ok: false, error: "Message is empty." });
      return;
    }

    if (cleanImage) {
      const typeOk = /^image\/(png|jpe?g|gif|webp)$/i.test(cleanImage.type || "");
      const dataOk = typeof cleanImage.dataUrl === "string" && cleanImage.dataUrl.length <= 4_500_000;

      if (!typeOk || !dataOk) {
        reply?.({ ok: false, error: "Image must be PNG, JPG, GIF, or WebP and under about 3 MB." });
        return;
      }
    }

    const message = {
      id: createId(8),
      senderId: socket.id,
      senderName: socket.data.name,
      text: cleanText,
      image: cleanImage
        ? {
            name: String(cleanImage.name || "image").slice(0, 80),
            type: cleanImage.type,
            dataUrl: cleanImage.dataUrl
          }
        : null,
      sentAt: Date.now()
    };

    room.messages.push(message);
    io.to(roomId).emit("new-message", message);
    reply?.({ ok: true });
  });

  socket.on("end-room", ({ roomId, creatorToken }, reply) => {
    const room = rooms.get(roomId);
    if (!room) {
      reply?.({ ok: false, error: "Room already ended." });
      return;
    }

    if (creatorToken !== room.creatorToken) {
      reply?.({ ok: false, error: "Only the creator can end this room." });
      return;
    }

    rooms.delete(roomId);
    io.to(roomId).emit("room-ended");
    io.in(roomId).socketsLeave(roomId);
    reply?.({ ok: true });
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    const room = rooms.get(roomId);
    if (!room) return;

    room.users.delete(socket.id);
    io.to(roomId).emit("presence", Array.from(room.users.values()));

    if (socket.data.name) {
      socket.to(roomId).emit("system-message", `${socket.data.name} left`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`One Time Chat is running on http://localhost:${PORT}`);
});
