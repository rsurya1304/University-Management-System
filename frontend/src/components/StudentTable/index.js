import React, { Component } from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import './index.css';

class StudentTable extends Component {
  renderActions(student) {
    const { canManage, onDelete, onEdit } = this.props;

    if (!canManage) {
      return null;
    }

    return (
      <td>
        <div className="row-actions">
          <button
            className="row-action edit"
            type="button"
            onClick={() => onEdit(student)}
            title="Edit student"
            aria-label={`Edit ${student.studentName}`}
          >
            <FiEdit3 />
          </button>
          <button
            className="row-action delete"
            type="button"
            onClick={() => onDelete(student)}
            title="Delete student"
            aria-label={`Delete ${student.studentName}`}
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    );
  }

  render() {
    const { canManage, students } = this.props;

    return (
      <div className="student-table data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Courses</th>
              {canManage && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.studentId}>
                <td>{student.studentId}</td>
                <td>{student.studentName}</td>
                <td>{student.email}</td>
                <td>{student.courses?.length || 0}</td>
                {this.renderActions(student)}
              </tr>
            ))}
          </tbody>
        </table>
        {!students.length && <div className="empty-state">No students found.</div>}
      </div>
    );
  }
}

export default StudentTable;
