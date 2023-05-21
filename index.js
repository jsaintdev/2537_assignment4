const setup = () => {


  let firstCard = undefined;
  let secondCard = undefined;

  let clicks = 0;
  let matchedPairs = 0;
  let pairsLeft = $(".card").length / 2;

  let pairCheck = false;

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
              alert("Congratulations! You matched all the pairs.");
            }, 500);
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

$(document).ready(setup)