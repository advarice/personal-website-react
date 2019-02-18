import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css'
import './index.css';
import Navbar from './components/Navbar'
import StockGainLose from './components/StockGainLose'
import Footer from './components/Footer'
//import Test from './components/Test'

ReactDOM.render(<Navbar />, document.getElementById('header'));
ReactDOM.render(<StockGainLose />, document.getElementById('stock'));
ReactDOM.render(<Footer />, document.getElementById('footer'));
//ReactDOM.render(<StockModal />, document.getElementById('aaaa'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
