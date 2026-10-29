/**
 * ==============================================================================
 * Simple Expense Tracker - JavaScript
 * ==============================================================================
 * A beginner-friendly script managing the state, validation, and DOM updates.
 */

// ------------------------------------------------------------------------------
// 1. App State (Stores expenses in memory while the page is open)
// ------------------------------------------------------------------------------
let expenses = [];

// ------------------------------------------------------------------------------
// 2. DOM Elements (References to HTML elements we need to interact with)
// ------------------------------------------------------------------------------
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategorySelect = document.getElementById('expense-category');
const errorMessage = document.getElementById('error-message');

const expenseList = document.getElementById('expense-list');
const emptyState = document.getElementById('empty-state');
const totalAmount = document.getElementById('total-amount');
const totalCountBadge = document.getElementById('total-count-badge');

// ------------------------------------------------------------------------------
// 3. Helper Functions (Error messages & Currency formatting)
// ------------------------------------------------------------------------------

/**
 * Displays an error message inside the error banner.
 * @param {string} message - The text to show the user.
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

/**
 * Hides the error banner.
 */
function hideError() {
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
}

/**
 * Formats a numeric amount as currency (e.g., 35.5 -> "$35.50").
 * @param {number} amount - The numeric dollar value.
 * @returns {string} Formatted dollar string.
 */
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// ------------------------------------------------------------------------------
// 4. Core Logic Functions
// ------------------------------------------------------------------------------

/**
 * Calculates the total of all expenses and updates the UI summary card.
 */
function updateTotal() {
  let total = 0;

  // Sum all amounts in our expenses array
  for (let i = 0; i < expenses.length; i++) {
    total += expenses[i].amount;
  }

  // Update total amount display
  totalAmount.textContent = formatCurrency(total);

  // Update expense count badge (handles singular vs plural)
  const count = expenses.length;
  totalCountBadge.textContent = count === 1 ? '1 Expense' : `${count} Expenses`;
}

/**
 * Re-renders the list of expenses on the screen.
 */
function renderExpenses() {
  // Clear the existing list before drawing updated items
  expenseList.innerHTML = '';

  // If there are no expenses, show the empty state message
  if (expenses.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');

    // Loop through each expense and create its HTML list item
    expenses.forEach((expense) => {
      const li = document.createElement('li');
      li.className = 'expense-item';

      li.innerHTML = `
        <div class="item-left">
          <span class="item-name">${escapeHTML(expense.name)}</span>
          <span class="item-category">${escapeHTML(expense.category)}</span>
        </div>
        <div class="item-right">
          <span class="item-amount">${formatCurrency(expense.amount)}</span>
          <button 
            type="button" 
            class="btn-delete" 
            data-id="${expense.id}"
            title="Delete expense"
          >
            🗑️ Delete
          </button>
        </div>
      `;

      expenseList.appendChild(li);
    });
  }

  // Always update the total spent whenever the list changes
  updateTotal();
}

/**
 * Adds a new expense after validating inputs.
 * @param {Event} event - The form submit event.
 */
function handleAddExpense(event) {
  // Prevent page refresh on form submit
  event.preventDefault();

  // Read and clean up user inputs
  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);
  const category = expenseCategorySelect.value;

  // Validation 1: Check for empty name
  if (!name) {
    showError('Please enter an expense name.');
    expenseNameInput.focus();
    return;
  }

  // Validation 2: Check for valid amount greater than 0
  if (isNaN(amount) || amount <= 0) {
    showError('Please enter a valid amount greater than $0.00.');
    expenseAmountInput.focus();
    return;
  }

  // If validation passes, hide any previous error
  hideError();

  // Create an expense object
  const newExpense = {
    id: Date.now(), // Unique ID using the current timestamp
    name: name,
    amount: amount,
    category: category,
  };

  // Add new expense to the start of our list (most recent first)
  expenses.unshift(newExpense);

  // Re-render UI
  renderExpenses();

  // Reset form fields and refocus name input
  expenseForm.reset();
  expenseNameInput.focus();
}

/**
 * Deletes an expense by its unique ID.
 * @param {number} id - The unique ID of the expense to remove.
 */
function deleteExpense(id) {
  // Filter out the expense with the matching ID
  expenses = expenses.filter((expense) => expense.id !== id);

  // Re-render the list and total
  renderExpenses();
}

/**
 * Basic helper to prevent cross-site scripting (XSS) when rendering user text.
 * @param {string} str - Raw input text.
 * @returns {string} Escaped text.
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ------------------------------------------------------------------------------
// 5. Event Listeners & Initial Setup
// ------------------------------------------------------------------------------

// Listen for form submissions (button click or pressing Enter)
expenseForm.addEventListener('submit', handleAddExpense);

// Listen for clicks on the expense list (Event Delegation for Delete buttons)
expenseList.addEventListener('click', (event) => {
  const deleteBtn = event.target.closest('.btn-delete');
  if (deleteBtn) {
    const id = Number(deleteBtn.dataset.id);
    deleteExpense(id);
  }
});

// Initial render to show empty state and $0.00 total
renderExpenses();
