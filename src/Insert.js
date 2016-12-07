import React from 'react';
import {Col, FormGroup, FormControl, Button, ControlLabel, Form} from 'react-bootstrap';
import firebase from 'firebase';
import { hashHistory, Link } from 'react-router';
import {Alert} from 'react-bootstrap';

class InsertClassForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            'course_id': '',
            'course_name': '',
            'desc': '',
            'loading': false
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
    insertClass(event){
        event.preventDefault();
        var thisComponent = this;
        this.setState({loading:true});
        if(thisComponent.state.course_id != ''){
            var courses = firebase.database().ref('user_inputed_classes/'+thisComponent.state.course_id);
            var courseData = {
                course_id: thisComponent.state.course_id,
                course_name: thisComponent.state.course_name,
                description: thisComponent.state.desc,
                created_at: firebase.database.ServerValue.TIMESTAMP
            }
            courses.set(courseData).then(function(){
                thisComponent.setState({course_id:'',course_name: '', desc:'', loading:false});
                hashHistory.push('/insertProfessor');
            });
            
        }else{
            thisComponent.setState({error: 'can\'t add class if the course id is empty', loading:false});
        }
    };

    render(){
        return(
            <div className="container">
                <div className="form">
                    <h1> Inserting course here</h1>
                    <Form horizontal>
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
                        <FormGroup controlId="formHorizontalName">
                            <Col componentClass={ControlLabel} sm={2}>
                                Course ID
                            </Col>
                            <Col sm={10}>
                                <FormControl aria-label="course_id field" value={this.state.course_id} name="course_id" type="text" placeholder="enter a course id" onChange={this.handleChange} />
                            </Col>
                        </FormGroup>
                    <FormGroup controlId="formHorizontalName">
                            <Col componentClass={ControlLabel} sm={2}>
                                Course Name
                            </Col>
                            <Col sm={10}>
                                <FormControl aria-label="course name field" value={this.state.course_name} name="course_name" type="text" placeholder="enter a course name" onChange={this.handleChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="formHorizontalDescription">
                            <Col componentClass={ControlLabel} sm={2}>
                                Description
                            </Col>
                            <Col sm={10}>
                                <FormControl aria-label="course description field" value={this.state.desc} name="desc" type="text" placeholder="enter course's description" onChange={this.handleChange} />
                            </Col>
                        </FormGroup>
                        <Button className="button pull-right" aria-label="submit button" type="submit" onClick={this.insertClass}>
                        Submit
                        </Button>
                    </Form>
                </div>
            </div>
        )
    }
}

class InsertProfessorForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
                'professor_name': '',
                'overall_rating': 'none',
                'class_name': '',
                'loading': false,
                'desc': ''
            }; 
        this.handleChange = this.handleChange.bind(this);
        this.insertProfessor = this.insertProfessor.bind(this);
    }

    //get all the classes back
    componentDidMount(){
       var classes = firebase.database().ref('user_inputed_classes');
        classes.on('value', (snapshot) =>{
        var classesArray = []; //an array to put in the state
        snapshot.forEach(function(childSnapshot){ //go through each item like an array
            var courseData = childSnapshot.val();
            courseData.id = childSnapshot.key;
            classesArray.push(courseData);
        });
        this.setState({classes: classesArray, class_name: classesArray[0].course_name, class_id: classesArray[0].id});
        })
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
    insertProfessor(event){
        event.preventDefault();
        var thisComponent = this;
        if(thisComponent.state.professor_name != ''){
            var professors = firebase.database().ref('users_inputed_professors/'+thisComponent.state.professor_name);
            thisComponent.setState({loading:true});
            var professorData = {
                'name':thisComponent.state.professor_name,
                'desc':thisComponent.state.desc,
                'created_at': firebase.database.ServerValue.TIMESTAMP,
                'class_id':thisComponent.state.class_id
            };
            professors.set(professorData).then(function(){
                thisComponent.setState({success:true,loading:false, 'professor_name': '','class_name': '','loading': false,'desc': ''});
            });
        }else{
            thisComponent.setState({error: 'professor name can\'t be blank'})
        }
    };

    render(){
        var classOptions = [];
        if(this.state.classes){
            classOptions = this.state.classes;
            classOptions = classOptions.map(function(course){
                return <option value={course.key} key={course.course_name}>{course.course_name}</option>
            })
        }
        return(
            <div className="container">                
                <h1> Inserting a professor here</h1>
                <Form horizontal>
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
                            <Alert bsStyle="warning">
                                <strong>Request sent, we will check it out soon <a href="#">Dismiss</a></strong>
                            </Alert>
                        </div>
                    }      
                   <FormGroup controlId="formHorizontalName">
                        <Col componentClass={ControlLabel} sm={2}>
                            Professor Name
                        </Col>
                        <Col sm={10}>
                            <FormControl aria-label="professor name" value={this.state.professor_name} name="professor_name" type="text" placeholder="enter a professor name" onChange={this.handleChange} />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalName">
                        <Col componentClass={ControlLabel} sm={2}>
                            Description
                        </Col>
                        <Col sm={10}>
                            <FormControl aria-label="professor name" value={this.state.desc} name="desc" type="text" placeholder="enter a professor's description" onChange={this.handleChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect">
                        <Col componentClass={ControlLabel} sm={2}>
                            Classes
                        </Col>
                        <Col sm={10}>
                            <FormControl aria-label="class options" name="class_name" componentClass="select" placeholder="select" onChange={this.handleChange}>
                                {classOptions}
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <Button className="button pull-right" aria-label="submit button" type="submit" onClick={this.insertProfessor}>
                    Submit
                    </Button>
                </Form>
            </div>
        )
    }
}

export { InsertProfessorForm }; 
export default InsertClassForm;