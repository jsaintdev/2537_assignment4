let timer;
let time = 0;

let firstCard = undefined;
let secondCard = undefined;
let clicks = 0;
let matchedPairs = 0;
let pairsLeft;
let powerUpChance = 0;

let pairCheck = false;

const setup = () => {
  firstCard = undefined;
  secondCard = undefined;
  clicks = 0;
  matchedPairs = 0;
  pairsLeft = $(".card").length / 2;
  pairCheck = false;
  powerUpChance = 0;

  $('#clicks').text(clicks);
  $('#pairs-matched').text(matchedPairs);
  $('#pairs-left').text(pairsLeft);
  $('.card').removeClass('flip').off('click').removeClass('matched');
  $('#time-remaining').text(0);

  rebindClickHandler();
};


const clickHandler = function () {
  // Prevents clicking if two cards are already being matched
  if (pairCheck) return;

  // Check if card is already flipped
  if ($(this).hasClass('flip')) return;

  // Flips a card if flipped
  $(this).toggleClass("flip");
  clicks++;
  $('#clicks').text(clicks);

  // If nothing is clicked, assigns the first card clicked as "firstCard"
  if (!firstCard) {
    firstCard = $(this).find(".front_face")[0];
  // unbind click handler for firstCard
  $(this).off("click");
  // If firstCard already exists, assigns the next card clicked as "secondCard"
  } else {
    secondCard = $(this).find(".front_face")[0];
    console.log(firstCard, secondCard);
    pairCheck = true;

    // Prevents further clicks and checks if the two cards match
    setTimeout(() => {
      // Checks if the clicked cards match
      if (firstCard.src == secondCard.src) {
        console.log("match");
        $(`#${firstCard.id}`).closest('.card').addClass('matched').off("click");
        $(`#${secondCard.id}`).closest('.card').addClass('matched').off("click");
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

        // Rebind click handler for firstCard
        $(`#${firstCard.id}`).closest('.card').on("click", clickHandler);

        // Increase chance for power-up every two clicks
        if (clicks % 2 == 0 && powerUpChance < 0.4) {
          powerUpChance += 0.05;
        }

        // Power-up event
        if (Math.random() < powerUpChance) {
          powerUpChance = 0; // Reset the chance after power-up

          // Ensure that matched cards do not respond to the power-up event
          $('.card').each(function () {
            if (!$(this).hasClass('matched')) {
              $(this).addClass('flip');
            }
          });

          alert("Power-up activated!");

          setTimeout(() => {
            // Ensure that matched cards do not respond to the power-up event
            $('.card').each(function () {
              if (!$(this).hasClass('matched')) {
                $(this).removeClass('flip');
              }
            });
            rebindClickHandler();
          }, 1000);
        }
      }
      firstCard = undefined;
      secondCard = undefined;
      pairCheck = false;
    }, 1000);
  }
};

const rebindClickHandler = () => {
  $(".card").off('click').on("click", clickHandler);
};

const startGame = async (difficulty) => {
  let numCards;
  let timeLimit;
  let gridSize;

  $('#game_grid').removeClass('grid-easy grid-medium grid-hard');

  switch (difficulty) {
    case 'easy':
      numCards = 6;
      timeLimit = 30;
      gridSize = {
        width: "600px",
        height: "400px"
      };
      $('#game_grid').addClass('grid-easy');
      break;
    case 'medium':
      numCards = 12;
      timeLimit = 60;
      gridSize = {
        width: "800px",
        height: "600px"
      };
      $('#game_grid').addClass('grid-medium');
      break;
    case 'hard':
      numCards = 24;
      timeLimit = 90;
      gridSize = {
        width: "1200px",
        height: "800px"
      };
      $('#game_grid').addClass('grid-hard');
      break;
    default:
      numCards = 6;
      timeLimit = 30;
      gridSize = {
        width: "600px",
        height: "400px"
      };
      $('#game_grid').addClass('grid-easy');
  }

  $('#total-pairs').text(numCards / 2);
  $('#time-remaining').text(timeLimit);

  $('#game_grid').css(gridSize);

  let pokemonData = await getPokemonData(numCards);
  generateCards(pokemonData);

  $('.hidden').show();
  setup();
  time = 0;
  timer = setInterval(() => {
    time++;
    $('#timer').text(time);
    $('#time-remaining').text(timeLimit - time);
    if (time >= timeLimit) {
      clearInterval(timer);
      $('.card').off('click');
      alert("Time's up!");
    }
  }, 1000);
}

const getPokemonData = async (numCards) => {
  let pokemonData = [];
  let ids = new Set();
  while (pokemonData.length < numCards) {
    let id = Math.floor(Math.random() * 649) + 1;
    if (!ids.has(id)) {
      ids.add(id);
      try {
        let res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (res.data.sprites.other['official-artwork'].front_default) {
          pokemonData.push(res.data.sprites.other['official-artwork'].front_default);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
  return pokemonData;
}


const generateCards = (pokemonData) => {

  let cardArray = [];
  for (let i = 0; i < pokemonData.length / 2; i++) {
    cardArray.push(
      `<div class="card">
        <img id="img${i}a" class="front_face" src="${pokemonData[i]}" alt="">
        <img class="back_face" src="back.webp" alt="">
      </div>`,
      `<div class="card">
        <img id="img${i}b" class="front_face" src="${pokemonData[i]}" alt="">
        <img class="back_face" src="back.webp" alt="">
      </div>`
    );
  }

  for (let i = cardArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [cardArray[i], cardArray[j]] = [cardArray[j], cardArray[i]];
  }

  let gameGrid = $('#game_grid');
  gameGrid.empty();
  for (let i = 0; i < cardArray.length; i++) {
    gameGrid.append(cardArray[i]);
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
    $('#game_grid').empty();
    setup();
  });

  $('.btn-success').on('click', function () {
    $('#game_grid').css('background-color', 'green');
    $('#game_grid img').css('background-color', 'green');
  });


  $('.btn-info').on('click', function () {
    $('#game_grid').css('background-color', 'blue');
    $('#game_grid img').css('background-color', 'blue');
  });

  $('.btn-danger').on('click', function () {
    $('#game_grid').css('background-color', 'red');
    $('#game_grid img').css('background-color', 'red');
  });

  $('.btn-warning').on('click', function () {
    $('#game_grid').css('background-color', 'yellow');
    $('#game_grid img').css('background-color', 'yellow');
  });

  $('.btn-light').on('click', function () {
    $('#game_grid').css('background-color', 'white');
    $('#game_grid img').css('background-color', 'white');
  });

  $('.btn-dark').on('click', function () {
    $('#game_grid').css('background-color', 'black');
    $('#game_grid img').css('background-color', 'black');
  });

});