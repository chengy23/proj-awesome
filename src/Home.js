import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Link } from 'react-router';
import firebase from 'firebase';
import {Item, Caption} from 'react-bootstrap'
import Carousel from './Carousel.js';
var TeamCarousel = [
   {id: 0, src: "https://scontent-sea1-1.xx.fbcdn.net/v/t35.0-12/15398987_751039088381962_190128122_o.jpg?oh=d52708b4503d6e79dd60f0482926ad65&oe=584A6CF2", classname: "active", name:"iDiverity", description:"Diversity is a core value and foundational concept in the Information School. Catalyzing the power of diversity enriches all of us by exposing us to a range of ways to understand and engage with the world, identify challenges, and to discover, define and deliver solutions. The iSchool prepares professionals to work in an increasingly diverse and global society by promoting equity and justice for all individuals. We actively work to eliminate barriers and obstacles created by institutional discrimination."},
   {id: 1, src: "https://www.ius.edu/social-sciences/images/social-sciences-header.jpg", classname: "", name:"INFO 498D Gender, Equity & Information Technology", description:"In this course, students will challenge and respond to pressing questions about ‘why so few’ women in information technology studies and professions by exploring the relationship between gender and the construction of information technology as a field. The aim of understanding the sociocultural constructs that have shaped the current information technology industry is to provide students with knowledge to challenge limited and stereotypical representations of information technology as a ‘masculine domain’."},
   {id: 2, src: "https://www.ius.edu/diversity/images/diversity-header.jpg", classname: "", name:"INFO 102 Gender and Information Technology", description:"Explores the social construction of gender in relation to the history and contemporary development of information technologies. Considers the importance of diversity and difference in the design and construction of innovative information technology solutions. Challenges prevailing viewpoints about who can and does work in the information technology field."},
 ];

class Home extends React.Component {
    render() {
        return (
            <div>
                <Carousel data={TeamCarousel}/>
                <h1 className="greeting">Warmest Greeting From iVal</h1>
                <PopList />
            </div>
        );
    }
}


class PopList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { courses: [] };
    }

    componentDidMount() {
        var courseRef = firebase.database().ref('classes');
        courseRef.on('value', (snapshot) => {
            var courseArray = []; //could also do this processing in render
            snapshot.forEach(function(child) {
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

class CourseItem extends React.Component {
    render() {
        return (
            <Link to={'class/' + this.props.courseId} className="list-group-item list-group-item-action courseItem" activeClassName="activeLink"><strong>{this.props.courseId.replace("-", " ").toUpperCase()}</strong> <br />  {this.props.courseName}</Link>
        )
    }
}

export class Footer extends React.Component {
    render() {
        return (
            <footer className=" App-footer footer-inverse">
                &copy; iVal 2016
        </footer>
        );
    }
}


export default Home;
