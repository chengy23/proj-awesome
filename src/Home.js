import React from 'react';
import ReactDOM from 'react-dom';

class Home extends React.Component {

  render() {
    return (
      <div>
        <h1>Warmest greeting from iVal</h1>
        <AddContent />
        <PopList />
        <TopRating />
      </div>
    );
  }
}


class PopList extends React.Component {
  render() {
    return (
      <div>
        <div className="list-group">
          <button type="button" className="list-group-item">INFO 343</button>
          <button type="button" className="list-group-item">INFO 343</button>
          <button type="button" className="list-group-item">INFO 343</button>
          <button type="button" className="list-group-item">INFO 343</button>
          <button type="button" className="list-group-item">INFO 343</button>
          <button type="button" className="list-group-item">INFO 343</button>

        </div>
      </div>
    );
  }
}

class AddContent extends React.Component {
  render() {
    return (
      <div className="container">
      <button type="button" className="btn btn-primary addButton">Add A Professor</button>
      <button type="button" className="btn btn-primary addButton">Add A Course</button>
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
      <footer className="">
      </footer>
    );
  }
}


export default Home;

