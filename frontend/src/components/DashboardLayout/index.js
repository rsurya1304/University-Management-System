import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiBookOpen,
  FiCalendar,
  FiClipboard,
  FiDollarSign,
  FiGrid,
  FiMenu,
  FiPieChart,
  FiShield,
  FiUserCheck,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { getProfile, NAV_ITEMS } from '../../config/access';
import UniversityLogo from '../../assets/university-logo.svg';
import ThemeToggle from '../ThemeToggle';
import UserCard from '../UserCard';
import './index.css';

const NAV_ICONS = {
  overview: FiGrid,
  students: FiUsers,
  professors: FiUserCheck,
  courses: FiBookOpen,
  academic: FiClipboard,
  fees: FiDollarSign,
  marks: FiPieChart,
  timetable: FiCalendar,
  reports: FiPieChart,
  access: FiShield,
};

class DashboardLayout extends Component {
  state = {
    navOpen: false,
  };

  getProfile() {
    return getProfile(this.props.session.accessLevel);
  }

  getActiveItem() {
    return NAV_ITEMS.find((item) => item.id === this.props.activeView) || NAV_ITEMS[0];
  }

  toggleNav = () => {
    this.setState((state) => ({ navOpen: !state.navOpen }));
  };

  closeNav = () => {
    this.setState({ navOpen: false });
  };

  renderNavIcon(itemId) {
    const Icon = NAV_ICONS[itemId] || FiGrid;
    return <Icon aria-hidden="true" />;
  }

  renderNavItems(className) {
    const profile = this.getProfile();
    const allowedNavItems = NAV_ITEMS.filter((item) => profile.views.includes(item.id));

    return (
      <nav className={className} aria-label="Main navigation">
        {allowedNavItems.map((item) => (
          <NavLink
            activeClassName="active"
            exact
            key={item.id}
            to={item.path}
            onClick={this.closeNav}
          >
            {this.renderNavIcon(item.id)}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    );
  }

  render() {
    const profile = this.getProfile();
    const activeItem = this.getActiveItem();
    const { navOpen } = this.state;

    return (
      <div className={`app-shell ${navOpen ? 'nav-open' : ''}`}>
        <button
          className="sidebar-scrim"
          type="button"
          aria-label="Close navigation"
          onClick={this.closeNav}
        />

        <aside className="sidebar" aria-label="Sidebar navigation">
          <div className="brand-lockup compact sidebar-brand">
            <img className="brand-logo" src={UniversityLogo} alt="University logo" />
            <div>
              <strong>University</strong>
              <span>Management System</span>
            </div>
            <button
              className="icon-button sidebar-close"
              type="button"
              aria-label="Close navigation"
              onClick={this.closeNav}
            >
              <FiX />
            </button>
          </div>

          {this.renderNavItems('main-nav')}

          <UserCard
            profile={profile}
            session={this.props.session}
            onSignOut={this.props.onSignOut}
          />
        </aside>

        <main className="workspace">
          <header className="topbar">
            <div className="topbar-title">
              <button
                className="icon-button mobile-menu-button"
                type="button"
                aria-label="Open navigation"
                onClick={this.toggleNav}
              >
                <FiMenu />
              </button>
              <div>
                <p className="eyebrow">{activeItem.label}</p>
                <h1>{profile.label} workspace</h1>
                <span>{profile.summary}</span>
              </div>
            </div>
            <div className="topbar-actions">
              <ThemeToggle />
            </div>
          </header>

          {this.renderNavItems('top-nav-strip')}

          <section className="workspace-scroll">
            {this.props.children}
          </section>
        </main>
      </div>
    );
  }
}

export default DashboardLayout;
