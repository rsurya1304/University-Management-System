import React, { Component } from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import './index.css';

class CourseTable extends Component {
  renderActions(course) {
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
            onClick={() => onEdit(course)}
            title="Edit course"
            aria-label={`Edit ${course.courseName}`}
          >
            <FiEdit3 />
          </button>
          <button
            className="row-action delete"
            type="button"
            onClick={() => onDelete(course)}
            title="Delete course"
            aria-label={`Delete ${course.courseName}`}
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    );
  }

  render() {
    const { canManage, courses } = this.props;

    return (
      <div className="course-table data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Course</th>
              <th>Credits</th>
              <th>Professor</th>
              <th>Students</th>
              {canManage && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.courseId}>
                <td>{course.courseId}</td>
                <td>{course.courseName}</td>
                <td>{course.credits}</td>
                <td>{course.professor?.professorName || 'Unassigned'}</td>
                <td>{course.students?.length || 0}</td>
                {this.renderActions(course)}
              </tr>
            ))}
          </tbody>
        </table>
        {!courses.length && <div className="empty-state">No courses found.</div>}
      </div>
    );
  }
}

export default CourseTable;
