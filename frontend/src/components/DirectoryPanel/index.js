import React, { Component } from 'react';
import './index.css';

class DirectoryPanel extends Component {
  render() {
    const { action, children, detail, title } = this.props;

    return (
      <section className="directory-layout">
        <div className="panel data-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Records</p>
              <h2>{title}</h2>
              {detail && <span className="panel-detail">{detail}</span>}
            </div>
          </div>
          {children}
        </div>
        {action && <aside className="panel form-panel">{action}</aside>}
      </section>
    );
  }
}

export default DirectoryPanel;
