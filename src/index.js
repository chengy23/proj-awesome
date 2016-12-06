import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import firebase from 'firebase';
import {IndexRoute, Router, Route, hashHistory} from 'react-router';
import SignUpForm, {SignInForm} from './SignUp';
import InsertClassForm, {InsertProfessorForm} from './Insert';
import Home from './Home';
import InsertCommentForm from './InsertCommentForm';
import Professor from './Professor';
import Class from './Class';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';

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
      <IndexRoute component={Home} />
      <Route path="join" component={SignUpForm} />
      <Route path="login" component={SignInForm} />
      <Route path="home" component={Home} />
      <Route path="professor/:class_has_professors_id" component={Professor} />
      <Route path="insertClass" component={InsertClassForm} />
      <Route path="insertProfessor" component={InsertProfessorForm} />
      <Route path="rate/:class_has_professors_id" component={InsertCommentForm} />
      <Route path="class/:class_id" component={Class} />
    </Route>
  </Router>,
  document.getElementById('root')
);

//extraneous method call to produce error for non-configured app
firebase.auth(); 