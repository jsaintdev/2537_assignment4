let timer;
let time = 0;

let firstCard = undefined;
let secondCard = undefined;
let clicks = 0;
let matchedPairs = 0;
let pairsLeft;

let pairCheck = false;

const setup = () => {

  firstCard = undefined;
  secondCard = undefined;
  clicks = 0;
  matchedPairs = 0;
  pairsLeft = $(".card").length / 2;
  pairCheck = false;

  $('#clicks').text(clicks);
  $('#pairs-matched').text(matchedPairs);
  $('#pairs-left').text(pairsLeft);
  $('.card').removeClass('flip').off('click');

  // Flips cards and checks their values to see if they match
  $(".card").on(("click"), function () {

    // Prevents clicking if two cards are already being matched
    if (pairCheck) return;

    // Flips a card if flipped
    $(this).toggleClass("flip");
    clicks++;
    $('#clicks').text(clicks);

    // If nothing is clicked, assigns the first card clicked as "firstCard"
    if (!firstCard)
      firstCard = $(this).find(".front_face")[0]
    // If firstCard already exists, assigns the next card clicked as "secondCard"
    else {
      secondCard = $(this).find(".front_face")[0]
      console.log(firstCard, secondCard);
      pairCheck = true;

      // Prevents further clicks and checks if the two cards match
      setTimeout(() => {
        // Checks if the clicked cards match
        if (firstCard.src == secondCard.src) {
          console.log("match");
          $(`#${firstCard.id}`).parent().off("click");
          $(`#${secondCard.id}`).parent().off("click");
          matchedPairs++;
          pairsLeft--;
          $('#pairs-matched').text(matchedPairs);
          $('#pairs-left').text(pairsLeft);

          // Generates a pop-up if all the cards have been matched
          if (matchedPairs === $(".card").length / 2) {
            setTimeout(() => {
              alert("Congratulations! You matched all the pairs in " + time + " seconds.");
            }, 500);
            clearInterval(timer);
          }

          // Flips the cards back if they do not match and resets the variables
        } else {
          console.log("no match");
          $(`#${firstCard.id}`).parent().toggleClass("flip");
          $(`#${secondCard.id}`).parent().toggleClass("flip");
        }
        firstCard = undefined;
        secondCard = undefined;
        pairCheck = false;
      }, 1000);
    }
  });
}

const startGame = (difficulty) => {
  let numCards;
  let timeLimit;
  let gridSize;

  switch(difficulty) {
    case 'easy':
      numCards = 6;
      timeLimit = 30;
      gridSize = {width: "600px", height: "400px"};
      break;
    case 'medium':
      numCards = 12;
      timeLimit = 60;
      gridSize = {width: "800px", height: "600px"};
      break;
    case 'hard':
      numCards = 24;
      timeLimit = 90;
      gridSize = {width: "1200px", height: "800px"};
      break;
    default:
      numCards = 6;
      timeLimit = 30;
      gridSize = {width: "600px", height: "400px"};
  }

  $('#game_grid').css(gridSize);
  generateCards(numCards);

  $('.hidden').show();
  setup();
  time = 0;
  timer = setInterval(() => {
    time++;
    $('#timer').text(time);
    if (time >= timeLimit) {
      clearInterval(timer);
      $('.card').off('click');
      alert("Time's up!");
    }
  }, 1000);
}

const generateCards = (numCards) => {
  let gameGrid = $('#game_grid');
  gameGrid.empty();
  for (let i = 0; i < numCards / 2; i++) {
    let cardTemplate = 
    `<div class="card">
      <img id="img${i}a" class="front_face" src="${i}.png" alt="">
      <img class="back_face" src="back.webp" alt="">
    </div>
    <div class="card">
      <img id="img${i}b" class="front_face" src="${i}.png" alt="">
      <img class="back_face" src="back.webp" alt="">
    </div>`
  gameGrid.append(cardTemplate);;
  }
}

$(document).ready(function () {
  $('#start-button').on('click', function () {
    $('#menu').hide();
    $('.hidden').show();
    let difficulty = $("input[name='difficulty']:checked").val();
    time = 0;
    $('#timer').text(time);
    clearInterval(timer);
    startGame(difficulty);

  });

  $('#reset-button').on('click', function () {
    $('#menu').show();
    $('.hidden').hide();
    clearInterval(timer);
    setup();
  });
});