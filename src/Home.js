import React from 'react';
import ReactDOM from 'react-dom';

class Home extends React.Component {
  render() {
    return (
      <div>
      <h1>Home Component</h1>
      <Header />
      <Showcase />
      <Footer />
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

class Footer extends React.Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

export default Home;