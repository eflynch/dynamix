var React = require('react');

var ChainSensorList = React.createClass({
    getDefaultProps: function (){
        return {
            sensors: [],
            selectSensor: function(){}
        }
    },
    selectSensor: function (e){
        for (var i=0; i < this.props.sensors.length; i++){
            if (this.props.sensors[i].metric === e.target.value){
                this.props.selectSensor(this.props.sensors[i]);
                return;
            }
        }
    },
    getSensorOptions: function (){
        return this.props.sensors.map(function (sensor){
            return <option key={sensor.metric}>{sensor.metric}</option>;
        });
    },
    render: function (){
        return (
            <select onChange={this.selectSensor}>
                {this.getSensorOptions()}
            </select>
        );
    }    
});

module.exports = ChainSensorList
