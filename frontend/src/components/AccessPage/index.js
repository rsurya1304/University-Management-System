import React, { Component } from 'react';
import { FiShield, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import { ACCESS_PROFILES, getProfile } from '../../config/access';
import { apiRequest } from '../../services/api';
import AccessPanel from '../AccessPanel';
import './index.css';

const STAFF_ROLES = ['PROFESSOR', 'ADMIN'];
const STAFF_ICONS = {
  PROFESSOR: FiUserCheck,
  ADMIN: FiShield,
};

class AccessPage extends Component {
  state = {
    staffForm: {
      fullName: '',
      email: '',
      password: '',
      accessLevel: 'PROFESSOR',
    },
    loading: false,
    notice: '',
    noticeType: 'success',
  };

  updateStaffForm = (field, value) => {
    this.setState((state) => ({
      staffForm: {
        ...state.staffForm,
        [field]: value,
      },
    }));
  };

  submitStaffAccount = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, notice: '' });

    try {
      await apiRequest('/auth/staff', {
        method: 'POST',
        body: this.state.staffForm,
      });
      this.setState({
        staffForm: {
          fullName: '',
          email: '',
          password: '',
          accessLevel: 'PROFESSOR',
        },
        notice: 'Staff account created successfully.',
        noticeType: 'success',
      });
    } catch (error) {
      this.setState({ notice: error.message, noticeType: 'error' });
    } finally {
      this.setState({ loading: false });
    }
  };

  renderStaffRegistration() {
    if (this.props.session.accessLevel !== 'ADMIN') {
      return null;
    }

    const { loading, notice, noticeType, staffForm } = this.state;

    return (
      <section className="staff-registration" aria-labelledby="staff-registration-title">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Registration</p>
            <h2 id="staff-registration-title">Create staff access</h2>
          </div>
          <FiUserPlus aria-hidden="true" />
        </div>

        {notice && <div className={`status-message ${noticeType}`}>{notice}</div>}

        <form className="staff-registration-form" onSubmit={this.submitStaffAccount}>
          <label>
            Full name
            <input
              type="text"
              value={staffForm.fullName}
              onChange={(event) => this.updateStaffForm('fullName', event.target.value)}
              placeholder="Professor or admin name"
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={staffForm.email}
              onChange={(event) => this.updateStaffForm('email', event.target.value)}
              placeholder="name@university.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={staffForm.password}
              onChange={(event) => this.updateStaffForm('password', event.target.value)}
              placeholder="Minimum 8 characters"
              required
            />
          </label>
          <div className="field-group">
            <span>Role</span>
            <div className="staff-role-grid">
              {STAFF_ROLES.map((role) => {
                const Icon = STAFF_ICONS[role] || FiShield;
                return (
                  <button
                    className={staffForm.accessLevel === role ? 'active' : ''}
                    key={role}
                    type="button"
                    onClick={() => this.updateStaffForm('accessLevel', role)}
                  >
                    <Icon aria-hidden="true" />
                    {ACCESS_PROFILES[role].label}
                  </button>
                );
              })}
            </div>
          </div>
          <button className="primary-action" type="submit" disabled={loading}>
            {loading ? 'Creating account' : 'Create staff account'}
          </button>
        </form>
      </section>
    );
  }

  render() {
    const profile = getProfile(this.props.session.accessLevel);

    return (
      <section className="access-page">
        <AccessPanel profile={profile} session={this.props.session} />
        {this.renderStaffRegistration()}
      </section>
    );
  }
}

export default AccessPage;
