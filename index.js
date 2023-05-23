let timer;
let time = 0;

let firstCard = undefined;
let secondCard = undefined;
let clicks = 0;
let matchedPairs = 0;
let pairsLeft;

let pairCheck = false;

const setup = async () => {


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

const startGame = async (difficulty) => {
  let numCards;
  let timeLimit;
  let gridSize;

  $('#game_grid').removeClass('grid-easy grid-medium grid-hard');

  switch(difficulty) {
    case 'easy':
      numCards = 6;
      timeLimit = 30;
      gridSize = {width: "600px", height: "400px"};
      $('#game_grid').addClass('grid-easy');
      break;
    case 'medium':
      numCards = 12;
      timeLimit = 60;
      gridSize = {width: "800px", height: "600px"};
      $('#game_grid').addClass('grid-medium');
      break;
    case 'hard':
      numCards = 24;
      timeLimit = 90;
      gridSize = {width: "1200px", height: "800px"};
      $('#game_grid').addClass('grid-hard');
      break;
    default:
      numCards = 6;
      timeLimit = 30;
      gridSize = {width: "600px", height: "400px"};
      $('#game_grid').addClass('grid-easy');
  }

  $('#game_grid').css(gridSize);

  let pokemonData = await getPokemonData(numCards);
  generateCards(pokemonData);

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
});