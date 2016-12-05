import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './css/index.css';
import firebase from 'firebase';
import {IndexRoute, Router, Route, hashHistory} from 'react-router';
import SignUpForm, {SignInForm} from './SignUp';
import Home from './Home';
import Class from './Class';
import 'bootstrap/dist/css/bootstrap.css';

var config = {
  apiKey: "AIzaSyCmpNNVowzW0F58cvtf7liSOyieFUjPEpE",
  authDomain: "ival-281f0.firebaseapp.com",
  databaseURL: "https://ival-281f0.firebaseio.com",
  storageBucket: "ival-281f0.appspot.com",
  messagingSenderId: "582622995561"
};
firebase.initializeApp(config);

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={App} />
      <Route path="register" component={SignUpForm} />
      <Route path="login" component={SignInForm} />
      <Route path="home" component={Home} />
      <Route path="class" component={Class} />
    </Route>
  </Router>,
  document.getElementById('root')
);

//extraneous method call to produce error for non-configured app
firebase.auth(); 