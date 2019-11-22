$(window).load(function() {
    $("#main-checkbox").click(function(){
        
        $(".check").each(function(){
            let status = $("#main-checkbox").prop("checked");
            console.log(status)
            if(status)
                $(this).prop("checked", true);
            else
                $(this).prop("checked",false);
        })
    })
});