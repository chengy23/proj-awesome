import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Link } from 'react-router';
import firebase from 'firebase'
import {Item, Caption} from 'react-bootstrap'

class Home extends React.Component {
    render() {
        return (
            <div className="page-container">
                <h1>Warmest greeting from iVal</h1>
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
