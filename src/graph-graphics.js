var React = require('react');
var ClickDrag = require('react-clickdrag-mixin');

var GraphLines = require('./graph-lines');
var GraphLabels = require('./graph-labels');
var Distribution = require('./distribution');

var GraphGraphics = React.createClass({
    displayName: 'GraphGraphics',
    mixins: [ClickDrag],
    _onDragStart: function (e, pos){
        if (e.altKey){
            this.setState({
                altKey: true
            });
        }
        if (e.shiftKey){
            this.setState({
                shiftKey: true
            });
        }

        this.setState({
            dragPos: this.state.scrollPos,
            dragZoomX: this.state.zoomX,
            dragZoomY: this.state.zoomY
        });
    },
    _onDragStop: function (e){
        this.setState({
            shiftKey: false,
            altKey: false
        });
    },
    _onDragMove: function (e, deltaPos){
        if (this.state.altKey){
            this.setState({
                zoomX: Math.min(10.0, Math.max(0.1, this.state.dragZoomX + deltaPos.x / this.props.width)),
                zoomY: Math.min(10.0, Math.max(0.1, this.state.dragZoomY + deltaPos.y / this.props.height))
            });
        } else if (this.state.shiftKey){
            this.setState({scrollPos:{
                px: this.state.dragPos.px + deltaPos.x,
                py: this.state.dragPos.py + deltaPos.y
            }});
        }
        
    },
    getDefaultProps: function(){
        return {
            color: "rgba(256, 256, 256, 0.5)",
            backgroundcolor: "rgba(0,0,0,1.0)"
        }
    },
    getInitialState: function(){
        return {
            zoomX: 0.6,
            zoomY: 0.8,
            altKey: false,
            shiftKey: false,
            dragZoomX: undefined,
            dragZoomY: undefined,
            dragPos: undefined,
            scrollPos: {px: 380, py:80},
            tool: "grab"
        };
    },
    valueToPixel: function (v){
        var px = this.state.scrollPos.px + this.props.width * this.state.zoomX * ((v.x - this.xAxis().min) / (this.xAxis().max - this.xAxis().min));
        var py = this.state.scrollPos.py + this.props.height * this.state.zoomY * (1 - ((v.y - this.yAxis().min) / (this.yAxis().max - this.yAxis().min)));
        return {
            px: px,
            py: py
        };
    },
    pixelToValue: function (p){
        var x = this.xAxis().min + (this.xAxis().max - this.xAxis().min) * ((p.px - this.state.scrollPos.px) / (this.props.width * this.state.zoomX));
        var y = this.yAxis().min - (this.yAxis().max - this.yAxis().min) * ((p.py - this.state.scrollPos.py) / (this.props.height * this.state.zoomY) - 1);
        return {
            x: x,
            y: y
        }
    },
    xAxis: function (){
        return this.props.axies[this.props.shownAxies[0]];
    },
    yAxis: function (){
        return this.props.axies[this.props.shownAxies[1]];
    },
    renderTracks: function (){
        return this.props.tracks.map(function (track, i){
            return (
                <Distribution
                    name={track.name}
                    key={track.name}
                    mu={track.mu}
                    sig={track.sig}
                    color={track.color}
                    valueToPixel={this.valueToPixel}
                    pixelToValue={this.pixelToValue}
                    axies={this.props.axies}
                    shownAxies={this.props.shownAxies}
                    hiddenValues={this.props.hiddenValues}
                    threshold={this.props.threshold}
                    enabled={this.props.tracksEnabled[i]}
                    selected={i === this.props.trackSelected}
                    modifyTrack={function (e) {this.props.modifyTrack(i, e);}.bind(this)}
                    onClick={function () {this.props.selectTrack(i);}.bind(this)}/>
            );
        }.bind(this));
    },
    render: function (){
       return (
            <svg width={this.props.width} height={this.props.height}>
                <g style={{cursor:"grab"}}>
                    <rect width={this.props.width} height={this.props.height} style={{fill:this.props.backgroundcolor}}
                          onClick={function (e){
                            if (!e.altKey && !e.shiftKey && !e.metaKey){
                                this.props.selectTrack(undefined);
                            }
                        }.bind(this)
                    }/>
                    <GraphLines valueToPixel={this.valueToPixel}
                                xAxis={this.xAxis()} yAxis={this.yAxis()}
                                color={this.props.color} />
                    <GraphLabels valueToPixel={this.valueToPixel}
                                 xAxis={this.xAxis()} yAxis={this.yAxis()}
                                 color={this.props.color} />
                    {this.renderTracks()}
                </g>
            </svg>
       ); 
    }
});

module.exports = GraphGraphics;
