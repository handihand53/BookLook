$(window).load(function() {
    if(localStorage.getItem("token")==null){
        // window.location.replace("http://127.0.0.1:8081/index");
    }

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
          console.log(data);
          $("#username").val(data.username)
          $("#fullName").val(data.name)
          $("#email").val(data.email)
          $("#biodata").val(data.biodata)
        },
        failure: function(errMsg) {
          console.log(errMsg); 
        }
      });
});