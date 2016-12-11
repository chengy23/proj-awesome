import React from 'react';
import Arrow from './CarouselArrow.js';

class Carousel extends React.Component {
  render() {
    //put all images into an item
    var generateImages = this.props.data.map(function (image) {
      return (
        <div key={image.id} className={"item " + image.classname}>
          <img src={require(image.src)} alt="diversity class" />
          <div className="carousel-caption">
            <h3>{image.name}</h3>
            <p>{image.description}</p>
          </div>
        </div>
      );
    });

    var generateThumbnail = this.props.data.map(function (image) {
      return (
        <li key={image.id} data-target="#myCarousel" data-slide-to={image.id} className={image.classname}></li>
      );
    });

    return (
      <div id="myCarousel" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner" role="listbox">
          {generateImages}
        </div>
        <Arrow direction={"left"} />
        <Arrow direction={"right"} />
        <ol className="carousel-indicators">
          {generateThumbnail}
        </ol>
      </div>
    );
  }
}

export default Carousel; 