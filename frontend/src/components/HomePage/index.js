import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiBell,
  FiBookOpen,
  FiCheckCircle,
  FiCreditCard,
  FiLayers,
  FiLogIn,
  FiPieChart,
  FiUserPlus,
} from 'react-icons/fi';
import UniversityLogo from '../../assets/university-logo.svg';
import ThemeToggle from '../ThemeToggle';
import './index.css';

class HomePage extends Component {
  render() {
    return (
      <main className="home-page">
        <header className="home-header">
          <div className="brand-lockup">
            <img className="brand-logo" src={UniversityLogo} alt="University logo" />
            <div>
              <p className="eyebrow">University Management System</p>
              <strong>University Management Portal</strong>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <section className="home-hero">
          <div className="home-copy">
            <p className="eyebrow">Campus ERP</p>
            <h1>Manage university academics, operations, and student services in one portal.</h1>
            <p>
              A focused workspace for administrators, professors, and students to handle
              daily campus work with clean dashboards, secure access, and reliable records.
            </p>
            <div className="home-actions">
              <Link className="primary-action" to="/login">
                <FiLogIn />
                <span>Login</span>
              </Link>
              <Link className="secondary-action" to="/register">
                <FiUserPlus />
                <span>Register</span>
              </Link>
            </div>
          </div>

          <div className="home-feature-panel" aria-label="Portal modules">
            <article>
              <FiBookOpen />
              <strong>Academic Records</strong>
              <span>Maintain students, professors, courses, syllabus, marks, and timetable records.</span>
            </article>
            <article>
              <FiCheckCircle />
              <strong>Course Registration</strong>
              <span>Students can browse available courses and manage their own registrations.</span>
            </article>
            <article>
              <FiBell />
              <strong>Announcements</strong>
              <span>Publish notices for students, professors, and administrators.</span>
            </article>
          </div>
        </section>

        <section className="home-details" aria-label="How the portal works">
          <article>
            <FiLayers />
            <strong>Role-based dashboard</strong>
            <span>Admins manage the whole institution, professors focus on teaching data, and students see their own academic information.</span>
          </article>
          <article>
            <FiCreditCard />
            <strong>Student services</strong>
            <span>Students can view their fees, marks, timetable, registered courses, and campus announcements from one place.</span>
          </article>
          <article>
            <FiPieChart />
            <strong>Operational reports</strong>
            <span>Admin users can review campus totals, course load, fee status, marks, and academic records.</span>
          </article>
          <Link to="/login">
            Open portal
            <FiArrowRight />
          </Link>
        </section>
      </main>
    );
  }
}

export default HomePage;
