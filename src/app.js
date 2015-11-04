var React = require('react');
var update = require('react-addons-update');
var $ = require('jquery');

var Graph = require('./graph');
var lib = require('./lib');

var parseDistribution = lib.parseDistribution;
var parseAxis = lib.parseAxis;
var formatDistribution = lib.formatDistribution;
var formatAxis = lib.formatAxis;

var Header = React.createClass({
    getDefaultProps: function (){
        return {
            height: 40
        };
    },
    render: function (){
        return (
            <div className="header" style={{height:this.props.height}}>
                <h1>Reactive Mix Specification Editor </h1>
            </div>
        );
    }
});


var App = React.createClass({
    displayName: "App",
    getInitialState() {
        return {
            axies: [{name:"x", min:0, max:1, value:0.5}, {name:"y", min:0, max:1, value:0.5}],
            filename: undefined,
            tracks: [],
            trackSelected: undefined,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        };
    },
    getDefaultProps(){
        return {
            headerHeight: 40,
            menuWidth: 300
        }
    },
    handleResize: function(e){
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
    },
    componentDidMount() {
        if (this.props.initFilename){
            this.loadFromFile(this.props.initFilename);
        }
        window.addEventListener('resize', this.handleResize);
    },
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleRezie);
    }, 
    componentDidUpdate(prevProps, prevState) {
        if (this.state.tracks !== prevState.tracks || this.state.axies !== prevState.axies){
            this.writeToFile();
        }  
    },
    loadFromFile: function (filename){
        $.get('data/' + filename, function (data){
            var tracks = [];
            var axies = [];
            var lines = data.split('\n');
            for (var i=0; i < lines.length; i++){
                var l = lines[i];
                if (l[0] === '#'){continue;}
                var pieces = l.split(':::');
                if (pieces[0] === 'AXIS'){
                    axies.push(parseAxis(pieces[1]));
                } else if (pieces[0] === 'TRACK'){
                    tracks.push(parseDistribution(pieces[1]));
                }
            } 

            this.setState({
                filename: filename,
                tracks: tracks,
                axies: axies
            });
        }.bind(this));
    },
    writeToFile: function (){
        var filename = "/Users/eflynch/things/tidmarsh_pieces/bogrock/data/files.txt";
        if (fs === null){return;}
        var str = "";
        for (var i=0; i < this.state.axies.length; i++){
            str += 'AXIS:::' + formatAxis(this.state.axies[i]) + '\n';
        }
        for (var i=0; i < this.state.tracks.length; i++){
            str += 'TRACK:::' + formatDistribution(this.state.tracks[i]) + '\n';
        }
        fs.writeFile(filename, str); 
    },
    toggleTrack: function (i){
        var hash = {};
        hash[i] = {enabled: {$set: !this.state.tracks[i].enabled}};
        this.setState({
            tracks: update(this.state.tracks, hash)
        });
    },
    selectTrack: function (i){
        this.setState({trackSelected: i});
    },
    setAxisValue: function (i, v){
        var hash = {};
        hash[i] = {value: {$set: v}};
        this.setState({
            axies: update(this.state.axies, hash)
        })
    },
    modifyTrack: function (i, e){
        var hash = {};
        hash[i] = e;
        this.setState({
            tracks: update(this.state.tracks, hash)
        });
    },
    render: function (){
        return (
            <div>
                <Header height={this.props.headerHeight}/>
                <Graph axies={this.state.axies}
                       tracks={this.state.tracks}
                       width={Math.max(800, this.state.windowWidth)}
                       height={Math.max(800, this.state.windowHeight)}
                       headerHeight={this.props.headerHeight}
                       menuWidth={this.props.menuWidth}
                       trackSelected={this.state.trackSelected}
                       selectTrack={this.selectTrack}
                       modifyTrack={this.modifyTrack}
                       setAxisValue={this.setAxisValue}
                       toggleTrack={this.toggleTrack}>
                </Graph>
            </div>
        );
        
    }
});

module.exports = App;
