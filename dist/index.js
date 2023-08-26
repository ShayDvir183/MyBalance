const DOM = {
    headerRef: null,
    balanceRef: null,
    incomesRowRef: null,
    expensesRowRef: null,
    transactionTypeRef: null,
    transactionDescRef: null,
    transactionAmountRef: null,
    addBtnRef: null,
    incomeTableRef: null,
    expensesTableRef: null,
    incomesRowNumber: null,
    expensesRowNumber: null,
    formRef: null,
    percentageHeader: null,
};
const state = {
    incomeTransactions: [],
    expenseTransactions: [],
    incomes: 0,
    expenses: 0,
    balance: 0,
};
const greenColor = "#198754";
const redColor = "#dc3545";
function makeItGreenOrRed() {
    switch (DOM.transactionTypeRef.value) {
        case `+`:
            DOM.transactionAmountRef.classList.remove("minus");
            DOM.transactionDescRef.classList.remove("minus");
            DOM.transactionTypeRef.classList.remove("minus");
            DOM.addBtnRef.classList.remove("btn-danger");
            DOM.transactionAmountRef.classList.add("plus");
            DOM.transactionAmountRef.style.color = greenColor;
            DOM.transactionDescRef.style.color = greenColor;
            DOM.transactionTypeRef.style.color = greenColor;
            DOM.addBtnRef.style.color = "#fff";
            DOM.transactionAmountRef.classList.add("plus");
            DOM.transactionDescRef.classList.add("plus");
            DOM.transactionTypeRef.classList.add("plus");
            DOM.addBtnRef.classList.add("btn", "btn-success");
            return;
        case `-`:
            DOM.transactionAmountRef.classList.remove("plus");
            DOM.transactionDescRef.classList.remove("plus");
            DOM.transactionTypeRef.classList.remove("plus");
            DOM.addBtnRef.classList.remove("btn-success");
            DOM.transactionAmountRef.style.color = "#dc3545";
            DOM.transactionDescRef.style.color = "#dc3545";
            DOM.transactionTypeRef.style.color = "#dc3545";
            DOM.addBtnRef.style.color = "#fff";
            DOM.transactionAmountRef.classList.add("minus");
            DOM.transactionDescRef.classList.add("minus");
            DOM.transactionTypeRef.classList.add("minus");
            DOM.addBtnRef.classList.add("btn-danger");
            return;
        default:
            break;
    }
}
const mediaScreen = window.matchMedia("(max-width: 992px)");
console.log(mediaScreen);
function init() {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const month = new Date().getMonth();
    const year = new Date().getFullYear().toString();
    const text = `Avaiable Budget in ${months[month]} ${year} :`;
    DOM.headerRef = document.getElementById("header");
    DOM.balanceRef = document.getElementById("balance");
    DOM.incomesRowRef = document.getElementById("incomesRef");
    DOM.expensesRowRef = document.getElementById("expensesRef");
    DOM.transactionTypeRef = document.getElementById("select");
    DOM.transactionDescRef = document.getElementById("desc");
    DOM.transactionAmountRef = document.getElementById("amount");
    DOM.addBtnRef = document.getElementById("addBtn");
    DOM.incomeTableRef = document.getElementById("incomeTable");
    DOM.expensesTableRef = document.getElementById("expensesTable");
    DOM.incomesRowNumber = document.getElementById("incomes");
    DOM.expensesRowNumber = document.getElementById("expenses");
    DOM.formRef = document.getElementById("form");
    DOM.addBtnRef.addEventListener("click", createTransaction);
    DOM.transactionAmountRef.addEventListener("keydown", (e) => {
        if (e.code === `Enter` || e.code === `NumpadEnter`) {
            createTransaction();
        }
    });
    DOM.transactionTypeRef.addEventListener("change", makeItGreenOrRed);
    DOM.headerRef.innerHTML = text;
    makeItGreenOrRed();
}
init();
function createTransaction() {
    const transaction = {
        ammount: 0,
        type: "-",
        description: "",
        id: "",
    };
    if (typeof DOM.transactionDescRef.value !== "string") {
        DOM.transactionDescRef.value = ``;
        return alert(`Please Fill Current Descriptaion`);
    }
    transaction.ammount = DOM.transactionAmountRef.value;
    transaction.type = DOM.transactionTypeRef.value;
    transaction.description = DOM.transactionDescRef.value;
    const condition = !transaction.ammount || !transaction.type || !transaction.description;
    if (condition) {
        console.log(condition);
        return alert(`Please Fill All Fields`);
    }
    transaction.id = `${transaction.description}${transaction.ammount}`;
    if (transaction.type === `-`) {
        doMinusStuff(transaction);
    }
    if (transaction.type === `+`) {
        doPlusStuff(transaction);
    }
    if (state.balance >= 0) {
        DOM.balanceRef.style.color = greenColor;
    }
    else {
        DOM.balanceRef.style.color = redColor;
    }
}
function drawPercentage() {
    for (let index = 0; index < state.expenseTransactions.length; index++) {
        const element = state.expenseTransactions[index];
        const percentageSpan = document.getElementById(element.id);
        let percentage = Math.round((element.ammount / state.incomes) * 100);
        if (percentage === Infinity) {
            percentage = 0;
        }
        percentageSpan.textContent = `${percentage}%`;
    }
}
function drawTable(transactions, type) {
    const table = document.createElement("table");
    table.classList.add("table", "table-hover");
    const tBody = document.createElement("tbody");
    for (let index = 0; index < transactions.length; index++) {
        const element = transactions[index];
        const tRow = document.createElement("tr");
        const descTd = document.createElement("td");
        const ammountTd = document.createElement("td");
        const percentageSpan = document.createElement("span");
        percentageSpan.id = element.id;
        const deleteBtn = createDeleteBtn(element, type, mediaScreen.matches);
        if (mediaScreen.matches) {
            if (type === "-") {
                tRow.classList.add("red");
                ammountTd.style.color = "#fff";
                descTd.style.color = "#fff";
            }
            else {
                tRow.classList.add("green");
                ammountTd.style.color = "#fff";
                descTd.style.color = "#fff";
            }
            deleteBtn.classList.remove("invisible");
            deleteBtn.classList.add("visible");
        }
        else {
            tRow.addEventListener("mouseover", (e) => {
                if (type === "-") {
                    tRow.classList.add("red");
                    ammountTd.style.color = "#fff";
                    descTd.style.color = "#fff";
                }
                else {
                    tRow.classList.add("green");
                    ammountTd.style.color = "#fff";
                    descTd.style.color = "#fff";
                }
                deleteBtn.classList.remove("invisible");
                deleteBtn.classList.add("visible");
            });
            tRow.addEventListener("mouseleave", (e) => {
                if (type === "-") {
                    tRow.classList.add("red");
                    ammountTd.style.color = "#dc3545";
                    descTd.style.color = "#dc3545";
                }
                else {
                    tRow.classList.add("green");
                    ammountTd.style.color = greenColor;
                    descTd.style.color = greenColor;
                }
                deleteBtn.style.border = "none";
                deleteBtn.classList.remove("visible btn-success btn-danger");
                deleteBtn.classList.add("invisible");
            });
        }
        descTd.innerHTML = element.description;
        percentageSpan.classList.add("badge", "rounded-pill", "bg-light", "text-dark");
        percentageSpan.style.fontSize = "small";
        let percentage = Math.round((element.ammount / state.incomes) * 100);
        if (percentage === Infinity) {
            percentageSpan.innerText = `0%`;
        }
        else {
            percentageSpan.innerText = `${percentage}%`;
        }
        if (type === `-`) {
            tBody.style.color = redColor;
            ammountTd.textContent = `-${element.ammount}   `;
            ammountTd.append(percentageSpan);
        }
        else {
            tBody.style.color = greenColor;
            ammountTd.textContent = element.ammount.toLocaleString();
        }
        tRow.append(descTd, ammountTd, deleteBtn);
        tBody.append(tRow);
    }
    table.append(tBody);
    if (type === "+") {
        DOM.incomeTableRef.innerHTML = "";
        DOM.incomeTableRef.append(table);
    }
    else if (type === "-") {
        DOM.expensesTableRef.innerHTML = "";
        DOM.expensesTableRef.append(table);
    }
    drawPercentage();
}
function deleteTransaction(element, type) {
    if (type === `-`) {
        const filterTransactions = state.expenseTransactions.filter((e) => {
            return e.id !== element.id;
        });
        state.expenses = state.expenses + Number(element.ammount);
        state.balance = state.balance + Number(element.ammount);
        const fixedNumber = state.balance.toFixed(2);
        DOM.balanceRef.textContent = Number(fixedNumber).toLocaleString();
        DOM.expensesRowNumber.textContent = "";
        const expensesFixedNumber = state.expenses.toFixed(2);
        DOM.expensesRowNumber.textContent =
            Number(expensesFixedNumber).toLocaleString();
        state.expenseTransactions = filterTransactions;
        drawTable(state.expenseTransactions, type);
    }
    else if (type === `+`) {
        const dummyArray = state.incomeTransactions.filter((e) => {
            return e.id !== element.id;
        });
        state.incomes = state.incomes - Number(element.ammount);
        state.balance = state.balance - Number(element.ammount);
        const fixedNumber = state.balance.toFixed(2);
        const incomesFixedNumber = state.incomes.toFixed(2);
        DOM.balanceRef.textContent = +Number(fixedNumber).toLocaleString();
        DOM.incomesRowNumber.textContent = "";
        DOM.incomesRowNumber.textContent =
            Number(incomesFixedNumber).toLocaleString();
        state.incomeTransactions = dummyArray;
        drawTable(state.incomeTransactions, type);
    }
    return;
}
function doMinusStuff(transaction) {
    state.expenseTransactions.push(transaction);
    state.expenses -= transaction.ammount;
    DOM.expensesRowNumber.textContent = "";
    const incomePercentage = Math.round((state.expenses / state.incomes) * 100);
    state.balance -= Number(transaction.ammount);
    const span = document.createElement("span");
    span.classList.add("badge", "rounded-pill", "bg-light", "text-dark");
    span.style.fontSize = "small";
    DOM.balanceRef.textContent = "";
    if (state.balance <= 0) {
        const balanceFixedNumber = state.balance.toFixed(2);
        DOM.balanceRef.textContent = Number(balanceFixedNumber).toLocaleString();
        const expensesFixedNumber = state.balance.toFixed(2);
        DOM.expensesRowNumber.textContent = `${Number(expensesFixedNumber).toLocaleString()}`;
        DOM.expensesRowNumber.append(span);
    }
    else {
        const fixedNumber = state.balance.toFixed(2);
        DOM.balanceRef.textContent = `+` + Number(fixedNumber).toLocaleString();
        const expensesFixedNumber = state.expenses.toFixed(2);
        DOM.expensesRowNumber.textContent =
            Number(expensesFixedNumber).toLocaleString();
        span.textContent = `${Math.abs(incomePercentage)}%`;
        DOM.expensesRowNumber.append(span);
    }
    DOM.formRef.reset();
    makeItGreenOrRed();
    drawTable(state.expenseTransactions, "-");
}
function doPlusStuff(transaction) {
    state.incomeTransactions.push(transaction);
    state.incomes = state.incomes + Number(transaction.ammount);
    DOM.incomesRowNumber.textContent = "";
    const incomesFixedNumber = state.incomes.toFixed(2);
    DOM.incomesRowNumber.textContent =
        Number(incomesFixedNumber).toLocaleString();
    state.balance += Number(transaction.ammount);
    const percentage = Math.round((state.expenses / state.incomes) * 100);
    const span = document.createElement("span");
    span.classList.add("badge", "rounded-pill", "bg-light", "text-dark");
    span.style.fontSize = "small";
    percentage === Infinity
        ? (span.textContent = `0%`)
        : (span.textContent = `${percentage}%`);
    const expensesFixedNumber = state.expenses.toFixed(2);
    DOM.expensesRowNumber.textContent =
        Number(expensesFixedNumber).toLocaleString();
    DOM.expensesRowNumber.append(span);
    const fixedNumber = state.balance.toFixed(2);
    DOM.balanceRef.textContent = `+${Number(fixedNumber).toLocaleString()}`;
    drawTable(state.incomeTransactions, "+");
    drawTable(state.expenseTransactions, "-");
    DOM.formRef.reset();
}
function createDeleteBtn(element, type, isMobile) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    if (type === `-`) {
        if (!isMobile) {
            deleteBtn.classList.add("btn-danger", "invisible");
            deleteBtn.style.backgroundColor = "#dc3545";
        }
    }
    else if (type === `+`) {
        if (!isMobile) {
            deleteBtn.style.backgroundColor = greenColor;
            deleteBtn.classList.add("btn-success", "invisible");
        }
    }
    deleteBtn.classList.add("btn");
    deleteBtn.addEventListener("click", (e) => {
        deleteTransaction(element, type);
    });
    return deleteBtn;
}
