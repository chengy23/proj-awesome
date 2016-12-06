import React, {Component}from 'react';
import {Table, ProgressBar, Grid, Row, Col} from 'react-bootstrap';
import firebase from 'firebase';

var sample_classes = {id:'343', 
                    name:'Client-Side Web Development', 
                    description:'Introduction to client-side web development including markup, programming, protocols, libraries, frameworks, and techniques for creating effective, usable, dynamic, and responsive applications that meet user needs. Includes an introduction to web development roles within organizations, content management systems, and other tools to build and manage websites and applications.'
                }; 
var sample_professors = {id:"111", 
            name:"Jorl Ross", 
            overall_rating:"10", 
            comments:{user_id:"111", 
            tags:{tag1:"Intense", 
            tag2:"Helpful", 
            tag3:"Good Office Hour"},
            course_name:"Info343",
            rating:{easinessOverall:"9",
            lectureOverall:"8",
            homeworkDifficulity:"10",
            gradingEasiness:"7"}, 
            time_taken:"20-30",  
            content:"He is really good at teaching web development, but this class takes a lot of time"},
            class_id:"343"};
              
class Class extends React.Component {
    constructor(props){
        super(props);
        this.state = {course_id: "",
                      course_name: "",
                      description: ""
                    };
   }
 
    componentDidMount (){
        console.log(this.props.params.class_id);
        var classesRef = firebase.database().ref('classes/'+this.props.params.class_id);

        classesRef.on('value', (snapshot) => {
            this.setState({course_id:snapshot.val().course_id,
                           course_name:snapshot.val().course_name,
                           description:snapshot.val().description});
        });
    }

    componentWillUnmount(){
        firebase.database().ref('classes').off();
    }

    render(){  
        return(
            <div>
                <h1>{this.state.course_id.replace("-", " ").toUpperCase()} {this.state.course_name}</h1>
                <ProfessorsIntroduction desc={this.state.description}/>
                <ComparisionTable />
            </div>
        );
    }
}

class ProfessorsIntroduction extends React.Component{
    render(){
        return(
            <div>
                <h2>Description of the course</h2>
                <p id='description'>{this.props.desc}</p>
                <h2>Instructors</h2>
            </div>
        );
    }
}

class ComparisionTable extends React.Component{

    render(){
        return(
            <div>
                <Grid>
                <Row>
                <Col xs={6} md={4}>
                <h3>Instructor 1</h3>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Criteria</th>
                            <th>Score</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Easiness Overll</td>
                            <td>{sample_professors.comments.rating.easinessOverall}/10</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>Lecture Overall</td>
                            <td>{sample_professors.comments.rating.lectureOverall}/10</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>Homework Difficulity</td>
                            <td>{sample_professors.comments.rating.homeworkDifficulity}/10</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>Grading Easiness</td>
                            <td>{sample_professors.comments.rating.gradingEasiness}/10</td>
                            <td>1</td>
                        </tr>
                    </tbody>
                </Table>
                <div>
                    <ProgressBar striped bsStyle="success" active now={(sample_professors.comments.rating.easinessOverall)*10} label={`Easiness Overall`}/>
                    <ProgressBar striped bsStyle="info" active now={(sample_professors.comments.rating.lectureOverall)*10} label={`Lecture Overall`}/>
                    <ProgressBar striped bsStyle="warning" active now={(sample_professors.comments.rating.homeworkDifficulity)*10} label={`Homework Difficulity`}/>
                    <ProgressBar striped bsStyle="danger" active now={(sample_professors.comments.rating.gradingEasiness)*10} label={`Grading Easiness`}/>
                </div>
                </Col>
                </Row>
                </Grid>
            </div>
        );
    }
}

export default Class;