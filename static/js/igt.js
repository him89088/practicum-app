
var totalcash = 2000, //cash in the cash pile
        deckAclicks = 0, //clicks for deck A
        deckBclicks = 0, //clicks for deck B
        deckCclicks = 0, //clicks for deck C
        deckDclicks = 0, //clicks for deck D
        totalclicks = 0, //total clicks. if == to MAXGAMES stop playing.  
        penalty = 0,   //penalty store for display
        netgain = 0,   //netgain store fpr display
       
        DECKA_WIN = 100, //how much did we win on Deck A click
        DECKB_WIN = 100, //how much did we win on Deck B click
        DECKC_WIN = 50, //how much did we win on Deck C click
        DECKD_WIN = 50, //how much did we win on Deck D click
	    CASHMAX = 7000, //Maximum amount of cash that can be won.	
	    MAXGAMES = 10; //maxium amount of plays 100

//Penaly schedules. If lookup DECKN_PENALTY[deckNclicks] to get the preset penalty amount. 
var DECKA_PENALTY = [0, 0, -150, 0, -300, 0, -200, 0, -250, -350, 0, -350, 0, -250, -200, 0, -300, -150, 0, 0, 0, -300, 0, -350, 0, -200, -250, -150, 0, 0, -350, -200, -250, 0, 0, 0, -150, -300, 0, 0];
var DECKB_PENALTY = [0, 0, 0, 0, 0, 0, 0, 0, -1250, 0, 0, 0, 0, -1250, 0, 0, 0, 0, 0, 0, -1250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1250, 0, 0, 0, 0, 0, 0, 0, 0];
var DECKC_PENALTY = [0, 0, -50, 0, -50, 0, -50, 0, -50, -50, 0, -25, -75, 0, 0, 0, -25, -75, 0, -50, 0, 0, 0, -50, -25, -50, 0, 0, -75, -50, 0, 0, 0, -25, -25, 0, -75, 0, -50, -75];
var DECKD_PENALTY = [0, 0, 0, 0, 0, 0, 0, 0, 0, -250, 0, 0, 0, 0, 0, 0, 0, 0, 0, -250, 0, 0, 0, 0, 0, 0, 0, 0, -250, 0, 0, 0, 0, 0, -250, 0, 0, 0, 0, 0];
var selectedCards = []; //stores the selections for output when the game is over.
var gain = [];
var loss = [];
var net = [];
var totcash = [];

let results = {};
var res;
var response = [];

function game(){
    $("#info").hide();
    $("#game").show();
    $(".card").click(function () {
        totalclicks++; //increment our click counter.
        //Note in order to end the game the person has to click MAXGAMES + 1 times. This is ok becuase the person is just clicking away.
        if (totalclicks <= MAXGAMES) {

            var clicked = $(this).attr("id"); //Get the id of the clicked deck
            switch (clicked) {                //Do something with that clicked deck id.
                case "card-one":
                    if (deckAclicks === DECKA_PENALTY.length)
                    {
                        //if we are at the end of the array reset our position back to the beginning. this is described in variants of this test.
                        deckAclicks = 0;
                    }   
                    penalty = DECKA_PENALTY[deckAclicks]; //get the penalty value
                    netgain = DECKA_WIN + penalty;          //get the net gain    
                    gain.push(DECKA_WIN);
                    loss.push(penalty);
                    net.push(netgain);                
                    $("#winamt").html(DECKA_WIN);           //output our win amount                   
                    deckAclicks++;                        //increment our position for penalty lookup
                    selectedCards.push("A");                //Add to our output of selected cards.
                    //$("#deck-one-clicks").html(deckoneclicks); debugging                    
                    break;

                case "card-two":
                    if (deckBclicks === DECKB_PENALTY.length) {
                        //if we are at the end of the array reset our position back to the beginning. this is described in variants of this test.
                        deckBclicks = 0;
                    }
                    penalty = DECKB_PENALTY[deckBclicks]; //get the penalty value
                    netgain = DECKB_WIN + penalty;          //get the net gain  
                    gain.push(DECKB_WIN);
                    loss.push(penalty);
                    net.push(netgain);                   
                    $("#winamt").html(DECKB_WIN);           //output our win amount                   
                    deckBclicks++;                        //increment our position for penalty lookup
                    selectedCards.push("B");                //Add to our output of selected cards.
                    //$("#deck-one-clicks").html(deckoneclicks); debugging          
                    break;

                case "card-three":
                    if (deckCclicks === DECKC_PENALTY.length) {
                        //if we are at the end of the array reset our position back to the beginning. this is described in variants of this test.
                        deckCclicks = 0;
                    }
                    penalty = DECKC_PENALTY[deckCclicks]; //get the penalty value
                    netgain = DECKC_WIN + penalty;          //get the net gain
                    gain.push(DECKC_WIN);
                    loss.push(penalty);
                    net.push(netgain);                    
                    $("#winamt").html(DECKC_WIN);           //output our win amount                   
                    deckCclicks++;                        //increment our position for penalty lookup
                    selectedCards.push("C");                //Add to our output of selected cards.
                    //$("#deck-one-clicks").html(deckoneclicks); debugging                    
                    break;

                case "card-four":
                    if (deckDclicks === DECKD_PENALTY.length) {
                        //if we are at the end of the array reset our position back to the beginning. this is described in variants of this test.
                        deckDclicks = 0;
                    }
                    penalty = DECKD_PENALTY[deckDclicks]; //get the penalty value
                    netgain = DECKD_WIN + penalty;          //get the net gain 
                    gain.push(DECKD_WIN);
                    loss.push(penalty);
                    net.push(netgain);                   
                    $("#winamt").html(DECKD_WIN);           //output our win amount                   
                    deckDclicks++;                        //increment our position for penalty lookup
                    selectedCards.push("D");                //Add to our output of selected cards.
                    //$("#deck-one-clicks").html(deckoneclicks); debugging                    
                    break;
            }

            $("#penaltyamt").html(penalty.toString());  //output the penalty
            $("#netgains").html(netgain.toString());    //output the net gain or loss
            totalcash += netgain;                       //increment our totals
            totcash.push(totalcash);                       
            //change the color of the font if we win or lose
            if (netgain <= 0)
                $(".outputtext").css("color", "red");
            else
                $(".outputtext").css("color", "green");

            if (totalcash < 0) totalcash = 0; //if total cash is negative make it 0.			               
            $("#totalmoney").html("€" + totalcash.toString());
            //calculate our cash bar and display
            var cashpilebarvalue = 100 * totalcash / CASHMAX;
            $("#cashpilebar").css("width", cashpilebarvalue.toString() + "%"); //grow or shrink the progress bar
            $("#cashpileamt").html("€" + totalcash);                            //change the label in the progress bar
        }
        else //game over 
        {
            $("#game").hide();
            alert("the game is over");
            $("#endigt").show(); 
            var i;
            
            for (i=0; i< MAXGAMES; i++){
                results = {
                selected: selectedCards[i],
                profit: gain[i],
                loss : loss[i],
                netamt: net[i],
                finalcash: totcash[i],
                }
                response.push(results);
                res = JSON.stringify(response);
            }
            // console.log(JSON.stringify(selectedCards));
            // console.log(JSON.stringify(gain));
            // console.log(JSON.stringify(loss));
            // console.log(JSON.stringify(net));
            // console.log(JSON.stringify(totcash));
            // // sendIGT(selectedCards, gain, loss, net, totalcash);
            // // let res = JSON.stringify(results);
            // console.log(res);
        }
    });
 }

function sendIGT(){
    $.ajax({
        url: "/insert_igt", 
        data: res, 
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
}
