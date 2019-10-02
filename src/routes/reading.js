import React, { Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';    // EDITOR - react-quill
import DomPurify from 'dompurify'; // HTML XSS Security
import {checklogin, increase, traveledUserhistory, str_length, createguid, api, islive} from '../custom/custom';
import '../css/style.css';
import '../css/board.css';
import '../css/reading.css';
import '../../node_modules/react-quill/dist/quill.snow.css';

import BoardSub from '../components/boardSub';
import { element } from 'prop-types';

// 글쓰기
class Reading extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
           screenstate : 'desktop',     // css react option
           reDirection : 'none',        // reDirection path
           loadingText : 'loading...',  // load noticeview text
           postid : '',       
           content : {},
           images : [],
           loaded : false,
           heart : false,
           heart_loaded : false,
           // comment only
           comments : [],
           comment_loaded : false,
           comment_active : false,  // comment editor activity
           comment_text : '',       // comment contents
           comment_total : 0        // comment text limit
        };
        this.spliter = this.tr_spliter.bind(this);
        this.spliterV = this.tr_spliter_vertical.bind(this);
        this.reactsplitL = this.react_splitLeft.bind(this);
        this.reactsplitR = this.react_splitRight.bind(this);
        this.onLoad = this.onLoad_Main.bind(this);
        this.onLoadContent = this.onLoad_content.bind(this);
        this.onLoadReple = this.onLoad_reple.bind(this);
        this.historyheart = this.history_heart.bind(this);
        this.getguid = this.get_guid.bind(this);
        this.commentactive = this.comment_active.bind(this);
        this.commenthandleC = this.comment_handleChange.bind(this);
        this.createComment = this.create_Comment.bind(this);

        // Quill ref Object
        this.quillRef = React.createRef();
        // Heart icon dynamic change
        this.hearticon = React.createRef();

        // Post Data load
        if(!this.state.postid) {
            this.state.postid = this.getguid();
        }
    }

    // MAIN RENDER
    render () {
        if(this.state.reDirection !== 'none') {
            if(this.state.reDirection === 'login') {
                alert('로그인 페이지로 이동합니다.');
                return (<Redirect push to={'/login'}/>);
            }
            else {
                return (<Redirect push to={this.state.reDirection}/>);
            }
        }
        else {
            return (
                <div className="readpost">
                    {this.onLoad()}
                    {this.reactsplitL()}
                    {this.reactsplitR()}
                </div>
            );
        }
    }

    tr_spliter () {
        return (
            <tr>
                <td style={{ paddingLeft: '0%', paddingRight: '0%' }}>
                    <div className="board-spliter"></div>
                </td>
            </tr>
        )
    }

    tr_spliter_vertical () {
        return (
            <div className="board-spliter-vertical"></div>
        )
    }

    onLoad_Main () {
        const Load = async () => {
            return await this.onLoadContent()
            .then(res => {
                const reple_contents = async () => { 
                    return await this.onLoadReple(res); 
                } 
                reple_contents()
                .then(res => {})
                .catch(err => {console.log(err)})
                this.historyheart();
            })
            .catch(err => {console.log(err)})
        }
        Load();
    }

    onLoad_content () 
    {
        const self = this;
        if(self.state.loaded === true) 
            return Promise.reject();

        const process = async () => {
            return await axios({
                method: 'get',
                url: (islive()) ? api + '/api/post' : '/api/post',
                params : {
                    guid : self.state.postid,
                }
            })
            .then(function (response) {
                return Promise.resolve({ 
                    query : response.data,
                });
            })
            .catch ((err) => {
                return Promise.reject(err);
            });
        }
        return process().then((res) => {
            return Promise.resolve({
                content : {
                    id : res.query.id,
                    text: res.query.content, 
                    title: res.query.title,
                    createAt: res.query.createdAt,
                    updateAt: res.query.updatedAt,
                    userid: res.query.id,
                    category : res.query.category,
                    writer : res.query.writer,
                    views : res.query.views,
                    hearts : res.query.hearts,
                },
                loaded : true,
            })
        })
        .catch((err) => {
            return new Promise((resolve, reject) => {
                self.setState({
                    loadingText: 'Not Found Post',
                    loaded: true
                }, () => { return reject(err) })
            })
        })
    }

    onLoad_reple ( res ) 
    {
        const self = this;
        if(self.state.comment_loaded === false)
        {
            const process = async () => {
                return await axios({
                    method: 'get',
                    url: (islive()) ? api + '/api/post/comment' : '/api/post/comment',
                    params : {
                        guid : res.content.id,
                    }
                })
                .then(function (response) {
                    return Promise.resolve({ 
                        query : response.data,
                    });
                })
                .catch ((err) => {
                    return new Promise((resolve, reject) => {
                        self.setState({
                            content: res.content,
                            comments : "댓글이 없습니다. 첫 댓글을 작성해주세요!",
                            loaded : res.loaded,
                            comment_loaded: true
                        }, () => { return reject() });
                    })    
                });
            }
            return process().then((response) => {
                return new Promise((resolve, reject) => {
                    self.setState({
                        content: res.content,
                        comments : response.query.data,
                        loaded : res.loaded,
                        comment_loaded: true
                    }, () => { return resolve() });
                })
            })
            .catch((err) => {
                return new Promise((resolve, reject) => {
                    self.setState({
                        loaded : res.loaded,
                        comment_loaded : true
                    }, () => { return reject(err)})
                })
            })    
        }
        else {
            return Promise.reject('Comment Already Loaded');
        }
    }

    react_splitLeft() {
        if (this.state.screenstate === 'desktop') { // desktop - mobile 에서 표시 안함
            return (
                <div className="split-left">
                    <BoardSub/>
                </div>
            );
        }
    }

    react_splitRight() {

        const self = this;
        let rightratio;
        if (self.state.screenstate === 'mobile') { 
            rightratio = '90%';
        }
        else
            rightratio = '60%';

        if(self.state.heart_loaded === false) {
            return (
                <div className="board-main split-right" style={{ width : rightratio }}>
                    <h1>{self.state.loadingText}</h1>
                </div>
            )
        }
        else {
            return (
                <div className="board-main split-right" style={{ width : rightratio }}>
                <table style={{ width : '100%'}}>
                    <colgroup >
                        <col width='100%'/>
                    </colgroup>
                    <tbody>
                        <tr>
                            <td style={{ width : '100%' }}>
                                <div className="board-title">
                                    <div style={{ display : 'table-cell', verticalAlign : 'middle' }}>{self.state.content.title}</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="board-userinfo">
                                    <div style={{ display : 'table-cell', verticalAlign : 'middle', width : '49%', left : '0%'}}>{self.state.content.writer}</div>
                                    {self.spliterV()}
                                    <div style={{ display : 'table-cell', verticalAlign : 'middle', width : '39%', left : '40%'}}>{self.state.content.category}게시판</div>
                                    {self.spliterV()}
                                    <div className="btn-heart selectorList" ref={(mount) => {this.hearticon = mount}} style={{ 
                                        display : 'table-cell', 
                                        verticalAlign : 'middle', 
                                        width : '10%', 
                                        left : '80%', 
                                        backgroundImage : (this.state.heart) ? "url('" + require('../image/heartSelected-ico.png') + "')" : "url('" + require('../image/heart-ico.png') + "')"}} 
                                        onClick={this.onClick_Heart.bind(this)}></div>
                                </div>
                            </td>
                        </tr>
                        {/* {self.spliter()} */}
                        <tr>
                            <td style={{ paddingLeft: '0%', paddingRight: '0%' }}>
                                <div classname="content_post">
                                    <div dangerouslySetInnerHTML={{__html: DomPurify.sanitize(self.state.content.text) }}/>
                                </div>
                            </td>
                        </tr>
                        {/* {self.spliter()} */}
                        <tr>
                            <td style={{ paddingLeft : '0%', paddingRight : '0%' }}>
                                <Link to='/board' style={{ float : 'left' }}><button className="board-gomain btn-style selector-deep" style={{ textAlign : 'center', width : '70px' , height : '50%'}}>Back</button></Link>
                                <button className="board-apply btn-style selector-deep" style={{ float : 'right', width : '70px' , height : '50%'}} onClick={this.onClick_Edit.bind(this)}>Edit</button>
                                <button className="board-apply btn-style selector-deep" style={{ float : 'right', width : '70px' , height : '50%', marginRight : '2%'}} onClick={this.onClick_Remove.bind(this)}>Remove</button>
                            </td>
                        </tr>
                        {/* {self.spliter()} */}
                        <tr>
                            <td style={{ paddingLeft: '0%', paddingRight: '0%' }}>
                                <div classname="content_comment" style={{ minWidth : "360px" }}>
                                    {this.commentactive()}
                                    <div className="comment_active btn-style selector-deep" style={{ float : 'left', width : '40%' , marginTop : '2%'}} onClick={
                                        () => { this.setState({ comment_active : !(this.state.comment_active) }) }}>Comment Write</div>
                                    <div className="comment_active btn-style selector-deep" style={{ float : 'right', width : '40%' , marginTop : '2%'}} onClick={this.onClick_rpApply.bind(this)}>Comment Apply</div>
                                </div>
                            </td>
                        </tr>
                        {this.createComment()}
                    </tbody>
                </table>
            </div>    
            );
        }
    }

    get_guid () {
        const self = this;
        let guid = null;
        if (self.props.location.search) {
            guid = self.props.location.search.split('?post=')[1];
        }
        else {
            guid = self.state.postid;
        }
        return guid;
    }

    comment_active () {
        if(this.state.comment_active === true)
        return (
            <div className="comment_main">
                <div className="comment_limit" style={{ float : 'left',  width : '40%', marginBottom : '2%'}}>글 제한 ({this.state.comment_total}/500)</div>
                <div className="comment_usehide" style={{ float : 'right', width : '40%', marginBottom : '2%', textAlign : 'right'}}>
                    비밀글 : <input id="input_hidepost" type='checkbox' style={{ marginLeft : '10px', transform : 'scale(1.5)' }} />
                </div>
                <ReactQuill 
                theme='snow'
                id='write_editor' 
                value={this.state.comment_text} 
                ref={this.quillRef}
                onChange={this.commenthandleC} 
                placeholder='내용을 입력해주세요! (최대 500자)'
                modules={
                    {
                        toolbar: {
                          container: [
                            ["bold", "italic", "underline", "strike", "blockquote"],
                            [{ size: ["small", false, "large", "huge"] }, { color: [] }],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              { indent: "-1" },
                              { indent: "+1" },
                              { align: [] }
                            ],
                            ["link"],
                            ["clean"]
                          ],
                        },
                        clipboard: { matchVisual: false }
                    }                                       
                }
                style={{
                    height : '100%',
                    width  : '100%'
                }}/>
            </div>
        );
        else
        return null;
    }

    comment_handleChange (content, delta, source, editor) {
        const self = this;
        const limit = 500;
        let checkresult = str_length(editor.getText(content));
        if(checkresult > limit) {
            const quill = self.quillRef.current.editor;
            quill.deleteText(limit, checkresult)
            checkresult = limit;
        }
        this.setState({comment_total : checkresult, comment_text : editor.getHTML(content)});
    }

    history_heart () 
    {
        const self = this;
        traveledUserhistory( self.getguid(), 'heart' )
        .then((res) => {
            if(res.result === true) {
                self.setState({ heart : true, heart_loaded : true });
            }
            else
                throw new Error();
        })
        .catch(err => {
            self.setState({ heart : false, heart_loaded : true})
        })
    }

    // For comment function
    create_Comment ()
    {
        let arr = [];
        const comments = this.state.comments;

        if(comments) {
            for(let i = 0; i < comments.length ; ++i)
            {
                const cmt = comments[i];
                arr.push(
                <tr>
                    <div dangerouslySetInnerHTML={{__html: DomPurify.sanitize(cmt.content) }} />
                </tr>);
            }
            return (arr);
        }
        return null;
    }

    onClick_rpApply() 
    {
        const self = this;
        if(!self.state.postid) {
            return;
        }

        const usehide = document.getElementById("input_hidepost").checked;
        const content = {
            postId : self.state.content.id,
            guid : createguid(),
            text : self.state.comment_text,
            usehide : usehide,
        }

        async function process () {
            const rpApply = await axios({
                method: 'post',
                url: (islive()) ? api + '/api/post/comment' : '/api/post/comment',
                headers: { 'Content-Type': 'application/json' },
                params: { 
                    postId : content.postId,
                    guid : content.guid,
                    content : content.text,
                    useHide : content.usehide,
                }
            })
            .then(function (response) {    
                self.setState({ 
                    reDirection : '/reading' + '?post=' + self.state.postid ,
                });
            })
            .catch((err) => {
                alert(err);
            });   
        }

        if(content.guid) {
            process();
        }
    }

    // For post function
    onClick_Edit() {
        this.setState({reDirection : '/write' + '?post=' + this.state.postid});
    }

    onClick_Remove() 
    {
        const self = this;
        if(!self.state.postid) {
            return;
        }

        async function process () {
            // post DB Delete (Delete) 
            const postdelete = await axios({
                method: 'delete',
                url: (islive()) ? api + '/api/post' : '/api/post',
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    guid : self.state.postid
                }
            })
            .then(function (response) {    
                console.log(response.data.result);
                alert('포스트가 성공적으로 삭제되었습니다.');
                self.setState({ reDirection : '/board' });
            })
            .catch((err) => {
                console.log(err);
                alert(err);
                self.setState({ reDirection : '/board' });
            });   
        }

        process();
    }

    onClick_Heart () 
    {
        const self = this;
        traveledUserhistory( self.getguid(), 'heart' )
        .then((res) => {
            if(res.result === false) {
                increase(self.getguid(), 'heart', 1)
                .then(res => {
                    const heartSelectedimg = require('../image/heartSelected-ico.png');
                    if(heartSelectedimg) {
                        this.hearticon.style.backgroundImage = "url('" + heartSelectedimg + "')";
                        self.setState({ heart : true });
                    }
                });
            }
            else if ( res.result === true ) {
                increase(self.getguid(), 'heart', -1)
                .then(res => {
                    const heartimg = require('../image/heart-ico.png');
                    if(heartimg)
                        this.hearticon.style.backgroundImage = "url('" + heartimg + "')";
                        self.setState({ heart : false });
                });
            }
        })
    }

    resize () {
        if(window.innerWidth <= 720) {
            if(this.state.screenstate !== 'mobile') {
                this.setState({ screenstate : 'mobile' });
            }
        }
        else if(window.innerWidth > 720) {
            if(this.state.screenstate !== 'desktop') {
                this.setState({ screenstate : 'desktop' });
            }
        } 
    }
    
    componentDidMount () 
    {
        const self = this;
        const repost = self.state.postid;
        checklogin( 'reading' , { repost : repost } )
        .then((res) => {
            increase(repost, 'view', 1)
            .then(res => {
                console.log('success increase');
            })
            self.setState({ postid : repost, reDirection : 'none' });
        })
        .catch((err) => {
            self.setState({ postid : repost, reDirection : 'login' });
        })

        window.addEventListener('resize', () => {setTimeout(self.resize.bind(self), 100)});
        self.resize();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
}

export default Reading;