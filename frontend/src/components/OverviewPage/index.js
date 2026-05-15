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
  };

  componentDidMount() {
    this.loadOverview();
  }

  loadOverview = async () => {
    this.setState({ loading: true, apiError: '' });

    try {
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
        apiError: `${error.message}. Start the Spring server on ${getApiBase()} and refresh.`,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const profile = getProfile(this.props.session.accessLevel);
    const { apiError, counts, courses, loading } = this.state;

    if (loading) {
      return <div className="empty-state">Loading campus overview...</div>;
    }

    return (
      <div className="overview-page">
        {apiError && <div className="status-message error">{apiError}</div>}
        <Overview
          counts={counts}
          courses={courses}
          profile={profile}
          session={this.props.session}
        />
      </div>
    );
  }
}

export default OverviewPage;
