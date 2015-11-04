var React = require('react');

var Slider = require('rc-slider');

var Axis = React.createClass({
    displayName: 'Axis',
    onChangeSlider: function (v){
        this.props.onChange({
            x: this.props.x,
            y: this.props.y,
            v: v
        });
    },
    onChangeX: function (e){
        this.props.onChange({
            x: true,
            y: this.props.y,
            v: this.props.value
        });
    },
    onChangeY: function (e){
        this.props.onChange({
            x: this.props.x,
            y: true,
            v: this.props.value
        });
    },
    render: function (){
        return (
            <div className="axis">
                <div className="axis-boxes">
                    <div className="roundedOne">
                        <input className="roundedOne" type="checkbox" checked={this.props.x} onChange={this.onChangeX}/>
                        <label className="roundedOne" onClick={this.onChangeX}/>
                    </div>
                    <div className="roundedOne">
                        <input className="roundedOne" type="checkbox" checked={this.props.y} onChange={this.onChangeY}/>
                        <label className="roundedOne" onClick={this.onChangeY}/>
                    </div>
                </div>
                <div className="axis-slider">
                    <span>{this.props.name} </span>
                    <Slider min={this.props.min}
                            max={this.props.max}
                            step={(this.props.max - this.props.min)/100}
                            value={this.props.value}
                            onChange={this.onChangeSlider}/>
                </div>
            </div>
        );
    }
});

var GraphAxies = React.createClass({
    displayName: 'GraphAxies',
    onChangeGen: function (i){
        return function (e){
            this.props.setAxisValues(i, e);
        }.bind(this);
    },
    render: function (){
        var axies = [];
        for (var i=0; i < this.props.axies.length; i++){
            axies.push(
                <Axis key={i} name={this.props.axies[i].name}
                             min={this.props.axies[i].min}
                             max={this.props.axies[i].max}
                             value={this.props.axies[i].value}
                             x={i === this.props.shownAxies[0]}
                             y={i === this.props.shownAxies[1]}
                             onChange={this.onChangeGen(i)}/>
            );
        }
        return (
            <div>
                <div className="axies-header"><span>x</span><span>y</span></div>
                {axies}
            </div>
        );
    }
});

module.exports = GraphAxies;
