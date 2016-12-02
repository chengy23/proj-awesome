import React from 'react';
import './css/signup.css';
import {Alert} from 'react-bootstrap';
import { Link, hashHistory } from 'react-router';
import firebase from 'firebase';

/**
 * A form for signing up and logging into a website.
 * Specifies email, password, user handle, and avatar picture url.
 * Expects `signUpCallback` and `signInCallback` props
 */
class SignUpForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      'email': undefined,
      'password': undefined,
      'name':undefined,
      'passwordConfirm':undefined,
      'visible':false
    }; 

    //function binding
    this.handleChange = this.handleChange.bind(this);
    this.signUpUser = this.signUpUser.bind(this);
  }

  //update state for specific field
  handleChange(event) {
    var field = event.target.name;
    var value = event.target.value;

    var changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
  }

  //handle signUp button
  signUp(event) {
    event.preventDefault(); //don't submit
    this.signUpUser(this.state.email, this.state.password, this.state.name);
  }

  //A callback function for registering new users
  signUpUser(email, password, handle) {
    /* Create a new user and save their information */
    var thisComponent = this;
    thisComponent.setState({visible: !thisComponent.state.visible});
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((firebaseUser) => {
      firebaseUser.sendEmailVerification(); 
      thisComponent.setState({visible: !thisComponent.state.visible});
      var userData = {
        displayName: handle 
      }

      var profilePromise = firebaseUser.updateProfile(userData);

      //add to the JITC 
      //jsonObjectInTheCloud['users'].push(userData)
      var newUserRef = firebase.database().ref('users/'+firebaseUser.uid);
      newUserRef.set(userData);
      hashHistory.push('/home');
      return profilePromise;
    })
    .catch((error) => {
      thisComponent.setState({error: error.message, visible: !thisComponent.state.visible});
    });
  }
  //handle signIn button
  signIn(event) {
    event.preventDefault(); //don't submit
    this.props.signInCallback(this.state.email, this.state.password);
  }

  /**
   * A helper function to validate a value based on a hash of validations
   * second parameter has format e.g., 
   * {required: true, minLength: 5, email: true}
   * (for required field, with min length of 5, and valid email)
   */
  validate(value, validations) {
    var errors = {isValid: true, style:''};
    
    if(value !== undefined){ //check validations
      //handle required
      if(validations.required && value === ''){
        errors.required = true;
        errors.isValid = false;
      }

      //handle minLength
      if(validations.minLength && value.length < validations.minLength){
        errors.minLength = validations.minLength;
        errors.isValid = false;
      }

      //handle email type ??
      if(validations.email){
        //pattern comparison from w3c
        //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
        var valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
        if(!valid){
          errors.email = true;
          errors.isValid = false;
        }
      }
    }

    //handle the password confirmation matching
    if(validations.toBeMatched && value !== validations.toBeMatched){
      errors.matches = true;
      errors.isValid = false;
    }

    //display details
    if(!errors.isValid){ //if found errors
      errors.style = 'has-error';
    }
    else if(value !== undefined){ //valid and has input
      //errors.style = 'has-success' //show success coloring
    }
    else { //valid and no input
      errors.isValid = false; //make false anyway
    }
    return errors; //return data object
  }

  render() {
    //field validation
    var emailErrors = this.validate(this.state.email, {required:true, email:true});
    var passwordErrors = this.validate(this.state.password, {required:true, minLength:6});
    var handleErrors = this.validate(this.state.name, {required:true});
    var passwordConfirmationErrors = this.validate(this.state.password, {required: true, toBeMatched:this.state.passwordConfirm})
    //button validation
    var signUpEnabled = (emailErrors.isValid && passwordErrors.isValid && handleErrors.isValid && passwordConfirmationErrors.isValid);
    // var signInEnabled = (emailErrors.isValid && passwordErrors.isValid && passwordConfirmationErrors.isValid);
    if(this.state.visible){
      return (
        <div>
          <div className="message">
            <i className="fa fa-cog fa-spin fa-4x fa-fw"></i>
            <span className="sr-only">Loading...</span>
          </div>
          <form role="form" className="sign-up-form">

            <ValidatedInput field="email" type="email" label="your email address" changeCallback={this.handleChange} errors={emailErrors} />

            <ValidatedInput field="name" type="text" label="your name" changeCallback={this.handleChange} errors={handleErrors} />

            <ValidatedInput field="password" type="password" label="Password" changeCallback={this.handleChange} errors={passwordErrors} />

            <ValidatedInput field="passwordConfirm" type="password" label="Password Confirm" changeCallback={this.handleChange} errors={passwordConfirmationErrors} />

            <div className="form-group sign-up-buttons">
              <button className="btn btn-primary" disabled={!signUpEnabled} onClick={(e) => this.signUp(e)}>Sign-up</button>
              Already have an account? <Link to="/login"><button className="btn btn-primary">Sign In</button></Link>
            </div>
          </form>
        </div>
      );
    }

    //if there are error display then in the error field
    if(this.state.error){
       return (
        <div>
          <Alert bsStyle="warning">
            <strong>{this.state.error}</strong>
          </Alert>
          <form role="form" className="sign-up-form">

            <ValidatedInput field="email" type="email" label="your email address" changeCallback={this.handleChange} errors={emailErrors} />

            <ValidatedInput field="name" type="text" label="your name" changeCallback={this.handleChange} errors={handleErrors} />

            <ValidatedInput field="password" type="password" label="Password" changeCallback={this.handleChange} errors={passwordErrors} />

            <ValidatedInput field="passwordConfirm" type="password" label="Password Confirm" changeCallback={this.handleChange} errors={passwordConfirmationErrors} />

            <div className="form-group sign-up-buttons">
              <button className="btn btn-primary" disabled={!signUpEnabled} onClick={(e) => this.signUp(e)}>Sign-up</button>
              Already have an account? <Link to="/login"><button className="btn btn-primary">Sign In</button></Link>
            </div>
          </form>
        </div>
      );
    }else{
      return (
        <form role="form" className="sign-up-form">

          <ValidatedInput field="email" type="email" label="your email address" changeCallback={this.handleChange} errors={emailErrors} />

          <ValidatedInput field="name" type="text" label="your name" changeCallback={this.handleChange} errors={handleErrors} />

          <ValidatedInput field="password" type="password" label="Password" changeCallback={this.handleChange} errors={passwordErrors} />

          <ValidatedInput field="passwordConfirm" type="password" label="Password Confirm" changeCallback={this.handleChange} errors={passwordConfirmationErrors} />

          <div className="form-group sign-up-buttons">
            <button className="btn btn-primary" disabled={!signUpEnabled} onClick={(e) => this.signUp(e)}>Sign-up</button>
            Already have an account? <Link to="/login"><button className="btn btn-primary">Sign In</button></Link>
          </div>
        </form>
      );
    }
  }
}

class SignInForm extends React.Component {
  
  constructor(props){
    super(props);

    this.state = {
      'email': undefined,
      'password': undefined,
      'visible': false
    }; 

    //function binding
    this.handleChange = this.handleChange.bind(this);
    this.signInUser = this.signInUser.bind(this);
  }
  //update state for specific field
  handleChange(event) {
    var field = event.target.name;
    var value = event.target.value;

    var changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
  }

  //handle signIn button
  signIn(event) {
    event.preventDefault(); //don't submit
    this.signInUser(this.state.email, this.state.password);
  }

  signInUser(email, password) {
    var thisComponent = this;
    /* Sign in the user */
    thisComponent.setState({
      visible: !this.state.visible
    });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(function(error){
        if(error){
          thisComponent.setState({error: error.message, visible: !thisComponent.state.visible});
        }
      })
  }

  /**
   * A helper function to validate a value based on a hash of validations
   * second parameter has format e.g., 
   * {required: true, minLength: 5, email: true}
   * (for required field, with min length of 5, and valid email)
   */
  validate(value, validations) {
    var errors = {isValid: true, style:''};
    
    if(value !== undefined){ //check validations
      //handle required
      if(validations.required && value === ''){
        errors.required = true;
        errors.isValid = false;
      }

      //handle email type 
      if(validations.email){
        //pattern comparison from w3c
        //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
        var valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
        if(!valid){
          errors.email = true;
          errors.isValid = false;
        }
      }
    }

    //display details
    if(!errors.isValid){ //if found errors
      errors.style = 'has-error';
    }
    else if(value !== undefined){ //valid and has input
      //errors.style = 'has-success' //show success coloring
    }
    else { //valid and no input
      errors.isValid = false; //make false anyway
    }
    return errors; //return data object
  }

  render() {
    //field validation
    var emailErrors = this.validate(this.state.email, {required:true, email:true});
    var passwordErrors = this.validate(this.state.password, {required:true, minLength:6});
    //button validation
    var signInEnabled = (emailErrors.isValid && passwordErrors.isValid);
    if(this.state.visible){
      return(
        <div>
          <div className="message">
            <i className="fa fa-cog fa-spin fa-4x fa-fw"></i>
            <span className="sr-only">Loading...</span>
          </div>
          <form role="form" className="sign-up-form">
            <ValidatedInput field="email" type="email" label="your email address" changeCallback={this.handleChange} errors={emailErrors} />

            <ValidatedInput field="password" type="password" label="Password" changeCallback={this.handleChange} errors={passwordErrors} />

            <div className="form-group sign-up-buttons">
              <button className="btn btn-primary" disabled={!signInEnabled} onClick={(e) => this.signIn(e)}>Sign-in</button>
              Don't have an account? <Link to="/join"><button className="btn btn-primary">Sign Up</button></Link>
            </div>
          </form>
        </div>
      )
    };

    //if there are errors then show them in the alert box
    if(this.state.error){
      return(
        <div>
          <Alert bsStyle="warning">
            <strong>{this.state.error}</strong>
          </Alert>
          <form role="form" className="sign-up-form">
            <ValidatedInput field="email" type="email" label="your email address" changeCallback={this.handleChange} errors={emailErrors} />

            <ValidatedInput field="password" type="password" label="Password" changeCallback={this.handleChange} errors={passwordErrors} />

            <div className="form-group sign-up-buttons">
              <button className="btn btn-primary" disabled={!signInEnabled} onClick={(e) => this.signIn(e)}>Sign-in</button>
              Don't have an account? <Link to="/join"><button className="btn btn-primary">Sign Up</button></Link>
            </div>
          </form>
        </div>
      )
    }else{
      return (
        <div>
          <form role="form" className="sign-up-form">
            <ValidatedInput field="email" type="email" label="your email address" changeCallback={this.handleChange} errors={emailErrors} />

            <ValidatedInput field="password" type="password" label="Password" changeCallback={this.handleChange} errors={passwordErrors} />

            <div className="form-group sign-up-buttons">
              <button className="btn btn-primary" disabled={!signInEnabled} onClick={(e) => this.signIn(e)}>Sign-in</button>
              Don't have an account? <Link to="/join"><button className="btn btn-primary">Sign Up</button></Link>
            </div>
          </form>
        </div>
      );
    }
  }
}

//A component that displays an input form with validation styling
//props are: field, type, label, changeCallback, errors
class ValidatedInput extends React.Component {
  render() {
    return (
      <div className={"form-group "+this.props.errors.style}>
        <label htmlFor={this.props.field} className="control-label">{this.props.label}</label>
        <input aria-label="input" id={this.props.field} type={this.props.type} name={this.props.field} className="form-control" onChange={this.props.changeCallback} />
        <ValidationErrors errors={this.props.errors} />
      </div>
    );
  }  
}

//a component to represent and display validation errors
class ValidationErrors extends React.Component {
  render() {
    return (
      <div>
        {this.props.errors.required &&
          <p className="help-block">Required!</p>
        }
        {this.props.errors.email &&
          <p className="help-block">Not an email address!</p>
        }
        {this.props.errors.minLength &&
          <p className="help-block">Must be at least {this.props.errors.minLength} characters.</p>        
        }
        {this.props.errors.matches &&
          <p className="help-block">Passwords doesn't match</p>        
        }
      </div>
    );
  }
}
export { SignInForm }; 
export default SignUpForm;
