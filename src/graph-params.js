var React = require('react');

var Slider = require('rc-slider');

var GraphParams = React.createClass({
    displayName: 'GraphParams',
    onChangeSlider: function (v){
        this.props.setThreshold(v);
    },
    getForm: function (){
        var inputs = [];
        for (var i=0; i < this.props.axies.length; i++){

        }
    },
    onChangeMu: function(i, e){
        var v = e.currentTarget.valueAsNumber;
        if (v === undefined || isNaN(v)){
            v = 0.0;
        }
        var hash = {};
        hash[i] = {$set: Math.round(v*1000)/1000};
        this.props.modifyTrack(this.props.trackSelected, {
            mu: hash
        });
    },
    onChangeSig: function(i, e){
        var v = Math.pow(e.currentTarget.valueAsNumber, 2);
        if (v === undefined || isNaN(v)){
            v = 0.0;
        }
        var hash = {}
        hash[i] = {$set: Math.round(v*1000)/1000};
        this.props.modifyTrack(this.props.trackSelected, {
            sig: { 
                eig: hash
            }
        });
    },
    render: function (){
        return (
            <div className="params">
                <div className="params-slider">
                    <span>Threshold</span>
                    <Slider min={0.01} max={1.0} step={0.01} value={this.props.threshold} onChange={this.onChangeSlider}/>
                </div>
                <form>
                    { function(){
                        if (this.props.trackSelected === undefined){
                            return;
                        }
                        return this.props.axies.map(function (axis, i){
                            return (
                                <div key={i}>
                                    <div>{axis.name}</div>
                                    <input type="number" onChange={function (e){this.onChangeMu(i, e);}.bind(this)} value={this.props.tracks[this.props.trackSelected].mu[i]}/>
                                    <input type="number" onChange={function (e){this.onChangeSig(i, e);}.bind(this)} value={Math.sqrt(this.props.tracks[this.props.trackSelected].sig.eig[i])}/>
                                </div>
                            );
                        }.bind(this));
                    }.bind(this)()}
                </form>
            </div>
        );
    }
});

module.exports = GraphParams;
