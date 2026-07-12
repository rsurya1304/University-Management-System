import React, { Component } from 'react';
import { FiSearch } from 'react-icons/fi';
import { apiRequest, getApiBase } from '../../services/api';
import CourseForm from '../CourseForm';
import CourseTable from '../CourseTable';
import DirectoryPanel from '../DirectoryPanel';
import './index.css';

class CoursesPage extends Component {
  state = {
    loading: true,
    apiError: '',
    notice: '',
    query: '',
    courses: [],
    registeredCourseIds: [],
    professors: [],
    editingCourseId: null,
    courseForm: {
      courseName: '',
      credits: '3',
      professorId: '',
    },
  };

  componentDidMount() {
    this.loadCourses();
  }

  canManageCourses() {
    const { accessLevel } = this.props.session;
    return accessLevel === 'ADMIN';
  }

  canRegisterCourses() {
    return this.props.session.accessLevel === 'STUDENT';
  }

  loadCourses = async () => {
    this.setState({ loading: true, apiError: '' });

    try {
      const courses = await apiRequest('/courses');
      let professors = [];
      let registeredCourseIds = [];

      if (this.canManageCourses()) {
        professors = await apiRequest('/professors').catch(() => []);
      }

      if (this.canRegisterCourses()) {
        const registeredCourses = await apiRequest('/me/courses').catch(() => []);
        registeredCourseIds = Array.isArray(registeredCourses)
          ? registeredCourses.map((course) => course.courseId)
          : [];
      }

      this.setState({
        courses: Array.isArray(courses) ? courses : [],
        registeredCourseIds,
        professors: Array.isArray(professors) ? professors : [],
      });
    } catch (error) {
      this.setState({
        apiError: `${error.message}. The backend service at ${getApiBase()} may still be starting. Please wait a moment and refresh.`,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  updateCourseForm = (field, value) => {
    this.setState((state) => ({
      courseForm: {
        ...state.courseForm,
        [field]: value,
      },
    }));
  };

  startEditCourse = (course) => {
    this.setState({
      editingCourseId: course.courseId,
      notice: '',
      courseForm: {
        courseName: course.courseName || '',
        credits: String(course.credits || '3'),
        professorId: course.professor?.professorId ? String(course.professor.professorId) : '',
      },
    });
  };

  cancelCourseEdit = () => {
    this.setState({
      editingCourseId: null,
      notice: '',
      courseForm: { courseName: '', credits: '3', professorId: '' },
    });
  };

  submitCourse = async (event) => {
    event.preventDefault();
    this.setState({ notice: '' });

    const { courseForm, editingCourseId } = this.state;
    const body = {
      courseName: courseForm.courseName,
      credits: Number(courseForm.credits),
    };

    if (courseForm.professorId) {
      body.professor = { professorId: Number(courseForm.professorId) };
    }

    try {
      await apiRequest(editingCourseId ? `/courses/${editingCourseId}` : '/courses', {
        method: editingCourseId ? 'PUT' : 'POST',
        body,
      });
      this.setState({
        editingCourseId: null,
        courseForm: { courseName: '', credits: '3', professorId: '' },
        notice: editingCourseId ? 'Course record updated.' : 'Course record created.',
      });
      this.loadCourses();
    } catch (error) {
      this.setState({ notice: error.message });
    }
  };

  deleteCourse = async (course) => {
    if (!window.confirm(`Delete course "${course.courseName}"?`)) {
      return;
    }

    try {
      await apiRequest(`/courses/${course.courseId}`, { method: 'DELETE' });
      this.setState({
        editingCourseId: null,
        courseForm: { courseName: '', credits: '3', professorId: '' },
        notice: 'Course record deleted.',
      });
      this.loadCourses();
    } catch (error) {
      this.setState({ notice: error.message });
    }
  };

  isCourseRegistered = (course) => this.state.registeredCourseIds.includes(course.courseId);

  registerCourse = async (course) => {
    this.setState({ notice: '' });

    try {
      await apiRequest(`/me/courses/${course.courseId}`, { method: 'POST' });
      this.setState({ notice: `Registered for ${course.courseName}.` });
      this.loadCourses();
    } catch (error) {
      this.setState({ notice: error.message });
    }
  };

  withdrawCourse = async (course) => {
    this.setState({ notice: '' });

    try {
      await apiRequest(`/me/courses/${course.courseId}`, { method: 'DELETE' });
      this.setState({ notice: `Withdrawn from ${course.courseName}.` });
      this.loadCourses();
    } catch (error) {
      this.setState({ notice: error.message });
    }
  };

  filteredCourses() {
    const query = this.state.query.trim().toLowerCase();
    if (!query) {
      return this.state.courses;
    }

    return this.state.courses.filter((course) => {
      const text = [
        course.courseName,
        course.credits,
        course.professor?.professorName,
      ].filter(Boolean).join(' ').toLowerCase();
      return text.includes(query);
    });
  }

  renderNotice() {
    const { notice } = this.state;
    if (!notice) {
      return null;
    }

    const isSuccess = ['created', 'updated', 'deleted', 'Registered', 'Withdrawn']
      .some((word) => notice.includes(word));
    return <div className={`status-message ${isSuccess ? 'success' : 'error'}`}>{notice}</div>;
  }

  renderSearch() {
    return (
      <div className="search-row">
        <label>
          Search courses
          <span className="search-input-shell">
            <FiSearch aria-hidden="true" />
            <input
              type="search"
              value={this.state.query}
              onChange={(event) => this.setState({ query: event.target.value })}
              placeholder="Search by course, credit, or professor"
            />
          </span>
        </label>
      </div>
    );
  }

  render() {
    const { apiError, courseForm, editingCourseId, loading, professors } = this.state;
    const canManage = this.canManageCourses();
    const canRegister = this.canRegisterCourses();

    return (
      <section className="courses-page route-page">
        {apiError && <div className="status-message error">{apiError}</div>}
        {this.renderNotice()}
        {this.renderSearch()}
        {loading ? (
          <div className="empty-state">Loading courses...</div>
        ) : (
          <DirectoryPanel
            title="Course catalog"
            detail={
              canRegister
                ? 'Browse available courses and manage your personal course registration.'
                : 'Create course offerings, credit values, and professor ownership.'
            }
            action={
              canManage && (
                <CourseForm
                  editing={Boolean(editingCourseId)}
                  form={courseForm}
                  onCancel={this.cancelCourseEdit}
                  onChange={this.updateCourseForm}
                  onSubmit={this.submitCourse}
                  professors={professors}
                />
              )
            }
          >
            <CourseTable
              canManage={canManage}
              canRegister={canRegister}
              courses={this.filteredCourses()}
              isRegistered={this.isCourseRegistered}
              onDelete={this.deleteCourse}
              onEdit={this.startEditCourse}
              onRegister={this.registerCourse}
              onWithdraw={this.withdrawCourse}
            />
          </DirectoryPanel>
        )}
      </section>
    );
  }
}

export default CoursesPage;
