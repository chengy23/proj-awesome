import React from 'react';
import {Col, FormGroup, FormControl, Button, ControlLabel, Form} from 'react-bootstrap';
import { Link, hashHistory } from 'react-router';
import firebase from 'firebase';

class InsertCommentForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            'loading': false,
            'content': '',
            'easiness': 0,
            'lecture': 0,
            'homework': 0,
            }; 
        this.handleChange = this.handleChange.bind(this);
        this.insertComment = this.insertComment.bind(this);
    }

    componentDidMount(){
        var thisComponent = this;
        var url = this.props.params.professor_name
        var professor = firebase.database().ref('professors/'+ url);
        professor.on('value', (snapshot) =>{
            thisComponent.setState({professor: snapshot.val()});
        });
        var comments = firebase.database().ref('professors/'+ url+'/comments');
        comments.on('value', (snapshot) =>{
            console.log(snapshot.val());
        });
    }

    handleChange(event){
        var field = event.target.name;
        var value = event.target.value;
        var changes = {}; //object to hold changes
        changes[field] = value; //change this field
        this.setState(changes); //update state
    }

    insertComment(event){
        event.preventDefault();
        var thisComponent = this;
        var url = this.props.params.class_has_professors_id;
        var comments = firebase.database().ref('class_has_professors/'+ url+'/comments');
        thisComponent.setState({loading:true});
        var overall_rating = (parseInt(thisComponent.state.easiness)+parseInt(thisComponent.state.lecture)+parseInt(thisComponent.state.homework))/3;
        console.log(overall_rating);
        var commentData = {
            content: thisComponent.state.content,
            user_name: firebase.auth().currentUser.displayName, 
            created_at: firebase.database.ServerValue.TIMESTAMP,
            overall_rating: overall_rating,
            easiness: thisComponent.state.easiness,
            lecture: thisComponent.state.lecture, 
            homework: thisComponent.state.homework
        };
        thisComponent.setState({
                loading: false,
                content: '',
                easiness: 0,
                lecture: 0,
                homework: 0,
            })
        comments.push(commentData);
    }

    render(){
        return(
            <div>
                <h1>Insert a comment here</h1> 
                {this.state.loading &&  /*inline conditional rendering*/
                  <div className="message">
                        <i className="fa fa-cog fa-spin fa-4x fa-fw"></i>
                        <span className="sr-only">Loading...</span>
                    </div>
                }
                <Form horizontal>
                    <FormGroup controlId="formHorizontalName">
                        <Col componentClass={ControlLabel} sm={2}>
                            Comment
                        </Col>
                        <Col sm={10}>
                            <FormControl componentClass="textarea" value={this.state.comment} name="content" type="text" placeholder="write a comment" onChange={this.handleChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect">
                        <Col componentClass={ControlLabel} sm={2}>
                            Easiness
                        </Col>
                        <Col sm={10}>
                            <FormControl componentClass="select" type="number" name="easiness" placeholder="select" onChange={this.handleChange}>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect">
                        <Col componentClass={ControlLabel} sm={2}>
                            Lecture
                        </Col>
                        <Col sm={10}>
                            <FormControl componentClass="select" type="number" name="lecture" placeholder="select" onChange={this.handleChange}>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect">
                        <Col componentClass={ControlLabel} sm={2}>
                            Homework
                        </Col>
                        <Col sm={10}>
                            <FormControl componentClass="select" type="number" name="homework" placeholder="select" onChange={this.handleChange}>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <Button type="submit" onClick={this.insertComment}>
                        Submit
                    </Button>
                </Form>
            </div>
        )
    }
}

export default InsertCommentForm;