import React from 'react';
import { Table, ProgressBar, Grid, Row, Col } from 'react-bootstrap';
import firebase from 'firebase';
import './css/class.css';

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course_id: '',
      course_name: '',
      description: '',
      rating_overall: [],
      profArray: [],
      commentKey: ''
    };
  }

  //This here to refresh the class component when a new class is called
  componentWillReceiveProps(nextProps) {
    /* Add a listener for changes to the chirps object, and save in the state */
    var thisComponent = this;
    //the class info from firebase based on the parameter
    var classesRef = firebase.database().ref('classes/' + nextProps.params.class_id);
    classesRef.on('value', (snapshot) => {
      this.setState({
        course_id: snapshot.val().course_id,
        course_name: snapshot.val().course_name,
        description: snapshot.val().description
      });
    });

    //find filter every courses passed by the user's select from home page
    var commentRef = firebase.database().ref("class_has_professors");
    var class_id = nextProps.params.class_id; //class passed by the users select from home page
    var overallArray = [];
    commentRef.on('value', (snapshot) => {
      var filteredArray = [];
      snapshot.forEach(function (child) {
        var course = child.val();
        course.key = child.key;
        filteredArray.push(course);
      });
      filteredArray = filteredArray.filter(checkClassId);
      function checkClassId(eachClass) {
        return eachClass.class_id === class_id; //stored all the classes match the class_id
      }
      // this.setState({profArray: filteredArray}); //set to state of filted classes array
      overallArray = filteredArray;
      overallArray.forEach(function (comment) {
        var commentRef = firebase.database().ref("class_has_professors/" + comment.key + "/comments");
        thisComponent.setState({ commentKey: comment.key });
        var ttlEasiness = 0;
        var ttlLecture = 0;
        var ttlHomework = 0;
        var ttlOverall = 0;
        var ttlLength = 0;
        commentRef.on('value', (snapshot) => {
          var commentOverallArrray = [];
          snapshot.forEach(function (child) {
            var comment = child.val();
            ttlEasiness += parseInt(comment.easiness, 10);
            ttlLecture += parseInt(comment.lecture, 10);
            ttlHomework += parseInt(comment.homework, 10);
            ttlOverall += parseInt(comment.overall_rating, 10);
            ttlLength++;
          });
          if (ttlLength === 0)
            ttlLength = 1;
          commentOverallArrray.push({ easiness: ttlEasiness / ttlLength });
          commentOverallArrray.push({ lecture: ttlLecture / ttlLength });
          commentOverallArrray.push({ homework: ttlHomework / ttlLength });
          commentOverallArrray.push({ overall_rating: ttlOverall / ttlLength });
          comment.rating_overall = commentOverallArrray;
          thisComponent.setState({ profArray: overallArray, });
        });
      })
    });
  }

  //this and componentWillReceiveProps perform a same algorithm. This algorithm involves looks on the database 
  //for all comments that were made then pick out comment for the class is displaying. For each of those comment,
  //the function will compute the overall rating for each professor to render on the page
  componentDidMount() {
    /* Add a listener for changes to the chirps object, and save in the state */
    var thisComponent = this;
    //the class info from firebase based on the parameter
    var classesRef = firebase.database().ref('classes/' + thisComponent.props.params.class_id);
    classesRef.on('value', (snapshot) => {
      this.setState({
        course_id: snapshot.val().course_id,
        course_name: snapshot.val().course_name,
        description: snapshot.val().description
      });
    });

    //find filter every courses passed by the user's select from home page
    var commentRef = firebase.database().ref("class_has_professors");
    var class_id = thisComponent.props.params.class_id; //class passed by the users select from home page
    var overallArray = [];
    commentRef.on('value', (snapshot) => {
      var filteredArray = [];
      snapshot.forEach(function (child) {
        var course = child.val();
        course.key = child.key;
        filteredArray.push(course);
      });
      filteredArray = filteredArray.filter(checkClassId);
      function checkClassId(eachClass) {
        return eachClass.class_id === class_id; //stored all the classes match the class_id
      }
      // this.setState({profArray: filteredArray}); //set to state of filted classes array
      overallArray = filteredArray;
      overallArray.forEach(function (comment) {
        var commentRef = firebase.database().ref("class_has_professors/" + comment.key + "/comments");
        thisComponent.setState({ commentKey: comment.key });
        var ttlEasiness = 0;
        var ttlLecture = 0;
        var ttlHomework = 0;
        var ttlOverall = 0;
        var ttlLength = 0;
        commentRef.on('value', (snapshot) => {
          var commentOverallArrray = [];
          snapshot.forEach(function (child) {
            var comment = child.val();
            ttlEasiness += parseInt(comment.easiness, 10);
            ttlLecture += parseInt(comment.lecture, 10);
            ttlHomework += parseInt(comment.homework, 10);
            ttlOverall += parseInt(comment.overall_rating, 10);
            ttlLength++;
          });
          if (ttlLength === 0)
            ttlLength = 1;
          commentOverallArrray.push({ easiness: ttlEasiness / ttlLength });
          commentOverallArrray.push({ lecture: ttlLecture / ttlLength });
          commentOverallArrray.push({ homework: ttlHomework / ttlLength });
          commentOverallArrray.push({ overall_rating: ttlOverall / ttlLength });
          comment.rating_overall = commentOverallArrray;
          thisComponent.setState({ profArray: overallArray, });
        });
      })
    });
  }

  componentWillUnmount() {
    firebase.database().ref('classes/' + this.props.params.class_id).off();
    firebase.database().ref('class_has_professors').off();
  }

  render() {
    var instructors = [];
    if (this.state.profArray.length > 0) {
      instructors = this.state.profArray
    }
    instructors = instructors.map(function (instructor) {
      return (
        <Col sm={6} xs={12} md={4} id='col' key={instructor.key} >
          <ComparisionTable class_has_professors_id={instructor.key} professor_id={instructor.professor_id} rateOverall={instructor.rating_overall} />
        </Col>
      );
    })
    return (
      <div className="container">
        {this.state.course_id === "" && <h1 id='h1'>Didn't find you class? Go ahead and "Add a Class".</h1>
        }
        {this.state.course_id !== "" && <div><h1 id='h1'>{this.state.course_id.replace("-", " ").toUpperCase()} {this.state.course_name}</h1>
        <ProfessorsIntroduction desc={this.state.description} /></div>
        }
        <Grid id='grid'>
          <Row >
            {instructors}
          </Row>
        </Grid>

      </div>
    );
  }
}

class ProfessorsIntroduction extends React.Component {
  render() {
    return (
      <div>
        <h2 className='header_style'>Description of the course</h2>
        <div id="des"><p id='description'>{this.props.desc}</p></div>
        <h2 className='header_style'>Instructors</h2>
      </div>
    );
  }
}

class ComparisionTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //find info about a specific professor 
  componentDidMount() {
    var professor = firebase.database().ref("professors/" + this.props.professor_id);
    professor.on('value', (snapshot) => {
      this.setState({ professor: snapshot.val() });
    })
  }
  render() {
    var easiness = 0;
    var overall_rating = 0;
    var lecture = 0;
    var homework = 0;
    if (this.props.rateOverall && this.props.rateOverall[0]) {
      easiness = parseFloat(this.props.rateOverall[0].easiness).toFixed(1);
      overall_rating = parseFloat(this.props.rateOverall[3].overall_rating).toFixed(1);
      lecture = parseFloat(this.props.rateOverall[1].lecture).toFixed(1);
      homework = parseFloat(this.props.rateOverall[2].homework).toFixed(1);
    };
    var url = '#/professor/' + this.props.class_has_professors_id;
    if (this.state.professor)
      return (
        <div>
          <img src={this.state.professor.img} id='img' alt="professor's profile" />
          <h3 id='h3'>{this.state.professor.name}</h3>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th className="th">Criteria</th>
                <th className="th">Score</th>
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
                <td>Lecture Quality</td>
                <td>{lecture}/10</td>
              </tr>
              <tr>
                <td>Homework Load</td>
                <td>{homework}/10</td>
              </tr>
            </tbody>
          </Table>
          <div>
            <ProgressBar striped bsStyle="success" now={overall_rating * 10} label={`Overall Rating`} />
            <ProgressBar striped bsStyle="info" now={easiness * 10} label={`Easiness`} />
            <ProgressBar striped bsStyle="warning" now={lecture * 10} label={`Lecture Quality`} />
            <ProgressBar striped bsStyle="danger" now={homework * 10} label={`Homework Load`} />
          </div>
          <button className="btn btn-primary" id='buttonStyle'><a href={url} id="showMoreButton">See More</a></button>

        </div>
      );
    else
      return (
        <div>
        </div>
      );
  }
}

export default Class;