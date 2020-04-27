
function startGame() {
  $("#dialogArea").hide();
  $("#endStroop").hide();
  $(".err").show();

  let s = new Stroop(100, 'game');
  $("button").click(function() {
    var e = $(this).val();
    console.log(e);
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
      '#FFF200', // yellow
    ];
    this.colorKey = [
      'red', 'green', 'blue', 'yellow'
    ],

      this.gameWords = [
        'red',
        'blue',
        'yellow',
        'green',
      ]

    this.autoAdvance;

    this.count = 0;
    this.maxCount = maxCount;

    if (testType == 'game') {
      this.words = this.gameWords;
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
    self.next();
    setTimeout(function () {
      $(".btn-keys").show();
    }, 100);
  
  }

  next() {
    this.acceptInput = true;
    if (this.count == this.maxCount)
      this.end();
    self = this;
    this.currentWord = this.newWord();
    this.currentColor = this.newColor();
    this.displayWord();
  }

  getResponse(e) {
    let correct;
    self = this;
    if (this.validKeys.includes(e) && this.acceptInput) {
      if (this.validKeys.indexOf(e) == this.currentColor) {
        correct = true;
        this.displayCorrect();
        setTimeout(function () {
          self.next();
        }, 800);
        this.newResponse(e, correct);
        // this.next();
      }
      else {
        correct = false;
        this.displayIncorrect();
        this.acceptInput = false;
        setTimeout(function () {
          self.next();
        }, 800);
        // this.next();
        this.newResponse(e, correct);
      }
    }
  }

  newResponse(key, correct) {
    var word = this.words[this.currentWord];
    var color = this.colorKey[this.currentColor];
    let compatible;
    if ((word == "red" && color == "red") ||
      (word == "green" && color == "green") ||
      (word == "blue" && color == "blue") ||
      (word == "yellow" && color == "yellow"))
      compatible = true;
    else
      compatible = false;
    let r = {
      word: this.words[this.currentWord],
      color: this.colorKey[this.currentColor],
      time: new Date().getTime() - this.displayTime,
      keyPressed: key,
      correct: correct,
      compatible: compatible
    }
    this.responses.push(r);
  }

  newWord() {
    let newWord = Math.floor(Math.random() * Math.floor(this.words.length));
    while (this.currentWord == newWord) {
      newWord = Math.floor(Math.random() * Math.floor(this.words.length));
    }
    return newWord;
  }

  newColor() {
    let newColor = Math.floor(Math.random() * Math.floor(this.colors.length));
    while (this.currentColor == newColor) {
      newColor = Math.floor(Math.random() * Math.floor(this.colors.length));
    }
    return newColor;
  }

  displayIncorrect() {
    let word = jQuery('.word');
    word.text('X').css({ 'color': self.colors[0] });
  }

  displayCorrect(){
    let word = jQuery('.word');
    word.text('+').css({ 'color': '#000' });
  }

  displayWord() {
    this.count++;
    this.displayTime = new Date().getTime();
    let self = this;
    let word = jQuery('.word');
    setTimeout(function () {
      word.text(self.words[self.currentWord]).css({ 'color': self.colors[self.currentColor] });
    }, 100);
  }

  end() {
    let results = JSON.stringify(this.responses);
    $("#stroop").hide();
    $('.btn-keys').hide();
    $(".err").hide();
    $("#endStroop").show();
    setValues(results);
    console.log(results);
  }
}
var result_out;

function setValues(res) {
  result_out = res;
}

function con() {
  $.ajax({
    url: "/insert_stroop",
    data: result_out,
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
}
