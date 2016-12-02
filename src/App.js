import React, { Component } from 'react';
import './App.css';
import Home from './Home.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to iVal</h2>
        </div>
        <Home />
      </div>
    );
  }
}

export default App;
