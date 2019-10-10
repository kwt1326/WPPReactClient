import React, { Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import ReactQuill from 'react-quill';    // EDITOR - react-quill
import axios from 'axios';
import {checklogin, removefile, createguid, str_length, api, local, islive} from '../custom/custom';
import '../css/style.css';
import '../css/board.css';
import '../../node_modules/react-quill/dist/quill.snow.css';

import BoardSub from '../components/boardSub';
import { element } from 'prop-types';

// 글쓰기
class Write extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
           screenstate : 'desktop',
           text : '',
           title : '',
           images : [],
           reRender : false,
           reDirection : 'none',
           text_total : 0,
           edit_postid : '',
           edit_contents : {},
           edit_loaded : false,
           applystate_text : 'Apply', 
        };
        this.spliter = this.tr_spliter.bind(this);
        this.reactsplitL = this.react_splitLeft.bind(this);
        this.reactsplitR = this.react_splitRight.bind(this);
        this.handleChange = this.onChange.bind(this);
        this.clickPost = this.onClick_Post.bind(this);

        // edit function
        this.onLoad = this.onLoad_editpost.bind(this);
        this.categorySelect = this.categorySelect_edit.bind(this);

        // Quill ref Object
        this.quillRef = React.createRef();

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
            if(this.state.reDirection === './login') {
                alert('로그인 페이지로 이동합니다.');
                return (<Redirect push to={'./login'}/>);
            }
            else {
                return (<Redirect push to={this.state.reDirection}/>);
            }
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

    onLoad_editpost () 
    {
        const self = this;
        if(self.state.edit_loaded === true) return;

        const process = async () => {
            return await axios({
                method: 'get',
                url: (islive()) ? api + '/api/post' : '/api/post',
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
                text : res.query.content,
                edit_loaded : true,
                applystate_text : 'Edit'
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

    categorySelect_edit () {
        if(this.state.edit_loaded === true && this.state.edit_contents.category) {
            const selectdiv = document.getElementById('select_category');
            for(let i = 0 ; i < selectdiv.options.length; ++i) {
                if(selectdiv.options[i].text === this.state.edit_contents.category) {
                    selectdiv.selectedIndex = i;
                }
            }
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
                        <td>
                            <div className="board-userinfo">
                                <div style={{ display : 'table-cell', verticalAlign : 'middle' }}>분류 : </div>
                            </div>
                        </td>
                        <td>
                            <select id="select_category" style={{ width: '98%' }}>
                                <option value="오픈">오픈</option>
                                <option value="질문">질문</option>
                                <option value="기타">기타</option>
                            </select>
                            {this.categorySelect()}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="board-userinfo">
                                <div style={{ display : 'table-cell', verticalAlign : 'middle' }}>비밀글 : <input id="input_hidepost" type='checkbox' style={{ marginLeft : '10px', transform : 'scale(1.5)' }}></input></div>
                            </div>
                        </td>
                        <td>
                            <div className="board-userinfo">
                                <div style={{ display : 'table-cell', verticalAlign : 'middle' }}>패스워드 : </div><input id="input_password" type='password' style={{ width : '95%'}}/>
                            </div>
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
                        <td style={{ textAlign : 'left', paddingLeft : '0%' }}>
                            <Link to='./board'><button className="board-gomain btn-style selector-deep" style={{ textAlign : 'center', width : '70px' , height : '50%'}}>Back</button></Link>
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

        input.onchange = async () => {

            const quill = self.quillRef.current.editor;
            const file = input.files[0];
            const formData = new FormData();
            formData.append('img', file);

            // image upload
            axios({
                method: 'post',
                url: (islive()) ? api + '/api/post/files' : '/api/post/files',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData,
            })
            .then(function (response) {
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', local + "/" + response.data.url);            
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
        const category = document.getElementById('select_category').value;
        const password = document.getElementById('input_password').value;
        const usehide = document.getElementById('input_hidepost').checked;

        if(!title) {
            alert('타이틀을 입력해 주세요.'); return;
        }
        else if(!content) {
            alert('내용을 입력해 주세요.'); return;
        }
        else if(!category) {
            category = 'default';
        }
        else if(usehide) {
            if(!password) {
                alert('비밀글인 경우, 비밀번호를 입력해 주세요.'); 
                return;
            }
        }

        // img src 모두 추출
        const pattern = /<img src="(\/?)(\w+)([^>]*)">/;
        let matchArray = [];
        let buffer = self.state.text;
        let bufferarray = buffer.match(pattern);
        while(bufferarray !== null) {
            matchArray.push(bufferarray[0]);
            buffer = buffer.split(bufferarray[0])[1];
            bufferarray = buffer.match(pattern);
        }

        async function process () {
            self.state.images.forEach((element) => {
                let targetarr = element.split('.');
                let finded = false;
                for(let i = 0 ; i < matchArray.length ; ++i) {
                    const idx = matchArray[i].indexOf(targetarr[0]);
                    const idx2 = matchArray[i].indexOf(targetarr[1] + '">'); 
                    // extension + 괄호 (중간에 확장자 검색 방지, 끝부분만 검사)
                    if((idx !== -1) && (idx2 !== -1)) {
                        finded = true;
                    }
                }
    
                if (finded === false) {
                    removefile(element);
                }
            })
    
            // If Edit Mode, process patch if not process post
            if(self.state.edit_postid && self.state.edit_loaded === true) 
            {
                // post DB Update (Patch)
                const updatepost = await axios({
                    method: 'patch',
                    url: (islive()) ? api + '/api/post' : '/api/post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: {
                        title: title,
                        content: content,
                        category : category,
                        password: password,
                        usehide: usehide,
                        guid : self.state.edit_postid
                    }
                })
                .then(function (response) {    
                    console.log(response.data.result);
                    alert('포스트가 성공적으로 수정(업데이트)되었습니다.');
                    self.setState({ reDirection : './board' });
                })
                .catch((err) => {
                    console.log(err);
                    alert(err);
                    self.setState({ reDirection : './board' });
                });   
            }
            else 
            {
                // post DB Send (POST) 
                const sendpost = await axios({
                    method: 'post',
                    url: (islive()) ? api + '/api/post' : '/api/post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: {
                        title: title,
                        content: content,
                        category : category,
                        password: password,
                        usehide: usehide,
                        guid : createguid()
                    }
                })
                .then(function (response) {    
                    console.log(response.data.result);
                    alert('포스트가 성공적으로 등록되었습니다.');
                    self.setState({ reDirection : './board' });
                })
                .catch((err) => {
                    console.log(err);
                    alert(err);
                    self.setState({ reDirection : './board' });
                });   
            }
        }

        process();
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

        checklogin( './write' )
        .then((res) => {
            self.setState({reDirection : 'none'});
        })
        .catch((err) => {
            self.setState({ reDirection : './login' });
        })

        window.addEventListener('resize', () => {setTimeout(self.resize.bind(self), 100)});
        self.resize();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
}

export default Write;