var React = require('react');
var update = require('react-addons-update');

var BufferWrapper = class BufferWrapper{
    constructor(name, buffer, gain){
        this.name = name;
        this.buffer = buffer;
        this.gain = gain;
        this.srcNode = false;
        this.gainNode = false;
    }

    start(ctx){
        var srcNode = ctx.createBufferSource();
        var gainNode = ctx.createGain();
        srcNode.buffer = this.buffer;
        srcNode.loop = true;
        srcNode.connect(gainNode);
        gainNode.connect(ctx.destination);
        gainNode.gain.value = this.gain;
        srcNode.start();
        this.srcNode = srcNode;
        this.gainNode = gainNode;
    }

    stop(ctx){
        if (this.srcNode){
            this.srcNode.stop();
            this.srcNode = false;
            this.gainNode = false;
        }
    }

    setGain(gain){
        this.gain = gain;
        if (this.gainNode){
            this.gainNode.gain.value = gain;
        }
    }
}


var Player = React.createClass({
    displayName: 'Player',
    getInitialState: function (){
        return {
            ctx: false,
            loadedTracks: [],
            failedTracks: [],
            numLoaded: 0
        }
    },
    getDefaultProps() {
        return {
            playing: false,
            prefix: 'assets/',
            suffix: '.mp3',
            tracks: []
        };
    },
    componentWillMount() {
        var ctx;
        ctx = new AudioContext();
        this.setState({ctx: ctx});
    },
    initBuffer: function (track){
        var req = new XMLHttpRequest();
        req.open("GET", this.props.prefix+track.name+this.props.suffix, true);
        req.responseType = "arraybuffer";
        var that = this;
        req.onload = function (e){
            if (this.status == 200){
                that.state.ctx.decodeAudioData(req.response, function(buffer) {
                    this.state.loadedTracks.push(new BufferWrapper(track.name, buffer, track.gain))
                    this.setState({numLoaded: this.state.loadedTracks.length});
                }.bind(that));
            } else {
                that.state.failedTracks.push(track.name);
            }
            
        }
        req.send();
    },
    componentWillReceiveProps(nextProps) {
        for (var j=0; j < nextProps.tracks.length; j++){
            var track = nextProps.tracks[j];
            var foundOne = false;
            for (var i=0; i < this.state.loadedTracks.length; i++){
                if (this.state.loadedTracks[i].name === track.name){
                    foundOne = true;
                    this.state.loadedTracks[i].setGain(track.gain);
                }
            }
            for (var i=0; i < this.state.failedTracks.length; i++){
                if (this.state.failedTracks[i] === track.name){
                    foundOne = true;
                }
            }
            if (!foundOne){
                this.initBuffer(track);
            }
        }
        if (!this.props.playing && nextProps.playing){
            this.startPlaying();
        }
        if (this.props.playing && !nextProps.playing){
            this.stopPlaying();
        }
    },
    startPlaying: function(){
        for (var i=0; i < this.state.loadedTracks.length; i++){
            var track = this.state.loadedTracks[i];
            track.start(this.state.ctx);
        }
    },
    stopPlaying: function(){
        for (var i=0; i < this.state.loadedTracks.length; i++){
            var track = this.state.loadedTracks[i];
            track.stop(this.state.ctx);
        }
    },
    selectedGain: function(){
        for (var i=0; i < this.state.loadedTracks.length; i++){
            var track = this.state.loadedTracks[i];
            if (this.props.tracks.length > this.props.trackSelected){
                if (track.name === this.props.tracks[this.props.trackSelected].name){
                    return track.gain;
                }
            }
        }
        return "none";
    },
    render: function (){
        return <span> ({this.state.numLoaded} / {this.props.tracks.length})</span>;
    }
});

module.exports = Player;
