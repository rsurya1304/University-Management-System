import React, { Component } from 'react';
import { getProfile } from '../../config/access';
import AccessPanel from '../AccessPanel';
import './index.css';

class AccessPage extends Component {
  render() {
    const profile = getProfile(this.props.session.accessLevel);

    return (
      <section className="access-page">
        <AccessPanel profile={profile} session={this.props.session} />
      </section>
    );
  }
}

export default AccessPage;
