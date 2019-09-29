import React, { Component} from 'react';
import axios from 'axios';
import '../css/style.css';
import '../css/board.css';

class BoardSub extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
           
        };
    }

    render () {
        return (
            <div className="board-subMenu">
                <div>자유게시판</div>
                <ul>
                    <li>카페게시판</li>
                    <li>카페리스트</li>
                    <li>의견게시판</li>
                </ul>
            </div>
        );
    }
}

export default BoardSub;