import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

$(window).load(function () {
    var dataBook = JSON.parse(localStorage.getItem('dataBook'))
    var bookArr= [];
    for (var i = 0; i < dataBook.products.length; i++) {
        $.ajax({
            type: "GET",
            async:false,
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/products/" + dataBook.products[i],
            dataType: 'json',
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                bookArr.push(data)
            },
            error: function (errMsg) {
                  window.location.replace("/404.html");
            }
        });
    }

    var totPrice = 0;

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/users",
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            for (var i = 0; i < bookArr.length; i++) {
                var html = `
                <div class="content-border shadow-card no-border border-radius-4 mb-2">
                                <div class="judul-utama p-2">
                                    <span class="bold">`+bookArr[i].product.title+`</span>
                                    <a href="/market/market-page.html?id=`+bookArr[i].marketId+`"><span class="blue float-right link">`+bookArr[i].marketName+`</span></a>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-4">
                                        <img src="`+bookArr[i].product.productPhoto+`" alt="" class="width-img">
                                    </div>
                                    <div class="col-7 no-padding mobile">
        
                                        <div class="row border-bot">
                                            <div class="col-md-6 sub-list gray">
                                                Author
                                            </div>
                                            <div class="col-md-6 sub-list ">
                                                `+bookArr[i].product.author+`
                                            </div>
                                        </div>
        
                                        <div class="row border-bot">
                                            <div class="col-md-6 sub-list gray">
                                                Penerbit
                                            </div>
                                            <div class="col-md-6 sub-list ">
                                            `+bookArr[i].product.publisher+`
                                            </div>
                                        </div>
        
                                        <div class="row border-bot">
                                            <div class="col-md-6 sub-list gray">
                                                SKU
                                            </div>
                                            <div class="col-md-6 sub-list-sku ">
                                            `+bookArr[i].product.sku+`
                                            </div>
                                        </div>
        
                                        <div class="row border-bot">
                                            <div class="col-md-6 sub-list gray">
                                                ISBN
                                            </div>
                                            <div class="col-md-6 price-list ">
                                                `+bookArr[i].product.isbn+`
                                            </div>
                                        </div>

                                        <div class="row border-bot gray">
                                            <div class="col-md-6 sub-list">
                                                Harga
                                            </div>
                                            <div class="col-md-6 price-list orange">
                                                Rp `+bookArr[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '')+`
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                `;
                totPrice+=bookArr[i].product.price;
                $("#book-confirm").append(html)
            }

            $(".totPrice").html(totPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, ''))
        },
        error: function (errMsg) {
            window.location.replace("/404.html");
        }
    });

    console.log()
    $("#bayar").click(function(){
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/transactions/add",
            dataType: 'json',
            data: JSON.stringify(dataBook),
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                $("#modalBayar").click()

                // window.location.replace("/user/index.html");
                
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    })
})