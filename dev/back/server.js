const express = require('express');
require('dotenv').config();
const mysqlPool = require('./config/db');
const userRouter = require('./routes/userRoutes');  
const formationRouter = require('./routes/formationRoutes');
const cors = require('cors');  

const app = express();
const port = process.env.PORT || 5000;


app.use(cors({
    origin: "http://localhost:3000", 
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());  


app.use('/api/v1/users', userRouter);
app.use('/api/v1/formations', formationRouter);


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
