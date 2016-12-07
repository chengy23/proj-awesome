import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Link } from 'react-router';
import firebase from 'firebase'
import {Item, Caption} from 'react-bootstrap'
import Carousel from './Carousel.js';
import './css/home.css';
var TeamCarousel = [
   {id: 0, src: "http://uwecocar.com/images/home/car.jpg", classname: "active", name:"First", description:"This is first"},
   {id: 1, src: "http://uwecocar.com/images/home/car.jpg", classname: "", name:"Second", description:"This is second"},
   {id: 2, src: "http://uwecocar.com/images/home/car.jpg", classname: "", name:"Third", description:"This is third"},
   {id: 3, src: "http://uwecocar.com/images/home/car.jpg", classname: "", name:"Fourth", description:"This is fourth"}
 ];
class Home extends React.Component {
    render() {
        return (
            <div className="page-container">
                <PopList />
            </div>
        );
    }
}


class PopList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { courses: [], searchValue: '', searchBy: '' };
        this.handleClickSearch = this.handleClickSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    handleChange(event) {
        event.preventDefault();
        // format the display class name
        var searchValue = event.target.value.replace(/\s/g,'').toLowerCase();
        if (searchValue.match(/\d/g)) {
        searchValue = searchValue.replace(/\d/g,'') + "-" + searchValue.match(/\d/g).join("");
        this.setState({ searchValue: searchValue });
        }
    }


    handleClickSearch(event) {
        event.preventDefault();
        return hashHistory.push('class/' + this.state.searchValue);
    }
    render() {
        var courseItems = this.state.courses.map((course) => {
            return <CourseItem courseId={course.course_id}
                courseName={course.course_name}
                key={course.course_id} />
        })
        return (
            <div>
                <div className="intro-header">
                <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="intro-message">
                            <h1>Warmest greeting from iVal</h1>
                            <h3>
                                <form className="input-group">
                                <input type="text" className="form-control" placeholder="Search for a class (e.g. Info 343)" onChange={this.handleChange} />
                                <span className="input-group-btn">
                                    <button className="btn btn-default" type="submit" onClick={this.handleClickSearch} ><span className="glyphicon glyphicon-search"></span></button>
                                </span>
                                </form>
                            </h3>
                            <hr className="intro-divider" />
                            <ul className="list-inline intro-social-buttons">
                                <li>
                                    <a href="https://ischool.uw.edu/" className="btn btn-default btn-lg"><i className="fa fa-info" aria-hidden="true"></i> <span className="network-name">iSchool</span></a>
                                </li>
                                <li>
                                    <a href="https://github.com/chengy23/proj-awesome" className="btn btn-default btn-lg"><i className="fa fa-github fa-fw" aria-hidden="true"></i> <span className="network-name">Github</span></a>
                                </li>
                            </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>        
                <Carousel data={TeamCarousel}/>
                <div className="list-group">
                    <a href="#" className="list-group-item active">
                        Courses
                    </a>
                    {courseItems}
                </div>
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

