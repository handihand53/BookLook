import {
  setCookie,
  getCookie,
  checkCookie
} from '../../../cookies.js'

$(window).load(function () {
  var _URL = window.URL || window.webkitURL;
  $('input[id="upload"]').change(function (file2) {

    var fileExtension = ['jpeg', 'jpg', 'png'];
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
    var fileName = file2.target.files[0].name;
    var reader = new FileReader();
    reader.readAsDataURL(event.srcElement.files[0]);
    var me = this;
    reader.onload = function () {
      var fileContent = reader.result;
      // console.log(fileContent);
      $('#img').attr('src', fileContent);
    }
    $('p[id="file-name"]').html(fileName + ' has been selected.');
  });

  var fileInput = document.querySelector("#input");

  fileInput.addEventListener("click", function (event) {
    document.querySelector("#upload").click();
    console.log("click");
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
    success: function (data) {
      if (data.marketId != null) {
        $("#marketName").html(data.marketName)
        $("#skuToko").val(data.marketSKU)
      }
    },
    failure: function (errMsg) {
      console.log(errMsg);
    }
  });

  $("#addBook").click(function () {
    // console.log($("#book-form").serialize())
    var judulBuku = $("#judulBuku").val()
    var penulisBuku = $("#penulisBuku").val()
    var penerbitBuku = $("#penerbitBuku").val()
    var kategoriBuku = $("#kategoriBuku").val()
    var skuBuku = $("#skuToko").val() + $("#skuBuku").val()
    var hargaBuku = $("#hargaBuku").val()
    var deskripsiBuku = $("#deskripsiBuku").val()
    var judulBuku = $("#judulBuku").val()
    var fotoBuku = $("#upload").val()

    var data = {
      "title": judulBuku,
      "description": deskripsiBuku,
      "author": penulisBuku,
      "publisher": penerbitBuku,
      "sku": skuBuku,
      "price": hargaBuku,
      "picture": fotoBuku,
      "categories": kategoriBuku
    };
    
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: "http://127.0.0.1:8080/api/products/create",
      data: JSON.stringify(data),
      dataType: 'json',
      timeout: 600000,
      headers: {
        'Authorization': `Bearer ` + getCookie("token"),
      },
      success: function (msg) {
        console.log("sukses")
      },
      failure: function (errMsg) {
        console.log(errMsg);
      }
    });
  })

  function submitForm(form) {
    var url = form.attr("action");
    var formData = {};
    $(form).find("input[name]").each(function (index, node) {
      formData[node.name] = node.value;
    });
    $.post(url, formData).done(function (data) {
      alert(data);
    });
  }

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
        <option value=` + s.categortyId + `>` + s.categoryName + `</option>
        `;
        $("#ketegoriBuku").append(html);

      }
    },
    failure: function (errMsg) {
      console.log(errMsg);
    }
  });

});