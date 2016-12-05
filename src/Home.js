import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Link } from 'react-router';
import firebase from 'firebase'

class Home extends React.Component {

    render() {
        return (
            <div>
                <h1>Warmest greeting from iVal</h1>
                <PopList />
                <TopRating />
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
        snapshot.forEach(function (child) {
          var course = child.val();
          course.key = child.key;
          courseArray.push(course); //make into an array
        });    
        this.setState({ courses: courseArray });
        // this.setState({ courses: ["Info 343", "Info 344", "Info 340", "Info 360", "React 101"] });
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
                <a href="#" className="list-group-item active">
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
         <Link to={'class/' + this.props.courseId} className="list-group-item list-group-item-action courseItem" activeClassName="activeLink"><strong>{this.props.courseId.replace("-", " ").toUpperCase()}</strong> <br/>  {this.props.courseName}</Link>
                // <th scope="row"><Link to={'/course/' + this.props.course} activeClassName="activeLink"><button type="button" className="list-group-item">{this.props.course}</button></Link></th>
                // <td><Link to={'/course/' + this.props.course} activeClassName="activeLink"><button type="button" className="list-group-item">{this.props.course}</button></Link></td>
        )
    }
}


class AddContent extends React.Component {
    render() {
        return (
            <div className="container">
                <Link to="/insertProf" activeClassName="activeLink"><button type="button" className="btn btn-primary addButton" >Add A Professor</button></Link>
                <Link to="/insertCors" activeClassName="activeLink"><button type="button" className="btn btn-primary addButton" >Add A Course</button></Link>
            </div>
        );
    }
}

class TopRating extends React.Component {
    render() {
        return (
            <div>
            </div>
        );
    }
}

export class Footer extends React.Component {
    render() {
        return (
            <footer className=" App-footer footer-inverse">
                iVal info343
        </footer>
        );
    }
}


export default Home;

