import express from 'express'
import db from '../db/index.js'

const router = express.Router()

//create new student
router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body
        const student = await db.query(
            `INSERT INTO students (name, email)
            VALUES($1, $2) RETURNING *`,
            [name, email]
        )
        res.status(201).json(student.rows[0])
    } catch (e) {
        console.log('create new student ' + e);
        res.status(400).json({ error: 'some exception occured' })
    }
})

//get all students
router.get('/', async (req, res) => {
    try {
      let { page = 1, limit = 10 } = req.query;
  
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;
  
      const students = await db.query(
        `SELECT * FROM students ORDER BY id LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
  
      const count = await db.query(`SELECT COUNT(*) FROM students`);
      const total = parseInt(count.rows[0].count);
  
      res.status(200).json({
        data: students.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (e) {
      console.log('get all students ' + e);
      res.status(400).json({ error: 'some exception occurred' });
    }
  });  

//get student with marks
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const student = await db.query(
            `SELECT * FROM students s JOIN
            marks m on s.id = m.st_id WHERE s.id = $1`,
            [id]
        )
        if (student.rows.length == 0) {
            return res.status(404).json({ message: 'Student or marks not exist' });
        }
        const studentDetails = {
            id: student.rows[0].id,
            name: student.rows[0].name,
            email: student.rows[0].email,
            marks: []
        };
        student.rows.forEach((row) => {
            if (row.subject) {
                studentDetails.marks.push({
                    subject: row.subject,
                    marks: row.marks
                });
            }
        })
        res.json(studentDetails);
    } catch (e) {
        console.log('get student with marks ' + e);
        res.status(400).json({ 'error': 'some exception occured' })
    }
})

// Edit student details
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
      const student = await db.query(
        'UPDATE students SET name = $1, email = $2 WHERE id = $3 RETURNING *',
        [name, email, id]
      );
      
      if (student.rowCount === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      res.status(200).json({ message: 'Data updated successfully', student: student.rows[0] });
    } catch (e) {
        console.error('Edit student details ' + e);
        res.status(500).json({ error: 'some exception occured' });
    }
  });

//Delete student data
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query(
        'DELETE FROM students WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      res.status(200).json({ message: 'Data deleted successfully' });
    } catch (e) {
        console.error('Delete student data ' + e);
        res.status(500).json({ error: 'some exception occured' });
      }
  });
  
export default router