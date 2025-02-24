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

  const btcResponse = await fetch(
    "https://cointradermonitor.com/api/pbb/v1/ticker"
  );

  const btcValueRealTime = await btcResponse.json();

  const ethResponse = await fetch(
    "https://api.binance.com/api/v3/ticker/price?symbol=ETHBRL"
  );

  const ethValueRealTime = await ethResponse.json();

  return {
    dolar: coinsValueInRealTime.USDBRL.high,
    euro: coinsValueInRealTime.EURBRL.high,
    libra: 1 / libraValueRealTime.rates.GBP,
    bitcoin: btcValueRealTime.last,
    ethereum: ethValueRealTime.price,
  };
}

function getFormattedInputValue(fromCurrency) {
  const input = document.querySelector(".main-input").value;

  // Ajustar formato com base na moeda de origem
  if (fromCurrency === "real") {
    return parseFloat(input.replace(/\./g, "").replace(",", "."));
  }

  // Para dólar, euro, libra, btc e eth baseado em dol
  return parseFloat(input.replace(/,/g, ""));
}

async function convertValues() {
  const inputValue = getFormattedInputValue(selectConverter.value);
  try {
    if (isNaN(inputValue) || inputValue <= 0) {
      Toastify({
        text: "Adicione um valor e tente novamente!",
        duration: 2000,
        close: false,
        gravity: "top",
        position: "left",
        backgroundColor: "rgba(138, 81, 252, 1)",
        color: "#00ff00",
        className: "custom-toast",
      }).showToast();
      return;
    }

    const { dolar, euro, libra, bitcoin, ethereum } =
      await fetchExchangeRates();

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
      { dolar, euro, libra, bitcoin, ethereum }
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
    case "btc":
      valueInBRL = inputValue * rates.bitcoin;
      break;
    case "eth":
      valueInBRL = inputValue * rates.ethereum;
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
    case "btc":
      return valueInBRL / rates.bitcoin;
    case "eth":
      return valueInBRL / rates.ethereum;
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
    btc: { locale: "en-US", currency: "BTC" },
    eth: { locale: "en-US", currency: "ETH" },
  };

  const { locale, currency: curr } = currencyFormat[currency] || {};

  // Exibe até 8 casas decimais para o caso do bitcoin e ethereum
  if (currency === "btc" || currency == "eth") {
    return value.toFixed(8);
  }

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

  const formatCurrencyLabel = isConverter
    ? document.querySelector(".valor-converter")
    : document.querySelector(".valor-convertido");

  switch (selectElement.value) {
    case "real":
      currencyName.innerHTML = "Real";
      currencyImg.src = "./assets/real.png";
      formatCurrencyLabel.innerHTML = "R$ 0,00";
      break;
    case "dolar":
      currencyName.innerHTML = "Dólar";
      currencyImg.src = "./assets/dolar.png";
      formatCurrencyLabel.innerHTML = "US$ 0.00";
      break;
    case "euro":
      currencyName.innerHTML = "Euro";
      currencyImg.src = "./assets/euro.png";
      formatCurrencyLabel.innerHTML = "€ 0.00";
      break;
    case "libra":
      currencyName.innerHTML = "Libra";
      currencyImg.src = "./assets/libra.png";
      formatCurrencyLabel.innerHTML = "£ 0.00";
      break;
    case "btc":
      currencyName.innerHTML = "Bitcoin";
      currencyImg.src = "./assets/btc.png";
      formatCurrencyLabel.innerHTML = "₿ 0.00";
      break;
    case "eth":
      currencyName.innerHTML = "Ethereum";
      currencyImg.src = "./assets/eth.png";
      formatCurrencyLabel.innerHTML = "Ξ 0.00";
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
