import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import AcademicPage from '../AcademicPage';
import AccessPage from '../AccessPage';
import AuthShell from '../AuthShell';
import CoursesPage from '../CoursesPage';
import FeesPage from '../FeesPage';
import MarksPage from '../MarksPage';
import NotFound from '../NotFound';
import OverviewPage from '../OverviewPage';
import ProfessorsPage from '../ProfessorsPage';
import ProtectedRoute from '../ProtectedRoute';
import ReportsPage from '../ReportsPage';
import StudentsPage from '../StudentsPage';
import ThemeProvider from '../ThemeProvider';
import TimetablePage from '../TimetablePage';
import { getDefaultPath } from '../../config/access';
import './index.css';

const SESSION_KEY = 'university-session';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: this.getStoredSession(),
    };
  }

  getStoredSession() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (!session?.token || !session?.accessLevel || !session?.email) {
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  handleSession = (user) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    this.setState({ session: user });
  };

  handleSignOut = () => {
    localStorage.removeItem(SESSION_KEY);
    this.setState({ session: null });
  };

  renderAuthRoute(mode) {
    const { session } = this.state;

    if (session) {
      return <Redirect to={getDefaultPath(session.accessLevel)} />;
    }

    return <AuthShell initialMode={mode} onAuthenticated={this.handleSession} />;
  }

  renderRootRoute() {
    const { session } = this.state;
    return <Redirect to={session ? getDefaultPath(session.accessLevel) : '/login'} />;
  }

  renderProtectedRoute(path, viewId, PageComponent) {
    return (
      <ProtectedRoute
        exact
        path={path}
        viewId={viewId}
        component={PageComponent}
        session={this.state.session}
        onSignOut={this.handleSignOut}
      />
    );
  }

  render() {
    return (
      <ThemeProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" render={() => this.renderRootRoute()} />
            <Route exact path="/login" render={() => this.renderAuthRoute('login')} />
            <Route exact path="/register" render={() => this.renderAuthRoute('register')} />
            {this.renderProtectedRoute('/overview', 'overview', OverviewPage)}
            {this.renderProtectedRoute('/students', 'students', StudentsPage)}
            {this.renderProtectedRoute('/professors', 'professors', ProfessorsPage)}
            {this.renderProtectedRoute('/courses', 'courses', CoursesPage)}
            {this.renderProtectedRoute('/academic', 'academic', AcademicPage)}
            {this.renderProtectedRoute('/fees', 'fees', FeesPage)}
            {this.renderProtectedRoute('/marks', 'marks', MarksPage)}
            {this.renderProtectedRoute('/timetable', 'timetable', TimetablePage)}
            {this.renderProtectedRoute('/reports', 'reports', ReportsPage)}
            {this.renderProtectedRoute('/access', 'access', AccessPage)}
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
