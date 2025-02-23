const convertButton = document.querySelector(".main-button");
const selectConverter = document.querySelector(".select-converter");
const selectConverted = document.querySelector(".select-convertido");
const resetValue = document.querySelector(".main-input");

async function fetchExchangeRates() {
  const response = await fetch(
    "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL"
  );
  const coinsValueInRealTime = await response.json();

  const libraResponse = await fetch(
    "https://api.exchangerate-api.com/v4/latest/BRL"
  );
  const libraValueRealTime = await libraResponse.json();

  return {
    dolar: coinsValueInRealTime.USDBRL.high,
    euro: coinsValueInRealTime.EURBRL.high,
    libra: 1 / libraValueRealTime.rates.GBP,
  };
}

async function convertValues() {
  const inputValue = parseFloat(document.querySelector(".main-input").value);
  try {
    if (isNaN(inputValue) || inputValue <= 0) {
      Toastify({
        text: "Adicione um valor e tente novamente!",
        duration: 2000, // Duração em milissegundos
        close: false, // Exibe um botão de fechar
        gravity: "top", // Posição do toast: "top" ou "bottom"
        position: "left", // Posição do toast: "left", "center", "right"
        backgroundColor: "rgba(138, 81, 252, 1)", // Cor de fundo (rgba)
        color: "#00ff00", // Cor do texto (letras)
        className: "custom-toast",
      }).showToast();
      return;
    }

    const { dolar, euro, libra } = await fetchExchangeRates();

    const valueToConvert = document.querySelector(".valor-converter");
    const valueToConverted = document.querySelector(".valor-convertido");

    valueToConvert.innerHTML = formatCurrency(
      inputValue,
      selectConverter.value
    );
    const convertedValue = calculateConversion(
      inputValue,
      selectConverter.value,
      selectConverted.value,
      { dolar, euro, libra }
    );

    valueToConverted.innerHTML = formatCurrency(
      convertedValue,
      selectConverted.value
    );
  } finally {
    resetValue.value = "";
  }
}

function calculateConversion(inputValue, from, to, rates) {
  if (from === to) return inputValue;

  let valueInBRL;

  // Converter tudo para BRL primeiro
  switch (from) {
    case "real":
      valueInBRL = inputValue;
      break;
    case "dolar":
      valueInBRL = inputValue * rates.dolar;
      break;
    case "euro":
      valueInBRL = inputValue * rates.euro;
      break;
    case "libra":
      valueInBRL = inputValue * rates.libra;
      break;
    default:
      return inputValue;
  }

  // Converter de BRL para a moeda de destino
  switch (to) {
    case "real":
      return valueInBRL;
    case "dolar":
      return valueInBRL / rates.dolar;
    case "euro":
      return valueInBRL / rates.euro;
    case "libra":
      return valueInBRL / rates.libra;
    default:
      return valueInBRL;
  }
}

function formatCurrency(value, currency) {
  const currencyFormat = {
    real: { locale: "pt-BR", currency: "BRL" },
    dolar: { locale: "en-US", currency: "USD" },
    euro: { locale: "de-DE", currency: "EUR" },
    libra: { locale: "en-GB", currency: "GBP" },
  };

  const { locale, currency: curr } = currencyFormat[currency] || {};
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: curr,
  }).format(value);
}

function changeCurrency(selectElement, isConverter = false) {
  const currencyName = isConverter
    ? document.getElementById("nome-converter")
    : document.getElementById("nome-convertido");
  const currencyImg = isConverter
    ? document.querySelector(".bandeira-converter")
    : document.querySelector(".bandeira-convertida");

  switch (selectElement.value) {
    case "real":
      currencyName.innerHTML = "Real";
      currencyImg.src = "./assets/real.png";
      break;
    case "dolar":
      currencyName.innerHTML = "Dólar";
      currencyImg.src = "./assets/dolar.png";
      break;
    case "euro":
      currencyName.innerHTML = "Euro";
      currencyImg.src = "./assets/euro.png";
      break;
    case "libra":
      currencyName.innerHTML = "Libra";
      currencyImg.src = "./assets/libra.png";
      break;
    default:
      console.error("Moeda não reconhecida");
      break;
  }
}

selectConverter.addEventListener("change", () =>
  changeCurrency(selectConverter, true)
);
selectConverted.addEventListener("change", () =>
  changeCurrency(selectConverted, false)
);
convertButton.addEventListener("click", convertValues);
