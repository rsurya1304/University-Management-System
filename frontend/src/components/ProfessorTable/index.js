import React, { Component } from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import './index.css';

class ProfessorTable extends Component {
  renderActions(professor) {
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
            onClick={() => onEdit(professor)}
            title="Edit professor"
            aria-label={`Edit ${professor.professorName}`}
          >
            <FiEdit3 />
          </button>
          <button
            className="row-action delete"
            type="button"
            onClick={() => onDelete(professor)}
            title="Delete professor"
            aria-label={`Delete ${professor.professorName}`}
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    );
  }

  render() {
    const { canManage, professors } = this.props;

    return (
      <div className="professor-table data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Courses</th>
              {canManage && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {professors.map((professor) => (
              <tr key={professor.professorId}>
                <td>{professor.professorId}</td>
                <td>{professor.professorName}</td>
                <td>{professor.department}</td>
                <td>{professor.courses?.length || 0}</td>
                {this.renderActions(professor)}
              </tr>
            ))}
          </tbody>
        </table>
        {!professors.length && <div className="empty-state">No professors found.</div>}
      </div>
    );
  }
}

export default ProfessorTable;
