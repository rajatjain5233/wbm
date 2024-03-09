function calculateSuperTrend(time,highPrices, lowPrices, closePrices, multiplier, length) {
    // console.log("calculateSuperTrend",highPrices,lowPrices)
    const hl2Values = calculateHL2(highPrices, lowPrices);
    const atrValues = calculateATR(highPrices, lowPrices, closePrices, length);

    let basicUpperBand = [];
    let basicLowerBand = [];
    let upperBand = [];
    let lowerBand = [];
    let superTrend = [];
    let trendIdentifier=[];
    let lastFlipped="";
    let candlesAgo=0;

    for (let i = 0; i < closePrices.length; i++) {
        basicUpperBand[i] = hl2Values[i] + multiplier * atrValues[i];
        basicLowerBand[i] = hl2Values[i] - multiplier * atrValues[i];

        upperBand[i] = (i === 0 || basicUpperBand[i] < upperBand[i - 1] || closePrices[i - 1] > upperBand[i - 1]) ?
        basicUpperBand[i] :
        upperBand[i - 1];

        lowerBand[i] = (i === 0 || basicLowerBand[i] > lowerBand[i - 1] || closePrices[i - 1] < lowerBand[i - 1]) ?
        basicLowerBand[i] :
        lowerBand[i - 1];

        const isUpTrend = closePrices[i] > lowerBand[i];

        const trendDirection = (i < length) ? "Down" :
        (superTrend[i - 1] === upperBand[i - 1]) ?
        (closePrices[i] > upperBand[i] ? "Up" : "Down") :
        (closePrices[i] < lowerBand[i] ? "Down" : "Up");
        
        let trender=[];
        
        if(trendIdentifier[i-1]&&trendIdentifier[i-1][1]&&trendDirection!=trendIdentifier[i-1][1]){
          lastFlipped=trendIdentifier[i-1][0]
          candlesAgo=closePrices.length-i;
          // console.log("candlesAgo",candlesAgo);
        }
        trender.push(time[i],trendDirection,lastFlipped,candlesAgo);

        trendIdentifier.push(trender);
        superTrend[i] = (trendDirection === "isUpTrend") ? lowerBand[i] : upperBand[i];
    }
    // console.log("trendIdentifier",trendIdentifier);

    return trendIdentifier;
}

function calculateHL2(highPrices, lowPrices) {
  return highPrices.map((high, i) => (parseFloat(high) + parseFloat(lowPrices[i])) / 2);
}

function calculateATR(highPrices, lowPrices, closePrices, length) {
  const trValues = calculateTR(highPrices, lowPrices, closePrices);
  const atrValues = [trValues[0]];

  for (let i = 1; i < closePrices.length; i++) {
    atrValues[i] = (atrValues[i - 1] * (length - 1) + trValues[i]) / length;
  }

  return atrValues;
}

function calculateTR(highPrices, lowPrices, closePrices) {
  const trValues = [];
  for (let i = 1; i < closePrices.length; i++) {
    const highLowDiff = parseFloat(highPrices[i]) - parseFloat(lowPrices[i]);
    const highCloseDiff = Math.abs(parseFloat(highPrices[i]) - parseFloat(closePrices[i - 1]));
    const lowCloseDiff = Math.abs(parseFloat(lowPrices[i]) - parseFloat(closePrices[i - 1]));
    trValues.push(Math.max(highLowDiff, highCloseDiff, lowCloseDiff));
  }
  return trValues;
}




function convertEpochToSpecificTimezone(timeEpoch, offset){
  var d = new Date(timeEpoch);
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
  var nd = new Date(utc + (3600000*offset));
  return nd.toLocaleString();
}