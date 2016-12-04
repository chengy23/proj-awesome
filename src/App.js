import React, { Component } from 'react';
import './App.css';
import { hashHistory } from 'react-router';
import firebase from 'firebase';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  componentDidMount(){
    //hook up with the current auth status of firebase
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if(firebaseUser){
        this.setState({userId: firebaseUser.uid});
        //hashHistory.push('/home');
      }else{
        this.setState({userId: null});
        //hashHistory.push('/login');
      }
    });
  }

  signOut(){
    /* Sign out the user, and update the state */
    firebase.auth().signOut();
  }
  
  render() {
    return (
      <div className="App">
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">Brand</a>
            </div>

            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li><a href="#/login">Login</a></li>
                <li><a href="#/register">Register</a></li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                {this.state.userId &&  /*inline conditional rendering*/
                  <div className="logout">
                    <button className="btn btn-warning" onClick={()=>this.signOut()}>
                      {/* Show user name on sign out button */}
                      Sign out { firebase.auth().currentUser.displayName }
                    </button>
                  </div>
                }
              </ul>
            </div>
          </div>
        </nav>
        <main className="container">
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default App;
