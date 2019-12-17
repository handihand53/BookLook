import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

$(window).load(function () {
    let id;
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/markets",
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        async: false,
        success: function (data) {
            console.log(data.marketId)
            id = data.marketId;
            if (data.marketId != null) {
                $("#loading").css("visibility", "hidden");
                $("#marketName").html(data.marketName)
                if (data.marketPhoto == null)
                    $('#display').attr('src', "../assets/else/signature.png");
                else
                    $('#display').attr('src', data.marketPhoto);
            }
        },
        error: function (errMsg) {
            console.log(errMsg);
            window.location.replace("/404.html")
        }
    });

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://localhost:8080/api/products/market/" + id,
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.length != 0) {
                for (var i = 0; i < data.length; i++) {
                    var html = `
                        <div class="col-3-custom">
                        <div class="content-border shadow-card no-border border-radius-4">
                            <img src="`+data[i].productPhoto+`" alt="" class="width-img">
                            <div class="p-2">
                            <p class="title-book" title="`+data[i].title+`">`+data[i].title+`</p>
                            <p class="author-book">`+data[i].author+`</p>
                            <p class="price-store">Rp. `+data[i].price+`</p>
                            <a href="detail-buku.html?_i=`+data[i].productId+`"><button class="btn-detail">Detail</button></a>
                            </div>
                        </div>
                        </div>
                        `
                    $("#product-content").append(html)
                }
            } else {

            }
        },
        error: function (errMsg) {
            console.log(errMsg);
            // window.location.replace("/404.html")
        }
    });
});

{
    /*  */
}