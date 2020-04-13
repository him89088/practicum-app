$(window).bind("pageshow", function () {
    var form = $('form');
    // let the browser natively reset defaults
    form[0].reset();
});

var icfData = []

function sendICF() {
    var icf = {}
    var ele = document.getElementsByTagName('input');
    for (i = 0; i < ele.length; i++) {
        if (ele[i].type = "radio") {
            if (ele[i].checked)
                icf[ele[i].name] = ele[i].value;
        }
    }
    icfData.push(icf);
    console.log("JSONify " + JSON.stringify(icfData));

    $.ajax({
        url: "/insert_icf",
        data: JSON.stringify(icfData),
        //data: surveyData, 
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        dataType: 'jsonp',
        async:false,
        cache: false,
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
};
