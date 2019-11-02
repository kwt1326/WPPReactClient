import React, { Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import ReactQuill from 'react-quill';    // EDITOR - react-quill
import axios from 'axios';
import {checklogin, removefile, createguid, str_length, api, local, islive} from '../custom/custom';
import '../css/style.css';
import '../css/board.css';
import '../../node_modules/react-quill/dist/quill.snow.css';

import BoardSub from '../components/boardSub';

// 글쓰기
class Write extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
           screenstate : 'desktop',
           text : '',
           title : '',
           tags : [],
           images : [],
           level : 'user',
           reRender : false,
           reDirection : 'none',
           text_total : 0,
           edit_postid : '',
           edit_contents : {},
           edit_loaded : false,
           applystate_text : 'Apply', 
           frontimg : null,
        };
        this.spliter = this.tr_spliter.bind(this);
        this.reactsplitL = this.react_splitLeft.bind(this);
        this.reactsplitR = this.react_splitRight.bind(this);
        this.handleChange = this.onChange.bind(this);
        this.clickPost = this.onClick_Post.bind(this);

        // edit function
        this.onLoad = this.onLoad_editpost.bind(this);

        // ref Object
        this.quillRef = React.createRef();
        this.imageselect = React.createRef();
        this.inputtag = React.createRef();
        this.tags = React.createRef();

        // handler for React-Quill
        this.imageHandler = this.RQ_imageHandler.bind(this);

        // if use like to Edit, get param for guid.
        if(!this.state.edit_postid) {
            this.state.edit_postid = this.geteditguid();
            if(this.state.edit_postid) {
                this.onLoad();
            }
        }
    }

    // MAIN RENDER
    render () {
        if(this.state.reDirection !== 'none') {
            return (<Redirect push to={this.state.reDirection}/>);
        }
        else {
            return (
                <div className="board">
                    {this.reactsplitL()}
                    {this.reactsplitR()}
                </div>
            );
        }
    }

    geteditguid () {
        const self = this;
        let guid = null;
        if (self.props.location.search) {
            guid = self.props.location.search.split('?post=')[1];
        }
        return guid; 
    }

    parse_tag (content) {
        return (content !== undefined && content !== null) ? content.split(',') : null;
    }

    onLoad_editpost () 
    {
        const self = this;
        if(self.state.edit_loaded === true) return;

        const process = () => {
            return axios({
                method: 'get',
                url: (islive()) ? api + '/api/post' : '/api/post',
                headers: {
                    'Content-Type': 'application/json',
                },
                params : {
                    guid : self.state.edit_postid,
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
        process().then((res) => {
            self.setState({ edit_contents : {
                title: res.query.title,
                category : res.query.category,
                writer : res.query.writer,
            },
                tags : self.parse_tag(res.query.hashtag),
                text : res.query.content,
                edit_loaded : true,
                applystate_text : 'Edit'
            }, () => {
                self.createtags();
            });
        })
        .catch((err) => {
            self.setState({
                edit_loaded : false
            })
            console.log(err);
        })
    }

    titleSet_Edit () {
        if(this.state.edit_loaded === true && this.state.edit_contents.title) {
            const titleelem = document.getElementById('input_title');
            titleelem.value = this.state.edit_contents.title;
        }
    }

    tr_spliter () {
        return (
            <tr>
                <td colSpan='2' style={{ paddingLeft: '0%', paddingRight: '0%' }}>
                    <div className="board-spliter"></div>
                </td>
            </tr>
        )
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

        let rightratio;
        if (this.state.screenstate === 'mobile') { 
            rightratio = '90%';
        }
        else
            rightratio = '60%';

        return (
            <div className="board-main split-right" style={{ width : rightratio }}>
            <table>
                <tbody>
                    <tr>
                        <td style={{ width : '28%' }}>
                            <div className="board-title">
                                <div style={{ display : 'table-cell', verticalAlign : 'middle' }}>제목 : </div>
                            </div>
                        </td>
                        <td>
                            <input id="input_title" type='text' style={{ width : '95%'}}></input>
                            {this.titleSet_Edit()}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2' style={{ paddingLeft: '0%', paddingRight: '0%' }}>
                            <div className="main-content" style={{ backgroundColor : "white", color : "black" }}>
                                <ReactQuill 
                                    theme='snow'
                                    id='write_editor' 
                                    value={this.state.text} 
                                    ref={this.quillRef}
                                    onChange={this.handleChange} 
                                    placeholder='내용을 입력해주세요! (최대 1000자)'
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
                                                ["link", "image"],
                                                ["clean"]
                                              ],
                                              handlers: { image: this.imageHandler }
                                            },
                                            clipboard: { matchVisual: false }
                                        }                                       
                                    }
                                    style={{
                                        height : '100%',
                                        width  : '100%'
                                    }}/>
                            </div>
                            <div className="text-limit">글 제한 ({this.state.text_total}/1000)</div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style={{ width : "auto" }}>{"대표 이미지 URL : "}</div>
                        </td>
                        <td>
                            <input id="frontimage" type='text' ref={(mount) => {this.imageselect = mount}} style={{ width: '80%' }}>
                            </input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="board-userinfo">
                                <div style={{ display : 'table-cell', verticalAlign : 'middle' }}>태그 : </div>
                            </div>
                        </td>
                        <td>
                            <input id="input_tag" type='text' style={{ width : '95%'}} ref={(mount) => {this.inputtag = mount}} onKeyUp={this.addtag}></input>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2' >
                            <div id="tags" ref={(mount) => {this.tags = mount}} style={{ width: '98%' }}></div>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ textAlign : 'left', paddingLeft : '0%' }}>
                            <button className="board-gomain btn-style selector-deep" style={{ textAlign : 'center', width : '70px' , height : '50%'}} onClick={() => {this.props.history.goBack()}}>Back</button>
                        </td>
                        <td style={{ textAlign : 'right', paddingRight : '0%'}}>
                            <button className="board-apply btn-style selector-deep" style={{ textAlign : 'center', width : '70px' , height : '50%'}} onClick={this.clickPost}>{this.state.applystate_text}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <input id='onimage' type='file' accept='image/*' style={{ visibility : 'hidden'}}></input>
        </div>
        );
    }

    createtags = () => 
    {
        const self = this;
        const arrtags = self.state.tags;

        while(self.tags.firstChild) {
            self.tags.removeChild(self.tags.firstChild);    
        }

        function tag_onclick (obj) {
            arrtags.splice(arrtags.indexOf(obj.value), 1);
            self.createtags();
        }

        function addtags () {
            for(let i = 0 ; i < arrtags.length ; ++i) {
                if(arrtags[i]) {
                    let tag = document.createElement('button');
                    tag.className = "btn-style";
                    tag.value = arrtags[i];
                    tag.innerHTML = arrtags[i];
                    tag.onclick = () => {tag_onclick(tag)};
                    self.tags.appendChild(tag);
                }
            }
        }

        if(arrtags !== null)
            addtags();
    }

    addtag = () => {
        if(window.event.keyCode === 13) {
            const value = this.inputtag.value;
            if(this.state.tags === null) {
                this.state.tags = new Array();
                this.state.tags[0] = value;
            }
            else if(this.state.tags.indexOf(value) !== -1) {
                return;
            }
            else {
                this.state.tags[this.state.tags.length] = String(value);
            }
            this.createtags();
        }
    }

    // React-quill 에서 데이터를 받을 수 있음
    onChange(content, delta, source, editor) {
        const self = this;
        const limit = 1000;
        let checkresult = str_length(editor.getText(content));
        if(checkresult > limit) {
            const quill = self.quillRef.current.editor;
            quill.deleteText(limit, checkresult)
            checkresult = limit;
        }
        this.setState({text_total : checkresult, text : editor.getHTML(content)});
    }

    RQ_imageHandler () 
    {
        const self = this;
        const input = document.getElementById('onimage');
        input.value = ''; // 동일한 이미지 부를시 onChange 발생하지 않음
        input.click();

        input.onchange = () => {

            const quill = self.quillRef.current.editor;
            const file = input.files[0];
            const formData = new FormData();

            // image upload
            formData.append('img', file);
            axios({
                method: 'post',
                url: (islive()) ? api + '/api/post/files/ci' : '/api/post/files/ci',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
            })
            .then(function (response) {
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', response.data.url);            
                self.setState({ images : [...self.state.images, response.data.url]});
            })
            .catch((err) => {
                alert(err);
                return;
            });        
        }
    }

    onClick_Post() 
    {
        const self = this;
        const content = self.state.text;
        const title = document.getElementById('input_title').value;

        if(!title) {
            alert('타이틀을 입력해 주세요.'); return;
        }
        else if(!content) {
            alert('내용을 입력해 주세요.'); return;
        }

        const tags = this.state.tags;
        let tag_inline = "";

        for(let i = 0 ; i < tags.length ; ++i) {
            tag_inline += ((i === tags.length - 1) ? tags[i] : (tags[i] + ","));
        }

        function sendtags ( name ) {
            if(name === undefined || name === null || name === '')
                return;

            // tags DB Send (POST) 
            axios({
                method: 'post',
                url: (islive()) ? api + '/api/tag' : '/api/tag',
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    name: tag_inline //name
                }
            })
            .then(function (response) {})
            .catch(err => { alert(err); })
        }
            
        // If Edit Mode, process patch if not process post
        if(self.state.edit_postid && self.state.edit_loaded === true) 
        {
            // post DB Update (Patch)
            axios({
                method: 'patch',
                url: (islive()) ? api + '/api/post' : '/api/post',
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    title: title,
                    content: content,
                    guid : self.state.edit_postid,
                    frontimg : self.imageselect.value,
                    hashtag : tag_inline,
                }
            })
            .then((response) => {    
                sendtags(tag_inline);
                console.log(response.data.result);
                alert('포스트가 성공적으로 수정(업데이트)되었습니다.');
                self.setState({ reDirection : './board/All' });
            })
            .catch((err) => {
                console.log(err);
                alert(err);
                self.setState({ reDirection : './board/All' });
            });   
        }
        else 
        {
            // post DB Send (POST) 
            axios({
                method: 'post',
                url: (islive()) ? api + '/api/post' : '/api/post',
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    title: title,
                    content: content,
                    guid : createguid(),
                    frontimg : self.imageselect.value,
                    hashtag : tag_inline,
                }
            })
            .then((response) => {    
                sendtags(tag_inline);
                console.log(response.data.result);
                alert('포스트가 성공적으로 등록되었습니다.');
                self.setState({ reDirection : './board/All' });
            })
            .catch((err) => {
                console.log(err);
                alert(err);
                self.setState({ reDirection : './board/All' });
            });   
        }
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

        checklogin()
        .then((res) => {
            if(res.userdata.data.level === 'admin') {
                self.setState({ level : res.userdata.data.level, reDirection : 'none'});
            }
            else {
                alert('관리자만 작성할 수 있습니다.');    
                self.setState({ reDirection : `/board/All` });
            }
        })
        .catch((err) => {
            alert('로그인 페이지로 이동합니다.');
            self.setState({ reDirection : `/login?from=${"write"}` });
        })

        window.addEventListener('resize', () => {setTimeout(self.resize.bind(self), 100)});
        self.resize();
    }
}

export default Write;