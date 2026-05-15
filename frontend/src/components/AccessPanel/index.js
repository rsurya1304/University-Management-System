import React, { Component } from 'react';
import { ACCESS_PROFILES } from '../../config/access';
import PermissionList from '../PermissionList';
import './index.css';

class AccessPanel extends Component {
  render() {
    const { profile, session } = this.props;

    return (
      <section className="access-layout">
        <div className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Signed in as</p>
              <h2>{session.fullName}</h2>
            </div>
            <span className="role-badge">{profile.label}</span>
          </div>
          <p className="panel-copy">{profile.summary}</p>
          <PermissionList permissions={profile.permissions} />
        </div>

        <div className="role-grid">
          {Object.entries(ACCESS_PROFILES).map(([level, roleProfile]) => (
            <article
              className={`role-tile ${level === session.accessLevel ? 'current' : ''}`}
              key={level}
            >
              <span>{roleProfile.label}</span>
              <strong>{level}</strong>
              <p>{roleProfile.summary}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }
}

export default AccessPanel;
