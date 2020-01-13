import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js';

$(document).ready(function () {
    var catName = new Array();

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



    getData()
    var size = 0;

    function getData() {
        $("#kategoriData").html("")
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:8080/api/categories",
            async: false,
            success: function (data) {
                catName = data
            },
            error: function (err) {
                window.location.assign("/admin_login.html");
            }
        });
        var i = 0;
        catName.forEach(arr => {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                async: false,
                url: "http://127.0.0.1:8080/api/products/category/" + arr.categoryName,
                success: function (data) {
                    var html = `
                        <div class="card">
                            <div class="card-body">
                                <span class="no mr-2">` + (i + 1) + `</span>
                                <span>` + arr.categoryName + `</span>
                                <span class="jml">` + data.length + ` Buku</span>
                            </div>
                        </div>
                        `
                    $("#kategoriData").append(html)
                }
            });
            i++;
        })
    }

    $("#add").click(function () {
        if ($("#catName").val() == "") {
            $("#err").html("Silahkan isi nama kategori")
            $("#err").addClass("show")
            return
        }

        var data = {
            "categoryName": $("#catName").val()
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            async: false,
            data: JSON.stringify(data),
            url: "http://127.0.0.1:8080/api/categories/create",
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                getData()
                $("#catName").val("")
                $("#clk").click()
            }
        });
    })

    $("#dash-category").addClass("li-active")
    $("#dash-category-link").addClass("link-list")
    $("#dash-category-mob").addClass("li-active")
    $("#dash-category-link-mob").addClass("link-list")
})