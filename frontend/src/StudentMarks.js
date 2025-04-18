import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StudentMarks = () => {
  const { id } = useParams(); // student ID from URL
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');

  const fetchStudentMarks = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/students/${id}`);
      setStudent(res.data);
    } catch (err) {
      setError('Failed to fetch student marks');
    }
  };

  useEffect(() => {
    fetchStudentMarks();
  }, [id]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h3>Marks for {student.name}</h3>
      <p><strong>Email:</strong> {student.email}</p>

      {student.marks.length === 0 ? (
        <div className="alert alert-info">No marks available.</div>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Subject</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {student.marks.map((mark, index) => (
              <tr key={index}>
                <td>{mark.subject}</td>
                <td>{mark.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentMarks;
