import express from 'express'
import db from '../db/index.js'

const router = express.Router()

// Route to add marks for a student
router.post('/', async (req, res) => {
    const { st_id, subject, marks } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO marks (st_id, subject, marks) VALUES ($1, $2, $3)',
        [st_id, subject, marks]
      );
      res.status(201).json({ message: 'Marks added successfully' });
    } catch (e) {
      console.error('Route to add marks for a student' + e);
      res.status(500).json({ error: 'some exception occured' });
    }
  });

  //Edit student marks
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { st_id, subject, marks } = req.body;
    try {
      const result = await db.query(
        'UPDATE marks SET subject = $2, marks = $3 WHERE st_id = $4 RETURNING *',
        [st_id, subject, marks, id]
      );
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Marks not found' });
      }
  
      res.status(200).json({ message: 'Data updated successfully', marks: result.rows[0] });
    } catch (e) {
        console.error('Edit student marks ' + e);
        res.status(500).json({ error: 'some exception occured' });
      }
  });

  export default router