const formAdd= document.querySelector('#form-add');
const formEdit = document.querySelector('#form-edit')
const tickerAdd = document.querySelector('#ticker-add');
const sharesAdd= document.querySelector('#shares-add');
const basisAdd = document.querySelector('#basis-add');
const tickerEdit = document.querySelector('#ticker-edit');
const sharesEdit = document.querySelector('#shares-edit');
const basisEdit = document.querySelector('#basis-edit');
const errorElement = document.querySelector('#error');

console.log('form edit', formEdit);

const modalContainerAdd = document.querySelector('.modal-container-add');
const modalContainerEdit = document.querySelector('.modal-container-edit');

const addButton = document.querySelector('#addButton');
addButton.addEventListener('click', () => {
  modalContainerAdd.classList.add('show');
});


const closeButtons = document.querySelectorAll('.close');
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
  modalContainerAdd.classList.remove('show');
  modalContainerEdit.classList.remove('show');
  })
})
  
const editStockButtons = document.querySelectorAll('.edit-stock');
editStockButtons.forEach(button => {
  button.addEventListener('click', () => {
    modalContainerEdit.classList.add('show');
    const id = button.attributes['data-id'].textContent;
    const ticker = button.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].innerText;
    const shares = Number(button.parentNode.parentNode.parentNode.childNodes[3].innerText);
    const basis = Number(button.parentNode.parentNode.parentNode.childNodes[5].innerText.slice(1));
    
    tickerEdit.value = ticker;
    sharesEdit.value = shares;
    basisEdit.value = basis;
    formEdit.action = `/dashboard/editStock/${id}?_method=PUT`;
  })
})


formAdd.addEventListener('submit', async function(e) {
  e.preventDefault();
  let messages = [];

  const quoteResponse = await fetch(
    `https://financialmodelingprep.com/api/v3/quote/${tickerAdd.value}?apikey=ac08be8670bfbfba904e1e17d7596342`
  )
  const stockQuote = await quoteResponse.json();
 
  if(stockQuote.length === 0) {
    messages.push('Please enter a valid ticker symbol!');
  }

  errorElement.innerText = messages.join(', ');

  if(messages.length === 0) {
    formAdd.submit();
  }

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
    

    try {
      const divResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`);
      const historicDividends = await divResponse.json();
    

      const quoteResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`
      )
      const stockQuote = await quoteResponse.json();

      const changeCell = stockList[i].childNodes[7];
      console.log(changeCell);
      console.log('Current stock quote', stockQuote);
      const change = stockQuote[0].change;
      const changesPercentage = stockQuote[0].changesPercentage;


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
      const price = (stockQuote[0].price);
      console.log("CURRURURU:",price);
      priceCell.innerText = `$${Number(price).toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })}`;

      const profitLossCell = stockList[i].childNodes[11];
      const profitTotal = ((shares * stockQuote[0].price) - (shares * avgCost));
      totalProfitLoss += Number(profitTotal);
      profitTotal < 0 ? profitLossCell.classList.add('txt-red') : profitLossCell.classList.add('txt-green');
      profitLossCell.innerText = `$${Number(profitTotal).toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })}`;
      

     const dividendCell = stockList[i].childNodes[13];
     console.log(historicDividends)
     if(Object.keys(historicDividends).length > 0 && historicDividends.historical[0].dividend != 0) {
       const dividendYield = ((historicDividends.historical[0].dividend * 4 / stockQuote[0].price) * 100).toFixed(2)
       annualDividend += shares * historicDividends.historical[0].dividend * 4; // quarterly for now, will add algo to change this soon
       
       dividendCell.innerText = `${dividendYield}%`;
     } else {
      dividendCell.innerText = `-`
     }
 


  
    } catch(err) {
      console.log(err);
    }
    
    document.querySelector('.yearlyDividend').innerText = annualDividend.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
    document.querySelector('.currentValue').innerText = currentValue.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    if(totalProfitLoss > 0) {
      document.querySelector('.netProfit').classList.remove('txt-red');
      document.querySelector('.netProfit').classList.add('txt-green');
    } else if(totalProfitLoss < 0) {
      document.querySelector('.netProfit').classList.remove('txt-green');
      document.querySelector('.netProfit').classList.add('txt-red');
    }
    document.querySelector('.netProfit').innerText = `${(totalProfitLoss > 0 ? '+' : '')}${Number(totalProfitLoss.toFixed(2)).toLocaleString('en-US')}`;
  }
  calculateRealTime();

  getPortfolioYield(currentValue, annualDividend);
}

function getPortfolioYield(currentValue, annualDividend) {
  const annualYield = (annualDividend / currentValue) * 100;

  document.querySelector('.annual-yield').innerText = annualYield.toFixed(2);
}


function calculateRealTime() {
  const dividend = document.querySelector('.yearlyDividend');
  const realTime = document.querySelector('.realTime');
  let currentValue = Number(document.querySelector('.currentValue').innerText.replaceAll(',', ''));
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


// getCurrentPrice();
// getDividend();
getStockData();

