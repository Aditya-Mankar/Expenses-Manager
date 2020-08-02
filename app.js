// Expense Class
class Expense {
    constructor(expense, amount, desc) {
        this.expense = expense;
        this.amount = amount;
        this.desc = desc;
    }
}

// UI class
class UI {
    static displayExpenses() {
        const storedExpenses = Store.getExpenses();

        const expenses = storedExpenses;

        expenses.forEach((expense) => UI.addExpense(expense));
    }

    static addExpense(exp) {
        const list = document.querySelector('#expense-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${exp.expense}</td>
            <td>${exp.amount}</td>
            <td>${exp.desc}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a></td>   
        `;

        list.appendChild(row);
    }

    static deleteExpense(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const form = document.querySelector("#expense-form");
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector(".alert").remove(), 3000);
    }

    static clearFields() {
        document.querySelector("#expense").value = '';
        document.querySelector("#amount").value = '';
        document.querySelector("#description").value = '';
    }
}

// Store class
class Store {
    static getExpenses() {
        let expenses;

        if (localStorage.getItem('expenses') == null) {
            expenses = [];
        }
        else {
            expenses = JSON.parse(localStorage.getItem("expenses"));
        }

        return expenses;
    }

    static addExpense(exp) {
        const expenses = Store.getExpenses();

        expenses.push(exp);

        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    static removeExpense(exp) {
        const expenses = Store.getExpenses();

        expenses.forEach((e, index) => {
            if (e.expense == exp) {
                expenses.splice(index, 1);
            }
        });

        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
}

// Event: display expenses
document.addEventListener('DOMContentLoaded', UI.displayExpenses);

// Event: add an expense
document.querySelector("#expense-form").addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const exp = document.querySelector("#expense").value;
    const amount = document.querySelector("#amount").value;
    const desc = document.querySelector("#description").value;

    // Validate
    if (exp == '' || amount == '' || desc == '') {
        UI.showAlert('Fill all fields', 'danger');
    }
    else {
        // Instantiate expense
        const expense = new Expense(exp, amount, desc);

        //console.log(expense);

        // Add expense to list;
        UI.addExpense(expense);

        // Add expense to store
        Store.addExpense(expense);

        // Show success message
        UI.showAlert('Expense added', 'success');

        // Clear fields
        UI.clearFields();
    }
});

// Event: remove expense
document.querySelector('#expense-list').addEventListener('click', (e) => {
    // Remove expense form UI
    UI.deleteExpense(e.target);

    // Remove expense from Store
    Store.removeExpense(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

    // Show removed message
    UI.showAlert('Expense Removed', 'success');
})