$(window).load(function() {
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
          $("#name").html(data.name.substring(0,7))
          $("#fullName").html(data.name)
          $("#biodata").html(data.biodata)
        },
        failure: function(errMsg) {
          console.log(errMsg); 
        }
      });
      
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/markets",
        dataType: 'json',
        timeout: 600000,
        headers: {
            'Authorization': `Bearer ` + localStorage.getItem("token"),
        },
        success: function (data) {
            if(data.marketId!=null){
                $("#marketName").html(data.marketName)
                $("#marketBio").html(data.marketBio)
            }
        },
        failure: function(errMsg) {
            console.log(errMsg); 
        }
    });
});