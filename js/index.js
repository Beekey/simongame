$(document).ready(function() {
  // define different sound for each of the buttons
  var audioRed = new Audio("https://raw.githubusercontent.com/Beekey/simongame/master/sounds/simonRed.mp3");
  var audioBlue = new Audio("https://raw.githubusercontent.com/Beekey/simongame/master/sounds/simonBlue.mp3");
  var audioYellow = new Audio("https://raw.githubusercontent.com/Beekey/simongame/master/sounds/simonYellow.mp3");
  var audioGreen = new Audio("https://raw.githubusercontent.com/Beekey/simongame/master/sounds/simonGreen.mp3");
  // preload sounds
  audioRed.load();
  audioBlue.load();
  audioYellow.load();
  audioGreen.load();
  var ww, wh, wrapperWidth; // ww is viewing window width, wh is window height, wrapper holds the Simon game elements
  var orderOfPlay = ""; // random sequence of digits (0-3) each corresponding to one button/sound
  var sequenceGuess = ""; // sequence of digits entered by the player in an attempt to replicate orderOfPlay sequence
  var playSequence; // holds setInterval that is used to play the computer generated sequence
  var i = 0; //counter keeps track of the index of the currently played orderOfPlay button/sound
  var tempo = 1300; // retulates speed at which orderOfPlay is played, the lower it is, the faster sequence plays
  var notPlayingSequence = true; // primarily used to detect when to disable use of gred/gree/blue/yellow buttons
  var gettingSequence = false; // detect when the player is entering their version of the sequence so the sequence is recorded
  var gameOn = false; // detect if the game was turned on by using the red on/off switch
  var strictOn = false; // detect if the strict mode is turned on 
  var repeat = false; // detect if the sequence is being repeated after an error (when mode is not strict) so that no new sound/button would be added to the orderOfPlay in case it is a repeated sequence

  // compare viewing window width and height, make simon game width 90% of the smaller dimension
  // don't change anything if width or height is less than 320px
  function resizeImage() {
    ww = $(window).width();
    wh = $(window).height();
    if (ww > 320 && wh > 320) {
      if (ww > wh) wrapperWidth = wh * 0.9;
      else wrapperWidth = ww * 0.9;
      // change font-size, padding and other properties to match the size of the wrapper
      $("#simon_logo").css("font-size", wrapperWidth / 9.5 + "px");
      $("#reg").css("font-size", wrapperWidth / 19 + "px");
      $("#developer").css("font-size", wrapperWidth / 42 + "px");
      $("#screen").css({
        "font-size": wrapperWidth / 21 + "px",
        "padding": wrapperWidth / 173 + "px 0 " + wrapperWidth / 159 + "px " + wrapperWidth / 119 + "px",
        "letter-spacing": wrapperWidth / 170 + "px",
        "-webkit-border-radius": wrapperWidth / 55 + "px",
        "-moz-border-radius": wrapperWidth / 55 + "px",
        "border-radius": wrapperWidth / 55 + "px",
        "border": wrapperWidth / 100 + "px solid #333"
      });
      $(".functions_text").css("font-size", wrapperWidth / 47 + "px");
      $(".functions_button").css("border", wrapperWidth / 97 + "px solid #222");
      $(".functions_text_button").css("font-size", wrapperWidth / 37 + "px");
      $("#strict_light").css("border", wrapperWidth / 142 + "px solid #222");
      wrapperWidth += "px";
      $("#wrapper").css({
        "width": wrapperWidth,
        "height": wrapperWidth
      });

    }
  }
  // set the size of wrapper and it's elements so the game fits into the screen
  resizeImage();
  // if window is resized, adjust the size of the wrapper
  $(window).bind('resize', function() {
    resizeImage();
  });
  // play the computer generated random of buttons/sounds
  function playSeries() {
    gettingSequence = false;
    // if a button/sound needs to be added to the sequence add a random one
    if (!repeat) orderOfPlay += Math.floor(Math.random() * 4);
    // reset repeat to false as player will be given a chance to play the sequence correctly after the sequence is played by the computer
    repeat = false;
    // show current level on the screen
    $("#screen").text("LEVEL: " + orderOfPlay.length);
    //start counter of the position in the sequence that is being played
    i = 0;
    notPlayingSequence = false;
    if (orderOfPlay.length < 5) tempo = 1300;
    else if (orderOfPlay.length < 9) tempo = 1200;
    else if (orderOfPlay.length < 13) tempo = 1100;
    else tempo = 900;
    // set an setInterval to play the sequence - one sound/button in each repetition
    playSequence = setInterval(function() {
      switch (orderOfPlay[i]) {
        case "0":
          playGreen();
          break;
        case "1":
          playRed();
          break;
        case "2":
          playBlue();
          break;
        case "3":
          playYellow();
          break;
      }
      i++;
      //  if the end of the sequence was reached clear the interval and prepare to start getting the sequence entered by the player
      if (i === orderOfPlay.length) setTimeout(function() {
        clearInterval(playSequence);
        $("#screen").text("REPEAT");
        gettingSequence = true;
        notPlayingSequence = true;
        sequenceGuess = "";
      }, 500);
    }, tempo);
  }

  function endGame() {
    notPlayingSequence = true;
    orderOfPlay = "";
    sequenceGuess = "";
    gettingSequence = false;
    repeat = false;
    clearInterval(playSequence);
  }

  function checkSequence() {
    // check if the part of the sequence entered by player is the same as the same part of the computer generated sequence that they player is attempting to repeat
    if (sequenceGuess !== orderOfPlay.substr(0, sequenceGuess.length)) {
      // if the sequence is incorrect print an error on the screen and either end game (in case of strict mode) or 
      // play previous sequence again and let the player try guessing it again
      $("#screen").text("ERROR ");
      setTimeout(function() {
        if (strictOn) {
          endGame();
          $("#screen").text("NEW GAME");
          setTimeout(function() {
            playSeries();
          }, 900);
        } else {
          $("#screen").text("TRY AGAIN");
          setTimeout(function() {
            repeat = true;
            playSeries();
          }, 900);
        }
      }, 900);
    } else {
      // if sequence was repeated correctly and the level is not 20 yet go on to play a new longer sequence
      if (sequenceGuess === orderOfPlay) {
        $("#screen").text("CORRECT ");
        setTimeout(function() {
          if (orderOfPlay.length < 20) setTimeout(function() {
            playSeries();
          }, 500);
          // if level 20 was reached end game and let the player know they won the game
          // after that game will idle... to play again player will need to press start button
          else {
            endGame();
            $("#screen").text("YOU WIN!");
          }
        }, 300);
      }
    }
  }

  function playBlue() {
    audioBlue.play();
    $("#blue").css("background-color", "skyblue");
    setTimeout(function() {
      $("#blue").css("background-color", "royalblue");
    }, 400);
    if (gettingSequence) {
      sequenceGuess += "2";
      checkSequence();
    }
  }

  function playYellow() {
    audioYellow.play();
    $("#yellow").css("background-color", "#FFFF2B");
    setTimeout(function() {
      $("#yellow").css("background-color", "gold");
    }, 400);
    if (gettingSequence) {
      sequenceGuess += "3";
      checkSequence();
    }
  }

  function playRed() {
    audioRed.play();
    $("#red").css("background-color", "#FF4A4A");
    setTimeout(function() {
      $("#red").css("background-color", "red");
    }, 400);
    if (gettingSequence) {
      sequenceGuess += "1";
      checkSequence();
    }
  }

  function playGreen() {
    audioGreen.play();
    $("#green").css("background-color", "springgreen");
    setTimeout(function() {
      $("#green").css("background-color", "limegreen");
    }, 400);
    if (gettingSequence) {
      sequenceGuess += "0";
      checkSequence();
    }
  }
  $("#developer").hover(function() {
      $("#developer").css("color", "#bbb");
    }, function() {
      $("#developer").css("color", "#777");
    })
    // switch game on and off using the red slider button
  $("#switch").on("click", function() {
    if (gameOn === true) {
      gameOn = false;
      strictOn = false;
      $("#strict_light").css("background-color", "#317631");
      notPlayingSequence = true;
      orderOfPlay = "";
      sequenceGuess = "";
      clearInterval(playSequence);
      repeat = false;
      $(this).css("left", "3%");
      $(this).prop("title", "Turn the game on");
      $("#screen").text("GOODBYE");
      setTimeout(function() {
        $("#screen").text("");
        $("#screen").css("background-color", "#999");
      }, 1000);
    } else {
      gameOn = true;
      $(this).css("left", "49%");
      $("#screen").text("WELCOME");
      setTimeout(function() {
        $("#screen").text("LET'S GO!");
      }, 700);
      $(this).prop("title", "Turn the game off");
      $("#screen").css("background-color", "#C6D59C");
    }
  })
  $("#strict").on("click", function() {
    if (gameOn) {
      if (strictOn === false) {
        strictOn = true;
        $("#strict_light").css("background-color", "Chartreuse ");
      } else {
        strictOn = false;
        $("#strict_light").css("background-color", "#317631");
      }
    }
  })
  $("#yellow").on("click", function() {
    if (notPlayingSequence) playYellow();
  })
  $("#red").on("click", function() {
    if (notPlayingSequence) playRed();
  })
  $("#blue").on("click", function() {
    if (notPlayingSequence) playBlue();
  })
  $("#green").on("click", function() {
    if (notPlayingSequence) playGreen();
  })

  $("#start").on("click", function() {
    if (gameOn) {
      endGame();
      playSeries();
    }
  })

})