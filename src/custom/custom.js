/*
    Custom_lib_For_Personal
    actor : Kimwontae
    프론트 단에서 개인적으로 자주 사용하는 공통된 함수를 여러 군데에서 사용하기 위해 모은 파일.
*/

import axios from 'axios';
import { func } from 'prop-types';

const api = "https://api.aquaclub.club";
const local = "http://localhost:3500";
const categoryStruct = {
    board : [
        "board", "web", "3d"
    ],
    introduce : [
        "introduce"
    ]
}

function islive() {
    return (process.env.NODE_ENV === "production") ? true : false;
}

function checklogin ( originpath , options ) {
    async function process () {
        return await axios({
            method: 'get',
            url: (islive()) ? api + '/api/user' : '/api/user',
            headers: {
                'Content-Type': 'application/json'
            },
            params : {
                redirect : originpath,
                repost : (options) ? options.repost : null
            }
        })
        .then(function (response) {
            return Promise.resolve({
                userdata : response,
                result : true
            });
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }
    return process();
}

function logout () {
    async function process () {
        return await axios({
            method: 'get',
            url: (islive()) ? api + '/api/auth/logout' : '/api/auth/logout',
        })
        .then(function (response) {
            return Promise.resolve({
                nickname : undefined,
                existsession : false
            })
        })
        .catch ((err) => {
            return Promise.reject(err);
        });
    }
    return process();
}

function increase ( id, target_type, num, bComment ) {
    async function process () {
        return await axios({
            method: 'patch',
            url: (bComment) ?
            ((islive()) ? api + '/api/post/comment/increase' : '/api/post/comment/increase') :
            ((islive()) ? api + '/api/post/increase' : '/api/post/increase'),
            headers: {
                'Content-Type': 'application/json'
            },
            params : {
                id : id,
                type : target_type,
                num : num
            }
        })
        .then(function (response) {
            return Promise.resolve({
                result : 'Success increase : ' + target_type + ' ' + num,
            });
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }
    return process();
}

function traveledUserhistory ( check_id, check_type ) {
    async function process () {
        return await axios({
            method: 'get',
            url: (islive()) ? api + '/api/user/history' : '/api/user/history',
            headers: {
                'Content-Type': 'application/json'
            },
            params : {
                id : check_id,
                type : check_type
            }
        })
        .then(function (response) {
            return Promise.resolve({
                result : response.data.result
            });
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }
    return process();
}

function removefile (filename) {
    async function process() {
        return await axios({
            method: 'delete',
            url: (islive()) ? api + '/api/post/files' : '/api/post/files',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                name: filename,
            }
        })
            .then(function (response) {
                return Promise.resolve({
                    result : response.data.response.result
                })
            })
            .catch((err) => {
                alert(err);
                return;
            });  
    }
    return process();
}

function getimgsrc ( imgp, alter ) {
    return (imgp) ? ((islive()) ? api +  "/" + imgp :
                                  local + "/" + imgp) : alter;
}

function str_length ( compare_string ) 
{
    var total = 0;
    const length = compare_string.length;
    for(let i = 0 ; i < length; ++i) {
        if(escape(compare_string.charAt(i)).length > 4) { // escape 가 한글일 때 16진수 => length => 6
            total += 2;
        } else {
            ++total;
        }
    }

    return total;
}

function createguid() {
    function random4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return random4() + random4() + '-' + random4() + '-' + random4() + '-' +
      random4() + '-' + random4() + random4() + random4();
}

export {
    api,
    local,
    islive,
    checklogin,
    logout,
    removefile,
    createguid,
    increase,
    traveledUserhistory,
    str_length,
    getimgsrc,
    categoryStruct,
};