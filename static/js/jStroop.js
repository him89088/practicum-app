
// jQuery( document ).ready(function( $ ) {
//   let s = new Stroop(10, 'practice');
//   jQuery(document).keypress(function(e) {
//     s.getResponse(e);
//   });
//   // let g = new Stroop(30, 'game');
//   // jQuery(document).keypress(function(e) {
//   //   g.getResponse(e);
//   // });
//   s.start();
//   // g.start();
//   jQuery(document).on('jStroopEnd', function(event, results) {
//     alert('Finished!');
//     console.log(results);
    
//   })
  

// });

function startGame(){
  $("#dialogArea").hide();
  $("#endStroop").hide();
  let s = new Stroop(5, 'practice');
  jQuery(document).keyup(function(e) {
    s.getResponse(e);
  });
  s.start();
}

class Stroop {

  constructor(maxCount, testType) {
    this.validKeys = ['r', 'g', 'b', 'y'];
    this.colors = [
      '#FF0000', // red
      '#00FF00', // green
      '#0000FF', // blue
      '#FFFF00', // yellow
      // '#FF69B4', //pink
      // '#FF5733', //orange
      // '#EE82EE', //violet
    ];
    this.colorKey = [
      'red', 'green', 'blue', 'yellow'
    ],

    // this.smokingWords = [
    //   'tobacco',
    //   'drag',
    //   'cigarette',
    //   'smoke',
    //   'ashtray',
    //   'puff',
    //   'lighter',
    //   'inhale',
    //   'smoking',
    //   'nicotine',

    //   'charm',
    //   'dear',
    //   'devotion',
    //   'excited',
    //   'joke',
    //   'peace',
    //   'playful',
    //   'pleasant',
    //   'sweet',
    //   'thrilled',

    //   'annoy',
    //   'awful',
    //   'boredom',
    //   'complain',
    //   'cruel',
    //   'gloomy',
    //   'tearful',
    //   'sadness',
    //   'sinful',
    //   'slum',

    //   'fan',
    //   'fence',
    //   'folder',
    //   'notebook',
    //   'pile',
    //   'portion',
    //   'reported',
    //   'sewing',
    //   'shift',
    //   'stand'
    // ];

    this.practiceWords = [
      'red',
      'blue',
      'yellow',
      'green',
      // 'red',
      // 'green',
      // 'yellow',
      // 'yellow',
      // 'blue',
      // 'green',
      // 'blue',
    ]

    this.autoAdvance;

    this.count = 0;
    this.maxCount = maxCount;

    if(testType == 'practice'){
      this.words = this.practiceWords;
    }

    else {
      this.words = this.smokingWords;
    }

    this.currentWord;
    this.currentColor;

    this.acceptInput;
    this.displayTime;

    this.responses = [];
  }

  start() {
    self = this;
    console.log("Stroop is starting");
    setTimeout(function() {
      self.next();
    }, 3000);
  }

  next() {
    clearTimeout(this.autoAdvance);
    this.acceptInput = true;
    if(this.count == this.maxCount) 
      this.end();
    self = this;
    this.currentWord = this.newWord();
    this.currentColor = this.newColor();
    this.displayWord();
    // If no key is pressed
    this.autoAdvance = setTimeout(function() {
      self.newResponse(0, false);
      self.displayIncorrect();
      setTimeout(function() {
        self.next();
      }, 1500);
    }, 3000);
  }

  getResponse(e) {
    let correct;
    self = this;
    if(this.validKeys.includes(e.key) && this.acceptInput) {
      clearTimeout(this.autoAdvance);
      if(this.validKeys.indexOf(e.key) == this.currentColor){
        correct = true;
        this.newResponse(e.key, correct);
        this.next();
      }
      else {
        correct = false;
        this.displayIncorrect();
        this.acceptInput = false;
        setTimeout(function() {
          self.next();
        }, 1500);
        this.newResponse(e.key, correct);
      }
    }
  }

  newResponse(key, correct) {
    var word = this.words[this.currentWord];
    var color = this.colorKey[this.currentColor];
    let compatible;
    if ((word=="red" && color == "red") || 
        (word=="green" && color == "green") || 
        (word=="blue" && color == "blue") || 
        (word=="yellow" && color == "yellow"))
      compatible = true;
    else
      compatible = false;
    let r = {
      word: this.words[this.currentWord],
      color: this.colorKey[this.currentColor],
      time: new Date().getTime() - this.displayTime,
      keyPressed: key,
      correct: correct,
      compatible : compatible
    }
    this.responses.push(r);
  }

  newWord() {
    let newWord = Math.floor(Math.random() * Math.floor(this.words.length));
    while(this.currentWord == newWord) {
      newWord = Math.floor(Math.random() * Math.floor(this.words.length));
    }
    return newWord;
  }

  newColor() {
    let newColor = Math.floor(Math.random() * Math.floor(this.colors.length));
    while(this.currentColor == newColor) {
      newColor = Math.floor(Math.random() * Math.floor(this.colors.length));
    }
    return newColor;
  }

  displayIncorrect() {
    let word = jQuery('.word');
    word.text('X').css({'color':self.colors[0]});
  }

  displayWord() {
    this.count++;
    this.displayTime = new Date().getTime();
    let self = this;
    let word = jQuery('.word');
    word.text('+').css({'color': '#000'});
    setTimeout(function() {
      console.log("Displaying " + self.words[self.currentWord]);
      word.text(self.words[self.currentWord]).css({'color':self.colors[self.currentColor]});
    }, 1000);
  }

  end() {
    let results = JSON.stringify(this.responses);
    $("#stroop").hide();   
    $("#endStroop").show();
    setValues(results);
    console.log(results);  

  }
}
var result_out;

function setValues(res){
  result_out = res;
}

function con(){
  $.ajax({
    url: "/insert_stroop", 
    data: result_out, 
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
