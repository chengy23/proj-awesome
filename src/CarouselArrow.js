'use strict';
 
 import React from 'react';
 
 class CarouselArrow extends React.Component{
 
   constructor(props) {
     super(props);
   }
 
   render() {
     var target;
     if (this.props.direction == "left") {
       target = "prev";
     } else {
       target = "next";
     }
     return (
       <a className={this.props.direction + " carousel-control"} href="#myCarousel" role="button" data-slide={target}>
         <span className={ "glyphicon glyphicon-chevron-" + this.props.direction} aria-hidden="true"></span>
         <span className="sr-only">Previous</span>
       </a>
     );
   }
 
 }
 
 export default CarouselArrow; 