import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'


$.ajax({
    type: "GET",
    url: "http://127.0.0.1:8080/api/files/books/201912241018294604_bab1.pdf",
    headers: {
        'Authorization': `Bearer ` + getCookie("token"),
    },
    success: function (data) {
        console.log(data)
        
    },
    error:function (err){
        console.log(err)
    }
});