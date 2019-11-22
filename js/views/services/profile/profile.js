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
                $("#market").removeAttr("data-target")
                $("#market").click(function(){
                    window.location.assign("http://127.0.0.1:8081/store");
                })
            }
        },
        failure: function(errMsg) {
            console.log(errMsg); 
        }
    });
});