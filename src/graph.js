var React = require('react');
var ClickDrag = require('react-clickdrag-mixin');


var GraphMenu = require('./graph-menu');
var GraphMenuCategory = require('./graph-menu-category');
var GraphLegend = require('./graph-legend');
var GraphParams = require('./graph-params');
var GraphAxies = require('./graph-axies');
var GraphGraphics = require('./graph-graphics');

var Graph = React.createClass({
    displayName: 'Graph',
    getInitialState(){
        return {
            shownAxies: [0, 1],
            hiddenValues: [],
            threshold: 0.7
        }
    },
    getDefaultProps() {
        return {
            width: 700,
            height: 700,
            axies: []
        };
    },
    getLegend: function (){
        return this.props.tracks.map(function (child, i){
            return {
                name: child.props.name,
                color: child.props.color,
                selected: i === this.props.trackSelected
            }
        }.bind(this));
    },
    setAxisValues: function (i, e){
        var shownAxies = this.state.shownAxies;
        var hiddenValues = this.state.hiddenValues;
        if (e.x){
            shownAxies[0] = i;
        }
        if (e.y){
            shownAxies[1] = i;
        }
        hiddenValues[i] = e.v;
        this.setState({
            shownAxies: shownAxies,
            hiddenValues: hiddenValues
        });
    },
    setThreshold: function (v){
        this.setState({threshold: v});
    },
    render: function (){
        return (
            <div className="graph">
                <GraphMenu headerHeight={this.props.headerHeight} width={this.props.menuWidth} height={this.props.height - this.props.headerHeight}>
                    <GraphMenuCategory title="Axies" defaultOpen={true}>
                        <GraphAxies axies={this.props.axies}
                                    shownAxies={this.state.shownAxies}
                                    hiddenValues={this.state.hiddenValues}
                                    setAxisValues={this.setAxisValues}/>
                    </GraphMenuCategory>
                    <GraphMenuCategory title="Legend" defaultOpen={true}>
                        <GraphLegend tracksEnabled={this.props.tracksEnabled} 
                                     trackSelected={this.props.trackSelected}
                                     tracks={this.props.tracks}
                                     toggleTrack={this.props.toggleTrack}
                                     selectTrack={this.props.selectTrack}/>
                    </GraphMenuCategory>
                    <GraphMenuCategory title="Parameters" defaultOpen={true}>
                        <GraphParams threshold={this.state.threshold} 
                                     setThreshold={this.setThreshold}
                                     axies={this.props.axies}
                                     trackSelected={this.props.trackSelected}
                                     tracks={this.props.tracks}
                                     modifyTrack={this.props.modifyTrack}/>
                    </GraphMenuCategory>
                </GraphMenu>
                <GraphGraphics width={this.props.width}
                               height={this.props.height}
                               axies={this.props.axies}
                               tracks={this.props.tracks}
                               num_vlines={10}
                               num_hlines={10}
                               shownAxies={this.state.shownAxies}
                               tracksEnabled={this.props.tracksEnabled}
                               trackSelected={this.props.trackSelected}
                               selectTrack={this.props.selectTrack}
                               modifyTrack={this.props.modifyTrack}
                               hiddenValues={this.state.hiddenValues}
                               threshold={this.state.threshold}>
                </GraphGraphics>
            </div>
        );
    }
});

module.exports = Graph;
