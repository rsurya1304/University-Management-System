import React, { Component } from 'react';
import { FiEdit3, FiPlus, FiSave, FiTrash2, FiX } from 'react-icons/fi';
import { apiRequest } from '../../services/api';
import './index.css';

class ModulePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      records: [],
      options: {},
      form: this.emptyForm(props),
      editingId: null,
      loading: true,
      notice: '',
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.endpoint !== this.props.endpoint) {
      this.setState(
        {
          records: [],
          options: {},
          form: this.emptyForm(this.props),
          editingId: null,
          loading: true,
          notice: '',
        },
        this.loadData
      );
    }
  }

  emptyForm(props) {
    const form = {};
    props.formFields.forEach((field) => {
      form[field.name] = field.defaultValue || '';
    });
    return form;
  }

  loadData = async () => {
    this.setState({ loading: true });

    try {
      const records = await apiRequest(this.props.endpoint);
      const options = {};

      if (this.props.canManage) {
        for (const field of this.props.formFields) {
          if (field.optionsEndpoint) {
            options[field.name] = await apiRequest(field.optionsEndpoint);
          }
        }
      }

      this.setState({
        records: Array.isArray(records) ? records : objectToRows(records),
        options,
        loading: false,
      });
    } catch (error) {
      this.setState({ notice: error.message, loading: false });
    }
  };

  updateField = (field, value) => {
    this.setState((state) => ({
      form: {
        ...state.form,
        [field]: value,
      },
    }));
  };

  startEdit = (record) => {
    const form = {};
    this.props.formFields.forEach((field) => {
      form[field.name] = field.fromRecord
        ? field.fromRecord(record)
        : record[field.name] || '';
    });

    this.setState({
      form,
      editingId: record[this.props.idField],
      notice: '',
    });
  };

  cancelEdit = () => {
    this.setState({
      form: this.emptyForm(this.props),
      editingId: null,
      notice: '',
    });
  };

  submit = async (event) => {
    event.preventDefault();

    const { editingId, form } = this.state;
    const body = this.props.buildBody ? this.props.buildBody(form) : form;

    try {
      await apiRequest(editingId ? `${this.props.endpoint}/${editingId}` : this.props.endpoint, {
        method: editingId ? 'PUT' : 'POST',
        body,
      });

      this.setState({
        form: this.emptyForm(this.props),
        editingId: null,
        notice: editingId ? 'Record updated.' : 'Record created.',
      });
      this.loadData();
    } catch (error) {
      this.setState({ notice: error.message });
    }
  };

  deleteRecord = async (record) => {
    const label = this.props.getRecordLabel
      ? this.props.getRecordLabel(record)
      : record[this.props.idField];

    if (!window.confirm(`Delete "${label}"?`)) {
      return;
    }

    try {
      await apiRequest(`${this.props.endpoint}/${record[this.props.idField]}`, {
        method: 'DELETE',
      });
      this.setState({ notice: 'Record deleted.' });
      this.loadData();
    } catch (error) {
      this.setState({ notice: error.message });
    }
  };

  renderCell(record, column) {
    if (column.render) {
      return column.render(record);
    }

    return getPath(record, column.key) || '-';
  }

  renderForm() {
    const { canManage, formFields } = this.props;
    const { editingId, form, options } = this.state;

    if (!canManage) {
      return null;
    }

    return (
      <aside className="module-form-panel panel">
        <form className="module-form" onSubmit={this.submit}>
          <div>
            <p className="eyebrow">{editingId ? 'Update' : 'Create'}</p>
            <h2>{editingId ? `Edit ${this.props.singular}` : `New ${this.props.singular}`}</h2>
          </div>

          {formFields.map((field) => (
            <label key={field.name}>
              {field.label}
              {field.type === 'select' ? (
                <select
                  value={form[field.name]}
                  onChange={(event) => this.updateField(field.name, event.target.value)}
                  required={field.required}
                >
                  <option value="">Select</option>
                  {(options[field.name] || []).map((option) => (
                    <option key={field.optionValue(option)} value={field.optionValue(option)}>
                      {field.optionLabel(option)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  value={form[field.name]}
                  onChange={(event) => this.updateField(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </label>
          ))}

          <div className="form-actions">
            <button className="primary-action" type="submit">
              {editingId ? <FiSave /> : <FiPlus />}
              <span>{editingId ? 'Update' : 'Add'}</span>
            </button>
            {editingId && (
              <button className="ghost-action" type="button" onClick={this.cancelEdit}>
                <FiX />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </form>
      </aside>
    );
  }

  render() {
    const { canManage, columns } = this.props;
    const { loading, notice, records } = this.state;

    return (
      <section className="module-page">
        <div className="panel module-table-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Module</p>
              <h2>{this.props.title}</h2>
              <span className="panel-detail">{this.props.detail}</span>
            </div>
          </div>

          {notice && (
            <div className={`status-message ${notice.includes('Record') ? 'success' : 'error'}`}>
              {notice}
            </div>
          )}

          {loading ? (
            <div className="empty-state">Loading {this.props.title.toLowerCase()}...</div>
          ) : (
            <div className="data-table module-table">
              <table>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key}>{column.label}</th>
                    ))}
                    {canManage && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record[this.props.idField]}>
                      {columns.map((column) => (
                        <td key={column.key}>{this.renderCell(record, column)}</td>
                      ))}
                      {canManage && (
                        <td>
                          <div className="row-actions">
                            <button
                              className="row-action edit"
                              type="button"
                              onClick={() => this.startEdit(record)}
                            >
                              <FiEdit3 />
                            </button>
                            <button
                              className="row-action delete"
                              type="button"
                              onClick={() => this.deleteRecord(record)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {!records.length && <div className="empty-state">No records found.</div>}
            </div>
          )}
        </div>

        {this.renderForm()}
      </section>
    );
  }
}

function getPath(record, path) {
  return path.split('.').reduce((value, key) => value?.[key], record);
}

function objectToRows(value) {
  return Object.entries(value || {}).map(([metric, result]) => ({
    metric,
    value: result,
  }));
}

export default ModulePage;
