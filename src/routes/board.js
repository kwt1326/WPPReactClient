import React, { Component} from 'react';
import { Link, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeboardstate } from '../reducer/board';
import axios from 'axios';
import {checklogin, islive, api} from '../custom/custom';
import '../css/style.css';
import '../css/board.css';

import filedef from '../image/file_default.png';

// 자유게시판 (게시글 리스트))
class Board extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
           redirect : 'none',
           page : 1,
           ofs : null,
           row_count : null,
           page_div : null,
           render_rows : null,
           render_rows_mobile : null,
           renderready : false,
        };
        this.load = this.Load.bind(this);
        this.addrow = this.add_row.bind(this);
        this.addpage = this.add_page.bind(this);
        this.addheader = this.add_header.bind(this);
        this.reactsplitR = this.react_splitRight.bind(this);
        this.clickApply = this.onClick_Apply.bind(this);

        this.searchdiv = React.createRef();
        this.props.changeboardstate('All');

        this.load();
    }

    // Posting Data load
    Load () {
        const self = this;
        const page = this.state.page;

        let keyword = "", isSearch = false;
        if(this.props.boardstate !== undefined && this.props.boardstate !== null) {
            if(this.props.boardstate.indexOf('search.') !== -1) {
                keyword = this.props.boardstate.split('search.')[1];
                isSearch = true;
            }
            else
                keyword = this.props.boardstate;
        }

        const process = async () => {
            return await axios({
                method: 'get',
                url: (islive()) ? api + '/api/post/list' : '/api/post/list',
                headers: {
                    'Content-Type': 'application/json',
                },    
                params : {
                    search : keyword,
                    page : page,
                    keyword : (isSearch) ? true : false,
                }
            })
            .then(function (response) {
                return Promise.resolve({ 
                    ofs : response.data.ofs,
                    count : response.data.count,
                    rows : response.data.rows
                });
            })
            .catch ((err) => {
                return Promise.reject(err);
            });
        }
        process()
        .then((res) => {
            if(res.rows.length > 0) {
                self.addrow(res)
                .then(res => {
                    self.addpage(res);
                });
            }
            else {
                self.setState({
                    renderready : true,
                    render_rows : null,
                    render_rows_mobile : null,
                    row_count : 0,
                    ofs : 0,
                    page_div : null
                })
            }
        });
    }

    add_header () {
        if(this.props.screenstate === 'phone') {
            return null;
        }
        else
        return (
            <tr>
                <td style={{ width: '10%' }}>
                    <div className="board-seqofpost" style={{ display: 'table' }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>번호</div>
                    </div>
                </td>
                <td style={{ width: '70%' }}>
                    <div className="board-titleofpost" style={{ display: 'table', width: '100%', textAlign: 'center' }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>제목</div>
                    </div>
                </td>
                <td style={{ width: '10%' }}>
                    <div className="board-viewsofpost" style={{ display: 'table' }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>조회</div>
                    </div>
                </td>
                <td style={{ width: '10%' }}>
                    <div className="board-viewsofpost" style={{ display: 'table' }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>추천</div>
                    </div>
                </td>
            </tr>
        )
    }

    add_row = (res) => 
    {
        const self = this;
        let arr = [];
        let arr_mobile = [];
        let rows = res.rows;
        let length = (res.count > 10) ? 10 : res.count;
        const ofs = res.ofs;

        if(rows.length > 0) {
            async function ArrAsyncProcess() {
                for (var i = 0; i < length; ++i) {
                    if (!rows[i])
                        continue;
                    else {
                        const img = (rows[i].frontimg) ? rows[i].frontimg : filedef;
                        arr.push(
                            <tr key={`post_row_${rows[i].id}`} className="selectorList">
                                <td style={{ width: '10%' }}>
                                    <div className="board-seqofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{(ofs - i)}</div>
                                    </div>
                                </td>
                                <td className="selectorList" style={{ width: '70%' }}>
                                    <Link to={`/board/reading/${String(rows[i].guid)}`} style={{textDecoration : 'none', color : 'white'}}>
                                    <div className="board-titleofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', width : "25%"}}><img src={img} alt="unknown" onError={(e)=>{e.target.onerror = null; e.target.src=filedef}}></img></div> 
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingLeft : "2%", width : "75%" }}>{rows[i].title}</div>
                                    </div>
                                    </Link>
                                </td>
                                <td style={{ width: '10%' }}>
                                    <div className="board-viewsofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{rows[i].views}</div>
                                    </div>
                                </td>
                                <td style={{ width: '10%' }}>
                                    <div className="board-viewsofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{rows[i].hearts}</div>
                                    </div>
                                </td>
                            </tr>
                        );
                        arr_mobile.push(
                            <tr key={`post_row_${rows[i].id}`} className="selectorList">
                                <td style={{ width: '100%' }}>
                                    <Link to={`/board/reading/${String(rows[i].guid)}`} style={{textDecoration : 'none', color : 'white'}}>
                                    <div className="board-titleofpost" style={{ display: 'table', padding : "1%" }}>
                                        <img src={img} style={{ width : "100px", height : "100px"}}  alt="unknown" onError={(e)=>{e.target.onerror = null; e.target.src=filedef}}></img>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingLeft : "2%", width : "70%" }}>{rows[i].title}</div>
                                    </div>
                                    </Link>
                                </td>
                            </tr>
                        );    
                    }
                }
            }

            async function setRows () {
                await ArrAsyncProcess();
                return ({
                    render_rows : arr,
                    render_rows_mobile : arr_mobile,
                    row_count : res.count,
                    ofs : res.ofs
                })
            }
            return setRows();
        }
    }

    add_page (res) {
        const self = this;
        let numpage = parseInt(res.row_count / 10);
        numpage += (res.row_count % 10 > 0) ? 1 : 0;
        const elems = [];
    
        async function create () {
            numpage = (numpage > 10) ? 10 : numpage;
            for(let i = 1 ; i <= numpage ; ++i)
            {
                elems.push(
                    <button key={`btn-page-${String(i)}`} className="selector-deep btn-style" onClick={() => {
                        self.props.history.push(self.props.history.location.pathname + '?page=' + String(i));
                        self.load();
                        }}>
                        {String(i) + " "}
                    </button>
                )
            }        
        }    
    
        async function process() {
            await create();
            self.setState({
                renderready : true,
                render_rows : res.render_rows,
                render_rows_mobile : res.render_rows_mobile,
                row_count : res.row_count,
                ofs : res.ofs,
                page_div : elems
            })
        }
    
        process();
    }

    search_tag = () => {
        if(window.event.keyCode === 13) {
            this.props.changeboardstate('search.' + this.searchdiv.value);
        }
    }

    render_rows = () => {
        if(this.props.screenstate === "phone")
            return this.state.render_rows_mobile
        else
            return this.state.render_rows
    }

    react_splitRight() 
    {
        let rightratio;
        if (this.props.screenstate === 'mobile' ||
            this.props.screenstate === 'phone') { 
            rightratio = '90%';
        }
        else
            rightratio = '69%';

        return (
            <div className="board-tablelist split-right" style={{ width : rightratio }}>
                <div style={{ display: 'table', width: '100%'}}>
                    <div style={{ display: 'table-cell', width: '50%', float: 'left'}}><h3>{this.props.boardstate}</h3></div>
                    <div style={{ display: 'table-cell', width: '50%', float: 'right', textAlign : 'right', verticalAlign: 'middle' }}>
                        <input className="board-search" type='text' ref={(mount) => {this.searchdiv = mount}} placeholder='Search : ' onKeyUp={this.search_tag}/>
                    </div>
                </div>
                <table>
                    <thead>
                        {this.addheader()}
                    </thead>
                    <tbody>
                        {this.render_rows()}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan='5' style={{ textAlign : 'right', paddingRight : '0%'}}>
                                <button className="board-apply btn-style selector-deep" style={{ textAlign : 'center', width : '70px' , height : '50%'}} onClick={this.clickApply}>글쓰기</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div style={{ width: '100%',textAlign : "center" }}>
                    {this.state.page_div}
                </div>
            </div>
        );
    }

    render () {
        if(this.state.redirect !== 'none') {
            return (<Redirect push to={this.state.redirect}/>);
        }
        else
        return (
            <div className="board">
                {this.reactsplitR()}
            </div>
        );
    }

    onClick_Apply () 
    {
        const self = this;
        checklogin()
        .then((res) => {
            if(res.userdata.data.level === 'admin') {
                self.setState({redirect : '/board/write'});
            }
            else {
                alert("관리자만 작성할 수 있습니다.");
            }
        })
        .catch((err) => {
            alert('로그인 페이지로 이동합니다.');
            self.setState({redirect : `/login?from=${"board/write"}`});
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.boardstate !== this.props.boardstate) {
            this.load();
        }
    }
}

const mapStateToProps = state => ({
    screenstate: state.screen.screenstate,
    boardstate: state.board.boardstate,
});

const mapDispatchToProps = dispatch => ({
    changeboardstate: boardstate => dispatch(changeboardstate(boardstate)),
});  

export default connect(mapStateToProps, mapDispatchToProps)(Board);