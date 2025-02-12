const express = require('express');
require('dotenv').config();
const mysqlPool = require('./config/db');
const userRouter = require('./routes/userRoutes');  
const formationRouter=require('./routes/formationRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());  

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/formations',formationRouter);

// Start server only if DB is connected
mysqlPool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit if DB fails
    }
    console.log(`Connected to database: ${process.env.DB_NAME}`);
    connection.release();
    
    app.listen(port, () => {
        console.log(`App is working on port: ${port}`);
    });
});
