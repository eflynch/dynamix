var React = require('react');
var ClickDrag = require('react-clickdrag-mixin');

var Distribution = React.createClass({
    displayName: "Distribution",
    mixins: [ClickDrag],
    _onDragStart: function (e, pos){
        if (e.metaKey){this.setState({metaKey: true})};
        this.setState({
            dragCP: this.centerPixel(),
            dragSig: this.props.sig
        });
    },
    _onDragStop: function (e){
        this.setState({metaKey: false});
    },
    _onDragMove: function (e, deltaPos){
        if (!this.props.selected){return;}

        if (this.state.metaKey){
            var newValue = this.props.pixelToValue({px: this.state.dragCP.px + deltaPos.x, py: this.state.dragCP.py + deltaPos.y});
            var oldValue = this.props.pixelToValue({px: this.state.dragCP.px, py: this.state.dragCP.py});
            var sx = Math.max(this.state.dragSig.eig[this.xIdx()] + deltaPos.x / (0.001 + Math.abs(deltaPos.x)) * Math.pow(newValue.x - oldValue.x, 2), 0.001);
            var sy = Math.max(this.state.dragSig.eig[this.yIdx()] + deltaPos.y / (0.001 + Math.abs(deltaPos.y)) * Math.pow(newValue.y - oldValue.y, 2), 0.001);
            var sigHash = {};
            sigHash[this.xIdx()] = {$set: Math.round(sx*1000)/1000};
            sigHash[this.yIdx()] = {$set: Math.round(sy*1000)/1000};
            this.props.modifyTrack({
                sig: {eig: sigHash}
            });
        } else {
            var newValue = this.props.pixelToValue({px: this.state.dragCP.px + deltaPos.x, py: this.state.dragCP.py + deltaPos.y});
            var muHash = {};
            muHash[this.xIdx()] = {$set: Math.round(newValue.x*1000)/1000};
            muHash[this.yIdx()] = {$set: Math.round(newValue.y*1000)/1000};
            this.props.modifyTrack({
                mu: muHash
            });
        }
        
    },
    getInitialState() {
        return {dragCP: undefined, dragSig: undefined, metaKey: false};
    },
    getDefaultProps() {
        return {
            onClick: function (e){return;},
            name: "track.wav",
            mu: [10, 50],
            sig: {
                vec: [
                    [1, 0],
                    [0, 1]
                ],
                eig: [
                    20,
                    30
                ]
            },
            color: "rgba(0,0,127,0.4)"
        };
    },
    evaluate: function (x){
        var acc = 1.0;
        for (var i=0; i < this.props.sig.vec.length; i++){
            var ei = this.props.sig.vec[i];
            var lambdai = this.props.sig.eig[i];
            
            // proj = < x - mu | ei >
            var proj = 0.0
            for (var j=0; j < x.length; x++){
                proj += (x[j] - this.props.mu[j]) * ei[j];
            }

            acc += Math.exp(-0.5 * Math.pow(proj, 2) / lambdai);
        }
        return acc;
    },
    gamma: function (idx1, idx2){
        // gamma(x1, x2) = Sum[ <ei|ex1> * <ei|ex2> * 1/li ]
        var acc = 0.0;
        for (var i=0; i< this.props.sig.vec.length; i++){
            var ei = this.props.sig.vec[i];
            var lambdai = this.props.sig.eig[i];
            acc += ei[idx1] * ei[idx2] * lambdai;
        }
        return acc;
    },
    xIdx: function (){
        return this.props.shownAxies[0];
    },
    yIdx: function (){
        return this.props.shownAxies[1];
    },
    centerPixel: function (){
        return this.props.valueToPixel({
            x: this.props.mu[this.xIdx()],
            y: this.props.mu[this.yIdx()]
        });
    },
    rightPixel: function (){
        // Sum (x - mu)^2 / sig^2 for non-shown axies
        var acc = 0.0;
        for (var i=0; i < this.props.axies.length; i++){
            if (this.props.shownAxies.indexOf(i) < 0){
                acc += Math.pow(this.props.axies[i].value - this.props.mu[i], 2) / this.props.sig.eig[i];
            }
        }
        var a = -2 * Math.log(this.props.threshold) - acc;
        // -2 ln(threshold) = Sum (x - mu)^2/sig^2
        // -2 ln(threshold) - acc = (x1 - mu1)^2/sig1^2 + (x2 - mu2)^2/sig2^2
        // a = ...

        return this.props.valueToPixel({
            x: this.props.mu[this.xIdx()] + Math.sqrt(Math.max(0, this.props.sig.eig[this.xIdx()] * a)),
            y: this.props.mu[this.yIdx()] - Math.sqrt(Math.max(0, this.props.sig.eig[this.yIdx()] * a))
        });
    },
    render: function (){
        if (!this.props.enabled){
            return <g/>;
        }
        var cp = this.centerPixel();
        var rp = this.rightPixel();
        var theta = 0;
        var rx = rp.px - cp.px;
        var ry = rp.py - cp.py;
        return (
            <g transform={"rotate("+theta+")"} onClick={this.props.onClick}>
                <ellipse cx={cp.px} cy={cp.py}
                         rx={rx} ry={ry} 
                         style={{fill:this.props.color, opacity: this.props.selected ? 1.0 : 0.3}}/>
                <ellipse cx={cp.px} cy={cp.py} rx={6} ry={6} style={{fill:'white'}}/>
                <text x={cp.px} y={cp.py - 14} fill="white" textAnchor="middle"
                      alignmentBaseline="central" className="unselectable">{this.props.name}</text>
            </g>
        );
    }
});

module.exports = Distribution;
