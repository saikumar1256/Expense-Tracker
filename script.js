
let salary = Number(localStorage.getItem("salary")) || 0;
let transactions = [];

try {
    transactions = JSON.parse(
        localStorage.getItem("transactions") || "[]"
    );

    if (!Array.isArray(transactions)) {
        transactions = [];
    }
} catch {
    transactions = [];
}

// Show saved salary
document.getElementById("salary").value = salary || "";

// Save salary
function saveSalary() {
    let value = Number(document.getElementById("salary").value);

    if (value <= 0 || !Number.isFinite(value)) {
        alert("Please enter a valid salary!");
        return;
    }

    let spent = 0;

    transactions.forEach(function(item) {
        spent += item.amount;
    });

    if (value < spent) {
        alert("Salary cannot be less than your total expenses!");
        return;
    }

    salary = value;

    localStorage.setItem("salary", salary);

    updateSummary();
    alert("Salary saved successfully!");
}

// Add a new transaction
function addTransaction() {
    let category = document.getElementById("category").value;
    let amount = Number(document.getElementById("amount").value);
    let date = document.getElementById("date").value;
    let note = document.getElementById("note").value.trim();

    if (salary <= 0) {
        alert("First enter and save your salary!");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0 || !date) {
        alert("Please enter a valid amount and date!");
        return;
    }

    let spent = 0;

    transactions.forEach(function(item) {
        spent += item.amount;
    });

    if (spent + amount > salary) {
        alert("You do not have enough balance!");
        return;
    }

    // Add new transaction without removing old ones
    let transaction = {
        id: Date.now() + Math.random(),
        category: category,
        amount: amount,
        date: date,
        note: note
    };

    transactions.push(transaction);

    // Save ALL transactions
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    updateSummary();
    showTransactions();

    // Clear only the expense inputs
    document.getElementById("amount").value = "";
    document.getElementById("date").value = "";
    document.getElementById("note").value = "";
}

// Calculate salary, spending and balance
function updateSummary() {
    let totalSpent = 0;

    transactions.forEach(function(item) {
        totalSpent += item.amount;
    });

    document.getElementById("totalSalary").innerText = salary;
    document.getElementById("totalSpent").innerText = totalSpent;
    document.getElementById("balance").innerText = salary - totalSpent;
}

// Display ALL transactions
function showTransactions() {
    let history = document.getElementById("history");
    let empty = document.getElementById("empty");

    history.innerHTML = "";

    empty.style.display =
        transactions.length === 0 ? "block" : "none";

    // Show newest transaction first
    for (let i = transactions.length - 1; i >= 0; i--) {
        let item = transactions[i];

        let card = document.createElement("div");
        card.className = "transaction";

        let title = document.createElement("h3");
        title.textContent = item.category + " - ₹" + item.amount;

        let date = document.createElement("p");
        date.textContent = "Date: " + item.date;

        let note = document.createElement("p");
        note.textContent = item.note
            ? "Note: " + item.note
            : "Note: No note";

        let deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.onclick = function() {
            if (confirm("Delete this transaction?")) {
                transactions.splice(i, 1);

                localStorage.setItem(
                    "transactions",
                    JSON.stringify(transactions)
                );

                updateSummary();
                showTransactions();
            }
        };

        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(note);
        card.appendChild(deleteButton);

        history.appendChild(card);
    }
}

// Display saved transactions when page opens
updateSummary();
showTransactions();