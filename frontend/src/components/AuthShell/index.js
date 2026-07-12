import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBookOpen,
  FiHome,
  FiEye,
  FiEyeOff,
  FiKey,
  FiLogIn,
  FiShield,
  FiUserCheck,
  FiUserPlus,
} from 'react-icons/fi';
import { DEMO_ACCOUNTS } from '../../config/access';
import { apiRequest, warmUpApi } from '../../services/api';
import UniversityLogo from '../../assets/university-logo.svg';
import ThemeToggle from '../ThemeToggle';
import './index.css';

const DEMO_ICONS = {
  ADMIN: FiShield,
  PROFESSOR: FiUserCheck,
  STUDENT: FiBookOpen,
};

class AuthShell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: props.initialMode || 'login',
      loading: false,
      notice: '',
      noticeType: 'error',
      serverStatus: 'checking',
      loginForm: {
        email: '',
        password: '',
      },
      registerForm: {
        fullName: '',
        email: '',
        password: '',
        accessLevel: 'STUDENT',
      },
      showLoginPassword: false,
      showRegisterPassword: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialMode !== this.props.initialMode && this.props.initialMode) {
      this.setState({ mode: this.props.initialMode, notice: '' });
    }
  }

  componentDidMount() {
    warmUpApi().then((ready) => {
      this.setState({ serverStatus: ready ? 'ready' : 'waking' });
    });
  }

  setMode = (mode) => {
    this.setState({ mode, notice: '', noticeType: 'error' });
  };

  updateLoginForm = (field, value) => {
    this.setState((state) => ({
      loginForm: {
        ...state.loginForm,
        [field]: value,
      },
    }));
  };

  updateRegisterForm = (field, value) => {
    this.setState((state) => ({
      registerForm: {
        ...state.registerForm,
        [field]: value,
      },
    }));
  };

  selectDemoAccount = (account) => {
    this.setState({
      mode: 'login',
      notice: '',
      loginForm: {
        email: account.email,
        password: account.password,
      },
    });
  };

  submitLogin = async (event) => {
    event.preventDefault();
    const email = this.state.loginForm.email.trim();
    const password = this.state.loginForm.password;

    if (!email || !password) {
      this.setState({
        notice: 'Enter both email and password before logging in.',
        noticeType: 'error',
      });
      return;
    }

    this.setState({ loading: true, notice: '' });

    try {
      const user = await apiRequest('/auth/login', {
        method: 'POST',
        body: {
          email,
          password,
        },
        retries: 1,
        skipAuthRedirect: true,
        friendlyErrorMessage:
          'Login failed. The email or password is incorrect. Use a demo account or check the typed credentials.',
      });
      this.props.onAuthenticated(user);
    } catch (error) {
      this.setState({
        notice: error.message,
        noticeType: 'error',
        serverStatus: error.transient ? 'waking' : 'ready',
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  submitRegister = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, notice: '' });

    try {
      const user = await apiRequest('/auth/register', {
        method: 'POST',
        body: this.state.registerForm,
      });
      this.setState({
        notice: 'Account created successfully. Opening your dashboard...',
        noticeType: 'success',
      });
      this.props.onAuthenticated(user);
    } catch (error) {
      this.setState({ notice: error.message, noticeType: 'error' });
    } finally {
      this.setState({ loading: false });
    }
  };

  renderLoginForm() {
    const { loading, loginForm, showLoginPassword } = this.state;

    return (
      <form className="auth-form" onSubmit={this.submitLogin}>
        <label>
          Email
          <input
            type="email"
            value={loginForm.email}
            onChange={(event) => this.updateLoginForm('email', event.target.value)}
              placeholder="admin@university.com"
            required
          />
        </label>
        <label>
          Password
          <div className="password-input-shell">
            <input
              type={showLoginPassword ? 'text' : 'password'}
              value={loginForm.password}
              onChange={(event) =>
                this.updateLoginForm('password', event.target.value)
              }
              placeholder="Enter password"
              required
            />
            <button
              className="icon-button password-toggle"
              type="button"
              aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
              title={showLoginPassword ? 'Hide password' : 'Show password'}
              onClick={() =>
                this.setState((state) => ({
                  showLoginPassword: !state.showLoginPassword,
                }))
              }
            >
              {showLoginPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </label>
        <button className="primary-action" type="submit" disabled={loading}>
          {loading ? 'Checking access' : 'Login to portal'}
        </button>
      </form>
    );
  }

  renderRegisterForm() {
    const { loading, registerForm, showRegisterPassword } = this.state;

    return (
      <form className="auth-form" onSubmit={this.submitRegister}>
        <label>
          Full name
          <input
            type="text"
            value={registerForm.fullName}
            onChange={(event) =>
              this.updateRegisterForm('fullName', event.target.value)
            }
            placeholder="Aarav Sharma"
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={registerForm.email}
            onChange={(event) =>
              this.updateRegisterForm('email', event.target.value)
            }
            placeholder="name@university.edu"
            required
          />
        </label>
        <label>
          Password
          <div className="password-input-shell">
            <input
              type={showRegisterPassword ? 'text' : 'password'}
              value={registerForm.password}
              onChange={(event) =>
                this.updateRegisterForm('password', event.target.value)
              }
              placeholder="Minimum 8 characters"
              required
            />
            <button
              className="icon-button password-toggle"
              type="button"
              aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
              title={showRegisterPassword ? 'Hide password' : 'Show password'}
              onClick={() =>
                this.setState((state) => ({
                  showRegisterPassword: !state.showRegisterPassword,
                }))
              }
            >
              {showRegisterPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </label>
        <div className="register-category">
          <FiBookOpen aria-hidden="true" />
          <div>
            <span>Account category</span>
            <strong>Student</strong>
            <em>Public registration creates a student login. Admins create professor and admin accounts from inside the portal.</em>
          </div>
        </div>
        <button className="primary-action" type="submit" disabled={loading}>
          {loading ? 'Creating access' : 'Create account'}
        </button>
      </form>
    );
  }

  render() {
    const { mode, notice, noticeType, serverStatus } = this.state;

    return (
      <main className="auth-page">
        <section className="auth-panel" aria-labelledby="auth-title">
          <div className="auth-header">
            <div className="brand-lockup">
              <img className="brand-logo" src={UniversityLogo} alt="University logo" />
              <div>
                <p className="eyebrow">University Management System</p>
                <h1 id="auth-title">University Management Portal</h1>
              </div>
            </div>
            <div className="auth-header-actions">
              <Link className="secondary-action auth-home-link" to="/">
                <FiHome />
                <span>Home</span>
              </Link>
              <ThemeToggle />
            </div>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button
              className={mode === 'login' ? 'active' : ''}
              type="button"
              onClick={() => this.setMode('login')}
            >
              <FiLogIn />
              Login
            </button>
            <button
              className={mode === 'register' ? 'active' : ''}
              type="button"
              onClick={() => this.setMode('register')}
            >
              <FiUserPlus />
              Register
            </button>
          </div>

          {notice && <div className={`status-message ${noticeType}`}>{notice}</div>}
          {serverStatus === 'waking' && !notice && (
            <div className="status-message">
              Backend may be waking up. First login can take a few seconds on free hosting.
            </div>
          )}

          {mode === 'login' ? this.renderLoginForm() : this.renderRegisterForm()}

          <div className="demo-strip" aria-label="Role-based demo credentials">
            <div className="demo-heading">
              <FiKey aria-hidden="true" />
              <span>Role-based demo credentials</span>
            </div>
            <div className="demo-account-grid">
              {DEMO_ACCOUNTS.map((account) => {
                const Icon = DEMO_ICONS[account.accessLevel] || FiKey;
                return (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => this.selectDemoAccount(account)}
                  >
                    <Icon aria-hidden="true" />
                    <strong>{account.label}</strong>
                    <span>Email: {account.email}</span>
                    <em>Password: {account.password}</em>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default AuthShell;
