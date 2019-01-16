import React, { Component } from 'react';
import './App.css';
import Header from './components/main'
import Search from './components/search'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header></Header>
        <Search></Search>
      </div>
    );
  }
}

export default App;
