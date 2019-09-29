import React, { Component} from 'react';
import {Route, Link} from 'react-router-dom';
import '../css/style.css';

class Intro extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
    }

    render () {
        return (
            <div className="intro" style={{ display : 'table' }}>
                <div className="intro-Msg" style={{ display : 'table-cell', verticalAlign: 'middle', color: 'rgb(255,255,255)' }}>Welcome!<br/>
                This place is Introduce Cafe for Good of Stydy.</div>
            </div>
        );
    }
}

export default Intro;