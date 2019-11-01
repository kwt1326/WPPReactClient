/*
    Custom_lib_For_Personal
    actor : Kimwontae
    프론트 단에서 개인적으로 자주 사용하는 공통된 함수를 여러 군데에서 사용하기 위해 모은 파일.
*/

import axios from 'axios';
import { func } from 'prop-types';

const api = "https://api.aquaclub.club";
const local = "http://localhost:3500";

function islive() {
    return (process.env.NODE_ENV === "production") ? true : false;
}

// TOKEN VERIFY
function checklogin ( ) {
    return axios({
        method: 'get',
        url: (islive()) ? api + '/api/user' : '/api/user',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(function (response) {
        return Promise.resolve({
            userdata : response,
            result : true
        });
    })
    .catch((err) => {
        if(err.response.data.expired === true) {
            alert("로그인 유효시간이 만료되었습니다. 다시 로그인 해주세요.");
            window.sessionStorage.removeItem('token');
            window.location.replace(window.location.origin + '/login');
        }
        return Promise.reject(err);
    });
}

function logout () {
    return axios({
        method: 'get',
        url: (islive()) ? api + '/api/auth/logout' : '/api/auth/logout',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(res => {
        window.sessionStorage.removeItem('token');
        return Promise.resolve({result : true});
    })
    .catch(err => {
        return Promise.reject(err);
    })
}

function increase ( id, target_type, num, bComment ) {
    async function process () {
        return await axios({
            method: 'patch',
            url: (bComment) ?
            ((islive()) ? api + '/api/post/comment/increase' : '/api/post/comment/increase') :
            ((islive()) ? api + '/api/post/increase' : '/api/post/increase'),
            headers: {
                'Content-Type': 'application/json',
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
                'Content-Type': 'application/json',
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

function getTags ( ) {
    return axios({
        method: 'get',
        url: (islive()) ? api + '/api/tag' : '/api/tag',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(function (response) {
        return Promise.resolve({
            tags : response.data.tags,
        });
    })
    .catch((err) => {
        return Promise.reject(err);
    });
}

function removefile (filename) {
    return axios({
        method: 'delete',
        url: (islive()) ? api + '/api/post/files' : '/api/post/files',
        headers: {
            'Content-Type': 'application/json',
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
            return Promise.reject(err);
        });  
}

function getimgsrc ( provider, imgp, alter ) {
    if(provider === 'local')
        return (imgp) ? ((islive()) ? imgp : (local + "/" + imgp)) : alter;
    else {
        return imgp;
    }
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

function timeparse( time ) {
    const result = time.replace("T", " ").split(".")[0];   
    return result;
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
    timeparse,
    getimgsrc,
    getTags,
};