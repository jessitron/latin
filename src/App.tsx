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
    return word.toLowerCase().endsWith(this.canonical) ||
      (this.closeEnough.find(sfx => word.toLowerCase().endsWith(sfx)) !== undefined);
  }

  public stripFrom(word: string): string {
    return word.substring(0, word.length - this.canonical.length);
  }

  public toString() {
    return this.canonical;
  }
}

interface Tense {
  name: string;
  description?: string;
  suffix: Suffix;
}

type Declension = {
  name: string;
  description: string;
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
    description: "most are feminine; all end in -a in the nominative singular",
    tenses: [{
      name: "nominative singular",
      description: "like, subject of a sentence",
      suffix: new Suffix("a")
    },
    {
      name: "nominative plural",
      description: "like, subject of a sentence",
      suffix: new Suffix("ae"),
    },
    {
      name: "genitive singular", suffix: new Suffix("ae"),
      description: "possessive or 'of ...'"
    },
    {
      name: "genitive plural", suffix: new Suffix("ārum", "arum"),
      description: "possessive or 'of ...'"
    },
    { name: "dative singular", suffix: new Suffix("ae") },
    { name: "dative plural", suffix: new Suffix("īs", "is") },
    { name: "accusative singular", suffix: new Suffix("am"), description: "direct object" },
    { name: "accusative plural", suffix: new Suffix("ās", "as"), description: "direct object" },
    { name: "ablative singular", suffix: new Suffix("ā") },
    { name: "ablative plural", suffix: new Suffix("īs") }
    ],
  }]
}

class VerbTensePerson implements Tense {
  constructor(public name: string,
    public suffix: Suffix,
    public description: string) { }
}

type Conjugation = {
  name: string,
  description: string,
  tenses: VerbTense[],
}

type Verb = {
  partOfSpeech: "verb",
  presentInfinitive: Tense,
  conjugations: Conjugation[],
}

interface VerbTense {
  persons: VerbTensePerson[];
  name: string;
  description: string;
}

class PresentTense implements VerbTense {
  public persons: VerbTensePerson[]
  constructor(public name: string, public description: string,
    firstPersonSingular: Suffix, firstPersonPlural: Suffix,
    secondPersonSingular: Suffix, secondPersonPlural: Suffix,
    thirdPersonSingular: Suffix, thirdPersonPlural: Suffix) {
    this.persons = [
      { name: "first person singular", description: "I ..., I am...", suffix: firstPersonSingular },
      { name: "first person plural", description: "We ..., we are...", suffix: firstPersonPlural },
      { name: "second person singular", description: "You ..., you are...", suffix: secondPersonSingular },
      { name: "second person plural", description: "Y'all ..., y'all are...", suffix: secondPersonPlural },
      { name: "third person singular", description: "He/she/it ..., it is...", suffix: thirdPersonSingular },
      { name: "third person plural", description: "They ..., they are...", suffix: thirdPersonPlural },
    ]
  }

  public recognizeSuffixes(word: string): Tense[] {
    return this.persons.filter(t => t.suffix.appearsIn(word))
  }
}

export const verbs: Verb = {
  partOfSpeech: "verb",
  presentInfinitive: new VerbTensePerson("present infinitive", new Suffix("re"), "to ..."),
  conjugations: [{
    name: "first conjugation",
    description: "these verbs have a present stem ending in -ā",
    tenses: [
      new PresentTense("present tense", "current or ongoing",
        new Suffix("ō", "o"), new Suffix("āmus", "amus"),
        new Suffix("ās", "as"), new Suffix("ātis", "atis"),
        new Suffix("at"), new Suffix("ant"))
    ]
  }]
}

class InfoAboutWord extends React.Component<{ word: string }> {

  public printTerm(term: { name: string, description?: string }) {
    return <span title={term.description || "I don't know either"} className="term">{term.name}</span>;
  }

  public whatchathink(word: string) {
    let thoughts = [];
    // noun?
    for (const d of nouns.declensions) {
      for (const tense of d.tenses) {
        if (tense.suffix.appearsIn(word)) {
          thoughts.push(<li key="">It might be a {" "}
            {this.printTerm(d)} {" "}
            {nouns.partOfSpeech} (or adjective) in the {" "}
            {this.printTerm(tense)}: {highlightSuffix(word, tense.suffix)}
          </li>);
        }
      }
    }
    // verb?
    for (const conj of verbs.conjugations) {
      for (const tense of conj.tenses) {
        for (const person of tense.persons) {
          if (person.suffix.appearsIn(word)) {
            thoughts.push(<li>
              It might be a {this.printTerm(person)} {this.printTerm(tense)} {verbs.partOfSpeech} {" "}
              in the {this.printTerm(conj)}: {highlightSuffix(word, person.suffix)}
            </li>)
          }
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
        <h1>Latin Ending Looker-For</h1>
      </header>
      <Word></Word>
    </div >
  );
}

export default App;
