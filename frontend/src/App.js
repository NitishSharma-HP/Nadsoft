import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import StudentMarks from './StudentMarks';
import AddMarks from './AddMarks';
import AddStudent from './AddStudent';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/marks/:id" element={<StudentMarks />} />
          <Route path="/add-marks/:id" element={<AddMarks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
