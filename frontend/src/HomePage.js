import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const HomePage = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchStudents = async (currentPage = 1) => {
    try {
      const res = await axios.get(`http://localhost:3001/students?page=${currentPage}&limit=5`);
      setStudents(res.data.data);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const deleteStudent = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/students/${id}`);
          fetchStudents(page);
          Swal.fire('Deleted!', 'The student has been deleted.', 'success');
        } catch (error) {
          Swal.fire('Error!', 'There was an issue deleting the student.', 'error');
        }
      }
    });
  };

  useEffect(() => {
    fetchStudents(page);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchStudents(newPage);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Students List</h2>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={() => navigate('/add-student')}>
          Add Student
        </button>
      </div>

      {students.length === 0 ? (
        <p className="text-muted">No students found</p>
      ) : (
        <>
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: '300px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger me-2"
                      onClick={() => deleteStudent(s.id)}
                    >
                      Delete
                    </button>
                    <Link to={`/marks/${s.id}`} className="btn btn-sm btn-info">
                      View Marks
                    </Link>
                    <Link to={`/add-marks/${s.id}`} className="btn btn-sm btn-success m-2">
                      Add Marks
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="d-flex justify-content-center align-items-center mt-4">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              className="btn btn-outline-primary ms-2"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
