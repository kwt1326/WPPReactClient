import React, { Component} from 'react';
import ThreeComp from './threeCreator';
import '../css/style.css';

class Main extends Component 
{
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
        
    }
}

export default Main;