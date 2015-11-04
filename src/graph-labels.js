var React = require('react');

var GraphLabels = React.createClass({
    displayName: 'GraphLabels',
    getDefaultProps() {
        return {
            color: "rgba(256,256,256,0.5)",
        };
    },
    renderLabels: function (){
        var p1 = this.props.valueToPixel({x: (this.props.xAxis.max + this.props.xAxis.min)/2, y: this.props.yAxis.min});
        var p2 = this.props.valueToPixel({x: this.props.xAxis.min, y: (this.props.yAxis.min + this.props.yAxis.max)/2});
        return (
            <g>
                <text className="unselectable"
                      x={p1.px} y={p1.py + 60}
                      textAnchor="middle" alignmentBaseline="central"
                      style={{stroke:this.props.color}}>
                      {this.props.xAxis.name}
                </text>
                <g transform={"translate("+(p2.px - 60)+","+p2.py+")"}>
                    <text className="unselectable"
                          x={0} y={0}
                          textAnchor="middle" alignmentBaseline="central"
                          style={{stroke:this.props.color}}
                          transform="rotate(90)">
                          {this.props.yAxis.name}
                    </text>
                </g>
            </g>
        );
    },
    render: function (){
        return (
            <g>
                {this.renderLabels()}
            </g>
        );
    }
});

module.exports = GraphLabels;
