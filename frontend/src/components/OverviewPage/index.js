import React, { Component } from 'react';
import { apiRequest, getApiBase } from '../../services/api';
import { getProfile } from '../../config/access';
import Overview from '../Overview';
import './index.css';

class OverviewPage extends Component {
  state = {
    loading: true,
    apiError: '',
    counts: {
      students: 0,
      professors: 0,
      courses: 0,
    },
    courses: [],
    fees: [],
    marks: [],
    studentProfile: null,
  };

  componentDidMount() {
    this.loadOverview();
  }

  loadOverview = async () => {
    this.setState({ loading: true, apiError: '' });

    try {
      if (this.props.session.accessLevel === 'STUDENT') {
        const [studentProfile, courses, fees, marks] = await Promise.all([
          apiRequest('/me/student'),
          apiRequest('/me/courses'),
          apiRequest('/me/fees'),
          apiRequest('/me/marks'),
        ]);

        this.setState({
          counts: {
            students: 1,
            professors: 0,
            courses: Array.isArray(courses) ? courses.length : 0,
          },
          courses: Array.isArray(courses) ? courses : [],
          fees: Array.isArray(fees) ? fees : [],
          marks: Array.isArray(marks) ? marks : [],
          studentProfile,
        });
        return;
      }

      const requests = [
        { key: 'students', path: '/students' },
        { key: 'professors', path: '/professors' },
        { key: 'courses', path: '/courses' },
      ];
      const settled = await Promise.allSettled(
        requests.map((request) => apiRequest(request.path))
      );
      const data = {};
      let hasServerIssue = false;

      settled.forEach((result, index) => {
        const key = requests[index].key;
        if (result.status === 'fulfilled') {
          data[key] = Array.isArray(result.value) ? result.value : [];
          return;
        }

        const message = String(result.reason?.message || '');
        if (!message.includes('401') && !message.includes('403')) {
          hasServerIssue = true;
        }
      });

      if (hasServerIssue) {
        throw new Error('Unable to load overview data');
      }

      this.setState({
        counts: {
          students: (data.students || []).length,
          professors: (data.professors || []).length,
          courses: (data.courses || []).length,
        },
        courses: data.courses || [],
      });
    } catch (error) {
      this.setState({
        apiError: this.getOverviewErrorMessage(error),
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  getOverviewErrorMessage(error) {
    if (error.status === 401) {
      return 'Your session has expired. Please sign in again.';
    }

    if (error.status === 403) {
      return 'This account is signed in, but it is not allowed to load one of the requested dashboard sections.';
    }

    if (error.status === 404) {
      return 'Your account exists, but the matching student profile or dashboard record was not found.';
    }

    if (error.transient) {
      return `The backend is starting or temporarily unavailable at ${getApiBase()}. Please wait a moment and refresh.`;
    }

    return error.message || 'Unable to load overview data. Please refresh and try again.';
  }

  render() {
    const profile = getProfile(this.props.session.accessLevel);
    const { apiError, counts, courses, fees, loading, marks, studentProfile } = this.state;

    if (loading) {
      return <div className="empty-state">Loading campus overview...</div>;
    }

    return (
      <div className="overview-page">
        {apiError && <div className="status-message error">{apiError}</div>}
        <Overview
          counts={counts}
          courses={courses}
          fees={fees}
          marks={marks}
          profile={profile}
          session={this.props.session}
          studentProfile={studentProfile}
        />
      </div>
    );
  }
}

export default OverviewPage;
