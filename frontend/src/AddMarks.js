import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddMarks = () => {
  const { id } = useParams(); // student ID
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !marks) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'All fields are required!',
      });
      return;
    }

    try {
      await axios.post('http://localhost:3001/marks', {
        st_id: id,
        subject,
        marks: Number(marks),
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Marks added successfully',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate(`/`);
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add marks',
      });
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Add Marks</h3>

      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Subject</label>
          <input
            type="text"
            className="form-control"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Marks</label>
          <input
            type="number"
            className="form-control"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="Enter marks"
          />
        </div>

        <button type="submit" className="btn btn-success me-2">Submit</button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddMarks;
