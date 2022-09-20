const form = document.querySelector('form');
const tickerInput = document.querySelector('#ticker');
const sharesInput = document.querySelector('#shares');
const basisInput = document.querySelector('#basis');
const errorElement = document.querySelector('#error');

const addButton = document.querySelector('#addButton');
addButton.addEventListener('click', () => {
  modalContainer.classList.add('show');
});

const modalContainer = document.querySelector('.modal-container');

const addStockButton = document.querySelector('#close');
addStockButton.addEventListener('click', () => {
  modalContainer.classList.remove('show');
});


form.addEventListener('submit', async function(e) {
  e.preventDefault();
  let messages = [];

  const quoteResponse = await fetch(
    `https://financialmodelingprep.com/api/v3/quote/${tickerInput.value}?apikey=ac08be8670bfbfba904e1e17d7596342`
  )
  const stockQuote = await quoteResponse.json();
 
  if(stockQuote.length === 0) {
    messages.push('Please enter a valid ticker symbol!');
  }

  errorElement.innerText = messages.join(', ');

  if(messages.length === 0) {
    form.submit();
  }

})

const deleteButtons = document.querySelectorAll('.deleteButton');
Array.from(deleteButtons).forEach(button => {
  button.addEventListener('click', deleteStock);
})
let totalValue = 0;
let annualDividend = 0;

async function getStockData() {
  let stockList = document.querySelectorAll('.row');
  for(let i = 0; i < stockList.length; i++) {
    let ticker = stockList[i].cells[0].childNodes[1].innerText; 
    let shares = Number(stockList[i].cells[1].innerText);
    let avgCost = Number(stockList[i].cells[2].innerText.slice(1));
   
    console.log(ticker);
    console.log(shares);
    console.log(avgCost);
    try {
      const divResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`);
      const historicDividends = await divResponse.json();
  

      const quoteResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`
      )
      const stockQuote = await quoteResponse.json();

      console.log('Current stock quote', stockQuote);
      const change = stockQuote[0].change;
      console.log(change);
      const changeCell = stockList[i].childNodes[7];
      changeCell.innerText = `$${change.toFixed(2)} (${(stockQuote[0].changesPercentage).toFixed(2)}%)`;


      const stockName = stockQuote[0].name;
      const nameSpan = document.createElement('span');
      nameSpan.classList.add('sm-txt');
      nameSpan.innerText = stockName;

      // Add name of company to first cell of every row
      // right under the ticker symbol
      stockList[i].cells[0].childNodes[3].append(nameSpan);

      totalValue += shares * (stockQuote[0].price);
   
      const priceCell = stockList[i].childNodes[9];
      priceCell.innerText = `$${(stockQuote[0].price).toFixed(2)}`;

      const profitLossCell = stockList[i].childNodes[11];
      profitLossCell.innerText = `$${((shares * stockQuote[0].price) - (shares * avgCost)).toFixed(2)}`;


      annualDividend += shares * historicDividends.historical[0].dividend * 4; // quarterly for now, will add algo to change this soon
      const dividendYield = ((historicDividends.historical[0].dividend * 4 / stockQuote[0].price) * 100).toFixed(2)
      console.log(`DIVIDEND YIELD: %${dividendYield}`);
 
      const dividendCell = stockList[i].childNodes[13];
      dividendCell.innerText = `${dividendYield}%`;


  
    } catch(err) {
      console.log(err);
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

async function deleteStock() {
  console.log('reached!');
  const stockId = this.parentNode.parentNode.dataset.id;
  try {
    const res = await fetch('dashboard/deleteStock', {
      method: 'delete',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({
        'stockIdFromJSFile': stockId,
      })
    })
    const data = await res.json();
    console.log(data);
    console.log('deleted');
    location.reload();
  } catch(err) {
    console.log(err);
  }
}

// getCurrentPrice();
// getDividend();
getStockData();
