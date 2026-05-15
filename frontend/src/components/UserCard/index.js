import React, { Component } from 'react';
import { FiLogOut } from 'react-icons/fi';
import './index.css';

class UserCard extends Component {
  render() {
    const { onSignOut, profile, session } = this.props;

    return (
      <div className="user-card">
        <span className="role-badge">{profile.label}</span>
        <strong>{session.fullName}</strong>
        <span>{session.email}</span>
        <button type="button" onClick={onSignOut}>
          <FiLogOut />
          Sign out
        </button>
      </div>
    );
  }
}

export default UserCard;
