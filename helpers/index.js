exports.getPercentageChangeNumberOnly = (currentNumber, prevNumber) => {
    console.log(`Current number is: ${currentNumber} and prev is ${prevNumber}`)
    const calc = (currentNumber - prevNumber) / prevNumber * 100
    return calc
}