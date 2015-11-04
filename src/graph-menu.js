var React = require('react');

var GraphMenu = React.createClass({
    displayName: 'GraphMenu',
    render: function (){
        return (
            <div className="graph-menu unselectable" style={{position:"absolute", width:this.props.width, height:this.props.height, top:this.props.headerHeight}}>
                {this.props.children}
            </div>
        );
    }
});

module.exports = GraphMenu;
