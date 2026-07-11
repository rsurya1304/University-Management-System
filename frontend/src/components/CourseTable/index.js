import React, { Component } from 'react';
import { FiCheckCircle, FiEdit3, FiPlusCircle, FiTrash2, FiXCircle } from 'react-icons/fi';
import './index.css';

class CourseTable extends Component {
  renderActions(course) {
    const {
      canManage,
      canRegister,
      isRegistered,
      onDelete,
      onEdit,
      onRegister,
      onWithdraw,
    } = this.props;

    if (canRegister) {
      const registered = isRegistered(course);
      return (
        <td>
          <button
            className={`course-register-action ${registered ? 'registered' : ''}`}
            type="button"
            onClick={() => (registered ? onWithdraw(course) : onRegister(course))}
          >
            {registered ? <FiXCircle /> : <FiPlusCircle />}
            <span>{registered ? 'Withdraw' : 'Register'}</span>
          </button>
        </td>
      );
    }

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
    const { canManage, canRegister, courses, isRegistered } = this.props;

    return (
      <div className="course-table data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Course</th>
              <th>Credits</th>
              <th>Professor</th>
              {canManage && <th>Students</th>}
              {canRegister && <th>Status</th>}
              {(canManage || canRegister) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.courseId}>
                <td>{course.courseId}</td>
                <td>{course.courseName}</td>
                <td>{course.credits}</td>
                <td>{course.professor?.professorName || 'Unassigned'}</td>
                {canManage && <td>{course.students?.length || 0}</td>}
                {canRegister && (
                  <td>
                    <span className={`course-status ${isRegistered(course) ? 'active' : ''}`}>
                      {isRegistered(course) ? (
                        <>
                          <FiCheckCircle />
                          Registered
                        </>
                      ) : (
                        'Available'
                      )}
                    </span>
                  </td>
                )}
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
