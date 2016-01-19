var React = require('react');
var update = require('react-addons-update');

var Player = require('./player');

var PlayButton = React.createClass({
    displayName: 'PlayButton',
    handleClick: function (){
        this.setState({playing: !this.state.playing});
    },
    getInitialState() {
        return {
            playing: false  
        };
    },
    getTracks: function (){
        var tracks = [];
        for (var i=0; i < this.props.tracks.length; i++){
            var track = this.props.tracks[i];
            var gain = 1.0;
            for (var j=0; j < this.props.axies.length; j++){
                var axis = this.props.axies[j];
                var x = axis.value;
                var m = track.mu[j];
                var sig = Math.sqrt(track.sig.eig[j]);
                var exp = Math.exp(-1.0 * (x-m) * (x-m) / (2 * sig * sig));
                gain *= exp;
            }
            tracks.push({
                name: track.name,
                gain: track.enabled ? gain : 0.0
            });
        }
        return tracks;
    },
    render: function (){
        return (
            <div className="playbutton">
                <span style={{cursor:'pointer'}} onClick={this.handleClick}>{this.state.playing ? "◼︎": "►"}</span>
                <Player tracks={this.getTracks()} playing={this.state.playing} trackSelected={this.props.trackSelected} />
            </div>
        );
    }
});

module.exports = PlayButton;
