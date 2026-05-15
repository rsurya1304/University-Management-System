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
    return accessLevel === 'ADMIN' || accessLevel === 'REGISTRAR';
  }

  loadCourses = async () => {
    this.setState({ loading: true, apiError: '' });

    try {
      const courses = await apiRequest('/courses');
      let professors = [];

      if (this.canManageCourses()) {
        professors = await apiRequest('/professors').catch(() => []);
      }

      this.setState({
        courses: Array.isArray(courses) ? courses : [],
        professors: Array.isArray(professors) ? professors : [],
      });
    } catch (error) {
      this.setState({
        apiError: `${error.message}. Start the Spring server on ${getApiBase()} and refresh.`,
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

    const isSuccess = notice.includes('created') || notice.includes('updated') || notice.includes('deleted');
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
            detail="Create course offerings, credit values, and professor ownership."
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
              courses={this.filteredCourses()}
              onDelete={this.deleteCourse}
              onEdit={this.startEditCourse}
            />
          </DirectoryPanel>
        )}
      </section>
    );
  }
}

export default CoursesPage;
