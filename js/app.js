import footer from './content/footer.js'
import header from './content/header.js'
import {
  setCookie,
  getCookie,
  checkCookie,
  deleteCookie
} from './cookies.js'
import checkTransaksi from '../js/notifMarket.js';
$(document).ready(function () {

  $("#footer").html(footer);
  $("#header").html(header);

  let dropHtml = "";
  let cartHtml = "";
  $.ajax({
    type: "GET",
    contentType: "application/json",
    url: "http://127.0.0.1:8080/api/users",
    headers: {
      'Authorization': `Bearer ` + getCookie("token"),
    },
    success: function (data) {
      $("#name").html(data.name.substring(0, 7))
      headerSuccess();
      $("#footer-masuk").html(`<a href="/kebijakan-privasi.html" class="bold alink">Kebijakan & privasi</a>`)
      $("#footer-daftar").html(`<a href="/syarat-dan-ketentuan.html" class="bold alink">Syarat & ketentuan</a>`)
      if (checkTransaksi() != 0) {
        $(".notif-toko").html(checkTransaksi())
        $(".notif-toko").css("display", "inline-block")
        $(".notif-toko-drop").html(checkTransaksi())
        $(".notif-toko-drop").css("display", "inline-block")
      } else {
        $(".notif-toko").css("display", "none")
        $(".notif-toko-drop").css("display", "none")
      }
    },
    error: function (errMsg) {
      headerError();
    }
  });

  addCategory();

  function addCategory() {
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:8080/api/categories/",
      Accept: "application/json",
      contentType: "application/json",
      dataType: 'json',
      timeout: 600000,
      success: function (data) {
        for (let s of data) {
          let html = `<a href="/market/category.html?kategori=` + s.categoryName + `"><p class="dropdown-item drop-active">` + s.categoryName + `</p>`;
          $("#categoryBox").append(html);
        }
      },
      error: function (errMsg) {
        console.log(errMsg);
      }
    });
  }

  var market = ""
  $.ajax({
    type: "GET",
    contentType: "application/json",
    url: "http://127.0.0.1:8080/api/markets",
    async: false,
    headers: {
      'Authorization': `Bearer ` + getCookie("token"),
    },
    success: function (data) {
      if (data.marketId != null) {
        market = `
        <a href="/market/store.html"><p class="dropdown-item drop-active blue"><i class="fas fa-store"></i> Toko <span class="notif-toko-drop"></span></p></a>`;
      } else {
        market = `
        <a href="/market/open-store.html"><p class="dropdown-item drop-active blue"><i class="fas fa-store"></i><span> Daftar Toko </span></p></a>
          `
      }
    }
  });

  function headerSuccess() {
    dropHtml = `
      <a href="/user/user.html"><p class="dropdown-item drop-active blue" id="prof"><i class="fas fa-user"></i> Profile</p></a>
      <a href="/user/mybook.html"><p class="dropdown-item drop-active blue" id="prof"><i class="fas fa-book"></i> Bukuku</p></a>` +
      market + `
      <a href="/user/transaksi.html"><p class="dropdown-item drop-active blue"><i class="far fa-credit-card"></i> Transaksi</p></a>
      <a href="/user/wishlist.html"><p class="dropdown-item drop-active blue"><i class="fas fa-shopping-bag"></i> Wishlist</p></a>
      <p class="dropdown-item drop-active blue" id="logout"><i class="fas fa-sign-out-alt"></i> Keluar</p>
  `;

    cartHtml = `
    
    <ul class="ul-keranjang" id="keranjang">
    
    </ul>`
    $("#profile-item-mobile").css("border-radius", "0px")
    $("#profile-item").css("border-radius", "0px")
    $("#cart-item").removeClass('cart-bg')

    addDropDown()
    getBuckets()
    logoutAct()
  }

  function headerError() {
    $("#name").html("Tamu");
    dropHtml = `
            <img src="../assets/else/not-login.png"  width="100%" alt=" Not Login Yet" style="padding: 35px;">
            <p class="center t14 m-1" >Mohon maaf anda belum login</p>
            <div class="center">
            <a href="/login.html"><button class="btn-orange">Login</button></a>
            </div>
            <br>
            `;
    cartHtml = `
        <p class="p-3 keranjang bold"> Keranjang Kamu kosong.</p>
        <div class="center">
            <p class="t14 p-2">Waah keranjang kamu kosong nih, isi yuk!</p>
            <a href="/login.html"><button class="btn-orange">Belanja</button></a>
            <br>
            <br>
        </div>
            `;
    $("#item-desk").css("min-width", "220px");
    $("#item-desk").css("border-radius", "7px");
    addDropDown()
  }

  function addDropDown() {
    $("#profile-item").html(dropHtml);
    $("#profile-item-mobile").html(dropHtml);
    $("#cart-item").html(cartHtml);
  }
  $("#logout").click(function () {
    localStorage.removeItem("token");
    window.location.reload();
  });

  function getBuckets() {
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:8080/api/buckets/",
      timeout: 600000,
      async: false,
      headers: {
        'Authorization': `Bearer ` + getCookie("token"),
      },
      success: function (data) {
        $("#keranjang").html("")
        if (data.length != 0) {
          $("#notif-bucket").html(data.length)
          $("#notif-bucket").css("display", "inline-block")
          var tot = 0;
          for (var i = 0; i < data.length; i++) {
            var html = `
          <li class="itm-keranjang">
            <div class="row m-1-cust">
              <div class="col-4">
                <img src="` + data[i].product.productPhoto + `" alt="" class="width-img-keranjang">
              </div>
              <div class="col-8 no-padding">
                  <h6 class="title-keranjang-header" title="` + data[i].product.title + `">` + data[i].product.title + `</h6>
                  <p class="author-header" title="` + data[i].product.author + `">` + data[i].product.author + `</p>
                  <p class="sku-header">` + data[i].product.sku + `</p>
                  <p class="isbn-header">` + data[i].product.isbn + `</p>
                  <div class="row">
                    <p class="price-header col-10">Rp. ` + data[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                    <p class="trash-buckets" data-id="` + data[i].product.productId + `" id="` + data[i].product.productId + `" onclick="bindDeleteData(this.id)"><i class="fa fa-trash trash-hov-profile" aria-hidden="true"></i></p> 
                  </div>
              </div>
            </div>
          </li>
          <hr>
          `
            $("#keranjang").append(html);
            tot += data[i].product.price;
          }
          var total = `<li>
          <div class="row p-2">
            <div class="col-6">
              <p>Total (<span class="bold-header">` + data.length + `</span>)</p>
              <p class="price-header">Rp. ` + tot.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>    
            </div>
            <div class="col-6">
              <a href="/user/detail_keranjang.html"><button class="btn-look">Lihat</button></a>
            </div>
          </div>
        </li>`
          $("#keranjang").append(total)
        } else {
          $("#keranjang").html(`
            <div class="bg-blank-keranjang"></div>
            <p class="p-1 keranjang bold center">Keranjang Kamu kosong.</p>
            <div class="center">
              <p class="t12">Waah keranjang kamu kosong nih, ayo isi buat nambah koleksi buku kamu!</p>
            </div>
          `);
        }
      },
      error: function (errMsg) {
        console.log(errMsg)
      },
      complete: function (stopMsg) {
        function bindDeleteData(data_id) {
          var id = data_id
          var data = {
            "productId": id
          }

          $.ajax({
            type: "DELETE",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/buckets/delete",
            data: JSON.stringify(data),
            dataType: 'json',
            cache: false,
            timeout: 600000,
            headers: {
              'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (msg) {
              $("#main-content").html("")
              refreshBuckets()
              getB()
              bindDeleteData()
            },
            error: function (errMsg) {
              console.log(errMsg)
            }
          });
        }
      }
    });
  }

  function logoutAct() {
    $("#logout").click(function () {
      logout()
    })

    $("#logout-sidebar").click(function () {
      logout()
    })
  }

  function logout() {
    deleteCookie()
    window.location.assign("/user/")
    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:8080/api/auth/signout",
      headers: {
        'Authorization': `Bearer ` + getCookie("token"),
      },
      success: function (data) {
        console.log(data)

      },
      error: function (data) {
        console.log(data)
      }
    });
  }


});