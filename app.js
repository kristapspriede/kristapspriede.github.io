let chartInstance = null; // To store the chart instance for cigarettes
let moneyChartInstance = null; // To store the chart instance for money spent

// Variables for calculating averages
let averageDailyCigarettes = 0;
let averageDailyMoneySpent = 0;

let timerInterval = null;

// Initial variables
let cigarettesRemaining = parseInt(localStorage.getItem('cigarettesRemaining')) || 0;
let totalSpent = parseFloat(localStorage.getItem('totalSpent')) || 0;
let costPerCigarette = parseFloat(localStorage.getItem('costPerCigarette')) || 0;
let cigarettesSmokedToday = parseInt(localStorage.getItem('cigsToday')) || 0;
let remainingDaysLeft = parseInt(getRemainingDaysInYear()) || 0;
let projectedExp = 0;
let projectedExpYear = 0;
let projectedCigs = 0;
let projectedCigsYear = 0;

const remainingEl = document.getElementById('cigarettes-remaining');
const spentEl = document.getElementById('total-spent');
const costPerCigEl = document.getElementById('cost-per-cigarette');
const cigsTodayEl = document.getElementById('cigs-today');
const avgDailyCigsEl = document.getElementById('avg-daily-cigs'); // Element for average daily cigarettes
const avgDailySpentEl = document.getElementById('avg-daily-spent'); // Element for average daily money spent
const logCigaretteBtn = document.getElementById('log-cigarette');
const logPackBtn = document.getElementById('log-pack');
const packSizeInput = document.getElementById('pack-size');
const packCostInput = document.getElementById('pack-cost');
const eraseDataBtn = document.getElementById('erase-data');

// Variables for projected expenses
const projectedExpenses = document.getElementById('projected-expenses');
const projectedExpensesYear = document.getElementById('projected-expenses-year');
const projectedCigarettes = document.getElementById('projected-cigarettes');
const projectedCigarettesYear = document.getElementById('projected-cigarettes-year');

// Update display and graph
// Update display and graph
function updateDisplay() {
  remainingEl.textContent = cigarettesRemaining;
  spentEl.textContent = totalSpent.toFixed(2);
  costPerCigEl.textContent = costPerCigarette.toFixed(2);
  cigsTodayEl.textContent = cigarettesSmokedToday;

  calculateAverages();
  avgDailyCigsEl.textContent = averageDailyCigarettes.toFixed(2);
  avgDailySpentEl.textContent = averageDailyMoneySpent.toFixed(2);

  // Calculate projected expenses
  calculateProjectedExpenses();
  projectedCigarettes.textContent = projectedCigs.toFixed(2);
  projectedCigarettesYear.textContent = projectedCigsYear.toFixed(2);
  projectedExpenses.textContent = projectedExp.toFixed(2);
  projectedExpensesYear.textContent = projectedExpYear.toFixed(2);

  // Update both graphs
  renderCigaretteGraph();
  renderMoneyGraph();

  // Update today's logged cigarette times
  updateCigaretteTimesList();
  
  // Update timer since last recorded cigarette
  updateTimer();
}


function updateCigaretteTimesList() {
  const today = getToday();
  const dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {};
  const timesList = document.getElementById('cigarettes-times-list');

  if (dailyStats[today] && Array.isArray(dailyStats[today].timestamps)) {
    timesList.innerHTML = dailyStats[today].timestamps.map(time => `<li>${new Date(time).toLocaleTimeString()}</li>`).join('');
  } else {
    timesList.innerHTML = '<li>No cigarettes logged today.</li>';
  }
}


// Update timer since last recorded cigarette
function updateTimer() {
  const today = getToday();
  const dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {};
  const timesList = dailyStats[today] && Array.isArray(dailyStats[today].timestamps) ? dailyStats[today].timestamps : [];
  
  if (timesList.length > 0) {
    const lastCigaretteTime = new Date(timesList[timesList.length - 1]);

    // Clear any previous interval before starting a new one
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    // Set up the timer to update every second
    timerInterval = setInterval(() => {
      const now = new Date();
      const elapsed = now - lastCigaretteTime;

      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

      document.getElementById('timer-since-last-cig').textContent = `${hours}h ${minutes}m ${seconds}s ago`;
    }, 1000); // Update every second

  } else {
    // Clear the interval if no cigarettes are logged today
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    document.getElementById('timer-since-last-cig').textContent = 'No cigarettes logged today.';
  }
}

// Log cigarette button
logCigaretteBtn.addEventListener('click', () => {
  if (cigarettesRemaining > 0) {
    cigarettesRemaining--;
    cigarettesSmokedToday++;
    totalSpent += costPerCigarette;

    localStorage.setItem('cigarettesRemaining', cigarettesRemaining);
    localStorage.setItem('totalSpent', totalSpent);
    localStorage.setItem('cigsToday', cigarettesSmokedToday);

    updateDailyStats();
    updateDisplay();  // Auto-update both graphs

    // Reset the timer when a new cigarette is logged
    updateTimer();
  } else {
    alert('No cigarettes left! Log a new pack.');
  }
});



// Get today's date
function getToday() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Update daily stats
// Update daily stats with timestamp
function updateDailyStats() {
  const today = getToday();
  let dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {};

  if (!dailyStats[today]) {
    dailyStats[today] = { cigarettes: 0, spent: 0, timestamps: [] };
  }

  // Ensure timestamps is an array
  if (!Array.isArray(dailyStats[today].timestamps)) {
    dailyStats[today].timestamps = [];
  }

  dailyStats[today].cigarettes++;
  dailyStats[today].spent += costPerCigarette;
  dailyStats[today].timestamps.push(new Date().toISOString()); // Log the time of cigarette logging

  localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
}


// Calculate averages based on daily statistics
function calculateAverages() {
  const dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {};
  const daysLogged = Object.keys(dailyStats).length;

  if (daysLogged > 0) {
    const totalCigarettes = Object.values(dailyStats).reduce((acc, stat) => acc + stat.cigarettes, 0);
    const totalMoneySpent = Object.values(dailyStats).reduce((acc, stat) => acc + stat.spent, 0);

    averageDailyCigarettes = totalCigarettes / daysLogged;
    averageDailyMoneySpent = totalMoneySpent / daysLogged;
  } else {
    averageDailyCigarettes = 0;
    averageDailyMoneySpent = 0;
  }
}

function calculateProjectedExpenses() {
  projectedCigs = averageDailyCigarettes * remainingDaysLeft;
  projectedCigsYear = averageDailyCigarettes * 365;
  projectedExp = averageDailyMoneySpent * remainingDaysLeft;
  projectedExpYear = averageDailyMoneySpent * 365;
}

// Render graph for cigarettes smoked
// Utility function to get the dates for the last week
function getLastWeekData(dailyStats) {
  const today = new Date();
  const oneWeekAgo = new Date(today.setDate(today.getDate() - 8));
  const labels = [];
  const cigarettesData = [];
  const moneySpentData = [];

  for (const date in dailyStats) {
    const dataDate = new Date(date);
    if (dataDate >= oneWeekAgo) {
      labels.push(date);
      cigarettesData.push(dailyStats[date].cigarettes);
      moneySpentData.push(dailyStats[date].spent);
    }
  }

  // Sort by date
  const sortedIndices = labels.map((_, index) => index).sort((a, b) => new Date(labels[a]) - new Date(labels[b]));
  return {
    labels: sortedIndices.map(i => labels[i]),
    cigarettesData: sortedIndices.map(i => cigarettesData[i]),
    moneySpentData: sortedIndices.map(i => moneySpentData[i])
  };
}

// Render graph for cigarettes smoked
function renderCigaretteGraph() {
  const ctx = document.getElementById('cigarettesChart').getContext('2d');
  const dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {};

  const { labels, cigarettesData } = getLastWeekData(dailyStats);

  // Destroy previous chart if exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create new chart for cigarettes smoked
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Cigarettes Smoked',
        data: cigarettesData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Render graph for money spent
function renderMoneyGraph() {
  const ctx = document.getElementById('moneyChart').getContext('2d');
  const dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {};

  const { labels, moneySpentData } = getLastWeekData(dailyStats);

  // Destroy previous chart if exists
  if (moneyChartInstance) {
    moneyChartInstance.destroy();
  }

  // Create new chart for money spent
  moneyChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Money Spent (€)',
        data: moneySpentData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Log cigarette button
logCigaretteBtn.addEventListener('click', () => {
  if (cigarettesRemaining > 0) {
    cigarettesRemaining--;
    cigarettesSmokedToday++;
    totalSpent += costPerCigarette;

    localStorage.setItem('cigarettesRemaining', cigarettesRemaining);
    localStorage.setItem('totalSpent', totalSpent);
    localStorage.setItem('cigsToday', cigarettesSmokedToday);

    updateDailyStats();
    updateDisplay();  // Auto-update both graphs
  } else {
    alert('No cigarettes left! Log a new pack.');
  }
});

// Log new pack button
logPackBtn.addEventListener('click', () => {
  const packSize = parseInt(packSizeInput.value);
  const packCost = parseFloat(packCostInput.value);

  if (packSize && packCost) {
    cigarettesRemaining += packSize;
    if (costPerCigarette === 0.0) {
      costPerCigarette = packCost / packSize;
    } else {
      costPerCigarette = (costPerCigarette + (packCost / packSize)) / 2;
    }
    

    localStorage.setItem('cigarettesRemaining', cigarettesRemaining);
    localStorage.setItem('costPerCigarette', costPerCigarette);

    updateDisplay();  // Auto-update both graphs
  } else {
    alert('Please enter valid pack details.');
  }
});

// Erase data
eraseDataBtn.addEventListener('click', () => {
  localStorage.clear();
  cigarettesRemaining = 0;
  totalSpent = 0;
  costPerCigarette = 0;
  cigarettesSmokedToday = 0;

  updateDisplay();  // Auto-update both graphs
});

function getRemainingDaysInYear() {
  const today = new Date();
  const endOfYear = new Date(today.getFullYear(), 11, 31); // December 31 of the current year
  const diffTime = endOfYear - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
}

// Function to export data to JSON
function exportData() {
  const data = {
    cigarettesRemaining,
    totalSpent,
    costPerCigarette,
    cigarettesSmokedToday,
    dailyStats: JSON.parse(localStorage.getItem('dailyStats')) || {}
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cigarette-logging-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Function to import data from JSON
function importData(file) {
  const reader = new FileReader();
  
  reader.onload = function(event) {
    const data = JSON.parse(event.target.result);

    // Update local storage and variables with imported data
    cigarettesRemaining = data.cigarettesRemaining || 0;
    totalSpent = data.totalSpent || 0;
    costPerCigarette = data.costPerCigarette || 0;
    cigarettesSmokedToday = data.cigarettesSmokedToday || 0;

    localStorage.setItem('cigarettesRemaining', cigarettesRemaining);
    localStorage.setItem('totalSpent', totalSpent);
    localStorage.setItem('costPerCigarette', costPerCigarette);
    localStorage.setItem('cigsToday', cigarettesSmokedToday);

    localStorage.setItem('dailyStats', JSON.stringify(data.dailyStats || {}));

    updateDisplay();  // Auto-update both graphs
  };
  
  reader.readAsText(file);
}

// Add event listeners for export and import buttons
document.getElementById('export-data').addEventListener('click', exportData);

document.getElementById('import-file').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    importData(file);
  }
});

document.getElementById('import-data').addEventListener('click', function() {
  document.getElementById('import-file').click();  // Trigger file input click
});

// Initial call to display and render the graphs
updateDisplay();
