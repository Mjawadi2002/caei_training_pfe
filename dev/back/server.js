const express = require("express");
require("dotenv").config();
const mysqlPool = require("./config/db");
const userRouter = require("./routes/userRoutes");
const formationRouter = require("./routes/formationRoutes");
const emailRouter = require("./routes/emailRoutes");
const enrollmentRouter = require("./routes/enrollmentsRoutes");
const chatbotRouter = require("./routes/chatbotRoutes");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost", "http://localhost:80", "http://frontend","http://localhost:3000","http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(cors({
  origin: ["http://localhost", "http://localhost:80", "http://frontend","http://localhost:3000","http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/formations", formationRouter);
app.use("/api/v1/email", emailRouter);
app.use("/api/v1/enrollment", enrollmentRouter);
app.use("/api/v1/chatbot", chatbotRouter);

// Socket.io
let activeClients = {};

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join room", ({ userName, room }) => {
    socket.join(room);

    if (!activeClients[room]) {
      activeClients[room] = [];
    }

    activeClients[room].push({ id: socket.id, userName });
    io.emit("update_clients", activeClients);
  });

  socket.on("sending", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    let roomIdToRemove = null;

    for (const room in activeClients) {
      activeClients[room] = activeClients[room].filter(user => user.id !== socket.id);
      if (activeClients[room].length === 0) {
        roomIdToRemove = room;
      }
    }

    if (roomIdToRemove) {
      delete activeClients[roomIdToRemove];
      io.emit("client_left", roomIdToRemove);
    }

    io.emit("update_clients", activeClients);
  });
});

// Connect to MySQL
mysqlPool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to MySQL Database.");
    connection.release();
  }
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
