import React, { Component } from 'react';
import { FiSearch } from 'react-icons/fi';
import { apiRequest, getApiBase } from '../../services/api';
import DirectoryPanel from '../DirectoryPanel';
import ProfessorForm from '../ProfessorForm';
import ProfessorTable from '../ProfessorTable';
import './index.css';

class ProfessorsPage extends Component {
  state = {
    loading: true,
    apiError: '',
    notice: '',
    query: '',
    professors: [],
    editingProfessorId: null,
    professorForm: {
      professorName: '',
      department: '',
    },
  };

  componentDidMount() {
    this.loadProfessors();
  }

  loadProfessors = async () => {
    this.setState({ loading: true, apiError: '' });

    try {
      const professors = await apiRequest('/professors');
      this.setState({ professors: Array.isArray(professors) ? professors : [] });
    } catch (error) {
      this.setState({
        apiError: `${error.message}. Start the Spring server on ${getApiBase()} and refresh.`,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  updateProfessorForm = (field, value) => {
    this.setState((state) => ({
      professorForm: {
        ...state.professorForm,
        [field]: value,
      },
    }));
  };

  startEditProfessor = (professor) => {
    this.setState({
      editingProfessorId: professor.professorId,
      notice: '',
      professorForm: {
        professorName: professor.professorName || '',
        department: professor.department || '',
      },
    });
  };

  cancelProfessorEdit = () => {
    this.setState({
      editingProfessorId: null,
      notice: '',
      professorForm: { professorName: '', department: '' },
    });
  };

  submitProfessor = async (event) => {
    event.preventDefault();
    this.setState({ notice: '' });

    const { editingProfessorId, professorForm } = this.state;

    try {
      await apiRequest(
        editingProfessorId ? `/professors/${editingProfessorId}` : '/professors',
        {
          method: editingProfessorId ? 'PUT' : 'POST',
          body: professorForm,
        }
      );
      this.setState({
        editingProfessorId: null,
        professorForm: { professorName: '', department: '' },
        notice: editingProfessorId ? 'Professor record updated.' : 'Professor record created.',
      });
      this.loadProfessors();
    } catch (error) {
      this.setState({ notice: error.message });
    }
  };

  deleteProfessor = async (professor) => {
    if (!window.confirm(`Delete professor "${professor.professorName}"?`)) {
      return;
    }

    try {
      await apiRequest(`/professors/${professor.professorId}`, { method: 'DELETE' });
      this.setState({
        editingProfessorId: null,
        professorForm: { professorName: '', department: '' },
        notice: 'Professor record deleted.',
      });
      this.loadProfessors();
    } catch (error) {
      this.setState({ notice: error.message });
    }
  };

  filteredProfessors() {
    const query = this.state.query.trim().toLowerCase();
    if (!query) {
      return this.state.professors;
    }

    return this.state.professors.filter((professor) =>
      [professor.professorName, professor.department].join(' ').toLowerCase().includes(query)
    );
  }

  renderNotice() {
    const { notice } = this.state;
    if (!notice) {
      return null;
    }

    const isSuccess = notice.includes('created') || notice.includes('updated') || notice.includes('deleted');
    return <div className={`status-message ${isSuccess ? 'success' : 'error'}`}>{notice}</div>;
  }

  renderSearch() {
    return (
      <div className="search-row">
        <label>
          Search professors
          <span className="search-input-shell">
            <FiSearch aria-hidden="true" />
            <input
              type="search"
              value={this.state.query}
              onChange={(event) => this.setState({ query: event.target.value })}
              placeholder="Search by professor or department"
            />
          </span>
        </label>
      </div>
    );
  }

  render() {
    const { apiError, editingProfessorId, loading, professorForm } = this.state;

    return (
      <section className="professors-page route-page">
        {apiError && <div className="status-message error">{apiError}</div>}
        {this.renderNotice()}
        {this.renderSearch()}
        {loading ? (
          <div className="empty-state">Loading professors...</div>
        ) : (
          <DirectoryPanel
            title="Professor directory"
            detail="Maintain faculty profiles and department ownership."
            action={
              <ProfessorForm
                editing={Boolean(editingProfessorId)}
                form={professorForm}
                onCancel={this.cancelProfessorEdit}
                onChange={this.updateProfessorForm}
                onSubmit={this.submitProfessor}
              />
            }
          >
            <ProfessorTable
              canManage
              professors={this.filteredProfessors()}
              onDelete={this.deleteProfessor}
              onEdit={this.startEditProfessor}
            />
          </DirectoryPanel>
        )}
      </section>
    );
  }
}

export default ProfessorsPage;
