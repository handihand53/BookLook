let header =`
<nav class="navbar navbar-expand-md navbar-dark bg-custom justify-content-between shadow-nav" >
<!-- Toggler/collapsibe Button -->
<button class="navbar-toggler no-border float-left" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
  <span class="navbar-toggler-icon" style="width: 25px;"></span>
</button>  

<!-- Logo -->
  <a class="navbar-brand" href="/user/index.html"><img src="../assets/logo/logo_white.png" alt="BookLook" height="27px" class="d-inline-block align-top"></a>

  <!-- Toggler/collapsibe Button -->
  <button class="navbar-toggler no-border float-left" id="btn_profile">
      <div class="dropdown"><img class="navbar-icon" src="../assets/logo/user.png" alt="">
        <div class="dropdown-content" style="right: 0;">
          <div>
            <div class="arrow-up" style="margin-left: 130px;"></div>
          </div>
          <div class="box border-radius-7" id="profile-item-mobile">
            <img src="../assets/else/loading.gif"  width="100%" alt=" Not Login Yet" style="padding: 35px;">
          </div>
        </div>
      <div>
  </button>

  <!-- Navbar links -->
  <div class="collapse navbar-collapse col-lg-5 " id="collapsibleNavbar">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link nav-active" href="#">Home</a>
      </li>
      <li class="nav-item" id="drop">
        <div class="nav-link dropdown" id="kategori">Kategori <i class="fa fa-fw fa-chevron-down"></i> 
          <div class="dropdown-content" >
            <div>
              <div class="arrow-up"></div>
            </div>
              <div class="box" id="categoryBox">
                
              </div>
          </div>
        <div>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Daftar Buku</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Tentang</a>
      </li>
    </ul>
  </div>
  <div class="col-lg-5 float-right no-padding justify-content-between">
    <input class="input search" style="width: 82%; font-size: 13px;" type="text" placeholder="Search">
    <div class="dropdown" id="drop-shop" style="margin: auto;">
        <a href="#" ><i class="fas fa-shopping-cart mark-white fa-lg wish-list" aria-hidden="true"></i></a>
        
        <div class="dropdown-content profile-mob" id="item-desk" style="top: 25px; min-width: 300px; overflow-y: auto; background-color: #fff">
            <div>
              <div class="arrow-up" style="margin-left: 190px;"></div>
            </div>
            <div class="box cart-bg" id="cart-item">
              <img src="../assets/else/loading.gif"  width="100%" alt=" Not Login Yet" style="padding: 35px;">
            </div>
        </div>
    </div>
    
    <span class="prof no-border float-left" id="profile">
        <div class="dropdown" style="color: white;">
           <img class="navbar-icon" src="../assets/logo/user.png" alt="">
              Hi, <span id="name">. . .</span><i class="fa fa-fw fa-chevron-down"></i>
          <div class="dropdown-content">
              <div>
                  <div class="arrow-up"></div>
              </div>
              <div class="box border-radius-7 profile-unlogin-bg" id="profile-item">
                  <img src="../assets/else/loading.gif"  width="100%" alt=" Not Login Yet" style="padding: 35px;">
              </div>
          </div>
        </div>
      </span>
  </div>
</nav>`;



export default header;