$(window).bind("pageshow", function () {
    var form = $('form');
    // let the browser natively reset defaults
    form[0].reset();
});

var gender;
var age;
var pain = 0;
var surveyData = []

flag1 = 0;
flag2 = 0;
flag3 = 0;

$( "#gender").change(function() {
    flag1++;
  });
  $( "#age").change(function() {
    flag2++;
  });
  $( "input[name='pain']").change(function() {
    flag3++;
  });

function getData(){
    var survey = {}
    if(flag1 > 0 && flag2 > 0 && flag3 > 0 ){
        gender = $('#gender option:selected').text();
        age = $('#age option:selected').text();
        pain = $("input[name='pain']:checked").val();
        survey["gender"] = gender;
        survey["age"] = age;
        survey["pain"] = pain;
        surveyData.push(survey);
        console.log("JSONify " + JSON.stringify(surveyData));
        sendSurvey();
    }
    else{
        alert('Please fill all the details');
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
};

