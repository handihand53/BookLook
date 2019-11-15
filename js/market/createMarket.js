$(document).ready(function(){

    document.getElementById("marketName").addEventListener("input", function(){
        if(document.getElementById("marketName").value=="")
            $("#marketName").addClass("login-input-false")
        else
            $("#marketName").removeClass("login-input-false")
    });
      
    document.getElementById("sku").addEventListener("input", function(){
        if(document.getElementById("sku").value=="")
            $("#sku").addClass("login-input-false")
        else
            $("#sku").removeClass("login-input-false")
    });

    document.getElementById("deskripsi").addEventListener("input", function(){
        if(document.getElementById("deskripsi").value=="")
            $("#deskripsi").addClass("login-input-false")
        else
            $("#deskripsi").removeClass("login-input-false")
    });

    $('input[id="upload"]').change(function(file){
        var fileName = file.target.files[0].name;
        $('p[id="file-name"]').html(fileName+  ' has been selected.');
    });
    
    $('#daftar').click(function(){
        var marketName = $("#marketName").val();
        var sku = $("#sku").val();
        var deskripsi = $("#deskripsi").val();

        if(marketName=="" || sku=="" || deskripsi==""){    
            $("#deskripsi").addClass("login-input-false")
            $("#sku").addClass("login-input-false")
            $("#marketName").addClass("login-input-false")
        }    // $("#msg").html('<b><i class="fa fa-window-close" aria-hidden="true"></i> Silahkan isi semua field terlebih dahulu!</b>')
        else{
            var data = { 
                "marketName": marketName, 
                "marketSKU": sku,
                "marketBio": deskripsi
            };

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "http://127.0.0.1:8080/api/markets/create",
                data: JSON.stringify(data),
                credentials: 'same-origin',
                dataType: 'json',
                cache: false,
                timeout: 600000,
                headers: {
                    'Authorization': `Bearer ` + localStorage.getItem("token"),
                },
                success:  function (msg) {
                    $("#modalBtn").click();
                },
                failure: function(errMsg) {
                    alert(errMsg);
                }
            });
        }
    });

    var fileInput  = document.querySelector( "#input" );

    fileInput.addEventListener("click", function(event){
        document.querySelector("#upload").click();
    });

    $('input[id="upload2"]').change(function(file){
        var fileName = file.target.files[0].name;
        $('p[id="file-name2"]').html(fileName+  ' has been selected.');
    });

    var fileInput  = document.querySelector( "#input2" );

    fileInput.addEventListener("click", function(event){
        document.querySelector("#upload2").click();
    });
});