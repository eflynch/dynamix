var React = require('react');

var ChainDeviceList = React.createClass({
    getDefaultProps: function (){
        return {
            devices: [],
            selectDevice: function(){}
        }
    },
    selectDevice: function (e){
        for (var i=0; i < this.props.devices.length; i++){
            if (this.props.devices[i].name === e.target.value){
                this.props.selectDevice(this.props.devices[i]);
                return;
            }
        }
    },
    getDeviceOptions: function (){
        return this.props.devices.map(function(device){
            return <option key={device.name}>{device.name}</option>;
        });
    },
    render: function (){
        return (
            <select onChange={this.selectDevice}>
                {this.getDeviceOptions()}
            </select>
        );
    }    
});

module.exports = ChainDeviceList
