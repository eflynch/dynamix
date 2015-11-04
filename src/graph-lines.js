var React = require('react');

var GraphLines = React.createClass({
    displayName: 'GraphLines',
    getDefaultProps() {
        return {
            num_vlines: 10,
            num_hlines: 10,  
        };
    },
    renderVlines: function (){
        var spacing = (this.props.xAxis.max - this.props.xAxis.min) / this.props.num_vlines;
        var vlines = [];
        for (var i=0; i < this.props.num_vlines + 1; i++){
            var p1 = this.props.valueToPixel({x: i * spacing + this.props.xAxis.min, y:this.props.yAxis.min});
            var p2 = this.props.valueToPixel({x: i * spacing + this.props.xAxis.min, y:this.props.yAxis.max});
            vlines.push(<line style={{stroke:this.props.color}}
                              x1={p1.px} y1={p1.py}
                              x2={p2.px} y2={p2.py} 
                              key={i}/>);
            vlines.push(<text className="unselectable"
                              x={p1.px} y={p1.py + 30}
                              style={{stroke:this.props.color}}
                              key={"label-" + i}>{Math.round(i * spacing + this.props.xAxis.min)}</text>);
        }
        return vlines;
    },
    renderHlines: function (){
        var spacing = (this.props.yAxis.max - this.props.yAxis.min) / this.props.num_hlines;
        var hlines = [];
        for (var i=0; i < this.props.num_hlines + 1; i++){
            var p1 = this.props.valueToPixel({y: i * spacing + this.props.yAxis.min, x:this.props.xAxis.min});
            var p2 = this.props.valueToPixel({y: i * spacing + this.props.yAxis.min, x:this.props.xAxis.max});
            hlines.push(<line style={{stroke:this.props.color}}
                              x1={p1.px} y1={p1.py}
                              x2={p2.px} y2={p2.py} 
                              key={i}/>);
            hlines.push(<text className="unselectable"
                              x={p1.px - 30} y={p1.py}
                              style={{stroke:this.props.color}}
                              key={"label-" + i}>{Math.round(i * spacing + this.props.yAxis.min)}</text>);
        }
        return hlines;
    },
    render: function (){
        return (
            <g>
                {this.renderVlines()}
                {this.renderHlines()}
            </g>
        );
    }

});

module.exports = GraphLines;
