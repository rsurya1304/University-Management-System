import React, { Component, createContext } from 'react';
import './index.css';

const THEME_KEY = 'university-theme';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

class ThemeProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: this.getInitialTheme(),
      toggleTheme: this.toggleTheme,
    };
  }

  componentDidMount() {
    this.applyTheme(this.state.theme);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.theme !== this.state.theme) {
      this.applyTheme(this.state.theme);
    }
  }

  getInitialTheme() {
    const storedTheme = localStorage.getItem(THEME_KEY);

    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }

    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  toggleTheme = () => {
    this.setState((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    }));
  };

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeProvider;
