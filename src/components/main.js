import React, { Component} from 'react';
import ThreeComp from './threeCreator';
import '../css/style.css';

class Main extends Component 
{
    constructor (props) {
        super(props);
        this.state = {}
    }

    catchSession = () =>
    {
        if(this.props.location) {
            const search = this.props.location.search;
            if(search !== undefined && search !== null && search !== "")
                window.sessionStorage.setItem('sid', this.props.location.search.split('?sid=')[1]);
        }
    }

    render () {
        return (
            <ThreeComp/>
            // <div className="box">
            //     <div className="box-child">One</div>
            //     <div className="box-child">Two</div>
            //     <div className="box-child">Three</div>
            // </div>
        )
    }

    componentDidMount () {
        this.catchSession();
    }
}

export default Main;