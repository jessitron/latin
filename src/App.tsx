import React, { InputHTMLAttributes } from 'react';
import './App.css';

function highlightSuffix(word: string, suffix: string) {
  const before = word.substring(-1 * suffix.length);
  return <span className="stem">{before}<span className="suffix">{suffix}</span></span>
}

type Tense = {
  description: string;
  suffix: string;
}

type Declension = {
  name: string;
  tenses: Tense[];
}

type Nouns = {
  partOfSpeech: "noun";
  declensions: Declension[];
}

const nouns = {
  partOfSpeech: "noun",
  declensions: [{
    name: "first declension",
    tenses: [{
      name: "nominative singular",
      suffix: "a"
    }],
  }]
}

class InfoAboutWord extends React.Component<{ word: string }> {

  public whatchathink(word: string) {
    let thoughts = [];
    // noun?
    for (const d of nouns.declensions) {
      for (const tense of d.tenses) {
        if (word.endsWith(tense.suffix)) {
          thoughts.push(<div>It might be a {d.name} {nouns.partOfSpeech} in the {tense.name}: {highlightSuffix(word, tense.suffix)}</div>);
        }
      }
    }
    return thoughts;
  }

  public render() {
    const word = this.props.word;
    if (!word) {
      return <p>Enter a word.</p>
    }
    return <div>
      <p>You entered: {word} </p>
      {this.whatchathink(word)}
    </div>
  }
}

class Word extends React.Component<{}, { word: string }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      word: "",
    };
  }

  public setWord(e: React.FormEvent) {
    this.setState({ word: (e.target as any).value });
  }

  public render() {
    return <div>
      <input onInput={(e) => this.setWord(e)} value={this.state.word}></input>
      <InfoAboutWord word={this.state.word}></InfoAboutWord>
    </div>
  }
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Word></Word>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
