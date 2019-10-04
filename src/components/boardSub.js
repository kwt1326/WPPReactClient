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
                    <li>{"<< 이전글"}</li>
                    <li>{"다음글 >>"}</li>
                    <li>{"실시간 베스트"}</li>
                </ul>
            </div>
        );
    }
}

export default BoardSub;