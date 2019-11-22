$(window).load(function() {

    var data = { 
        "usernameOrEmail" : username,
        "password" : password
    };

    console.log(JSON.stringify(data));

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/users",
        data: JSON.stringify(data),
        dataType: 'json',
        timeout: 600000,
        headers: {
          'Authorization': `Bearer ` + localStorage.getItem("token"),
        },
        success: function (data) {
          $("#name").html(data.name.substring(0,7))
          $("#fullName").html(data.name)
          $("#biodata").html(data.biodata)
        },
        failure: function(errMsg) {
          console.log(errMsg); 
        }
      });
});