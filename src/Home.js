import React from 'react';
import firebase from 'firebase';
import Carousel from './Carousel.js';
import { Link } from 'react-router';
import { Col, Image } from 'react-bootstrap';


// data showing in the Carousel (iSchool diversity course)
var TeamCarousel = [
  { id: 0, src: "./img/home-carousel/carousel-1.jpg", classname: "active", name: "iVal", description: "A Revoluntionary Course-Based Instructor Evaluation System for UW iSchool" },
  { id: 1, src: "./img/home-carousel/carousel-2.jpg", classname: "", name: "INFO 498D Gender, Equity & Information Technology", description: "In this course, students will challenge and respond to pressing questions about ‘why so few’ women in information technology studies and professions by exploring the relationship between gender and the construction of information technology as a field. The aim of understanding the sociocultural constructs that have shaped the current information technology industry is to provide students with knowledge to challenge limited and stereotypical representations of information technology as a ‘masculine domain’." },
  { id: 2, src: "./img/home-carousel/carousel-3.jpg", classname: "", name: "iDiversity", description: "Diversity is a core value and foundational concept in the Information School. Catalyzing the power of diversity enriches all of us by exposing us to a range of ways to understand and engage with the world, identify challenges, and to discover, define and deliver solutions. The iSchool prepares professionals to work in an increasingly diverse and global society by promoting equity and justice for all individuals. We actively work to eliminate barriers and obstacles created by institutional discrimination." },
  { id: 3, src: "./img/home-carousel/carousel-4.jpg", classname: "", name: "INFO 102 Gender and Information Technology", description: "Explores the social construction of gender in relation to the history and contemporary development of information technologies. Considers the importance of diversity and difference in the design and construction of innovative information technology solutions. Challenges prevailing viewpoints about who can and does work in the information technology field." }
];
// development team profile picture data
var devPic = ["./img/home-dev-pic/carol.jpg", "./img/home-dev-pic/quan.jpg",
  "./img/home-dev-pic/vicky.jpg", "./img/home-dev-pic/leon.jpg"];

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
    this.state = { courses: [], loading: false };
  }

  // get data from firebase
  componentDidMount() {
    this.setState({ loading: true });
    var courseRef = firebase.database().ref('classes');
    courseRef.on('value', (snapshot) => {
      var courseArray = []; //could also do this processing in render
      snapshot.forEach(function (child) {
        var course = child.val();
        course.key = child.key;
        courseArray.push(course); //make into an array
      });
      courseArray.sort((a, b) => a.course_id.localeCompare(b.course_id));
      this.setState({ courses: courseArray, loading: false });
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
        <div className="list-group-item active">
          Courses
        </div>
        {this.state.loading &&  /*inline conditional rendering*/
          <div className="message">
            <i className="fa fa-cog fa-spin fa-4x fa-fw spinner"></i>
          </div>
        }
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
        <div className="footer">iVal Team</div>
        <div className="picRow">{picItems}</div>
        <div className="footer last">&copy; iVal 2016 | <a href="https://github.com/chengy23/proj-awesome">GitHub</a></div>
      </footer>
    );
  }
}

// each single profile pics in the footer
class Pic extends React.Component {
  render() {
    return (
      <Col xs={3} md={3} className="avatar-container">
        <a className="picHover"><Image className="pics" alt="developer avatar" src={require(this.props.url)} circle /></a>
      </Col>
    );
  }
}

export default Home;
