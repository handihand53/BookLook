$(document).ready(function() {
    document.getElementById("name").addEventListener("input", function(){
        console.log("asd")
        if(document.getElementById("name").value=="")
          $("#name").addClass("signup-input-false")
        else
          $("#name").removeClass("signup-input-false")
      });
      
    document.getElementById("username").addEventListener("input", function(){
    if(document.getElementById("username").value=="")
        $("#username").addClass("signup-input-false")
    else
        $("#username").removeClass("signup-input-false")
    });

    document.getElementById("email").addEventListener("input", function(){
    if(document.getElementById("email").value=="")
        $("#email").addClass("signup-input-false")
    else
        $("#email").removeClass("signup-input-false")
    });

    document.getElementById("password").addEventListener("input", function(){
        if(document.getElementById("password").value=="")
            $("#password").addClass("signup-input-false")
        else
            $("#password").removeClass("signup-input-false")
        });

    $("#daftar").click(function(){
        var nama = $("#name").val();
        var username = $("#username").val();
        var email = $("#email").val();
        var password = $("#password").val();

        if(nama==""){
            $("#name").addClass("signup-input-false")
        }
        if(username=="")
            $("#username").addClass("signup-input-false")
            
        if(email=="") $("#email").addClass("signup-input-false")
            
        if(password=="") $("#password").addClass("signup-input-false")
        
        if(nama=="" || password=="" || email=="" || username=="")
            $("#msg").html('<b><i class="fa fa-window-close" aria-hidden="true"></i> Silahkan isi semua field terlebih dahulu!</b>')
        else{
            var data = { 
                "name": nama, 
                "username": username,
                "email": email, 
                "password": password
            };

            console.log(JSON.stringify(data));

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "http://127.0.0.1:8080/api/auth/signup",
                data: JSON.stringify(data),
                dataType: 'json',
                cache: false,
                timeout: 600000,
                success:  function (msg) {
                    alert(msg.message);
                },
                failure: function(errMsg) {
                    alert(errMsg);
                }
            });
        }
    });
});