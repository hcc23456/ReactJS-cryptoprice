import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import App from './App';
import './index.css';

ReactDOM.render( //only renders 1 component at a time bound to a root, unless wrapped to a div or using React.Fragment
  <Header />,
  document.getElementById('header')
);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
