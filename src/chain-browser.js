var React = require('react');
var $ = require('jquery');
var update = require('react-addons-update');

var ChainDeviceList = require('./chain-device-list');
var ChainSensorList = require('./chain-sensor-list');

var ChainBrowser = React.createClass({
    getInitialState: function (){
        return {
            url: "http://chain-api.media.mit.edu/sites/7",
            data: {},
            websocketURL: null,
            devices: [],
            selectedDevice: null,
            selectedSensor: null
        }
    },
    shouldComponentUpdate: function (nextProps, nextState){
        if (nextState.url !== this.state.url){
            return true;
        }
        if (nextState.selectedDevice !== this.state.selectedDevice){
            return true;
        }
        if (nextState.selectedSensor !== this.state.selectedSensor){
            return true;
        }
        if (nextState.devices !== this.state.devices){
            return true;
        }
        if (this.props !== nextProps){
            return true;
        }
        if (this.state.selectedSensor !== null){
            if (nextState.data.hasOwnProperty(this.state.selectedSensor.href)){
                if (nextState.data[this.state.selectedSensor.href] !== this.state.data[this.state.selectedSensor.href]){
                    return true;
                }
            }
        }
        
        return false;
    },
    changeURL: function (e){
        this.setState({url: e.currentTarget.value});
    },
    load: function (){
        $.getJSON(this.state.url, function (data){
            var summaryURL = data._links['ch:siteSummary'].href;
            var websocketURL = data._links['ch:websocketStream'].href;
            this.setState({websocketURL: websocketURL});
            $.getJSON(summaryURL, function (data){
                this.setState({
                    devices: this.getReasonableDevices(data.devices)
                });
            }.bind(this));

            if (this.websocket !== undefined){
                this.websocket.close();
                this.websocket = undefined;
            }

            this.websocket = new WebSocket(websocketURL);
            this.websocket.onmessage = function (e){
                var eData = JSON.parse(e.data);
                var value = eData.value;
                var href = eData._links['ch:sensor'].href;
                this.setState({
                    data: update(this.state.data, {$merge: {[href]: value}})
                });

                if (this.state.selectedSensor !== null){
                    if (this.state.selectedSensor.href === href){
                        this.onSelectedDeviceUpdate(value);
                    }
                }

                if (this.state.selectedDevice !== null){
                    for (var i=0; i < this.state.selectedDevice.sensors.length; i++){
                        var sensor = this.state.selectedDevice.sensors[i];
                        if (sensor.href === href){
                            this.onSelectedDeviceUpdate(sensor, value);
                        }
                    }
                }
                
            }.bind(this);

        }.bind(this));
    },
    getReasonableDevices: function (devices){
        return devices.filter(function(device){
            if (device.geoLocation === undefined){
                return false;
            }
            if (device.sensors.length === 0){
                return false;
            }
            if (device.sensors[0].data.length === 0){
                return false;
            }
            return true;
        });
    },
    selectDevice: function (device){
        this.setState({selectedDevice: device});
    },
    selectSensor: function (sensor){
        this.setState({selectedSensor: sensor});
    },
    getSelectedSensors: function (){
        if (this.state.selectedDevice === null){
            return [];
        } else {
            return this.state.selectedDevice.sensors;
        }
    },
    getSelectedSensorValue: function (){
        if (this.state.selectedSensor === null){
            return "..."
        }
        if (!this.state.data.hasOwnProperty(this.state.selectedSensor.href)){
            return "..."
        }
        return "" + this.state.data[this.state.selectedSensor.href] + " [" + this.state.selectedSensor.unit +"]";
    },
    onSelectedDeviceUpdate: function (sensor, value){
        this.props.onSelectedDeviceUpdate(this.state.selectedDevice, sensor, value);
    },
    onSelectedSensorUpdate: function (value){
        this.props.onSelectedSensorUpdate(this.state.selectedDevice, this.state.selectedSensor, value);
    },
    render: function (){
        if (this.props.hidden){
            return <div/>;
        }
        return (
            <div className="chainbrowser" style={{position:'absolute', zIndex: 1005, bottom: 0, right: 0}}>
                <h1>Chain Browser</h1>
                <table>
                    <tbody>
                        <tr>
                            <td>Chain URL</td>
                            <td><input type="text" value={this.state.url} onChange={this.changeURL}/></td>
                            <td><button onClick={this.load}>load</button></td>
                        </tr>
                        <tr>
                            <td>Device</td>
                            <td>
                                <ChainDeviceList selectDevice={this.selectDevice} devices={this.state.devices}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Sensors</td>
                            <td>
                                <ChainSensorList selectSensor={this.selectSensor} sensors={this.getSelectedSensors()}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Value</td>
                            <td>{this.getSelectedSensorValue()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});

module.exports = ChainBrowser
