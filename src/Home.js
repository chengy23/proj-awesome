import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Link } from 'react-router';
import firebase from 'firebase';
import { Item, Caption } from 'react-bootstrap'
import Carousel from './Carousel.js';
import { Col, Image } from 'react-bootstrap';
// data showing in the Carousel (iSchool diversity course)
var TeamCarousel = [
  { id: 0, src: "https://scontent-sjc2-1.xx.fbcdn.net/v/t35.0-12/15409980_751317745020763_619939353_o.jpg?oh=b5f2b00305aa22a665ba4c9669355ba9&oe=584A4444", classname: "active", name: "iVal", description: "A Revoluntionary Course-Based Instructor Evaluation Platform for iSchool" },
  { id: 1, src: "https://www.ius.edu/social-sciences/images/social-sciences-header.jpg", classname: "", name: "INFO 498D Gender, Equity & Information Technology", description: "In this course, students will challenge and respond to pressing questions about ‘why so few’ women in information technology studies and professions by exploring the relationship between gender and the construction of information technology as a field. The aim of understanding the sociocultural constructs that have shaped the current information technology industry is to provide students with knowledge to challenge limited and stereotypical representations of information technology as a ‘masculine domain’." },
  { id: 2, src: "https://scontent-sea1-1.xx.fbcdn.net/v/t35.0-12/15398987_751039088381962_190128122_o.jpg?oh=d52708b4503d6e79dd60f0482926ad65&oe=584A6CF2", classname: "", name: "iDiversity", description: "Diversity is a core value and foundational concept in the Information School. Catalyzing the power of diversity enriches all of us by exposing us to a range of ways to understand and engage with the world, identify challenges, and to discover, define and deliver solutions. The iSchool prepares professionals to work in an increasingly diverse and global society by promoting equity and justice for all individuals. We actively work to eliminate barriers and obstacles created by institutional discrimination." },
  { id: 3, src: "https://www.ius.edu/diversity/images/diversity-header.jpg", classname: "", name: "INFO 102 Gender and Information Technology", description: "Explores the social construction of gender in relation to the history and contemporary development of information technologies. Considers the importance of diversity and difference in the design and construction of innovative information technology solutions. Challenges prevailing viewpoints about who can and does work in the information technology field." }
];
// development team profile picture data
var devPic = ["https://scontent-sjc2-1.xx.fbcdn.net/v/t35.0-12/15354135_751257061693498_330333765_o.jpg?oh=fcad977585e1a9fdfc06133e9f7e6c57&oe=584A436E", "https://scontent-sjc2-1.xx.fbcdn.net/v/t1.0-9/10882112_991017114259830_9102339148920627845_n.jpg?oh=3b11156751cc5adfa5652158dac1c9fc&oe=58FC70EF",
  "https://scontent-sjc2-1.xx.fbcdn.net/v/t34.0-12/15424602_1992174424342848_475362897_n.jpg?oh=ecd7cf6f2f3a0779afa70c3606232605&oe=5849F9EA", "https://scontent-sjc2-1.xx.fbcdn.net/v/t1.0-9/13343121_891229021023725_8278429030512386549_n.jpg?oh=420faee48ea7f0414b451cd61c2629c6&oe=58F98319"];

class Home extends React.Component {
  render() {
    return (
      <div>
        <Carousel data={TeamCarousel} />
        <h1 className="greeting">Warmest Greeting From iVal</h1>
        <PopList />
      </div>
    );
  }
}

// the course lists showing on the home page
class PopList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { courses: [] };
  }

  // get data from firebase
  componentDidMount() {
    var courseRef = firebase.database().ref('classes');
    courseRef.on('value', (snapshot) => {
      var courseArray = []; //could also do this processing in render
      snapshot.forEach(function (child) {
        var course = child.val();
        course.key = child.key;
        courseArray.push(course); //make into an array
      });
      courseArray.sort((a, b) => a.course_id.localeCompare(b.course_id));
      this.setState({ courses: courseArray });
    });
  }

  componentWillUnmount() {
    firebase.database().ref('classes').off();
  }

  render() {
    var courseItems = this.state.courses.map((course) => {
      return <CourseItem courseId={course.course_id}
        courseName={course.course_name}
        key={course.course_id} />
    })
    return (

      <div className="list-group">
        <a href="#" role="button" className="list-group-item active">
          Courses
        </a>
        {courseItems}
      </div>
    );
  }
}
// each single row in the course table
class CourseItem extends React.Component {
  render() {
    return (
      <Link to={'class/' + this.props.courseId} className="list-group-item list-group-item-action courseItem" activeClassName="activeLink"><strong>{this.props.courseId.replace("-", " ").toUpperCase()}</strong> <br />  {this.props.courseName}</Link>
    )
  }
}

export class Footer extends React.Component {
  render() {
    var picItems = devPic.map((pic) => {
      return <Pic url={pic} key={pic} />
    })
    return (
      <footer className=" App-footer footer-inverse">
        <div className="footer">The iVal is Our Val</div>
        <div className="picRow">{picItems}</div>
        <div className="footer last">&copy; iVal 2016</div>
      </footer>
    );
  }
}

// each single profile pics in the footer
class Pic extends React.Component {
  render() {
    return (
      <Col xs={3} md={3}>
        <a className="picHover"><Image className="pics" src={this.props.url} circle /></a>
      </Col>
    );
  }
}


export default Home;
