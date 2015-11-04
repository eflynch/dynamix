var React = require('react');

var GraphMenuCategory = React.createClass({
    displayName: 'GraphMenuCategory',
    componentDidMount() {
        this.setState({
            open: this.props.defaultOpen
        });
    },
    getInitialState:function (){
        return {
            open: false
        }
    },
    handleClick: function(){
        this.setState({open: !this.state.open});
    },
    render: function (){
        var className = this.state.open ? '' : 'hidden';
        var symbol = this.state.open ? '▾' : '▸';
        return (
            <div clasName='graph-menu-category'>
                <span onClick={this.handleClick} className="graph-menu-category-title">{symbol} {this.props.title} </span>
                <div className={className} {...this.props}>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

module.exports = GraphMenuCategory;
