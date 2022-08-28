
let totalValue;
let annualDividend;

// Get current annual dividen income
async function getDividend() {
  let stockList = document.querySelectorAll('li');
  annualDividend = 0;
  for(let i = 0; i < stockList.length; i++) {
    let ticker = stockList[i].children[0].innerText.slice(8);
    let shares = Number(stockList[i].children[1].innerText.slice(7));
    console.log(ticker);
    console.log(shares);
    try {
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`);
      const stockInfo = await response.json();
      console.log(`Stock info`, stockInfo);
      annualDividend += shares * stockInfo.historical[0].dividend * 4; // quarterly for now, will add algo to change this soon
      
    } catch(err) {
      console.error(err);
    }
    document.querySelector('.yearlyDividend').innerText = annualDividend;
  }
}

// Get current price of the ticker
async function getCurrentPrice() {
  let stockList = document.querySelectorAll('li');
  totalValue = 0;
  for(let i = 0; i < stockList.length; i++) {
    let ticker = stockList[i].children[0].innerText.slice(8);
    let shares = Number(stockList[i].children[1].innerText.slice(7));
    console.log(ticker);
    console.log(shares);
    try {
      const response = await fetch(
            `https://financialmodelingprep.com/api/v3/quote-short/${ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`
          )
      const stockPrice = await response.json();
      console.log(stockPrice);
      totalValue += shares * (stockPrice[0].price);
    } catch(err) {
      console.error(err);
    }
  }
  
  document.querySelector('.totalValue').innerText = `$${totalValue.toFixed(2)}`;
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
calculateRealTime();