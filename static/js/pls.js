function redirectToInfo() {
    $.ajax({
        url: "/information",
        type: 'POST',
        success: function (response) {
            var dbData = response.result;
            console.log("Success" + dbData)
        },
        error: function (error) {
            console.log(error);
        }
    });
}
