import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

import checkMarket from '../../../marketCheck.js';


$(window).load(function () {
    getDataUser();
    checkMarket();
    function getDataUser() {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/users",
            dataType: 'json',
            timeout: 600000,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                if (data.userPhoto == null)
                    $('#img').attr('src', "../assets/else/signature.png");
                else
                    $('#img').attr('src', data.userPhoto);
                $("#loading").removeClass("loading");
                $("#nama-pengguna").val(data.username)
                $("#displayName").html(data.name);
                $("#nama-lengkap").val(data.name);
                $("#email-prof").val(data.email)
                $("#nomor-prof").val(data.numberPhone)
            },
            error: function (errMsg) {
                window.location.replace("/404.html")
            }
        });
    }

    var urlString = window.location.href;
    var urlParams = parseURLParams(urlString);

    function parseURLParams(url) {
        var queryStart = url.indexOf("?") + 1,
            queryEnd = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {},
            i, n, v, nv;

        if (query === url || query === "") return;

        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);

            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }

    var month = new Array();
    month[0] = "Januari";
    month[1] = "Februari";
    month[2] = "Maret";
    month[3] = "April";
    month[4] = "Mei";
    month[5] = "Juni";
    month[6] = "Juli";
    month[7] = "Agustus";
    month[8] = "September";
    month[9] = "Oktober";
    month[10] = "November";
    month[11] = "Desember";

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/transactions/user/show/"+urlParams._i,
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            var d = new Date(data.transaction.createdAt);
            var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
            $("#noDetailTransaksi").html(data.transaction.transactionId)
            $("#tglTransaksi").html(tgl)
            $("#statusPembayaran").html(data.transaction.transferConfirm)
            var color
            if(data.transaction.transferConfirm=="SUCCESS")  color ="pembayaran-success";
                else color = "pembayaran-unsuccess"
                $("#statusPembayaran").addClass(color)
            $("#totalTransaksi").html(data.transaction.checkout.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, ''))
            for(var i=0;i<data.transactionDetail.length;i++){
                var html=`
                <div class="row border-bottom-gray">
              <div class="col-3-custom">
                <div class="content-border shadow-card no-border border-radius-4">
                  <img src="../assets/img/sample 17.jpg" alt="" class="width-img">
                </div>
              </div>

              <div class="col-9-custom">
                <p class="title-book">Piece Of Pie</p>
                <p class="author-book">Laura Palmer</p>
                <p class="publish-book">Terbit : 27 Agustus 2005</p>
                <p class="deskripsi">Deskripsi</p>
                <p class="deskripsi-content mb-4">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perspiciatis
                  labore asperiores veritatis alias ullam officia nostrum commodi, placeat numquam eveniet sit inventore
                  repellendus hic eius, maxime, iste distinctio deleniti veniam. Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Maxime reiciendis nulla cum perferendis ipsam similique fugit ducimus quas eos, et,
                  aperiam magnam sed sapiente nesciunt placeat autem? Nemo, repudiandae ducimus.</p>
                <p class="price-detail orange">Rp. 57.000</p>
              </div>
            </div>
                `
                $("#bookContent").append(html)
            }
            console.log(data.transactionDetail)
        },
        error: function (errMsg) {
            //   window.location.replace("/404.html")
        }
    });
    
    

});