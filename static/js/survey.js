$(window).bind("pageshow", function () {
    var form = $('form');
    // let the browser natively reset defaults
    form[0].reset();
});

var gender;var age;var pain_duration;var meds;
var surveyData = []

flag1 = 0;flag2 = 0;flag3 = 0;

$("#gender").change(function () {flag1++;});
$("input[id='age-text']").change(function () {
    if (this.value >= 18 && this.value <= 100) {flag2++;}else flag2 = 0;});
$("input[id='pain-text']").change(function () {
    if (this.value >= 0) {flag3++;}else flag3 = 0;});

function getData() {
    var survey = {}
    if (flag1 > 0 && flag2 > 0 && flag3 > 0 && (($.trim($('#med-text').val())).length) > 0) {
        var $questions = $(".questions");
        if ($questions.find("input:radio:checked").length === $questions.length) {
            gender = $('#gender option:selected').text();
            age = $('#age-text').val();
            pain_duration = $('#pain-text').val();
            q1 = $("input[id='q1']:checked").val();
            q2 = $("input[id='q2']:checked").val();
            q3 = $("input[id='q3']:checked").val();
            q4 = $("input[id='q4']:checked").val();
            q5 = $("input[id='q5']:checked").val();
            meds = $('#med-text').val()
            q6 = $("input[id='q6']:checked").val();
            q7 = $("input[id='q7']:checked").val();
            q8 = $("input[id='q8']:checked").val();
            q9 = $("input[id='q9']:checked").val();
            q10 = $("input[id='q10']:checked").val();
            q11 = $("input[id='q11']:checked").val();
            q12 = $("input[id='q12']:checked").val();
            q13 = $("input[id='q13']:checked").val();
            survey["gender"] = gender;
            survey["age"] = age;
            survey["pain_duration"] = pain_duration;
            survey["q1"] = q1;
            survey["q2"] = q2;
            survey["q3"] = q3;
            survey["q4"] = q4;
            survey["q5"] = q5;
            survey["meds"] = meds;
            survey["q6"] = q6;
            survey["q7"] = q7;
            survey["q8"] = q8;
            survey["q9"] = q9;
            survey["q10"] = q10;
            survey["q11"] = q11;
            survey["q12"] = q12;
            survey["q13"] = q13;
            surveyData.push(survey);
            console.log("JSONify " + JSON.stringify(surveyData));
            sendSurvey();
        }
        else {
            alert("Please fill all the details!");
        }
    }
}

function sendSurvey() {
    $.ajax({
        url: "/insert_survey",
        data: JSON.stringify(surveyData),
        //data: surveyData, 
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        dataType: 'jsonp',
        cache: false,
        async: false,
        headers: {
            'cache-control': 'no-cache',
            "Access-Control-Allow-Origin": "*"
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



