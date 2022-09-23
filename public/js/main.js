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
let currentValue = 0;
let annualDividend = 0;
let totalProfitLoss = 0;

async function getStockData() {
  let stockList = document.querySelectorAll('.row');
  for(let i = 0; i < stockList.length; i++) {
    let ticker = stockList[i].cells[0].childNodes[1].innerText; 
    let shares = Number((stockList[i].cells[1].innerText).replaceAll(',', ''));
    let avgCost = Number(stockList[i].cells[2].innerText.slice(1).replaceAll(',', ''));
    
   
    // console.log(ticker);
    // console.log(shares);
    // console.log(avgCost);
    try {
      const divResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`);
      const historicDividends = await divResponse.json();
      
      console.log("DEBUG TNBIS:", historicDividends);

      const quoteResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`
      )
      const stockQuote = await quoteResponse.json();

      const changeCell = stockList[i].childNodes[7];
      console.log(changeCell);
      console.log('Current stock quote', stockQuote);
      const change = stockQuote[0].change;
      const changesPercentage = stockQuote[0].changesPercentage;
      console.log(change);

      const spanChange = document.createElement('span');
      const spanPercentage = document.createElement('span');
      spanChange.textContent = `$${Number(change).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
      spanPercentage.textContent = ` (${Number(changesPercentage).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits:2})}%)`;

      // change < 0 ? spanChange.classList.add('txt-red') : spanChange.classList.add('txt-green');
      changesPercentage < 0 ? spanPercentage.classList.add('txt-red') : spanPercentage.classList.add('txt-green');


      // changeCell.innerText = `$${Number(change).toLocaleString('en-US')} (${Number(changesPercentage).toLocaleString('en-US')}%)`;
      changeCell.appendChild(spanChange);
      changeCell.appendChild(spanPercentage);
      changeCell.classList.add('flex', 'dir-col');


      const stockName = stockQuote[0].name;
      const nameSpan = document.createElement('span');
      nameSpan.classList.add('sm-txt');
      nameSpan.innerText = stockName;

      // Add name of company to first cell of every row
      // right under the ticker symbol
      stockList[i].cells[0].childNodes[3].append(nameSpan);

      currentValue += shares * (stockQuote[0].price);
   
      const priceCell = stockList[i].childNodes[9];
      const price = (stockQuote[0].price).toFixed(2);
      priceCell.innerText = `$${Number(price).toLocaleString('en-US')}`;

      const profitLossCell = stockList[i].childNodes[11];
      const profitTotal = ((shares * stockQuote[0].price) - (shares * avgCost)).toFixed(2);
      totalProfitLoss += Number(profitTotal);
      profitTotal < 0 ? profitLossCell.classList.add('txt-red') : profitLossCell.classList.add('txt-green');
      profitLossCell.innerText = `$${Number(profitTotal).toLocaleString('en-US')}`;
      

     const dividendCell = stockList[i].childNodes[13];
     console.log(historicDividends)
     if(Object.keys(historicDividends).length > 0 && historicDividends.historical[0].dividend != 0) {
       const dividendYield = ((historicDividends.historical[0].dividend * 4 / stockQuote[0].price) * 100).toFixed(2)
       annualDividend += shares * historicDividends.historical[0].dividend * 4; // quarterly for now, will add algo to change this soon
       console.log(`DIVIDEND YIELD: ${dividendYield}%`);
       
       dividendCell.innerText = `${dividendYield}%`;
     } else {
      dividendCell.innerText = `-`
     }
 


  
    } catch(err) {
      console.log(err);
    }
    
    document.querySelector('.yearlyDividend').innerText = Number(annualDividend.toFixed(2)).toLocaleString('en-US');
    document.querySelector('.currentValue').innerText = Number(currentValue.toFixed(2)).toLocaleString('en-US');
    if(totalProfitLoss > 0) {
      document.querySelector('.netProfit').classList.remove('txt-red');
      document.querySelector('.netProfit').classList.add('txt-green');
    } else if(totalProfitLoss < 0) {
      document.querySelector('.netProfit').classList.remove('txt-green');
      document.querySelector('.netProfit').classList.add('txt-red');
    } else {
      document.querySelector('netProfit').classList.remove('txt-green');
      document.querySelector('netProfit').classList.remove('txt-red');
    }
    document.querySelector('.netProfit').innerText = `(${(totalProfitLoss > 0 ? '+' : '')}${Number(totalProfitLoss.toFixed(2)).toLocaleString('en-US')})`;
  }
  calculateRealTime();
}


function calculateRealTime() {
  const dividend = document.querySelector('.yearlyDividend');
  const realTime = document.querySelector('.realTime');
  let currentValue = Number(document.querySelector('.currentValue').innerText.replaceAll(',', ''));
  console.log(currentValue);
  const yearlyDividend = Number(dividend.innerText.replaceAll(',',''));
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
    currentValue += second / 2;
    realTime.innerText = currentValue.toLocaleString('en-US', {minimumFractionDigits: 8});
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
