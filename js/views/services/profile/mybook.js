import {
  setCookie,
  getCookie,
  checkCookie
} from '../../../cookies.js'

import checkMarket from '../../../marketCheck.js';


$(window).load(function () {

  getDataUser();
  checkMarket();
  getBook();

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

  function getBook() {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: "http://127.0.0.1:8080/api/libraries",
      dataType: 'json',
      timeout: 600000,
      headers: {
        'Authorization': `Bearer ` + getCookie("token"),
      },
      success: function (data) {
        if (data.length!=0) {
          for (var i = 0; i < data.length; i++) {
            var pro = data[i].product;
            console.log(pro)
            var html = `
                <div class="col-3-custom max-min">
                <a href="readbook.html?file=` + pro.productFile + `">
                    <div class="content-border no-border border-radius-4 border-book">
                    <img src="` + pro.productPhoto + `" alt="" class="width-img">
                    <div class="p-2">
                        <p class="title-book" title="+` + pro.title + `+">` + pro.title + `</p>
                        <p class="author-book">` + pro.author + `</p>
                    </div>
                    </div>
                </a>
                </div>
                `

            $("#contentBook").append(html)
          }
        }else{
          $("#contentBook").removeClass("flex-row")
          var html = `
          <div class="bg-products"></div>
          <div class="center book">Buku Kamu Kosong.</div>
          <div class="center book-12">ayo <a href="/user/"><span class="link">belanja</span></a> biar bisa nambah ilmu lagi.</div>
          `
          $("#contentBook").append(html)
        }

      },
      error: function (errMsg) {
        console.log(errMsg)
      }
    });
  }
});