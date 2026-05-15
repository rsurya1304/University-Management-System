import React, { Component } from 'react';
import './index.css';

class PermissionList extends Component {
  render() {
    return (
      <div className="permission-list">
        {this.props.permissions.map((permission) => (
          <span key={permission}>{permission}</span>
        ))}
      </div>
    );
  }
}

export default PermissionList;
