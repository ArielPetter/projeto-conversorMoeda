const convertButton = document.querySelector(".main-button")

function convertValues(){
    const inputValue = document.querySelector(".main-input").value 
    const valueDolar = 4.95

    const convertedValue = inputValue / valueDolar
    console.log(convertedValue)
}

convertButton.addEventListener("click", convertValues)