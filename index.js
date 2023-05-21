const setup = () => {

  let firstCard = undefined;
  let secondCard = undefined;
  let pairCheck
   = false;

  $(".card").on(("click"), function () {
    if (pairCheck
      ) return;

    $(this).toggleClass("flip");

    if (!firstCard)
      firstCard = $(this).find(".front_face")[0]
    else {
      secondCard = $(this).find(".front_face")[0]
      console.log(firstCard, secondCard);
      pairCheck
       = true;

      setTimeout(() => {
        if (
          firstCard.src ==
          secondCard.src
        ) {
          console.log("match");
          $(`#${firstCard.id}`).parent().off("click");
          $(`#${secondCard.id}`).parent().off("click");
        } else {
          console.log("no match");
          $(`#${firstCard.id}`).parent().toggleClass("flip");
          $(`#${secondCard.id}`).parent().toggleClass("flip");
        }
        firstCard = undefined;
        secondCard = undefined;
        pairCheck
         = false;
      }, 1000);
    }
  });
}

$(document).ready(setup)