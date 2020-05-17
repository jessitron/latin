import React from 'react';
import './App.css';

export function highlightSuffix(word: string, suffix: Suffix) {
  return <span className="stem">{suffix.stripFrom(word)}<span className="suffix">{suffix.canonical}</span></span>
}

export class Suffix {

  public readonly closeEnough: string[];

  constructor(public canonical: string, ...closeEnough: string[]) {
    this.closeEnough = closeEnough;
  }
  public appearsIn(word: string): boolean {
    return word.endsWith(this.canonical) || (this.closeEnough.find(sfx => word.endsWith(sfx)) !== undefined);
  }

  public stripFrom(word: string): string {
    return word.substring(0, word.length - this.canonical.length);
  }

  public toString() {
    return this.canonical;
  }
}

type Tense = {
  name: string;
  suffix: Suffix;
}

type Declension = {
  name: string;
  tenses: Tense[];
}

type Nouns = {
  partOfSpeech: "noun";
  declensions: Declension[];
}

const nouns: Nouns = {
  partOfSpeech: "noun",
  declensions: [{
    name: "first declension",
    tenses: [{
      name: "nominative singular",
      suffix: new Suffix("a")
    },
    {
      name: "nominative plural",
      suffix: new Suffix("ae"),
    },
    {
      name: "genitive singular", suffix: new Suffix("ae"),
    },
    {
      name: "genitive plural", suffix: new Suffix("ārum", "arum")
    },
    { name: "dative singular", suffix: new Suffix("ae") },
    { name: "dative plural", suffix: new Suffix("īs", "is") },
    { name: "accusative singular", suffix: new Suffix("am") },
    { name: "accusative plural", suffix: new Suffix("ās", "as") },
    { name: "ablative singular", suffix: new Suffix("ā") },
    { name: "ablative plural", suffix: new Suffix("īs") }
    ],
  }]
}

class InfoAboutWord extends React.Component<{ word: string }> {

  public whatchathink(word: string) {
    let thoughts = [];
    // noun?
    for (const d of nouns.declensions) {
      for (const tense of d.tenses) {
        if (tense.suffix.appearsIn(word)) {
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
      <input onChange={(e) => this.setWord(e)} value={this.state.word}></input>
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
