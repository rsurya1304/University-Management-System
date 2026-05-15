import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './index.css';

class NotFound extends Component {
  render() {
    return (
      <main className="not-found-page">
        <section className="panel not-found-panel">
          <p className="eyebrow">404</p>
          <h1>Page not found</h1>
          <p className="panel-copy">
            This route is not part of the university management console.
          </p>
          <Link className="secondary-action not-found-link" to="/overview">
            <FiArrowLeft />
            <span>Back to dashboard</span>
          </Link>
        </section>
      </main>
    );
  }
}

export default NotFound;
