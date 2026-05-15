import React, { Component } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { ThemeContext } from '../ThemeProvider';
import './index.css';

class ThemeToggle extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme, toggleTheme }) => (
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            title={theme === 'light' ? 'Dark theme' : 'Light theme'}
          >
            <span className="theme-toggle__track">
              <span className="theme-toggle__thumb">
                {theme === 'light' ? <FiSun /> : <FiMoon />}
              </span>
            </span>
            <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
          </button>
        )}
      </ThemeContext.Consumer>
    );
  }
}

export default ThemeToggle;
