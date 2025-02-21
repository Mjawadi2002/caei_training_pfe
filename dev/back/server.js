const express = require('express');
require('dotenv').config();
const mysqlPool = require('./config/db');
const userRouter = require('./routes/userRoutes');  
const formationRouter = require('./routes/formationRoutes');
const emailRouter = require('./routes/emailRoutes'); 
const cors = require('cors');  
const http=require('http');
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:3000", 
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for messages from the client
    socket.on("message", (data) => {
        console.log("Message received:", data);
        io.emit("message", data); // Broadcast message to all clients
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

app.use(express.json());  




app.use('/api/v1/users', userRouter);
app.use('/api/v1/formations', formationRouter);
app.use("/api/v1/email", emailRouter);

mysqlPool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); 
    }
    console.log(`Connected to database: ${process.env.DB_NAME}`);
    connection.release();
    
    app.listen(port, () => {
        console.log(`App is working on port: ${port}`);
    });
});
