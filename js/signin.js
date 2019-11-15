$(document).ready(function() {
    if(localStorage.getItem("token")!=null) window.location.replace("http://127.0.0.1:8081/index");
    // localStorage.removeItem("token");
    $("#masuk").click(function(){
        
        var username = $("#username").val();
        var password = $("#password").val();
        if(username=="" && password ==""){
            $("#msg").html('<b><i class="fa fa-window-close" aria-hidden="true"></i> Username atau password tidak boleh kosong</b>;') 
            $("#username").addClass("login-input-false")
            $("#password").addClass("login-input-false")
        }else if(username==""){
            $("#msg").html('<b><i class="fa fa-window-close" aria-hidden="true"></i> Username tidak boleh kosong</b>') 
            $("#username").addClass("login-input-false")
            $("#password").removeClass("login-input-false")
        }else if(password==""){
            $("#msg").html('<b><i class="fa fa-window-close" aria-hidden="true"></i> Password tidak boleh kosong</b>') 
            $("#username").removeClass("login-input-false")
            $("#password").addClass("login-input-false")
        }
        else{

        
            var data = { 
                "usernameOrEmail" : username,
                "password" : password
            };

            console.log(JSON.stringify(data));

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "http://127.0.0.1:8080/api/auth/signin",
                data: JSON.stringify(data),
                dataType: 'json',
                timeout: 600000,
                success: function (data) {
                    var token = data.accessToken;
                    var type = data.tokenType;
                    localStorage.setItem("token", token);
                    console.log(localStorage.getItem("token"));
                    window.location.assign("http://127.0.0.1:8081/index");
                },
                failure: function(errMsg) {
                    console.log(errMsg); 
                }
            });
        }
    });
});