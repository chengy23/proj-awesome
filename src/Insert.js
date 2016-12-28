import React from 'react';
import { Col, FormGroup, FormControl, Button, ControlLabel, Form } from 'react-bootstrap';
import firebase from 'firebase';
import { Link } from 'react-router';
import { Alert } from 'react-bootstrap';

class InsertClassForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course_id: '',
      course_name: '',
      desc: '',
      loading: false,
      success: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.insertClass = this.insertClass.bind(this);
  }

  //handle any changes to the inputs
  handleChange(event) {
    var field = event.target.name;
    var value = event.target.value;

    var changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
  }

  //insert class into firebase
  insertClass(event) {
    event.preventDefault();
    var thisComponent = this;
    this.setState({ loading: true });
    if (thisComponent.state.course_id !== '') {
      var courses = firebase.database().ref('user_inputed_classes/' + thisComponent.state.course_id);
      var courseData = {
        course_id: thisComponent.state.course_id,
        course_name: thisComponent.state.course_name,
        description: thisComponent.state.desc,
        created_at: firebase.database.ServerValue.TIMESTAMP
      }
      courses.set(courseData).then(function () {
        thisComponent.setState({ course_id: '', course_name: '', desc: '', loading: false, success: true });
      });

    } else {
      thisComponent.setState({ error: 'can\'t add class if the course id is empty', loading: false });
    }
  };

  render() {
    return (
      <div className="container">
        <h1 className="insertTitle"> Inserting a course</h1>
        <Form horizontal className="form">
          {this.state.loading &&  /*inline conditional rendering*/
            <div className="message">
              <i className="fa fa-cog fa-spin fa-4x fa-fw"></i>
              <span className="sr-only">Loading...</span>
            </div>
          }
          {this.state.error &&  /*inline conditional rendering*/
            <div className="message">
              <Alert bsStyle="warning">
                <strong>{this.state.error}</strong>
              </Alert>
            </div>
          }
          {this.state.success &&  /*inline conditional rendering*/
            <div className="message">
              <Alert bsStyle="success">
                <strong>Request sent successfully! We will check it out soon <Link to="/">Back to Home</Link> or <Link to="insertProfessor">Continue to insert a professor</Link></strong>
              </Alert>
            </div>
          }
          <FormGroup controlId="formHorizontalName">
            <Col componentClass={ControlLabel} sm={2}>
              Course ID
                            </Col>
            <Col sm={10}>
              <FormControl aria-label="course_id field" value={this.state.course_id} name="course_id" type="text" placeholder="a course id (e.g. INFO 343)" onChange={this.handleChange} />
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalName">
            <Col componentClass={ControlLabel} sm={2}>
              Course Name
                            </Col>
            <Col sm={10}>
              <FormControl aria-label="course name field" value={this.state.course_name} name="course_name" type="text" placeholder="a course name" onChange={this.handleChange} />
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalDescription">
            <Col componentClass={ControlLabel} sm={2}>
              Description
                            </Col>
            <Col sm={10}>
              <FormControl aria-label="course description field" value={this.state.desc} name="desc" type="text" placeholder="the course's description" onChange={this.handleChange} />
            </Col>
          </FormGroup>
          <Button className="pull-right btn btn-primary" aria-label="submit button" type="submit" onClick={this.insertClass}>
            Submit
                        </Button>
        </Form>
      </div>
    )
  }
}

class InsertProfessorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      professor_name: '',
      class_name: '',
      profLoading: false,
      profSuccess: false,
      profDesc: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.insertProfessor = this.insertProfessor.bind(this);
  }

  handleChange(event) {
    var field = event.target.name;
    var value = event.target.value;

    var changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
  }

  //insert a professor into the database then insert the professor id and the class id into the 
  //class_has_professors table
  insertProfessor(event) {
    event.preventDefault();
    var thisComponent = this;
    if (thisComponent.state.professor_name !== '') {
      var professors = firebase.database().ref('users_inputed_professors/' + thisComponent.state.professor_name);
      thisComponent.setState({ loading: true });
      var professorData = {
        'name': thisComponent.state.professor_name,
        'desc': thisComponent.state.profDesc,
        'classes_teaching': thisComponent.state.class_name,
        'created_at': firebase.database.ServerValue.TIMESTAMP,
      };
      professors.set(professorData).then(function () {
        thisComponent.setState({ success: true, loading: false, professor_name: '', class_name: '', profLoading: false, profDesc: '' });
      });
    } else {
      thisComponent.setState({ error: 'professor name can\'t be blank' })
    }
  };

  render() {
    return (
      <div className="container">
        <h1 className="insertTitle"> Inserting a professor</h1>
        <Form horizontal className="form">
          {this.state.loading &&  /*inline conditional rendering*/
            <div className="message">
              <i className="fa fa-cog fa-spin fa-4x fa-fw"></i>
              <span className="sr-only">Loading...</span>
            </div>
          }
          {this.state.error &&  /*inline conditional rendering*/
            <div className="message">
              <Alert bsStyle="warning">
                <strong>{this.state.error}</strong>
              </Alert>
            </div>
          }
          {this.state.success &&  /*inline conditional rendering*/
            <div className="message">
              <Alert bsStyle="success">
                <strong>Request sent successfully! We will check it out soon <Link to="/">Back to Home</Link></strong>
              </Alert>
            </div>
          }
          <FormGroup controlId="formHorizontalName">
            <Col componentClass={ControlLabel} sm={2}>
              Professor Name
                        </Col>
            <Col sm={10}>
              <FormControl aria-label="professor name" value={this.state.professor_name} name="professor_name" type="text" placeholder="professor's name" onChange={this.handleChange} />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalDescription">
            <Col componentClass={ControlLabel} sm={2}>
              Description
                        </Col>
            <Col sm={10}>
              <FormControl aria-label="professor description" value={this.state.profDesc} name="profDesc" type="text" placeholder="professor's description" onChange={this.handleChange} />
            </Col>
          </FormGroup>
          <FormGroup controlId="formControlsClasses">
            <Col componentClass={ControlLabel} sm={2}>
              Class Taught
                        </Col>
            <Col sm={10}>
              <FormControl aria-label="classes teaching" name="class_name" value={this.state.class_name} placeholder="class(es) that the professor teaches" onChange={this.handleChange}></FormControl>
            </Col>
          </FormGroup>
          <Button className="pull-right btn btn-primary" aria-label="submit button" type="submit" onClick={this.insertProfessor}>
            Submit
                    </Button>
        </Form>
      </div>
    )
  }
}

export { InsertProfessorForm };
export default InsertClassForm;
