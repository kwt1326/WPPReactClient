import React, { Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';    // EDITOR - react-quill
import DomPurify from 'dompurify'; // HTML XSS Security
import {checklogin, increase, traveledUserhistory, 
        str_length, createguid, api, islive, getimgsrc} from '../custom/custom';
import '../css/style.css';
import '../css/board.css';
import '../css/reading.css';
import '../../node_modules/react-quill/dist/quill.snow.css';

import BoardSub from '../components/boardSub';

// 글쓰기
class Reading extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
           screenstate : 'desktop',     // css react option
           reDirection : 'none',        // reDirection path
           loadingText : 'loading...',  // load noticeview text
           defaultimg : require("../image/unknown.png"),           
           postid : '',       
           content : {},
           images : [],
           loaded : false,
           heart : false,
           heart_loaded : false,
           // comment only
           comments : [],
           comments_ex : [],
           comment_active_inner : 'Comment Write',
           comment_active : false,  // comment editor activity
           comment_text : '',       // comment contents
           comment_total : 0,       // comment text limit
           comment_renders : [],
        };
        this.spliter = this.tr_spliter.bind(this);
        this.spliterV = this.tr_spliter_vertical.bind(this);
        this.reactsplitL = this.react_splitLeft.bind(this);
        this.reactsplitR = this.react_splitRight.bind(this);
        this.onLoad = this.onLoad_Main.bind(this);
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
        this.onLoad();
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
        const self = this;
        const guid = this.getguid();

        const Load = async () => {
            await axios({
                method: 'get',
                url: (islive()) ? api + '/api/post/reading' : '/api/post/reading',
                headers: {
                    'Content-Type': 'application/json'
                },    
                params : {
                    guid : guid,
                }
            })
            .then(res => {
                self.setState({
                    content : {
                        id : res.data.post.id,
                        text: res.data.post.content, 
                        title: res.data.post.title,
                        createAt: res.data.post.createdAt,
                        updateAt: res.data.post.updatedAt,
                        userid: res.data.post.id,
                        category : res.data.post.category,
                        writer : res.data.post_writer,
                        views : res.data.post.views,
                        hearts : res.data.post.hearts,
                    },
                    comments : res.data.comment,
                    comments_ex : res.data.comment_expands,
                    loaded : true,
                    postid : guid
                }, () => { 
                    this.historyheart();
                    this.createComment();
                });
            })
            .catch (err => {
                console.log("Not loaded post : " + err);
                self.setState({ loaded : true }, () => {return;});
            })
        }

        if(guid) {
            Load();
        }
    }

    getheartimg = ( picked ) => {
        return (picked) ? "url('" + require('../image/heartSelected-ico.png') + "')" 
                        : "url('" + require('../image/heart-ico.png') + "')"; 
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
            rightratio = '66%';

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
                                    <div style={{ display : 'table-cell', verticalAlign : 'middle', width : '50%', left : '0%'}}>{self.state.content.writer}</div>
                                    {self.spliterV()}
                                    <div style={{ display : 'table-cell', verticalAlign : 'middle', width : '40%', left : '40%'}}>
                                        {(self.state.content.category === "default") ? "자유게시판" : "태그게시판"}
                                    </div>
                                    {self.spliterV()}
                                    <div className="btn-heart selectorList" ref={(mount) => {this.hearticon = mount}} style={{ 
                                        display : 'table-cell', 
                                        verticalAlign : 'middle', 
                                        textAlign : 'center',
                                        width : '50px', 
                                        backgroundImage : this.getheartimg(this.state.heart),
                                        backgroundColor : 'transparent'
                                    }}
                                        onClick={this.onClick_Heart.bind(this)}></div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ paddingLeft: '0%', paddingRight: '0%'}}>
                                <div classname="content_post">
                                    <div dangerouslySetInnerHTML={{__html: DomPurify.sanitize(self.state.content.text) }}/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ paddingLeft : '0%', paddingRight : '0%' }}>
                                <button className="board-gomain btn-style selector-deep" style={{ float : 'left', textAlign : 'center', width : '70px' , height : '50%'}} onClick={() => {this.props.history.goBack()}}>Back</button>
                                <button className="board-apply btn-style selector-deep"  style={{ float : 'right', width : '70px' , height : '50%'}} onClick={this.onClick_Edit.bind(this)}>Edit</button>
                                <button className="board-apply btn-style selector-deep"  style={{ float : 'right', width : '70px' , height : '50%', marginRight : '2%'}} onClick={this.onClick_Remove.bind(this)}>Remove</button>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ paddingLeft: '0%', paddingRight: '0%' }}>
                                <div classname="content_comment" style={{ minWidth : "360px" }}>
                                    {this.commentactive()}
                                    <button className="comment_active btn-style selector-deep" style={{ float : 'left', width : '40%' , marginTop : '2%'}} onClick={
                                        () => { this.setState({ 
                                            comment_active : !(this.state.comment_active) ,
                                            comment_active_inner : (this.state.comment_active) ? 'Comment Write' : 'Cancel',
                                        }) }}>{this.state.comment_active_inner}</button>
                                    <button className="comment_active btn-style selector-deep" style={{ float : 'right', width : '40%' , marginTop : '2%'}} onClick={this.onClick_rpApply.bind(this)}>Comment Apply</button>
                                </div>
                            </td>
                        </tr>
                        {this.state.comment_renders}
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
            <div className="comment_main"  style={{ backgroundColor : "white", color : "black" }}>
                <div className="comment_limit" style={{ float : 'left',  width : '40%', marginBottom : '2%'}}>글 제한 ({this.state.comment_total}/500)</div>
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

    // For comment function //
    create_Comment ()
    {
        const self = this;

        let arr = [];
        const comments = this.state.comments;
        const comments_ex = this.state.comments_ex;
        arr.push(<tr><td><div style={{ margin : "2%" }}>{"댓글 : " + String((comments) ? comments.length : 0)}</div></td></tr>);

        const heartNumstyle = {display : "table-cell", textAlign : "center", verticalAlign : "middle", width : "50px"};
        const commentctrl = {display:"inline-block", marginLeft:"10px", color : "rgb(180,180,180)"};

        if(comments && comments_ex) 
        {
            async function process () {
                for(let i = 0; i < comments.length ; ++i)
                {
                    let commentheart = { result : false };
                    await self.Load_commentHeart(comments[i].guid, commentheart );
                    let createdAt = comments[i].createdAt.replace("T", " ").split(".")[0];
                    arr.push(
                    <tr>
                        <td>
                            <div style= {{ display : "table" , margin : "1%", width : "98%", position : "relative"}}>
                                <div style={{ display : "table-cell", verticalAlign : "middle",
                                     backgroundImage : 'url(' + getimgsrc(comments_ex[i].profileimg, self.state.defaultimg) + ')' , backgroundSize: "50px", width : "50px", height : "50px"}} />
                                <div style={{ display : "table-cell", verticalAlign : "middle", textAlign : "left", paddingLeft : "2%"}}>
                                    <div>
                                        {comments_ex[i].nickname}
                                        <div className="selector-deep" style={commentctrl} onClick={() => {self.comment_Edit(comments[i].guid)}}>{"수정"}</div>
                                        <div className="selector-deep" style={commentctrl} onClick={() => {self.comment_delete(comments[i].guid)}}>{"삭제"}</div>
                                        </div>
                                    <div style={{ color : "rgb(180,180,180)" }}>{createdAt}</div>
                                </div>
                                <div id={"heart-Btn" + String(comments[i].id)} className="selector-deep" style={{display : "table-cell", textAlign : "right", verticalAlign : "middle",
                                     backgroundImage : self.getheartimg(commentheart.result), backgroundSize: "contain", width : "50px"}} 
                                     onClick={() => {self.onClick_rpHeart(comments[i].guid, comments[i].id)}}/>
                                <div style={heartNumstyle}>{String(comments[i].hearts)}</div>
                            </div>
                            <div dangerouslySetInnerHTML={{__html: DomPurify.sanitize(comments[i].content) }} />
                        </td>
                    </tr>
                    );    
                }
            }
            process().then(res => {
                self.setState({ comment_renders : arr });
            });
        }
    }

    comment_delete = (guid) => {
        const self = this;

        async function process () {
            // comment DB Delete (Delete) 
            await axios({
                method: 'delete',
                url: (islive()) ? api + '/api/post/comment' : '/api/post/comment',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : window.sessionStorage.getItem('token'),    
                },
                params: {
                    guid : guid
                }
            })
            .then(function (response) {    
                alert('댓글이 성공적으로 삭제되었습니다.');
                window.location.reload();
            })
            .catch((err) => {
                alert(err.response.data);
            });   
        }

        process();
    }

    Load_commentHeart = (guid, ref) => {
        async function process () {
            const trace = await traveledUserhistory( guid, 'heart' );
            ref.result = trace.result;
        }
        return process();
    }

    onClick_rpApply() 
    {
        const self = this;
        if(!self.state.postid) {
            return;
        }

        const content = {
            postId : self.state.content.id,
            guid : createguid(),
            text : self.state.comment_text,
        }

        async function process () {
            await axios({
                method: 'post',
                url: (islive()) ? api + '/api/post/comment' : '/api/post/comment',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : window.sessionStorage.getItem('token'),                
                },
                params: { 
                    postId : content.postId,
                    guid : content.guid,
                    content : content.text,
                }
            })
            .then(function (response) {    
                alert("댓글이 성공적으로 등록되었습니다.");
                window.location.reload();
            })
            .catch((err) => {
                alert(err);
            });   
        }

        if(content.guid) {
            process();
        }
    }

    onClick_rpHeart = (comment_guid, comment_id) => 
    {
        const self = this;

        traveledUserhistory( comment_guid, 'heart' )
        .then((res) => {
            if(res.result === false) {
                increaselocal(1);
            }
            else if ( res.result === true ) {
                increaselocal(-1);
            }
        })

        function increaselocal ( num ) {
            const msg = (num > 0) ? "댓글을 추천하셨습니다." : "댓글 추천을 취소하셨습니다.";
            increase(comment_guid, 'heart', num, true)
            .then(res => {
                const heartbtn = document.getElementById("heart-Btn" + String(comment_id));
                if(heartbtn) {
                    heartbtn.style.backgroundImage = self.getheartimg((num > 0) ? true : false);
                    alert(msg);
                    self.props.history.push(self.props.history.location.pathname + '?post=' + String(self.state.postid));
                    self.onLoad();    
                }
            })
            .catch(err => {
                alert(err);
            })
        }
    }

    ///////////////////////

    // For post function //
    onClick_Edit() {
        this.setState({reDirection : '/write' + '?post=' + String(this.state.postid)});
    }

    onClick_Remove() 
    {
        const self = this;
        if(!self.state.postid) {
            return;
        }

        async function process () {
            // post DB Delete (Delete) 
            await axios({
                method: 'delete',
                url: (islive()) ? api + '/api/post' : '/api/post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : window.sessionStorage.getItem('token'),                
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
        const repost = self.getguid();
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