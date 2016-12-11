import React from 'react';
import './css/insertForm.css';
import Carousel from './Carousel.js'

var TeamCarousel = [
  { id: 0, src: "./img/home-carousel/carousel-1.jpg", classname: "active", name: "iVal", description: "A Revoluntionary Course-Based Instructor Evaluation System for UW iSchool" },
  { id: 1, src: "./img/home-carousel/carousel-2.jpg", classname: "", name: "INFO 498D Gender, Equity & Information Technology", description: "In this course, students will challenge and respond to pressing questions about ‘why so few’ women in information technology studies and professions by exploring the relationship between gender and the construction of information technology as a field. The aim of understanding the sociocultural constructs that have shaped the current information technology industry is to provide students with knowledge to challenge limited and stereotypical representations of information technology as a ‘masculine domain’." },
  { id: 2, src: "./img/home-carousel/carousel-3.jpg", classname: "", name: "iDiversity", description: "Diversity is a core value and foundational concept in the Information School. Catalyzing the power of diversity enriches all of us by exposing us to a range of ways to understand and engage with the world, identify challenges, and to discover, define and deliver solutions. The iSchool prepares professionals to work in an increasingly diverse and global society by promoting equity and justice for all individuals. We actively work to eliminate barriers and obstacles created by institutional discrimination." },
  { id: 3, src: "./img/home-carousel/carousel-4.jpg", classname: "", name: "INFO 102 Gender and Information Technology", description: "Explores the social construction of gender in relation to the history and contemporary development of information technologies. Considers the importance of diversity and difference in the design and construction of innovative information technology solutions. Challenges prevailing viewpoints about who can and does work in the information technology field." }
];

class About extends React.Component {
  render() {
    return (
      <div>
        <Carousel data={TeamCarousel} />
        <div className="aboutPara"><h1>iVal</h1>
          <p>iVal is a course-based instructor evaluation platfrom for University of Washington Information School (iSchool).</p>

          <p>This web application allows users to search for classes, rate instructors who have taught that class, and find other people's comments on that instructor. When users search for specific class, he or she will see all the instructors who have taught that class listed. Moreover, unlike other existing professor rating website which displays professor overall rating only, we rate instructors by classes they are teaching. For example, Professor A is teaching both Class 101 and Class 200, he will have two different ratings based on what class users are searching for.</p>

          <p>iVal also provides inserting class/professor features. If you are unable to find a class or instructor that you want to rate, please click on the 'Add a Class'/ 'Add a Professor' button in the header to send us an adding class/professor request form.</p>

          <p>We appreciate and value diverisity. Diversity is a core value and foundational concept in the Information School and also in iVal. We carry and spread our values by featuring diversity-related courses taught in the iSchool, to facilitate and enable social changes through the design and implementation of technology.</p>

          <p>iVal Team</p></div>
      </div>
    );
  }
}

export default About;