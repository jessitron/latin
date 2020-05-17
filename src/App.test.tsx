import React from 'react';
import { render } from '@testing-library/react';
import App, { Suffix, verbs } from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('stripping the suffix', () => {
  const s = new Suffix("a");
  expect(s.stripFrom("booga")).toBe("boog");
})

test("suffixes aren't case sensitive", () => {
  const s = new Suffix("a");
  expect(s.appearsIn("BOOGA")).toBeTruthy();
})

test("verb conjugation recognition", () => {
  const firstConjugation = verbs.conjugations[0].tenses[0];
  expect(firstConjugation.recognizeSuffixes("porto").find(t => t.name === "first person singular")).toBeTruthy()
  expect(firstConjugation.recognizeSuffixes("portas").find(t => t.name === "second person singular")).toBeTruthy()
  expect(firstConjugation.recognizeSuffixes("amat").find(t => t.name === "third person singular")).toBeTruthy()
  expect(firstConjugation.recognizeSuffixes("amamus").find(t => t.name === "first person plural")).toBeTruthy()
})

test("verb conjugation recognition is not excessive", () => {
  const firstConjugation = verbs.conjugations[0].tenses[0];
  expect(firstConjugation.recognizeSuffixes("porto").length).toBe(1);
})
