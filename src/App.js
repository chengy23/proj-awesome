import React, { Component } from 'react';
import './App.css';
import Home, { Footer } from './Home.js';
import { hashHistory, Link } from 'react-router';
import firebase from 'firebase';
import Carousel from './Carousel.js';
import './css/home.css';
var TeamCarousel = [
   {id: 0, src: "https://scontent-sea1-1.xx.fbcdn.net/v/t35.0-12/15398987_751039088381962_190128122_o.jpg?oh=d52708b4503d6e79dd60f0482926ad65&oe=584A6CF2", classname: "active", name:"iDiverity", description:"Diversity is a core value and foundational concept in the Information School. Catalyzing the power of diversity enriches all of us by exposing us to a range of ways to understand and engage with the world, identify challenges, and to discover, define and deliver solutions. The iSchool prepares professionals to work in an increasingly diverse and global society by promoting equity and justice for all individuals. We actively work to eliminate barriers and obstacles created by institutional discrimination."},
   {id: 1, src: "https://www.ius.edu/social-sciences/images/social-sciences-header.jpg", classname: "", name:"INFO 498D Gender, Equity & Information Technology", description:"In this course, students will challenge and respond to pressing questions about ‘why so few’ women in information technology studies and professions by exploring the relationship between gender and the construction of information technology as a field. The aim of understanding the sociocultural constructs that have shaped the current information technology industry is to provide students with knowledge to challenge limited and stereotypical representations of information technology as a ‘masculine domain’."},
   {id: 2, src: "https://www.ius.edu/diversity/images/diversity-header.jpg", classname: "", name:"INFO 102 Gender and Information Technology", description:"Explores the social construction of gender in relation to the history and contemporary development of information technologies. Considers the importance of diversity and difference in the design and construction of innovative information technology solutions. Challenges prevailing viewpoints about who can and does work in the information technology field."},
 ];
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    /* Add a listener and callback for authentication events */
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({userId:user.uid});
        hashHistory.push('/home');
      }
      else{
        this.setState({userId: null}); //null out the saved state
      }
    })
  }
  signOut() {
    /* Sign out the user, and update the state */
    firebase.auth().signOut();
  }

  render() {
    return (
      <div className="App">
        <Search />
        <Carousel data={TeamCarousel}/>
        <main className="container">
          {this.props.children}
        </main>
        <Footer />
      </div>
    );
  }
}


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { searchValue: '', searchBy: '' };
    this.handleClickSearch = this.handleClickSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount(){
    //hook up with the current auth status of firebase
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if(firebaseUser){
        this.setState({userId: firebaseUser.uid});
      }else{
        this.setState({userId: null});
      }
    });
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

  signOut(){
    /* Sign out the user, and update the state */
    firebase.auth().signOut();
  }

  handleClickSearch(event) {
    event.preventDefault();
    console.log("Route to: " + 'class/' + this.state.searchValue);
    return hashHistory.push('class/' + this.state.searchValue);
  }

  render() {
    return (
      <div className="">
        <nav role="navigation" className="navbar navbar-inverse" id="navbar">
          <div className="navbar-header">
            <button aria-label="for mobile use" type="button" data-target="#navbarCollapse" data-toggle="collapse" className="navbar-toggle">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a role="button" href="#" className="navbar-brand">iVal</a>
          </div>
          <div id="navbarCollapse" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li><a role="button" href="#">Home</a></li>
              <li><a href="https://ischool.uw.edu/">The iSchool</a></li>
              <li><Link to="insertClass" >Didn't Find a Class?</Link></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              {!this.state.userId && <li><Link to="/login">Login</Link></li>}
              {this.state.userId &&  /*inline conditional rendering*/
                <li className="logout">
                  <button aria-label="logout" className="btn btn-warning" onClick={()=>this.signOut()}>
                    {/* Show user name on sign out button */}
                    Sign out { firebase.auth().currentUser.displayName }
                  </button>
                </li>
              }
            </ul>
          </div>
          <div className="container">
          </div>
          <div className="row searchBar">
            <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3">
              <form className="input-group">
                <input aria-label="search for class" type="text" className="form-control" placeholder="Search for a class (e.g. Info 343)" onChange={this.handleChange} />
                <span className="input-group-btn">
                  <button aria-label="submit button" className="btn btn-default" type="submit" onClick={this.handleClickSearch} ><span className="glyphicon glyphicon-search"></span></button>
                </span>
              </form>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}
export default App;