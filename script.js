const convertButton = document.querySelector(".main-button")

function convertValues(){
    const inputValue = document.querySelector(".main-input").value // valor input
    const valueDolar = 4.95
    const convertedValue = inputValue / valueDolar // valor do input / pelo dólar
    const valueToConvert = document.querySelector(".valor-converter") // valor a converter 
    const valueToConverted = document.querySelector(".valor-convertido") // valor convertido

    valueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(inputValue)
    valueToConverted.innerHTML = new Intl.NumberFormat("en-US", {
        style:"currency",
        currency:"USD"
    }).format(convertedValue)
}

convertButton.addEventListener("click", convertValues)



