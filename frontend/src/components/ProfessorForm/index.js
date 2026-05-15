import React, { Component } from 'react';
import { FiPlus, FiSave, FiX } from 'react-icons/fi';
import './index.css';

class ProfessorForm extends Component {
  render() {
    const { editing, form, onCancel, onChange, onSubmit } = this.props;

    return (
      <form className="record-form professor-form" onSubmit={onSubmit}>
        <div>
          <p className="eyebrow">{editing ? 'Update' : 'Create'}</p>
          <h2>{editing ? 'Edit professor' : 'New professor'}</h2>
        </div>
        <label>
          Professor name
          <input
            value={form.professorName}
            onChange={(event) => onChange('professorName', event.target.value)}
            placeholder="Professor name"
            required
          />
        </label>
        <label>
          Department
          <input
            value={form.department}
            onChange={(event) => onChange('department', event.target.value)}
            placeholder="Department"
            required
          />
        </label>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            {editing ? <FiSave /> : <FiPlus />}
            <span>{editing ? 'Update professor' : 'Add professor'}</span>
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

export default ProfessorForm;
