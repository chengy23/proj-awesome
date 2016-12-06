import React from 'react';
import {Alert, Col, FormGroup, FormControl, Button, ControlLabel, Form} from 'react-bootstrap';
import { Link, hashHistory } from 'react-router';
import firebase from 'firebase';
import 'rc-slider/assets/index.css';
import Rcslider from 'rc-slider';
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
        this.onSliderChangeEasiness = this.onSliderChangeEasiness.bind(this);
        this.onSliderChangeHomework = this.onSliderChangeHomework.bind(this);
        this.onSliderChangeLecture = this.onSliderChangeLecture.bind(this);
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
        if(firebase.auth().currentUser){
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
            hashHistory.push('professor/'+thisComponent.props.params.class_has_professors_id);
        }else{
            thisComponent.setState({
                    error: true,
                    loading: false,
                    content: '',
                    easiness: 0,
                    lecture: 0,
                    homework: 0,
                })
        }
    }
    onSliderChangeEasiness(value) {
        this.setState({easiness:value});
    }
    onSliderChangeHomework(value) {
        this.setState({homework:value});
    }
    onSliderChangeLecture(value) {
        this.setState({lecture:value});
    }
    render(){
        return(
            <div>
                <h1>Insert a comment here</h1> 
                {this.state.error &&  /*inline conditional rendering*/
                  <Alert className="alert-box" bsStyle="warning">
                        <strong>Need to login to comment on a professor</strong>
                    </Alert>
                }
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
                        <div>
                            <Rcslider min={0} max={10} tipTransitionName="rc-slider-tooltip-zoom-down" onChange={this.onSliderChangeEasiness} />
                        </div>
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect">
                        <Col componentClass={ControlLabel} sm={2}>
                            Lecture
                        </Col>
                        <Col sm={10}>
                            <Rcslider min={0} max={10} tipTransitionName="rc-slider-tooltip-zoom-down" onChange={this.onSliderChangeLecture} />
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect">
                        <Col componentClass={ControlLabel} sm={2}>
                            Homework
                        </Col>
                        <Col sm={10}>
                            <Rcslider min={0} max={10} tipTransitionName="rc-slider-tooltip-zoom-down" onChange={this.onSliderChangeHomework} />
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