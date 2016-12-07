import React, { Component } from 'react';
import './App.css';
import Home, { Footer } from './Home.js';
import { hashHistory, Link } from 'react-router';
import firebase from 'firebase';
import {FormControl, FormGroup, Button} from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    /* Add a listener and callback for authentication events */
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        console.log('Auth state changed: logged in as', user.email);
        this.setState({userId:user.uid});
        hashHistory.push('/home');
      }
      else{
        console.log('Auth state changed: logged out');
        this.setState({userId: null}); //null out the saved state
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
        <main className="">
          <div id="space">
          </div>
          {this.props.children}
        </main>
        <Footer />
      </div>
    );
  }
}


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { searchValue: '', searchBy: '' };
    this.handleClickSearch = this.handleClickSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount(){
    //hook up with the current auth status of firebase
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if(firebaseUser){
        this.setState({userId: firebaseUser.uid});
      }else{
        this.setState({userId: null});
      }
    });
  }
  handleChange(event) {
    event.preventDefault();
    // format the display class name
    var searchValue = event.target.value.replace(/\s/g,'').toLowerCase();
    if (searchValue.match(/\d/g)) {
      searchValue = searchValue.replace(/\d/g,'') + "-" + searchValue.match(/\d/g).join("");
      this.setState({ searchValue: searchValue });
    }
  }

  signOut(){
    /* Sign out the user, and update the state */
    firebase.auth().signOut();
  }

  handleClickSearch(event) {
    event.preventDefault();
    console.log("Route to: " + 'class/' + this.state.searchValue);
    return hashHistory.push('class/' + this.state.searchValue);
  }

  render() {
    return (
      <div>
      <nav className="navbar navbar-default navbar-fixed-top topnav" role="navigation">
          <div className="container topnav">
              <div className="navbar-header">
                  <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                      <span className="sr-only">Toggle navigation</span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand topnav" href="#">iVal</a>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav">
                    <li><a href="#">Home</a></li>
                    <li><Link to="insertClass" >Didn't Find a Class?</Link></li>
                    <li id="formSearch"><form className="form-inline float-xs-right">
                          <input className="form-control" type="text" placeholder="Search for a class" onChange={this.handleChange}/>{' '}
                          <button className="btn btn-outline-success" type="submit" onClick={this.handleClickSearch}>Search</button>
                        </form></li>
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                      {!this.state.userId && <li><Link to="/login">Login</Link></li>}
                      {this.state.userId &&  /*inline conditional rendering*/
                        <li className="logout">
                          <button className="btn btn-warning" onClick={()=>this.signOut()}>
                            {/* Show user name on sign out button */}
                            Sign out { firebase.auth().currentUser.displayName }
                          </button>
                        </li>
                      }
                  </ul>
              </div>
          </div>
      </nav>
    </div>
    )
  }

}

export default App;
