// The cards needed to be sorted into the piles are in a pseudo random order that repeats itself twice (as if we had 2 identical decks of cards)
// In each deck there is one card for each possible combination of number (1/2/3/4), shape (circle/diamond/star/triangle), and color (red/green/blue/yellow)
// so we have 4X4X4=64 cards in a deck.
// The cards names are XXX=>number,shape,color - for example card name 234 is a card with 2 stars that are yellow. 

var cards = [234, 423, 244, 314, 134, 133, 242, 213, 414, 124, 324, 343, 334, 434, 223, 422, 131, 432, 241, 412, 323, 344, 413, 243, 331, 411, 341, 132, 112, 214, 111, 312, 311, 342, 141, 322, 441, 222, 123, 211, 421, 424, 431, 233, 122, 232, 333, 433, 442, 113, 212, 114, 224, 444, 221, 321, 231, 121, 143, 144, 332, 142, 443, 313]//, 234, 423, 244, 314, 134, 133, 242, 213, 414, 124, 324, 343, 334, 434, 223, 422, 131, 432, 241, 412, 323, 344, 413, 243, 331, 411, 341, 132, 112, 214, 111, 312, 311, 342, 141, 322, 441, 222, 123, 211, 421, 424, 431, 233, 122, 232, 333, 433, 442, 113, 212, 114, 224, 444, 221, 321, 231, 121, 143, 144, 332, 142, 443, 313];
// var cards = [234, 423, 244, 314, 134, 133, 242, 213, 414, 124]//, 324, 343, 334, 434, 223, 422, 131, 432, 241, 412, 323, 344, 413, 243, 331, 411, 341, 132, 112, 214, 111, 312, 311, 342, 141, 322, 441, 222, 123, 211, 421, 424, 431, 233, 122, 232, 333, 433, 442, 113, 212, 114, 224, 444, 221, 321, 231, 121, 143, 144, 332, 142, 443, 313, 234, 423, 244, 314, 134, 133, 242, 213, 414, 124, 324, 343, 334, 434, 223, 422, 131, 432, 241, 412, 323, 344, 413, 243, 331, 411, 341, 132, 112, 214, 111, 312, 311, 342, 141, 322, 441, 222, 123, 211, 421, 424, 431, 233, 122, 232, 333, 433, 442, 113, 212, 114, 224, 444, 221, 321, 231, 121, 143, 144, 332, 142, 443, 313];

var classificationPrinceple = 0;	//Classification principle 0=>by_count 1=>by_shape 2=>by+color
var countRight = 0;
var correctness = 1;		        //Counting how many are consecutive correct (in order to change the classification principle after 10 correct).
var seriesNumber = 0;				//WCST tests how many series (a series = 10 consecutive correct) the participants completed.
var totalWrong = 0;					//WCST tests the total amount of wrong answers the participant had.
var totalRepeatedWrong = 0; 		//WCST tests the total amount of wrong answers that the type of mistake was exactly like the mistake from the privious trial.
var previousTrialWrongType = -1;	//For this we always need to know if last trial was a wrong (error) and the type of error. -1 means right.
var currentTrialWrongType = -2;		//And we need the type of error in the current trial to compare to last trial. -2 is right (correct response).
//The error types can be 0/1/2  -  0=>sorted_by_count 1=>by_shape 2=>by_color
var isKeyPressed = 0;				//Tracks the keypress for each card so players won't press out of time

var startTime;

var jsondata = []

var Seq = 1;
var path = '../static/img/';

function WCSTstateTransitionToGame() {
    $('#WCSTinstructions').hide();
    $('#WCSTgameInstructions').show();
    $('#WCSTkeyCards').show();
    state = 'WCSTgame';

    card = cards[0];
    var path_img = path + card.toString() + ".jpg"
    document.getElementById('WCSTresponseCard').src = path_img;
    $('#WCSTresponseCard').show();
    startTime = Date.now();
}

function WCSTcardPressed(cardNumber) {
    if ((state == 'WCSTgame') && (isKeyPressed == 0)) {
        WCSTgameKeyPressed(cardNumber);
    }
}

function WCSTgameKeyPressed(code) {
    isKeyPressed = 1;
    switch (classificationPrinceple) {
        case 0:
            if (code == Math.floor(card / 100)) {
                WCSTdisplayRight();
            } else {
                WCSTdisplayWrong();
                if (code == (Math.floor(card / 10) % 10)) {
                    currentTrialWrongType = 1;
                } else if (code == Math.floor(card % 10)) {
                    currentTrialWrongType = 2;
                } else {
                    currentTrialWrongType = 3;
                }
            }
            break;

        case 1:
            if (code == (Math.floor(card / 10) % 10)) {
                WCSTdisplayRight();
            } else {
                WCSTdisplayWrong();
                if (code == Math.floor(card / 100)) {
                    currentTrialWrongType = 0;
                } else if (code == Math.floor(card % 10)) {
                    currentTrialWrongType = 2;
                } else {
                    currentTrialWrongType = 3;
                }
            }
            break;

        default:
            if (code == Math.floor(card % 10)) {
                WCSTdisplayRight();
            } else {
                WCSTdisplayWrong();
                if (code == Math.floor(card / 100)) {
                    currentTrialWrongType = 0;
                } else if (code == (Math.floor(card / 10) % 10)) {
                    currentTrialWrongType = 1;
                } else {
                    currentTrialWrongType = 3;
                }
            }
    }

    if (currentTrialWrongType != -2) {
        if (currentTrialWrongType == previousTrialWrongType) {
            totalRepeatedWrong++;
        }
        previousTrialWrongType = currentTrialWrongType;
    }

    $('#WCSTresponseCard').hide();

    cards.shift();

    if ((cards.length != 0) && (seriesNumber < 6)) {

        card = cards[0];
        var path_img = path + card.toString() + ".jpg"
        document.getElementById('WCSTresponseCard').src = path_img;
        setTimeout(function () {
            $("#WCSTresponseCard").show();
            isKeyPressed = 0;
            startTime = Date.now();
        }, 1000);

    } else {
        state = 'WCSTEnd';
        WCSTstateTransitionToEnd();
    }

    if (countRight == 10) {
        classificationPrinceple = (classificationPrinceple + 1) % 3;
        countRight = 0;
        seriesNumber++;
    }
    WCSTlogKeyPressed(code, correctness);
}

function WCSTdisplayRight() {
    $('#WCSTright').show().delay(800).hide(1);
    countRight++;
    previousTrialWrongType = -1;
    currentTrialWrongType = -2;
    correctness = 1;
}

function WCSTdisplayWrong() {
    $('#WCSTwrong').show().delay(800).hide(1);
    countRight = 0;
    totalWrong++;
    correctness = 0;
}

function WCSTlogKeyPressed(code, correct) {
    var key_pressed = code;
    var reaction_time = (Date.now() - startTime);
    var correct = correct;

    var jsdata = {}

    jsdata["key_pressed"] = key_pressed;
    jsdata["reaction_time"] = reaction_time;
    jsdata["outcome"] = correct;
    jsondata.push(jsdata);
    // console.log("Normal "+jsondata);
    // console.log("JSONify "+JSON.stringify(jsondata));

    Seq++;
}

function WCSTstateTransitionToEnd() {		//At this state only the end instructions should appear (Thank you for participating...)
    $('#WCSTkeyCards').hide();
    $('#WCSTgameInstructions').hide();
    $('#WCSTwrong').hide();
    $('#WCSTright').hide();
    setTimeout(function () {
        $('#WCSTendInstructions').show();
    }, 1000);
}

function sendJson() {
    $.ajax({
        url: "/insert",
        data: JSON.stringify(jsondata),
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
    $("#WCSTinstructions").hide()
};
