
let totalValue = 0;
let annualDividend = 0;


async function getStockData() {
  let stockList = document.querySelectorAll('.stock');
  for(let i = 0; i < stockList.length; i++) {
    let ticker = stockList[i].children[0].innerText.slice(8);
    let shares = Number(stockList[i].children[1].innerText.slice(7));
    let avgCost = Number(stockList[i].children[2].innerText.slice(8));
    console.log(ticker);
    console.log(shares);
    console.log(avgCost);
    try {
      const divResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`);
      const historicDividends = await divResponse.json();
      console.log(`Historic Dividend info`, historicDividends);

      const quoteResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`
      )
      const stockQuote = await quoteResponse.json();
      console.log('Current stock quote', stockQuote);
      const change = stockQuote[0].change;
      console.log(change);
      const priceChange =  document.createElement('span')
      priceChange.innerText = `Change: $${change.toFixed(2)} (${(stockQuote[0].changesPercentage).toFixed(2)}%)`;
      stockList[i].append(priceChange);

      totalValue += shares * (stockQuote[0].price);
      const currentPrice = document.createElement('span')
      currentPrice.innerText = ` Current Price: $${(stockQuote[0].price).toFixed(2)}`;
      stockList[i].append(currentPrice);
      const profitLoss = document.createElement('span')
      profitLoss.innerText = ` Proft/Loss: $${(shares * (stockQuote[0].price - avgCost)).toFixed(2)}`;
      stockList[i].append(profitLoss);

      annualDividend += shares * historicDividends.historical[0].dividend * 4; // quarterly for now, will add algo to change this soon
      const dividendYield = ((historicDividends.historical[0].dividend * 4 / stockQuote[0].price) * 100).toFixed(2)
      console.log(`DIVIDEND YIELD: %${dividendYield}`);
      const dividend = document.createElement('span')
      dividend.innerText = ` Dividend: ${dividendYield}%`;
      stockList[i].append(dividend);

      stockList[i].append(deleteLink);
    } catch(err) {
      console.error(err);
    }
    document.querySelector('.yearlyDividend').innerText = annualDividend.toFixed(2);
    document.querySelector('.totalValue').innerText = totalValue.toFixed(2);
    

  }
  calculateRealTime();
}


function calculateRealTime() {
  const dividend = document.querySelector('.yearlyDividend');
  const realTime = document.querySelector('.realTime');
  let totalValue = Number(document.querySelector('.totalValue').innerText);
  const yearlyDividend = Number(dividend.innerText);
  const monthly = yearlyDividend / 12;
  const daily = yearlyDividend / 365;
  const hourly = daily / 24;
  const minute = hourly / 60;
  const second = minute / 60;
  // console.log('yearly:', yearlyDividend);
  // console.log('monthly:', monthly);
  // console.log('daily:', daily);
  // console.log('hourly:', hourly);
  // console.log('minute:', minute);
  // console.log('second:', second);
  setInterval(() => {
    totalValue += second / 2;
    realTime.innerText = totalValue;
  }, 500)
}

// getCurrentPrice();
// getDividend();
getStockData();
