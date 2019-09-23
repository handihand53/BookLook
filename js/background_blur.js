window.onload = function(){
    var bg = document.getElementById("bg-black");
    var kategori_Drop = document.getElementById("kategori");
    var drop_content = document.getElementById("drop");
    var shop_drop = document.getElementById("drop-shop");
    var profile = document.getElementById("profile");
    
    function fixed(){
      bg.style.position ="fixed";
    }

    function unset(){
      bg.style.position ="unset";
    }

    profile.addEventListener("mouseover", fixed);
    profile.addEventListener("mouseout", unset);
    shop_drop.addEventListener("mouseover", fixed);
    shop_drop.addEventListener("mouseout", unset);
    bg.addEventListener("mouseover", unset);
    drop_content.addEventListener("mouseout", unset);
    kategori_Drop.addEventListener("mouseover", fixed);
  }