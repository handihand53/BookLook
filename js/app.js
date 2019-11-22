import footer from './content/footer.js'
import header from './content/header.js'




$(window).load(function () {
    $("#header").html(header);
    $("#footer").html(footer);
    console.log(localStorage.getItem("token"))
    localStorage.removeItem("token");
    let dropHtml = "";
    let cartHtml = "";
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/users",
        dataType: 'json',
        timeout: 600000,
        headers: {
            'Authorization': `Bearer ` + localStorage.getItem("token"),
        },
        success: function (data) {
            $("#name").html(data.name.substring(0, 7))
        },
        failure: function (errMsg) {
            console.log(errMsg);
        }
    });


    if (localStorage.getItem("token") != null) {
        dropHtml = `
            <a href="user.html"><p class="dropdown-item">Profile</p></a>
            <a href="store.html"><p class="dropdown-item">Toko</p></a>
            <a href="transaksi.html"><p class="dropdown-item">Transaksi</p></a>
            <a href="wishlist.html"><p class="dropdown-item">Wishlist</p></a>
            <p class="dropdown-item" onclick="logout()" id="logout">Log Out</p>
        `;

        cartHtml = `
        <p class="keranjang">Keranjang</p>
        <hr class="myline">
        <ul class="ul-keranjang">
                          <li class="itm-keranjang">
                            <div class="row">
                              <div class="col-4">
                                <img src="../assets/img/sample 14.jpg" alt="" class="width-img-keranjang">
                              </div>
                              <div class="col-8 no-padding">
                                  <h6 class="title-keranjang">DNA of a Christ Followers</h6>
                                  <p class="author">Daren Wride</p>
                                  <p class="author">Ini bagian SKU</p>
                                  <p class="price">Rp. 57.000</p>
                                  <p style="float: right; margin-right: 20px;"><i class="fa fa-trash" style="color: rgb(172, 172, 172);" aria-hidden="true"></i></p>
                              </div>
                            </div>
                          </li>
                          <hr>
                          <li class="itm-keranjang">
                              <div class="row">
                                <div class="col-4">
                                  <img src="../assets/img/sample 14.jpg" alt="" class="width-img-keranjang">
                                </div>
                                <div class="col-8 no-padding">
                                    <h6 class="title-keranjang">DNA of a Christ Followers</h6>
                                    <p class="author">Daren Wride</p>
                                    <p class="author">Ini bagian SKU</p>
                                    <p class="price">Rp. 57.000</p>
                                    <p style="float: right; margin-right: 20px;"><i class="fa fa-trash" style="color: rgb(172, 172, 172);" aria-hidden="true"></i></p>
                                </div>
                              </div>
                            </li>
                            <hr>
                            <li>
                              <div class="row">
                                <div class="col-6">
                                  <p>Total (2)</p>
                                  <p class="price">Rp. 114.000</p>    
                                </div>
                                <div class="col-6">
                                  <a href="detail_keranjang.html"><button class="btn-look">Lihat</button></a>
                                </div>
                              </div>
                            </li>
                        </ul>`
        $("#profile-item-mobile").css("border-radius", "0px")
        $("#profile-item").css("border-radius", "0px")
        $("#cart-item").removeClass('cart-bg')
    } else {
        $("#name").html("Tamu");
        dropHtml = `
            <img src="../assets/else/not-login.png"  width="100%" alt=" Not Login Yet" style="padding: 35px;">
            <p class="center t14 m-1" >Mohon maaf anda belum login</p>
            <div class="center">
            <a href="login.html"><button class="btn-orange">Login</button></a>
            </div>
            <br>
            `;
        cartHtml = `
        <p class="p-3 keranjang bold"> Keranjang Anda kosong.</p>
        <div class="center">
            <p class="t14 p-2">Waah keranjang kamu kosong nih, isi yuk!</p>
            <button class="btn-orange">Belanja</button>
            <br>
            <br>
        </div>
            `;
        $("#item-desk").css("min-width", "220px");
        $("#item-desk").css("border-radius", "7px");
        $("#profile-item").html(dropHtml);
        $("#profile-item-mobile").html(dropHtml);
        $("#cart-item").html(cartHtml);
    }


});