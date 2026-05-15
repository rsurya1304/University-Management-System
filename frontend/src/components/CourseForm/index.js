import React, { Component } from 'react';
import { FiPlus, FiSave, FiX } from 'react-icons/fi';
import './index.css';

class CourseForm extends Component {
  render() {
    const { editing, form, onCancel, onChange, onSubmit, professors } = this.props;

    return (
      <form className="record-form course-form" onSubmit={onSubmit}>
        <div>
          <p className="eyebrow">{editing ? 'Update' : 'Create'}</p>
          <h2>{editing ? 'Edit course' : 'New course'}</h2>
        </div>
        <label>
          Course name
          <input
            value={form.courseName}
            onChange={(event) => onChange('courseName', event.target.value)}
            placeholder="Course title"
            required
          />
        </label>
        <label>
          Credits
          <input
            type="number"
            min="1"
            max="8"
            value={form.credits}
            onChange={(event) => onChange('credits', event.target.value)}
            required
          />
        </label>
        <label>
          Professor
          <select
            value={form.professorId}
            onChange={(event) => onChange('professorId', event.target.value)}
          >
            <option value="">Unassigned</option>
            {professors.map((professor) => (
              <option key={professor.professorId} value={professor.professorId}>
                {professor.professorName}
              </option>
            ))}
          </select>
        </label>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            {editing ? <FiSave /> : <FiPlus />}
            <span>{editing ? 'Update course' : 'Add course'}</span>
          </button>
          {editing && (
            <button className="ghost-action" type="button" onClick={onCancel}>
              <FiX />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </form>
    );
  }
}

export default CourseForm;
