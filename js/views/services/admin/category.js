import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js';

$(document).ready(function () {

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/admin/profile",
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {},
        error: function (err) {
            window.location.assign("/admin_login.html");
        }
    });

    
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/categories",
        success: function (data) {
            console.log(data)
            data.forEach(function(entry) {
                var html = `
                <li>`+entry.categoryName+`</li>
                `
                $("#kategoriData").append(html)
            });
        },
        error: function (err) {
            window.location.assign("/admin_login.html");
        }
    });
    $("#dash-category").addClass("li-active")
    $("#dash-category-link").addClass("link-list")
    $("#dash-category-mob").addClass("li-active")
    $("#dash-category-link-mob").addClass("link-list")
})