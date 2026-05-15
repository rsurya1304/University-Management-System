import { render, screen } from '@testing-library/react';
import App from './App';

test('renders university auth screen', () => {
  render(<App />);
  expect(screen.getByText(/campus operations console/i)).toBeInTheDocument();
});
