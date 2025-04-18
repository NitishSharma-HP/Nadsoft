import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();

const app = express();

app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

import studentRoutes from './routes/students.js';
import marksRoutes from './routes/marks.js';

app.get('/health', (req, res)=>{
  res.json({
    "health": "working fine"
  })
})

app.use('/students', studentRoutes);
app.use('/marks', marksRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
