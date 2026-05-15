import React, { Component } from 'react';
import { ACCESS_PROFILES } from '../../config/access';
import './index.css';

class AccessPreview extends Component {
  render() {
    return (
      <aside className="access-preview" aria-label="Access level preview">
        <p className="eyebrow">Role-aware workspace</p>
        <h2>Every user lands in the tools they are allowed to use.</h2>
        <div className="preview-grid">
          {Object.entries(ACCESS_PROFILES).map(([level, profile]) => (
            <article key={level} className="preview-item">
              <strong>{profile.label}</strong>
              <span>{profile.summary}</span>
            </article>
          ))}
        </div>
      </aside>
    );
  }
}

export default AccessPreview;
