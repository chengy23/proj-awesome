import React, {Component}from 'react';
import {Table, ProgressBar, Grid, Row, Col, Button} from 'react-bootstrap';
import firebase from 'firebase';
              
class Class extends React.Component {
    constructor(props){
        super(props);
        this.state = {course_id: '',
                      course_name: '',
                      description: '',
                      rating_overall:[],
                      profArray: [],
                      //parame: ''
                    };
   }
 
    componentDidMount (){
        var thisComponent = this;
        //the class info from firebase based on the parameter
        var classesRef = firebase.database().ref('classes/'+this.props.params.class_id);
        classesRef.on('value', (snapshot) => {
            this.setState({course_id:snapshot.val().course_id,
                           course_name:snapshot.val().course_name,
                           description:snapshot.val().description});
        });

        //find filter every courses passed by the user's select from home page
        var commentRef = firebase.database().ref("class_has_professors"); 
        var class_id = this.props.params.class_id; //class passed by the users select from home page
        var overallArray = [];
        commentRef.on('value', (snapshot) => {
            var commentOverallArrray = [];
            var filteredArray = []; 
            snapshot.forEach(function(child) {
            var course = child.val();
                course.key = child.key;
                filteredArray.push(course);
            });
            filteredArray = filteredArray.filter(checkClassId); 
            function checkClassId(eachClass) {
                return eachClass.class_id == class_id; //stored all the classes match the class_id
            }  
            // this.setState({profArray: filteredArray}); //set to state of filted classes array
            overallArray = filteredArray;
            overallArray.forEach(function(comment){
                console.log(comment);
                var commentRef = firebase.database().ref("class_has_professors/"+ comment.key +"/comments"); 
                //get all the rating for one professor for a specific class
                var ttlEasiness = 0;
                var ttlLecture = 0;
                var ttlHomework = 0;
                var ttlOverall = 0;
                var ttlLength = 0;
                commentRef.on('value', (snapshot) => {
                    var commentOverallArrray = []; 
                    snapshot.forEach(function (child) {
                        var comment = child.val();
                        ttlEasiness+= parseInt(comment.easiness);
                        ttlLecture+= parseInt(comment.lecture);
                        ttlHomework+= parseInt(comment.homework);
                        ttlOverall+= parseInt(comment.overall_rating);
                        ttlLength++; 
                    });
                    if(ttlLength == 0)
                        ttlLength = 1;
                    commentOverallArrray.push({easiness: ttlEasiness / ttlLength });
                    commentOverallArrray.push({lecture: ttlLecture / ttlLength });
                    commentOverallArrray.push({homework: ttlHomework / ttlLength }); 
                    commentOverallArrray.push({overall_rating: ttlOverall / ttlLength });
                    comment.rating_overall = commentOverallArrray;
                    thisComponent.setState({profArray: overallArray});
                });
            })
        });
    }

    componentWillUnmount(){
        firebase.database().ref('classes').off();
        firebase.database().ref("class_has_professors").off();
    }

    render(){
        var instructors = [];
        if(this.state.profArray.length > 0){
            instructors = this.state.profArray
        }
        instructors = instructors.map(function(instructor){
            console.log(instructor);
            return <ComparisionTable key={instructor.key} class_has_professors_id={instructor.key} professor_id={instructor.professor_id} rateOverall={instructor.rating_overall}/>
        })
        return(
            <div>
                <h1>{this.state.course_id} {this.state.course_name}</h1>
                <ProfessorsIntroduction desc={this.state.description}/>
                {instructors}
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
    constructor(props){
        super(props);
        this.state = {};
   }
   componentDidMount(){
       var professor = firebase.database().ref("professors/"+ this.props.professor_id); 
       professor.on('value', (snapshot) => {
           this.setState({professor:snapshot.val()});
       })
   }
    render(){
        console.log(this.props);
        var easiness = 0;
        var overall_rating = 0;
        var lecture = 0;
        var homework = 0;
        if(this.props.rateOverall[0]){
            easiness = parseFloat(this.props.rateOverall[0].easiness).toFixed(2);
            overall_rating = parseFloat(this.props.rateOverall[3].overall_rating).toFixed(2);
            lecture = parseFloat(this.props.rateOverall[1].lecture).toFixed(2);
            homework = parseFloat(this.props.rateOverall[2].homework).toFixed(2);
        };
        var url = '#/professor/'+this.props.class_has_professors_id;
        if(this.state.professor)
            return(
                <div>
                    <Grid>
                    <Row>
                    <Col xs={6} md={4}>
                    <img src={this.state.professor.img} />
                    <h3>{this.state.professor.name}</h3>
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th>Criteria</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Overall Rating</td>
                                <td>{overall_rating}/10</td>
                            </tr>
                            <tr>
                                <td>Easiness</td>
                                <td>{easiness}/10</td>
                            </tr>
                            <tr>
                                <td>Lecture</td>
                                <td>{lecture}/10</td>
                            </tr>
                            <tr>
                                <td>Homework</td>
                                <td>{homework}/10</td>
                            </tr>
                        </tbody>
                    </Table>
                    <div>
                        <ProgressBar striped bsStyle="success"  now={overall_rating * 10} label={`Overall Rating`}/>
                        <ProgressBar striped bsStyle="info"  now={easiness*10} label={`Easiness`}/>
                        <ProgressBar striped bsStyle="warning"  now={lecture*10} label={`Lecture`}/>
                        <ProgressBar striped bsStyle="danger"  now={homework*10} label={`Homework`}/>
                    </div>
                    <Button bsStyle="primary"><a href={url}>See More</a></Button>
                    </Col>
                    </Row>
                    </Grid>
                </div>
            );
        else
            return(
                <div>
                </div>
            );
    }
}

export default Class;