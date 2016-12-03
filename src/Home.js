import React from 'react';
import ReactDOM from 'react-dom';

class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Home Component</h1>
        <Header />
        <Showcase />
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <div>
        <Search />
      </div>
    );
  }
}

class Search extends React.Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

class Showcase extends React.Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

export class Footer extends React.Component {
  render() {
    return (
      <footer className="">
      </footer>
    );
  }
}


export default Home;

