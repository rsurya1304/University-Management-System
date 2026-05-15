import React, { Component } from 'react';
import { FiEye, FiEyeOff, FiKey, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { ACCESS_PROFILES, DEMO_ACCOUNTS } from '../../config/access';
import { apiRequest } from '../../services/api';
import UniversityLogo from '../../assets/university-logo.svg';
import AccessPreview from '../AccessPreview';
import ThemeToggle from '../ThemeToggle';
import './index.css';

class AuthShell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: props.initialMode || 'login',
      loading: false,
      notice: '',
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

  setMode = (mode) => {
    this.setState({ mode, notice: '' });
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
    this.setState({ loading: true, notice: '' });

    try {
      const user = await apiRequest('/auth/login', {
        method: 'POST',
        body: this.state.loginForm,
      });
      this.props.onAuthenticated(user);
    } catch (error) {
      this.setState({ notice: error.message });
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
      this.props.onAuthenticated(user);
    } catch (error) {
      this.setState({ notice: error.message });
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
            placeholder="admin@university.edu"
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
          {loading ? 'Checking access' : 'Login to console'}
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
              placeholder="Minimum 6 characters"
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
        <div className="field-group">
          <span>Access level</span>
          <div className="segmented-control">
            {Object.keys(ACCESS_PROFILES)
              .filter((level) => level === 'STUDENT')
              .map((level) => (
              <button
                className={registerForm.accessLevel === level ? 'active' : ''}
                key={level}
                type="button"
                onClick={() => this.updateRegisterForm('accessLevel', level)}
              >
                {ACCESS_PROFILES[level].label}
              </button>
              ))}
          </div>
        </div>
        <button className="primary-action" type="submit" disabled={loading}>
          {loading ? 'Creating access' : 'Create account'}
        </button>
      </form>
    );
  }

  render() {
    const { mode, notice } = this.state;
    const showDemoAccounts = process.env.REACT_APP_SHOW_DEMO_ACCOUNTS === 'true';

    return (
      <main className="auth-page">
        <section className="auth-panel" aria-labelledby="auth-title">
          <div className="auth-header">
            <div className="brand-lockup">
              <img className="brand-logo" src={UniversityLogo} alt="University logo" />
              <div>
                <p className="eyebrow">University Management System</p>
                <h1 id="auth-title">Campus operations console</h1>
              </div>
            </div>
            <ThemeToggle />
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

          {notice && <div className="status-message error">{notice}</div>}

          {mode === 'login' ? this.renderLoginForm() : this.renderRegisterForm()}

          {showDemoAccounts && (
            <div className="demo-strip" aria-label="Demo access levels">
              <div className="demo-heading">
                <FiKey aria-hidden="true" />
                <span>Demo access levels</span>
              </div>
              <div className="demo-account-grid">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => this.selectDemoAccount(account)}
                  >
                    <strong>{account.label}</strong>
                    <span>{account.email}</span>
                    <em>{account.password}</em>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <AccessPreview />
      </main>
    );
  }
}

export default AuthShell;
