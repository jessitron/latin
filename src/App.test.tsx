import React from 'react';
import { render } from '@testing-library/react';
import App, { Suffix } from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('stripping the suffix', () => {
  const s = new Suffix("a");
  expect(s.stripFrom("booga")).toBe("boog");
})
