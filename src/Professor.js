import React from 'react';
import './css/Professor.css';
import firebase from 'firebase';
import { hashHistory } from 'react-router';
import {Media, ProgressBar, Grid, Row, Col, Jumbotron, Button} from 'react-bootstrap';

class Professor extends React.Component {
  constructor(props){
    super(props);

    //this ideally would be set up from a Controller
    this.state = { desc: "",
                   img: "",
                   name: "",
                   class: "",
                   comments: [],
                   rating_overall: []
                 };
  }

  // receiving professor id from comment id
  //Lifecycle callback executed when the component appears on the screen.
  componentDidMount() {
    /* Add a listener for changes to the user details object, and save in the state */
    var prof_id = 'class_has_professors/'+this.props.params.class_has_professors_id;
    var profClassRef = firebase.database().ref(prof_id)
    profClassRef.on('value', (snapshot) => {
      console.log(snapshot.val());
      this.setState({class: snapshot.val().class_id});
      var profRef = firebase.database().ref("professors/"+snapshot.val().professor_id);
      profRef.on('value', (snapshot) => {
        this.setState({ desc: snapshot.val().desc,
                        img: snapshot.val().img,
                        name: snapshot.val().name
                      });
      });
    })

    var commentRef = firebase.database().ref("class_has_professors/"+ this.props.params.class_has_professors_id +"/comments"); 
    var ttlEasiness = 0;
    var ttlLecture = 0;
    var ttlHomework = 0;
    var ttlOverall = 0;
    var ttlLength = 0;

    commentRef.on('value', (snapshot) => {
      var commentRatingArray = []; 
      var commentOverallArrray = []; 
      snapshot.forEach(function (child) {
        var comment = child.val();
        comment.key = child.key;
        ttlEasiness+= parseInt(comment.easiness);
        ttlLecture+= parseInt(comment.lecture);
        ttlHomework+= parseInt(comment.homework);
        ttlOverall+= parseInt(comment.overall_rating);
        ttlLength++;
        commentRatingArray.push(comment); //make into an array
      });
      if(ttlLength == 0)
        ttlLength = 1;
      commentOverallArrray.push({easiness: ttlEasiness / ttlLength });
      commentOverallArrray.push({lecture: ttlLecture / ttlLength });
      commentOverallArrray.push({homework: ttlHomework / ttlLength });
      commentOverallArrray.push({overall_rating: ttlOverall / ttlLength });
      console.log(commentOverallArrray);
      commentRatingArray.sort((a, b) => b.created_at - a.created_at); //reverse order

      this.setState({ comments: commentRatingArray, 
                      rating_overall: commentOverallArrray
                     
      });
    });
  }

 componentWillUnmount() {
    //unregister listeners
    firebase.database().ref("class_has_professors/"+ this.props.params.class_has_professors_id +"/comments").off();
    firebase.database().ref("class_has_professors/"+ this.props.params.class_has_professors_id).off();
  }

  render() {
    var courseName = this.state.class;
    console.log(courseName);
    var allComments = this.state.comments.map(function(comment){
      return <Comment key={comment.key} 
                      content={comment.content}  
                      easiness_rating={comment.easiness} 
                      homework_rating={comment.homework}
                      lecture_rating={comment.lecture}
                      overall_rating={comment.overall_rating}
                      username={comment.user_name}
                      date={comment.created_at}
              />
    })
    return (
      <div>
        <h1>{courseName.replace("-", " ").toUpperCase()} Professor</h1>  
         <Grid>
            <Row className="grid">
              <Col xs={6} md={4}><Info name={this.state.name} img={this.state.img} desc={this.state.desc} /></Col>
              <Col xs={12} md={8}><Rating rating_overall={this.state.rating_overall} /><RateButton id={this.props.params.class_has_professors_id}/></Col>
            </Row>
          </Grid>
         <Jumbotron>
          <p>Comments</p>
          {allComments}
        </Jumbotron>
      </div>
    );
  }
}

class RateButton extends React.Component {
  constructor(props){
    super(props);
    this.rateProfessor = this.rateProfessor.bind(this);
  }

  rateProfessor(event) {
    event.preventDefault();
    hashHistory.push('/rate/'+ this.props.id);
  }

  render() {
    return (
      <Button className="button" bsStyle="primary" bsSize="large" onClick={(e) => this.rateProfessor(e)}><span>Rate this professor</span></Button>
    );
  }
}

class Info extends React.Component {
  render() {
    return (
      <div className="info">
        <img src={this.props.img} alt={this.props.name} />
        <h2>{this.props.name}</h2>
        <div>{this.props.desc}</div>
      </div>
    );
  }  
}


class Comment extends React.Component {
  render() {
      return (
       <div className="comment-box well">
          <Media>
            <Media.Left align="top" className="comment-left">
              <img height={64} width={64} src="http://www.firstgiving.com/imaging/stock/336a509b-567f-4524-80b8-94557dea3b47.jpg" alt="pic" />  
            </Media.Left>
            <Media.Body>
              <Media.Heading>{this.props.username}</Media.Heading>
              <div>
              <div className="rate">Overall Rating: {(Math.round(this.props.overall_rating *10)/10)}/10</div>
              <div className="rate">Easiness Rating: {this.props.easiness_rating}/10</div>
              <div className="rate">Lecture Rating: {this.props.lecture_rating}/10</div>
              <div className="rate">Homework Rating: {this.props.homework_rating}/10</div>  
              </div>
              <div className="comment">{this.props.content}</div>
            </Media.Body>
          </Media>
        </div> 
    );
  }
}

class Rating extends React.Component {
  render() {
    var easiness = 0;
    var overall_rating = 0;
    var lecture = 0;
    var homework = 0;
    if(this.props.rating_overall[0]){
        easiness = this.props.rating_overall[0].easiness;
        overall_rating = this.props.rating_overall[3].overall_rating;
        lecture = this.props.rating_overall[1].lecture;
        homework = this.props.rating_overall[2].homework;
    };
    console.log(overall_rating);
    return (
      <div className="rating">
        <ProgressBar striped bsStyle="success" now={overall_rating * 10} label={"Overall Rating: " + (Math.round(overall_rating *10)/10) + " / 10"} /> 
        <ProgressBar striped bsStyle="info" now={easiness*10} label={"Easiness: " + (Math.round(easiness *10)/10) + " / 10"}/>
        <ProgressBar striped bsStyle="warning" now={lecture*10} label={"Lecture: " + (Math.round(lecture *10)/10) + " / 10"}/>
        <ProgressBar striped bsStyle="danger" now={homework*10} label={"Homework: " + (Math.round(homework *10)/10) + " / 10"}/>
    </div>
    );
  }  
}

export default Professor;