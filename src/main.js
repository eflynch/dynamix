"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

var App = require('./app');

document.addEventListener("DOMContentLoaded", function (){
    var content = document.getElementById("content");
    ReactDOM.render(
        <App initFilename="bogrock.txt"/>, content);
});
