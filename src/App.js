import React, { Component } from 'react';
import './App.css';
import Home, { Footer } from './Home.js';
import { hashHistory, Link } from 'react-router';
import firebase from 'firebase';
import './css/home.css';
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
        <main>
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
      <div className="">
        <nav role="navigation" className="navbar navbar-inverse" id="navbar">
          <div className="navbar-header">
            <button type="button" data-target="#navbarCollapse" data-toggle="collapse" className="navbar-toggle">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a href="#" className="navbar-brand">iVal</a>
          </div>
          <div id="navbarCollapse" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li className="" ><a href="https://ischool.uw.edu/">The iSchool</a></li>
              <li className="" ><Link to="insertClass" >Didn't Find a Class?</Link></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              {!this.state.userId && <li><Link to="/login">Login</Link></li>}
              {this.state.userId &&  /*inline conditional rendering*/
                <li>
                  <button className="btn btn-default logout" onClick={()=>this.signOut()}>
                    {/* Show user name on sign out button */}
                    Sign out { firebase.auth().currentUser.displayName }
                  </button>
                </li>
              }
            </ul>
          </div>
          <div className="container">
          </div>
          <div className="row searchBar">
            <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3">
              <form className="input-group">
                <input type="text" className="form-control" placeholder="Search for a class (e.g. Info 343)" onChange={this.handleChange} />
                <span className="input-group-btn">
                  <button className="btn btn-default" type="submit" onClick={this.handleClickSearch} ><span className="glyphicon glyphicon-search"></span></button>
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
