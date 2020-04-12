$(window).bind("pageshow", function () {
    var form = $('form');
    // let the browser natively reset defaults
    form[0].reset();
});

var gender;
var age;
var pain = 0;
var surveyData = []

function doThis(num) {
    pain = num;
    getdata(pain);
}

function getdata(pain) {
    gender = $('#gender option:selected').text();
    age = $('#age option:selected').text();
    pain = pain;
    json(gender, age, pain);
}

function json(gender, age, pain) {
    var survey = {}

    survey["gender"] = gender;
    survey["age"] = age;
    survey["pain"] = pain;
    surveyData.push(survey);
    console.log("JSONify " + JSON.stringify(surveyData));
}

function sendSurvey() {
    $.ajax({
        url: "/insert_survey",
        data: JSON.stringify(surveyData),
        //data: surveyData, 
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json',
        success: function (response) {
            var dbData = response.result;
            console.log("Success" + dbData)
        },
        error: function (error) {
            console.log(error);
        }
    });
};

