let header = `
<nav class="navbar navbar-expand-md navbar-dark bg-custom justify-content-between shadow-nav" >
<!-- Toggler/collapsibe Button -->
<div class="col-9-custom row mlr-auto" style="margin-top:0px">
<button class="navbar-toggler no-border float-left" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
  <span class="navbar-toggler-icon" style="width: 25px;"></span>
</button>  

<!-- Logo -->
  <a class="navbar-brand mrl-auto" href="/user/index.html"><img src="../assets/logo/logo_white.png" alt="BookLook" height="27px" class="d-inline-block align-top" "></a>

  <!-- Navbar links -->
  <div class="collapse navbar-collapse " id="collapsibleNavbar">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item" id="drop">
        <div class="nav-link dropdown" id="kategori">Kategori <i class="fa fa-fw fa-chevron-down"></i> 
          <div class="dropdown-content">
            <div class="category-drop">
              <div>
                <div class="arrow-up-kategori"></div>
              </div>
              <div class="box" id="categoryBox">
              </div>
            </div>
          </div>
        <div>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/tentang.html">Tentang</a>
      </li>
    </ul>
  </div>
  
  <span class="float-right no-padding">
  
    <span class="prof-header no-border float-right" id="profile">
        <div class="dropdown" style="color: white;">
           <img class="navbar-icon" src="../assets/logo/user.png" alt="">
              Hi, <span id="name">. . .</span><i class="fa fa-fw fa-chevron-down"></i>
          <div class="dropdown-content">
              <div>
                  <div class="arrow-up-prof"></div>
              </div>
              <div class="box border-radius-7 profile-unlogin-bg" id="profile-item">
                  <img src="../assets/else/loading.gif"  width="100%" alt=" Not Login Yet" style="padding: 35px;">
              </div>
          </div>
        </div>
      </span>
    <div class="dropdown float-right" id="drop-shop" style="margin: auto; padding: 8px;">
    <span class="notif-bucket" id="notif-bucket"></span>
    <a href="#" ><i class="fas fa-shopping-cart mark-white fa-lg wish-list" aria-hidden="true"></i></a>
        
    <div class="border-radius-7 right-6 dropdown-content profile-mob" id="item-desk" style="top: 38px; min-width: 300px; overflow-y: auto;">
    <div>
    <div class="arrow-up"></div>
  </div>
            <div class="box cart-bg border-radius-7" id="cart-item">
              <img src="../assets/else/loading.gif"  width="100%" alt=" Not Login Yet" style="padding: 35px;">
            </div>
        </div>
    </div>
  </span>
  <!-- Toggler/collapsibe Button -->
  <button class="navbar-toggler no-border cst-padding no-margin float-left" id="btn_profile">
      <span class="dropdown"><img class="navbar-icon" src="../assets/logo/user.png" alt="">
        <div class="dropdown-content" style="right: 0;">
          <div>
            <div class="arrow-up" style="margin-left: 130px;"></div>
          </div>
          <div class="box border-radius-7" id="profile-item-mobile">
            <img src="../assets/else/loading.gif"  width="100%" alt=" Not Login Yet" style="padding: 35px;">
          </div>
        </div>
      <span>
  </button>
  </div>
</nav>
<div id="modal"></div>
`;



export default header;