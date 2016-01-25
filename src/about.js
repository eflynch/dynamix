var React = require('react');

var About = React.createClass({
    displayName: 'About',
    getInitialState() {
        return {
            collapsed: true  
        };
    },
    onClick: function (){
        this.setState({collapsed: !this.state.collapsed});
    },
    render: function (){
        return (
            <div className={this.state.collapsed ? "about-closed" : "about-open"}>
                <span className="table-button" onClick={this.onClick}>{this.state.collapsed ? "?" : "x"}</span>
                <div style={{display: this.state.collapsed ? "none" : "block"}}>
                    <div style={{width: 720, align:'center', margin:'auto'}}>
                        <h1>Dynamix: Reactive Mixing Specification Editor</h1>
                        <p>
                            Dynamix is a tool/thought experiment for mixing together a set of tracks 
                            by performing a zeroth order spatialization in an abstract parameter space.
                            Presented here is a five-dimensional parameter space corresponding to five 
                            metrics that are measured by sensor nodes in a wetland restoration project
                            called <a href='http://tidmarsh.media.mit.edu'>Tidmarsh</a>. Eighteen 
                            instrumental tracks I recorded are listed under "Tracks." Each track is 
                            associated with a region of the parameter space specified by a max-one 
                            axis-aligned multivariate Gaussian distribution. A selected point in the 
                            parameter space specifies a mix of the tracks each weighted by the evaluation 
                            of the associated Gaussians at that point.
                        </p>
                        <p>
                            Select an X and a Y axis in the Axis and Cursor pane to visualize in the graph.
                            The sliders next to each axis move the "cursor" around the space changing the mix.
                        </p>
                        <p>
                            The graph visualizes each Gaussian distribution as an ellipse. The boundary of the 
                            ellipse is an isocontour of the ellipse projected onto the shown axies at the 
                            hyperplane specified by the cursor position of the non-shown axies. The value of the 
                            isocontour is set by the "Threshold" parameter. The position of a selected track in 
                            the parameter space may be adjusted graphically or with the parameters pane.
                        </p>
                        <p>
                            Enable and Disable tracks with the squares in the Tracks pane.
                        </p>
                        <ul>
                            <li>Click and drag to move a Gaussian distribution around</li>
                            <li>CMD-Click and drag to change Gaussian size</li>
                            <li>Shift-Click and drag to move the Graph</li>
                            <li>Opt-Click and drag to zoom the Graph</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = About;
