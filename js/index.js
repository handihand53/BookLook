$.ajax({
    type: "GET",
    contentType: "application/json",
    url: "http://127.0.0.1:8080/api/products/category/Health",
    success: function (data) {
        for (var i = 0; i < data.length; i++) {
            var html = `
            <a href="/market/book.html?_i=`+data[i].productId+`">
                <div class="col-4">
                    <div class="content-border select shadow-card max-min no-border border-radius-4">
                        <img src="` + data[i].productPhoto + `" alt="" class="width-img">
                        <div class="p-1">
                        <p class="title no-margin no-padding">` + data[i].title + `</p>
                        <p class="author-main">` + data[i].author + `</p>
                        <p class="price">Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                        </div>
                    </div>
                </div>
            <a>
                `
            $("#health").append(html)
        }
    },
    error: function (errMsg) {
        console.log(errMsg);
    }
});

$.ajax({
    type: "GET",
    contentType: "application/json",
    url: "http://127.0.0.1:8080/api/products/category/Fiction",
    success: function (data) {
        for (var i = 0; i < data.length; i++) {
            var html = `
            <div class="col-4">
                <a href="/market/book.html?_i=`+data[i].productId+`">
                    <div class="content-border select shadow-card max-min no-border border-radius-4">
                        <img src="` + data[i].productPhoto + `" alt="" class="width-img">
                        <div class="p-1">
                        <p class="title no-margin no-padding">` + data[i].title + `</p>
                        <p class="author-main">` + data[i].author + `</p>
                        <p class="price">Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                        </div>
                    </div>
                <a>
            </div>
            `
            $("#fiction").append(html)
        }
    },
    error: function (errMsg) {
        console.log(errMsg);
    }
});

$.ajax({
    type: "GET",
    contentType: "application/json",
    url: "http://127.0.0.1:8080/api/products/category/Sport",
    success: function (data) {
        for (var i = 0; i < data.length; i++) {
            var html = `
                <div class="col-4">
                    <a href="/market/book.html?_i=`+data[i].productId+`">
                        <div class="content-border select shadow-card max-min no-border border-radius-4">
                            <img src="` + data[i].productPhoto + `" alt="" class="width-img">
                            <div class="p-1">
                            <p class="title no-margin no-padding">` + data[i].title + `</p>
                            <p class="author-main">` + data[i].author + `</p>
                            <p class="price">Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                            </div>
                        </div>
                    </a>
                </div>
                `
            $("#sport").append(html)
        }
    },
    error: function (errMsg) {
        console.log(errMsg);
    }
});

$.ajax({
    type: "GET",
    contentType: "application/json",
    url: "http://127.0.0.1:8080/api/products/category/Education",
    success: function (data) {
        for (var i = 0; i < data.length; i++) {
            var html = `
                <div class="col-4">
                    <a href="/market/book.html?_i=`+data[i].productId+`">
                        <div class="content-border select shadow-card max-min no-border border-radius-4">
                            <img src="` + data[i].productPhoto + `" alt="" class="width-img">
                            <div class="p-1">
                            <p class="title no-margin no-padding">` + data[i].title + `</p>
                            <p class="author-main"> ` + data[i].author + `</p>
                            <p class="price">Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                            </div>
                        </div>
                    </a>
                </div>
                `
            $("#education").append(html)
        }
    },
    error: function (errMsg) {
        console.log(errMsg);
    }
});