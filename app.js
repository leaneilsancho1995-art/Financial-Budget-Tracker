const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Kunin ang mga nakasave na data sa phone offline
const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Dagdag Transaksyon
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Mangyaring ilagay ang pangalan at halaga.');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
}

// Mag-generate ng Random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Ipakita ang Transaksyon sa Screen
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  // Bigyan ng kulay depende kung gastos o kita
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}₱${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})" style="cursor:pointer; background:#ff0055; border:none; color:#fff; border-radius:4px; padding:2px 8px;">x</button>
  `;

  list.appendChild(item);
}

// I-update ang Kabuuang Balance, Kita, at Gastos
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);

  balance.innerText = `₱${total}`;
  money_plus.innerText = `+₱${income}`;
  money_minus.innerText = `-₱${expense}`;
}

// Magbura ng Transaksyon
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// I-save sa storage ng phone
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Simulan ang App
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();
form.addEventListener('submit', addTransaction);
