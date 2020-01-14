$(window).load(function () {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/categories",
        async: false,
        dataType: 'json',
        success: function (data) {
            data.forEach(e => {
                var kat = `
                <a href="/market/category.html?kategori=` + e.categoryName + `" class="row col-12">
                    <div class="akun-mob-nav row" style="width: 100%;">
                        <span class="float-left ml-3">` + e.categoryName + `</span>
                        <i id="icon2" class="fas fa-chevron-right mt-1 ml-auto"></i>
                    </div>
                </a>
                `
                console.log(kat)
                $("#kategori2").append(kat)
            });
        }
    });

    $("#iconback").html(`<i class="fas fa-chevron-left mt-1 ml-auto" style="color: white;"></i> <span class="bold">Kategori</span>`)
    $("#logoBooklook").addClass("h")
    $("#iconback").click(function () {
        window.history.back();
    })

    $("#kategori-i").addClass("bottom-active")
    $("#kategori-t").addClass("bottom-active border-active")
})