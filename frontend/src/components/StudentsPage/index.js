import React, { Component } from 'react';
import { FiSearch } from 'react-icons/fi';
import { apiRequest, getApiBase } from '../../services/api';
import DirectoryPanel from '../DirectoryPanel';
import StudentForm from '../StudentForm';
import StudentTable from '../StudentTable';
import './index.css';

class StudentsPage extends Component {
  state = {
    loading: true,
    apiError: '',
    notice: '',
    query: '',
    students: [],
    editingStudentId: null,
    studentForm: {
      studentName: '',
      email: '',
    },
  };

  componentDidMount() {
    this.loadStudents();
  }

  canManageStudents() {
    const { accessLevel } = this.props.session;
    return accessLevel === 'ADMIN' || accessLevel === 'REGISTRAR';
  }

  loadStudents = async () => {
    this.setState({ loading: true, apiError: '' });

    try {
      const students = await apiRequest('/students');
      this.setState({ students: Array.isArray(students) ? students : [] });
    } catch (error) {
      this.setState({
        apiError: `${error.message}. Start the Spring server on ${getApiBase()} and refresh.`,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  updateStudentForm = (field, value) => {
    this.setState((state) => ({
      studentForm: {
        ...state.studentForm,
        [field]: value,
      },
    }));
  };

  startEditStudent = (student) => {
    this.setState({
      editingStudentId: student.studentId,
      notice: '',
      studentForm: {
        studentName: student.studentName || '',
        email: student.email || '',
      },
    });
  };

  cancelStudentEdit = () => {
    this.setState({
      editingStudentId: null,
      notice: '',
      studentForm: { studentName: '', email: '' },
    });
  };

  submitStudent = async (event) => {
    event.preventDefault();
    this.setState({ notice: '' });

    const { editingStudentId, studentForm } = this.state;

    try {
      await apiRequest(editingStudentId ? `/students/${editingStudentId}` : '/students', {
        method: editingStudentId ? 'PUT' : 'POST',
        body: studentForm,
      });
      this.setState({
        editingStudentId: null,
        studentForm: { studentName: '', email: '' },
        notice: editingStudentId ? 'Student record updated.' : 'Student record created.',
      });
      this.loadStudents();
    } catch (error) {
      this.setState({ notice: error.message });
    }
  };

  deleteStudent = async (student) => {
    if (!window.confirm(`Delete student "${student.studentName}"?`)) {
      return;
    }

    try {
      await apiRequest(`/students/${student.studentId}`, { method: 'DELETE' });
      this.setState({
        editingStudentId: null,
        studentForm: { studentName: '', email: '' },
        notice: 'Student record deleted.',
      });
      this.loadStudents();
    } catch (error) {
      this.setState({ notice: error.message });
    }
  };

  filteredStudents() {
    const query = this.state.query.trim().toLowerCase();
    if (!query) {
      return this.state.students;
    }

    return this.state.students.filter((student) =>
      [student.studentName, student.email].join(' ').toLowerCase().includes(query)
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
          Search students
          <span className="search-input-shell">
            <FiSearch aria-hidden="true" />
            <input
              type="search"
              value={this.state.query}
              onChange={(event) => this.setState({ query: event.target.value })}
              placeholder="Search by student name or email"
            />
          </span>
        </label>
      </div>
    );
  }

  render() {
    const { apiError, editingStudentId, loading, studentForm } = this.state;
    const canManage = this.canManageStudents();

    return (
      <section className="students-page route-page">
        {apiError && <div className="status-message error">{apiError}</div>}
        {this.renderNotice()}
        {this.renderSearch()}
        {loading ? (
          <div className="empty-state">Loading students...</div>
        ) : (
          <DirectoryPanel
            title="Student directory"
            detail="Manage learner records, emails, and enrollments."
            action={
              canManage && (
                <StudentForm
                  editing={Boolean(editingStudentId)}
                  form={studentForm}
                  onCancel={this.cancelStudentEdit}
                  onChange={this.updateStudentForm}
                  onSubmit={this.submitStudent}
                />
              )
            }
          >
            <StudentTable
              canManage={canManage}
              students={this.filteredStudents()}
              onDelete={this.deleteStudent}
              onEdit={this.startEditStudent}
            />
          </DirectoryPanel>
        )}
      </section>
    );
  }
}

export default StudentsPage;
