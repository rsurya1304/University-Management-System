import React, { Component } from 'react';
import './index.css';

class MetricCard extends Component {
  render() {
    const { detail, label, value } = this.props;

    return (
      <article className="metric-card">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </article>
    );
  }
}

export default MetricCard;
