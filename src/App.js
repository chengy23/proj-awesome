import React, { Component } from 'react';
import { Footer } from './Home.js';
import { hashHistory, Link } from 'react-router';
import firebase from 'firebase';
import './css/home.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    /* Add a listener and callback for authentication events */
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ userId: user.uid });
      }
      else {
        this.setState({ userId: null }); //null out the saved state
      }
    })
  }
  signOut() {
    /* Sign out the user, and update the state */
    firebase.auth().signOut();
  }

  render() {
    return (
      <div className="App">
        <Search />
        <main>
          {this.props.children}
        </main>
        <Footer />
      </div>
    );
  }
}


// the overall header with a search box
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { searchValue: '' };
    this.handleClickSearch = this.handleClickSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    //hook up with the current auth status of firebase
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        this.setState({ userId: firebaseUser.uid });
      } else {
        this.setState({ userId: null });
      }
    });
  }
  handleChange(event) {
    event.preventDefault();
    // enable fuzzy search and format the displayed course name
    var searchValue = event.target.value.replace(/\s/g, '').toLowerCase();
    if (searchValue.match(/\d/g)) {
      searchValue = searchValue.replace(/\d/g, '') + "-" + searchValue.match(/\d/g).join("");
      this.setState({ searchValue: searchValue });
    }
  }

  signOut() {
    /* Sign out the user, and update the state */
    firebase.auth().signOut();
  }

  // route to a paticular course page
  handleClickSearch(event) {
    event.preventDefault();
    return hashHistory.push('class/' + this.state.searchValue);
  }

  render() {
    return (
      <div className="">
        <nav role="navigation" className="navbar navbar-inverse" id="navbar">
          <div className="navbar-header">
            <button aria-label="for mobile use" type="button" data-target="#navbarCollapse" data-toggle="collapse" className="navbar-toggle">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a role="button" href="#" className="navbar-brand">iVal</a>
          </div>
          <div id="navbarCollapse" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li><Link to="/insertClass" >Add a Class</Link></li>
              <li><Link to="/insertProfessor" >Add a Professor</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><a href="https://ischool.uw.edu/">UW iSchool</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              {!this.state.userId && <li><Link to="/login" aria-label="login">Login</Link></li>}
              {this.state.userId &&  /*inline conditional rendering*/
                <li>
                  <Link aria-label="logout" onClick={() => this.signOut()}>
                    {/* Show user name on sign out button */}
                    Sign out {firebase.auth().currentUser.displayName}
                  </Link>
                </li>
              }
            </ul>
          </div>
          <div className="">
          </div>
          <div className="">
            <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 searchBar">
              <form className="input-group searchInput" >
                <input aria-label="search for class" type="text" className="form-control searchInput" placeholder="Search for a class (e.g. Info 343)" onChange={this.handleChange} />
                <span className="input-group-btn">
                  <button aria-label="submit button" className="btn btn-default searchInput" type="submit" onClick={this.handleClickSearch} ><span className="glyphicon glyphicon-search"></span></button>
                </span>
              </form>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}
export default App;