import React, { Component} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';    // EDITOR - react-quill
import DomPurify from 'dompurify'; // HTML XSS Security
import {checklogin, increase, traveledUserhistory, 
        str_length, createguid, api, islive, timeparse} from '../custom/custom';
import '../css/style.css';
import '../css/board.css';
import '../css/reading.css';
import '../../node_modules/react-quill/dist/quill.snow.css';

import BoardSub from '../components/boardSub';

// default image
//import unknown from '../image/unknown.png';
import heartSel from '../image/heartSelected-ico.png';
import heartDef from '../image/heart-ico.png';

// 글쓰기
class Reading extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
           screenstate : 'desktop',     // css react option
           reDirection : 'none',        // reDirection path
           loadingText : 'loading...',  // load noticeview text       
           level : 'user',
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
           comment_active : -1,     // comment editor activity (comment id)
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
        this.commenthandleC = this.comment_handleChange.bind(this);
        this.createComment = this.create_Comment.bind(this);

        // Quill ref Object
        this.quillRef = React.createRef();
        // Heart icon dynamic change
        this.hearticon = React.createRef();

        this.limitrenderer = React.createRef();

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

            let level = 'user';
            let logged = false;

            // get user level
            await checklogin()
                .then((res) => {
                    if (res.userdata.data.level === 'admin') {
                        level = res.userdata.data.level;
                        logged = true;
                    }
                })
                .catch(err=>{
                    console.log(err);
                })

            // get reading post
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
                        writer : res.data.post_writer,
                        views : res.data.post.views,
                        hearts : res.data.post.hearts,
                        hashtag : res.data.post.hashtag,
                    },
                    comments : res.data.comment,
                    comments_ex : res.data.comment_expands,
                    loaded : true,
                    postid : guid,
                    level : level
                }, () => { 
                    this.historyheart();
                    this.createComment();

                    // recent viewed post add for user
                    increase(self.state.postid, 'view', 1, false)
                    .then(res => {
                        console.log("true");
                    })
                    .catch(err => {
                        console.log(err);
                    })
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
        return (picked) ? "url('" + heartSel + "')" 
                        : "url('" + heartDef + "')"; 
    }

    react_splitLeft() {
        if (this.state.screenstate === 'desktop') { // desktop - mobile 에서 표시 안함
            return (
                <div className="split-left">
                    <BoardSub parentWidth={window.innerWidth}/>
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
                <table>
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
                                        <div>{timeparse(self.state.content.createAt)}</div>
                                        <div>{timeparse(self.state.content.updateAt) + " (수정)"}</div>
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
                                    <div className="ql-editor" dangerouslySetInnerHTML={{__html: DomPurify.sanitize(self.state.content.text) }}/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ paddingLeft: '0%', paddingRight: '0%'}}>
                                <div classname="content_tags">
                                    {this.render_tags()}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ paddingLeft : '0%', paddingRight : '0%' }}>
                                <button className="board-gomain btn-style selector-deep" style={{ float : 'left', textAlign : 'center', width : '70px' , height : '50%'}} onClick={() => {this.props.history.goBack()}}>{"Back"}</button>
                                <button className="board-createcomment btn-style selector-deep" style={{ float : 'right', textAlign : 'left', width : '90px' , height : '50%', marginLeft : '2%'}} onClick={() => { 
                                    if(document.getElementById("comment_main"))
                                        return;
                                    if(this.state.comment_active === 'default') 
                                        this.setState({ comment_active : -1 }, () => {self.create_Comment()});
                                    else
                                        this.setState({ comment_active : 'default', comment_text : '', comment_total : 0});
                                    }}>{"Comment"}</button>
                                {this.btn_for_admin()}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ paddingLeft: '0%', paddingRight: '0%' }}>
                                {this.comment_active('default')}
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
        let guid = null;
        if (this.props.location.search) {
            guid = this.props.location.search.split('?post=')[1];
        }
        else {
            guid = this.state.postid;
        }
        return guid;
    }

    render_tags = () => {
        if(this.state.content.hashtag) {
            const tags = this.state.content.hashtag.split(",");
            let rendertag = "";
    
            tags.forEach(element => {
                if(element)
                    rendertag += "#" + element + " "
            });
    
            return (<div>{rendertag}</div>);
        }
    }

    btn_for_admin = () => {
        if(this.state.level === 'admin')
        return (
            <div>
                <button className="board-apply btn-style selector-deep"  style={{ float : 'right', width : '70px' , height : '50%'}} onClick={this.onClick_Edit.bind(this)}>Edit</button>
                <button className="board-apply btn-style selector-deep"  style={{ float : 'right', width : '90px' , height : '50%', marginRight : '2%'}} onClick={this.onClick_Remove.bind(this)}>Remove</button>
            </div>
        );    
        else return null;
    }

    Quill_form_Active = (guid /* comment only */) => {
        return (
            <div classname="content_comment" style={{ minWidth : "360px" }}>
                <div id="comment_main"  style={{ backgroundColor : "white", color : "black" }}>
                    <div className="comment_limit" ref={(mount) => {this.limitrenderer = mount}} style={{ float : 'left',  width : '40%', marginBottom : '2%'}}>글 제한 ({this.state.comment_total}/500)</div>
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
                <button className="comment_active btn-style selector-deep" style={{ float : 'left', width : '40%' , marginTop : '2%'}} onClick={() => {this.setState({ comment_active : -1 }, () => {this.create_Comment()})}}>{'Cancel'}</button>
                <button className="comment_active btn-style selector-deep" style={{ float : 'right', width : '40%' , marginTop : '2%'}} 
                    onClick={() => {
                        if(this.state.comment_active === 'default')
                            this.onClick_rpApply();
                        else {
                            this.onClick_rpModify(guid);
                        }
                    }}>{(this.state.comment_active === 'default') ? "Comment Apply" : "Modify"}
                    </button>                                
            </div>
        );    
    }

    comment_toggle = (id, content, guid) => {
        if(this.state.comment_active === id) {
            return (<div>{this.comment_active(id, guid)}</div>);
        }
        else {
            return (<div className="ql-editor" dangerouslySetInnerHTML={{__html: DomPurify.sanitize(content)}}></div>);
        }
    }

    comment_active = (id, guid) => {
        if(this.state.comment_active === id)
            return (this.Quill_form_Active(guid));
        else
            return null;
    }

    comment_handleChange (content, delta, source, editor) {
        const limit = 500;
        let checkresult = str_length(editor.getText(content));
        if(checkresult > limit) {
            const quill = this.quillRef.current.editor;
            quill.deleteText(limit, checkresult)
            checkresult = limit;
        }
        this.limitrenderer.innerText = "글 제한 (" + String(checkresult) + "/500)";
        this.state.comment_text = editor.getHTML(content);
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
                    let createdAt = timeparse(comments[i].createdAt);
                    arr.push(
                    <tr>
                        <td id={"comment_elem_" + comments[i].id}>
                            <div style= {{ display : "table" , margin : "1%", width : "98%", position : "relative"}}>
                                <div style={{ display : "table-cell", verticalAlign : "middle",
                                     backgroundImage : 'url(' + comments_ex[i].profileimg + ')', backgroundSize: "50px", width : "50px", height : "50px"}} />
                                <div style={{ display : "table-cell", verticalAlign : "middle", textAlign : "left", paddingLeft : "2%"}}>
                                    <div>
                                        {comments_ex[i].nickname}
                                        <div className="selector-deep" style={commentctrl} onClick={() => {
                                            if(document.getElementById("comment_main")) {
                                                return;
                                            }
                                            if(self.state.comment_active === comments[i].id) {
                                                self.setState({ comment_active : -1 }, () => {self.create_Comment()});
                                            }
                                            else
                                                self.setState({ comment_active : comments[i].id, comment_text : comments[i].content, comment_total : 0 }, () => {self.create_Comment()});
                                        }}>{"수정"}</div>
                                        <div className="selector-deep" style={commentctrl} onClick={() => {self.onClick_rpDelete(comments[i].guid)}}>{"삭제"}</div>
                                        </div>
                                    <div style={{ color : "rgb(180,180,180)" }}>{createdAt}</div>
                                </div>
                                <div id={"heart-Btn" + String(comments[i].id)} className="selector-deep" style={{display : "table-cell", textAlign : "right", verticalAlign : "middle",
                                     backgroundImage : self.getheartimg(commentheart.result), backgroundSize: "contain", width : "50px"}} 
                                     onClick={() => {self.onClick_rpHeart(comments[i].guid, comments[i].id)}}/>
                                <div style={heartNumstyle}>{String(comments[i].hearts)}</div>
                            </div>
                            {self.comment_toggle(comments[i].id, comments[i].content, comments[i].guid)}
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

    onClick_rpModify = (guid) => {
        const self = this;

        async function process () {
            // comment DB modify (PATCH) 
            await axios({
                method: 'patch',
                url: (islive()) ? api + '/api/post/comment' : '/api/post/comment',
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    guid : guid,
                    content : self.state.comment_text,
                }
            })
            .then(function (response) {    
                alert('댓글이 성공적으로 수정되었습니다.');
                window.location.reload();
            })
            .catch((err) => {
                alert("계정 혹은 권한이 없습니다.");
            });   
        }

        if(guid)
            process();
        else {
            alert("로그인이 필요합니다.");
            window.location.replace('/login');
        }    
    }

    onClick_rpDelete = (guid) => {
        async function process () {
            // comment DB Delete (Delete) 
            await axios({
                method: 'delete',
                url: (islive()) ? api + '/api/post/comment' : '/api/post/comment',
                headers: {
                    'Content-Type': 'application/json',
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
                alert("계정 혹은 권한이 없습니다.");
            });   
        }

        if(guid)
            process();
        else {
            alert("로그인이 필요합니다.");
            window.location.replace('/login');
        }    
    }

    Load_commentHeart = (guid, ref) => {
        async function process () {
            await traveledUserhistory( guid, 'heart' )
            .then(res => {
                ref.result = (res.result !== undefined || res.result !== null) ? res.result : false;
            })
            .catch(err => {
                ref.result = false;
            })
        }
        return process();
    }

    onClick_rpApply = () =>
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
                alert("계정 혹은 권한이 없습니다.");
            });   
        }

        if(content.guid) {
            process();
        }
        else {
            alert("로그인이 필요합니다.");
            window.location.replace('/login');
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
        .catch(err => {
            alert("로그인이 필요합니다.");
            window.location.replace('/login');
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
                alert("로그인이 필요합니다.");
                window.location.replace('/login');
            })
        }
    }

    ///////////////////////

    // For post function //
    onClick_Edit() {
        this.setState({reDirection : `/write?post=${String(this.state.postid)}`});
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
                },
                params: {
                    guid : self.state.postid
                }
            })
            .then(function (response) {    
                console.log(response.data.result);
                alert('포스트가 성공적으로 삭제되었습니다.');
                self.setState({ reDirection : '/board/All' });
            })
            .catch((err) => {
                console.log(err);
                alert("삭제권한이 없습니다.");
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
                increase(self.getguid(), 'heart', 1, false)
                .then(res => {
                    const heartSelectedimg = heartSel;
                    if(heartSelectedimg) {
                        this.hearticon.style.backgroundImage = "url('" + heartSelectedimg + "')";
                        alert("포스트가 추천되었습니다.");
                        self.setState({ heart : true });
                    }
                });
            }
            else if ( res.result === true ) {
                increase(self.getguid(), 'heart', -1, false)
                .then(res => {
                    const heartimg = heartDef;
                    if(heartimg)
                        this.hearticon.style.backgroundImage = "url('" + heartimg + "')";
                        alert("포스트의 추천이 취소되었습니다.");
                        self.setState({ heart : false });
                });
            }
        })
        .catch(err => {
            alert("로그인이 필요합니다.");
            window.location.replace('/login');
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
        window.addEventListener('resize', () => {setTimeout(this.resize.bind(this), 100)});
        this.resize();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
}

export default Reading;