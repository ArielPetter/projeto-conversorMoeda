const convertButton = document.querySelector(".main-button");
const select = document.querySelector(".select-convertido");

function convertValues() {
  const inputValue = document.querySelector(".main-input").value; // valor input
  const valueDolar = 4.95;
  const valueEuro = 5.38;
  const valueLibra = 6.27;
  const valueToConvert = document.querySelector(".valor-converter"); // valor a converter
  const valueToConverted = document.querySelector(".valor-convertido"); // valor convertido

  if (select.value == "dolar") {
    // quando dolar selecionado
    valueToConverted.innerHTML = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(inputValue / valueDolar);
  }

  if (select.value == "euro") {
    // quando euro estiver selecionado
    valueToConverted.innerHTML = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(inputValue / valueEuro);
  }

  if (select.value == "libra") { //libra estiver selecionado
    valueToConverted.innerHTML = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP"
    }).format(inputValue / valueLibra);
  }

  valueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(inputValue);
}

function changeCurrency() {
  const currencyName = document.getElementById("nome-convertido") // nome da moeda
  const currencyImg = document.querySelector(".bandeira-convertida") // bandeira
  const valueToConverted = document.querySelector(".valor-convertido"); // valor convertido

  if (select.value == "dolar") {
    currencyName.innerHTML = "Dólar americano"
    currencyImg.src = "./assets/dolar.png"
    valueToConverted.innerHTML = "US$ 0,00" 
  }

  if (select.value == "euro") {
    currencyName.innerHTML = "Euro"
    currencyImg.src = "./assets/euro.png"
    valueToConverted.innerHTML = "0,00 €"
  }
}


select.addEventListener("change", changeCurrency);
convertButton.addEventListener("click", convertValues);