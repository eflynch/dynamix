var React = require('react');

var GraphLegend = React.createClass({
    displayName: 'GraphLegend',
    handleClickGen: function (i){
        return function (){
            this.props.toggleTrack(i);
        }.bind(this);
    },
    handleClickTextGen: function (i){
        return function (){
            this.props.selectTrack(i);
        }.bind(this);
    },
    render: function (){
        var labels = [];
        for (var i=0; i < this.props.tracks.length; i++){
            var opacity = this.props.tracks[i].enabled ? 1.0 : 0.2;
            labels.push((
                <li key={i} style={{
                        cursor: 'pointer',
                        opacity:opacity,
                        fontWeight: this.props.trackSelected === i ? 900: 500,
                        color: this.props.trackSelected === i ? 'red' : 'white'}}>
                    <span onClick={this.handleClickGen(i)} style={{
                        backgroundColor: this.props.tracks[i].color
                    }}/>
                    <span onClick={this.handleClickTextGen(i)}>
                        {this.props.tracks[i].name}
                    </span>
                </li>
            ));
        }
        return <ul className="graph-legend">{labels}</ul>;
    }
});

module.exports = GraphLegend;
