$(document).ready(function(){
  var simonArr = [];
  var gameRunning = false;
  var acceptInput = false;
  var strict = false;
  
  var greenAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
  var redAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
  var yellowAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
  var blueAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");  
  var wrongAudio = new Audio("http://oringz.com/ringtone/served/sounds-913-served/");
  var winAudio = new Audio("http://oringz.com/ringtone/expect-good-news/79_high-gong/");
  
  function simonGen(){
    var newBtn = Math.random();
    if (newBtn < 0.25){
      simonArr.push("green");
    } else if (newBtn < 0.5){
      simonArr.push("red");
    } else if (newBtn < 0.75){
      simonArr.push("yellow");
    } else {
      simonArr.push("blue");
    }
  };
  
  function playButton(optArgument){
    var btnName = optArgument;
    var button = document.getElementById(btnName);
    var activeClass = btnName + "Active";
    //switch statement to trigger audio for button presses
    switch(btnName){
      case "green":
        greenAudio.play();
        break;
      case "red":
        redAudio.play();
        break;
      case "yellow":
        yellowAudio.play();
        break;
      case "blue":
        blueAudio.play();
        break;
    }
    button.classList.add(activeClass);
    acceptInput = false;
    var removeClass = function(){
      button.classList.remove(activeClass);
      acceptInput = true;
    };
    setTimeout(removeClass,450);
  };
  
  function wrongButton(optArgument){
    var btnName = optArgument;
    var button = document.getElementById(btnName);
    var activeClass = btnName + "Active";
    wrongAudio.play();
    button.classList.add(activeClass);
    var removeClass = function(){
      button.classList.remove(activeClass);
    };
    setTimeout(removeClass,250);
  };
  
  function simonIterates(){
    acceptInput = false;
    var index = 0;
    function simonCounter(){
      setTimeout(function(){
        playButton(simonArr[index]);
        index += 1;
        if (index < simonArr.length){
          simonCounter();
        } else {
          compareToSimon();
        }
      }, 750);
    }
    simonCounter();
  };
  
  function showScore() {
    var length = simonArr.length;
    var currentScore;
    if (length < 10){
      currentScore = "0" + length;
    } else {
      currentScore = length;
    }
    $("#scoreDisplay").text(currentScore);
  };
  
  function simonSay(){
    acceptInput = false;
    simonGen();
    simonIterates();
  };
  
  function compareToSimon(){
    if (!gameRunning){
      return false;
    }
    acceptInput = true;
    var currentIndex = 0;
    $(".gameButton").off().on("click", function(){
      var color = this.id;
      if (acceptInput && color === simonArr[currentIndex]){
        playButton(color);
        currentIndex += 1;
        if (currentIndex === 20){ //win condition
          gameRunning = false;
          showScore();
          setTimeout(function(){
            winAudio.play();
          },1000);
          setTimeout(function(){
            alert("a winner is you");
          }, 3000);
        } else if (currentIndex === simonArr.length){
          acceptInput = false;
          showScore();
          setTimeout(simonSay, 500);
        }
      } else if (gameRunning && acceptInput && color !== simonArr[currentIndex]){
        //play wrongButton sound;
        wrongButton(color);
        acceptInput = false;
        if (strict){
          simonArr = [];
          showScore();
          setTimeout(simonSay, 500);
        } else {
          setTimeout(simonIterates,500);
        }
      }
    });
  }
  
  function powerToggle(){
    if (!gameRunning){
      gameRunning = true;
      $("#powerButton").addClass("powerOn");
      $("#scoreDisplay").text("00");
      simonSay();
    } else if (gameRunning){
      gameRunning = false;
      acceptInput = false;
      $("#scoreDisplay").text("--");
      $("#powerButton").removeClass("powerOn");
      simonArr = [];
    }    
  }
  
  $("#powerButton").on("click",powerToggle);
  
  $("#strictButton").on("click",function(){
    if (strict){
      this.classList.remove("strictOn");
      strict = false;
    } else if (!strict){
      this.classList.add("strictOn");
      strict = true;
    }
  });  
});
