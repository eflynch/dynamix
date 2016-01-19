var React = require('react');

var Table = React.createClass({
    displayName: 'Table',
    getForm: function (){
        var inputs = [];
        for (var i=0; i < this.props.axies.length; i++){

        }
    },
    onChangeMu: function(trackIdx, axisIdx, e){
        var v = e.currentTarget.valueAsNumber;
        if (v === undefined || isNaN(v)){
            v = 0.0;
        }
        var hash = {};
        hash[axisIdx] = {$set: Math.round(v*1000)/1000};
        this.props.modifyTrack(trackIdx, {
            mu: hash
        });
    },
    onChangeSig: function(trackIdx, axisIdx, e){
        var v = Math.pow(e.currentTarget.valueAsNumber, 2);
        if (v === undefined || isNaN(v)){
            v = 0.0;
        }
        var hash = {}
        hash[axisIdx] = {$set: Math.round(v*1000)/1000};
        this.props.modifyTrack(trackIdx, {
            sig: { 
                eig: hash
            }
        });
    },
    render: function (){
        var headers = this.props.axies.map(function (axis, i){
            return [<th>{axis.name} mean</th>, <th>{axis.name} std</th>];
        }.bind(this));

        var rows = this.props.tracks.map(function (track, i){
            var cells =  this.props.axies.map(function (axis, j){           
                return [
                    <td>
                        <input type="number"
                               onChange={function (e){this.onChangeMu(i, j, e);}.bind(this)}
                               value={track.mu[j]}/>
                    </td>, 
                    <td>
                        <input type="number" 
                               onChange={function (e){this.onChangeSig(i, j, e);}.bind(this)}
                               value={Math.sqrt(track.sig.eig[j])}/>
                    </td>
                ];
            }.bind(this));
            return (
                <tr key={track.name}>
                    <td>{track.name}</td>
                    {cells}
                </tr>
            );
        }.bind(this));

        return (
            <div className="table" style={{display: this.props.visible ? "block" : "none"}}>
            <table>
                <thead>
                    <tr>
                        <th>Track</th>
                        {headers}
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
            </div>
        );
    }
});

module.exports = Table;
