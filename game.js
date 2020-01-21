const buttonColors = ["red", "blue", "green", "yellow"]

let gamePattern = []
let userClickedPattern = []

let gameStarted = false
let level = 0

setHighScore(level)

$(".btn").click(function() {
  let userChosenColor = this.id
  userClickedPattern.push(userChosenColor)
  playSound(userChosenColor)
  animatePress(userChosenColor)
  checkAnswer(userClickedPattern.length -1)
})

$(document).keypress(function(event){
  if(event.which == 13) {
    if(!gameStarted) {
      gameStarted = true
      $('#level-title').text(`Level ${level}`)
      nextSequence()
    }
  }
})

$('#reset').click(resetHighScore)

function nextSequence() {
  userClickedPattern = []

  level += 1
  $('#level-title').text(`Level ${level}`)

  let randomNumber = Math.floor(Math.random() * 4)

  let randomChosenColor = buttonColors[randomNumber]

  gamePattern.push(randomChosenColor)

  flashSequence()
}

function flashSequence() {

  const delay = (amount = number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, amount);
    });
  }

  async function loop() {
   for (let i = 0; i < gamePattern.length; i++) {
     $(`#${gamePattern[i]}`).fadeOut(100).fadeIn(100)
     playSound(gamePattern[i])
     await delay(500);
    }
  }

  loop()
}

function playSound(name) {
  let audio = new Audio(`sounds/${name}.mp3`)
  audio.play()
}

function animatePress(currentColor) {
  $(`.${currentColor}`).addClass("pressed")

  setTimeout(function(){
    $(`.${currentColor}`).removeClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel) {
  if(gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length){
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong")

    $("body").addClass("game-over")

    setTimeout(function(){
      $("body").removeClass("game-over");
    }, 200);

    $("#level-title").text(`Game Over at level ${level}. Press Enter To Restart`)

    startOver()
  }
}

function updateHighScore() {
  let currentHighScore = localStorage.getItem('highScore')
  if(currentHighScore < level) {
    localStorage.setItem('highScore', level)
    $('#high-score').text(`High Score: ${level}`)
  }
}

function setHighScore() {
  let currentHighScore = localStorage.getItem('highScore')

  if(currentHighScore) {
    $('#high-score').text(`High Score: ${currentHighScore}`)
  }
}

function resetHighScore() {
  localStorage.setItem('highScore', 0)
  setHighScore()
}

function startOver() {
  updateHighScore()

  level = 0
  gamePattern = []
  gameStarted = false
}
