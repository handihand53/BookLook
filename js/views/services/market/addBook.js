import {
  setCookie,
  getCookie,
  checkCookie
} from '../../../cookies.js'

$(window).load(function () {
  $("#book-form").submit(function (e) {
    e.preventDefault();
  });

  // upload foto
  var _URL = window.URL || window.webkitURL
  var photoInput = document.querySelector("#input");
  photoInput.addEventListener("click", function (event) {
    document.querySelector("#upload-photo").click();
    $("#lo").css({
      display: "block!important"
    });
  });

  $('input[id="upload-photo"]').change(function (file2) {

    var fileExtension = ['jpeg', 'jpg', 'png'];
    if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
      alert("Only formats are allowed : " + fileExtension.join(', '));
      return;
    }

    // checker for img size
    // ==========================================================
    var file = $(this)[0].files[0];

    var img = new Image();
    var imgwidth = 0;
    var imgheight = 0;
    var maxwidth = 600;
    var maxheight = 900;

    img.src = _URL.createObjectURL(file);
    img.onload = function () {
      imgwidth = this.width;
      imgheight = this.height;
      // if(imgwidth>maxwidth && imgheight>maxheight){
      //   alert("Ukuran Foto tidak valid")
      // }
      console.log(imgwidth);
      console.log(imgheight);
    }

    var fileName = file2.target.files[0].name;
    var reader = new FileReader();
    reader.readAsDataURL(event.srcElement.files[0]);
    // var me = this;
    reader.onload = function () {
      var fileContent = reader.result;
      $('#img').attr('src', fileContent);
    }

    $('p[id="photo-name"]').html(fileName + ' has been selected.');

  });

  //upload file

  var fileInput = document.querySelector("#input2");
  fileInput.addEventListener("click", function (event) {
    document.querySelector("#upload-file").click();
  });

  $('input[id="upload-file"]').change(function (file1) {

    var fileExtension = ['pdf'];
    if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
      alert("Only formats are allowed : " + fileExtension.join(', '));
      return;
    }

    // checker for img size
    // ==========================================================
    // var file = $(this)[0].files[0];

    // var img = new Image();
    // var imgwidth = 0;
    // var imgheight = 0;
    // var maxwidth = 640;
    // var maxheight = 640;

    // img.src = _URL.createObjectURL(file);
    // img.onload = function () {
    //   imgwidth = this.width;
    //   imgheight = this.height;
    //   console.log(imgwidth);
    //   console.log(imgheight);
    // }

    var fileName = file1.target.files[0].name;
    var reader = new FileReader();
    reader.readAsDataURL(event.srcElement.files[0]);
    $('p[id="file-name"]').html(fileName + ' has been selected.');

  });

  for (var i = 1; i < 80; i++) {
    var year = 1980 + i;
    $('select[id="tahun"]').append("<option value='" + year + "'>" + year + "</option>");
  }

  $.ajax({
    type: "GET",
    contentType: "application/json",
    url: "http://127.0.0.1:8080/api/markets",
    dataType: 'json',
    timeout: 600000,
    headers: {
      'Authorization': `Bearer ` + getCookie("token"),
    },
    beforeSend: function () {
      $("#loading").css("visibility", "visible");
    },
    success: function (data) {
      if (data.marketId != null) {
        $("#loading").css("visibility", "hidden");
        $("#marketName").html(data.marketName)
        $("#skuToko").val(data.marketSKU)
        if (data.marketPhoto == null)
          $('#display').attr('src', "../assets/else/signature.png");
        else
          $('#display').attr('src', data.marketPhoto);
      }
    },
    error: function (errMsg) {
      window.location.replace("/404.html")
    }
  });

  $("#addBook").click(function () {
    var judulBuku = $("#judulBuku").val()
    var penulisBuku = $("#penulisBuku").val()
    var penerbitBuku = $("#penerbitBuku").val()
    var kategoriBuku1 = $("#kategoriBuku1").val()
    var kategoriBuku2 = $("#kategoriBuku2").val()
    var skuBuku = $("#skuBuku").val()
    var hargaBuku = $("#hargaBuku").val()
    var deskripsiBuku = $("#deskripsiBuku").val()
    var isbn = $("#isbnBuku").val()
    var pict = $("#upload-photo").get(0).files[0];
    var file = $("#upload-file").get(0).files[0];
    var kategori;

    var stats = true;

    if (judulBuku == "") {
      stats = false;
      $("#judul").addClass("show");
    } else
      $("#judul").removeClass("show");

    if (penulisBuku == "") {
      stats = false;
      $("#penulis").addClass("show");
    } else
      $("#penulis").removeClass("show");

    if (penerbitBuku == "") {
      stats = false;
      $("#penerbit").addClass("show");
    } else
      $("#penerbit").removeClass("show");

    if (kategoriBuku1 == null) {
      stats = false;
      $("#kat").addClass("show");
    } else
      $("#kat").removeClass("show");

    if (skuBuku == "") {
      stats = false;
      $("#SKU").addClass("show");
    } else
      $("#SKU").removeClass("show");

    if (hargaBuku == "") {
      stats = false;
      $("#price").addClass("show");
    } else
      $("#price").removeClass("show");

    if (deskripsiBuku == "") {
      stats = false;
      $("#desc").addClass("show");
    } else
      $("#desc").removeClass("show");

    if (isbn == "") {
      stats = false;
      $("#isbnErr").addClass("show");
    } else
      $("#isbnErr").removeClass("show");

    if (kategoriBuku2 != kategoriBuku1) {
      if (kategoriBuku2 == null)
        kategori = kategoriBuku1;
      else
        kategori = kategoriBuku1 + ", " + kategoriBuku2
    } else {
      kategori = kategoriBuku1;
    }

    var fd = new FormData();
    fd.append('picture', pict)
    fd.append('title', judulBuku)
    fd.append('description', deskripsiBuku)
    fd.append('author', penulisBuku)
    fd.append('publisher', penerbitBuku)
    fd.append('sku', skuBuku)
    fd.append('categories', kategori)
    fd.append('price', hargaBuku)
    fd.append('book', file)
    fd.append('isbn', isbn)

    if (stats)
      $.ajax({
        url: 'http://127.0.0.1:8080/api/products/create',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        headers: {
          'Authorization': `Bearer ` + getCookie("token"),
        },
        beforeSend: function () {
          $("#loading").css("visibility", "visible");
        },
        success: function (data) {
          $("#show").click()
          $("#loading").css("visibility", "hidden");
        },
        error: function (data) {
          $("#loading").css("visibility", "hidden");
        }
      });
  })

  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8080/api/categories/",
    Accept: "application/json",
    contentType: "application/json",
    dataType: 'json',
    timeout: 600000,
    success: function (data) {
      for (let s of data) {
        let html = `
        <option value=` + s.categoryName + `>` + s.categoryName + `</option>
        `;
        $("#kategoriBuku1").append(html);
        $("#kategoriBuku2").append(html);
      }
    },
    failure: function (errMsg) {
      console.log(errMsg);
    }
  });

});