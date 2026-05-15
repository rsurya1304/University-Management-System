import React, { Component } from 'react';
import { FiPlus, FiSave, FiX } from 'react-icons/fi';
import './index.css';

class StudentForm extends Component {
  render() {
    const { editing, form, onCancel, onChange, onSubmit } = this.props;

    return (
      <form className="record-form student-form" onSubmit={onSubmit}>
        <div>
          <p className="eyebrow">{editing ? 'Update' : 'Create'}</p>
          <h2>{editing ? 'Edit student' : 'New student'}</h2>
        </div>
        <label>
          Student name
          <input
            value={form.studentName}
            onChange={(event) => onChange('studentName', event.target.value)}
            placeholder="Student name"
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => onChange('email', event.target.value)}
            placeholder="student@example.com"
            required
          />
        </label>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            {editing ? <FiSave /> : <FiPlus />}
            <span>{editing ? 'Update student' : 'Add student'}</span>
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

export default StudentForm;
