import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import { canAccessView, getDefaultPath } from '../../config/access';
import './index.css';

class ProtectedRoute extends Component {
  renderRoute = (routeProps) => {
    const {
      component: PageComponent,
      session,
      onSignOut,
      viewId,
      ...rest
    } = this.props;

    if (!session) {
      return <Redirect to="/login" />;
    }

    if (viewId && !canAccessView(session.accessLevel, viewId)) {
      return <Redirect to={getDefaultPath(session.accessLevel)} />;
    }

    return (
      <DashboardLayout
        activeView={viewId}
        onSignOut={onSignOut}
        session={session}
      >
        <PageComponent
          {...routeProps}
          {...rest}
          onSignOut={onSignOut}
          session={session}
          viewId={viewId}
        />
      </DashboardLayout>
    );
  };

  render() {
    const routeProps = { ...this.props };
    delete routeProps.component;
    delete routeProps.session;
    delete routeProps.onSignOut;
    delete routeProps.viewId;

    return <Route {...routeProps} render={this.renderRoute} />;
  }
}

export default ProtectedRoute;
