import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'


$.ajax({
    type: "GET",
    url: "http://127.0.0.1:8080/api/files/books/20191227058313511_-_Geospasial_pada_Android.pdf",
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