const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
    res.send('Todo API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
