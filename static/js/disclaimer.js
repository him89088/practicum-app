function redirectToPLS() {
    $.ajax({
        url: "/pls",
        type: 'POST',
        cache: false,
        async:false,
        headers:{
            'cache-control':'no-cache',
            "Access-Control-Allow-Origin":"*"
        },
        success: function (response) {
            var dbData = response.result;
            console.log("Success" + dbData)
        },
        error: function (error) {
            console.log(error);
        }
    });
}
