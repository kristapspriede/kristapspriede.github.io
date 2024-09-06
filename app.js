// Global Variables
let chartInstance = null;
let moneyChartInstance = null;
let timerInterval = null;
let longestNonSmokingTime = getFromLocalStorage('longestNonSmokingTime', 0);

// Local Storage Variables
let cigarettesRemaining = getFromLocalStorage('cigarettesRemaining', 0);
let totalSpent = getFromLocalStorage('totalSpent', 0);
let costPerCigarette = getFromLocalStorage('costPerCigarette', 0);
let cigarettesSmokedToday = getFromLocalStorage('cigsToday', 0);
let remainingDaysLeft = getRemainingDaysInYear();
let averageDailyCigarettes = 0;
let averageDailyMoneySpent = 0;
let projectedExp = 0;
let projectedExpYear = 0;
let projectedCigs = 0;
let projectedCigsYear = 0;

// DOM Elements
const elements = {
  remainingEl: document.getElementById('cigarettes-remaining'),
  spentEl: document.getElementById('total-spent'),
  costPerCigEl: document.getElementById('cost-per-cigarette'),
  cigsTodayEl: document.getElementById('cigs-today'),
  avgDailyCigsEl: document.getElementById('avg-daily-cigs'),
  avgDailySpentEl: document.getElementById('avg-daily-spent'),
  logCigaretteBtn: document.getElementById('log-cigarette'),
  logPackBtn: document.getElementById('log-pack'),
  packSizeInput: document.getElementById('pack-size'),
  packCostInput: document.getElementById('pack-cost'),
  eraseDataBtn: document.getElementById('erase-data'),
  projectedExpenses: document.getElementById('projected-expenses'),
  projectedExpensesYear: document.getElementById('projected-expenses-year'),
  projectedCigarettes: document.getElementById('projected-cigarettes'),
  projectedCigarettesYear: document.getElementById('projected-cigarettes-year'),
  cigaretteTimesList: document.getElementById('cigarettes-times-list'),
  timerSinceLastCig: document.getElementById('timer-since-last-cig'),
  longestNonSmokingTimeEl: document.getElementById('longest-non-smoking-time'),
  exportDataBtn: document.getElementById('export-data'),
  importDataBtn: document.getElementById('import-data'),
  importDataInput: document.getElementById('import-data-input')
};

// Utility Functions
function getFromLocalStorage(key, defaultValue) {
  return JSON.parse(localStorage.getItem(key)) || defaultValue;
}

function safeAddEventListener(element, event, handler) {
  if (element) {
    element.addEventListener(event, handler);
  } else {
    console.warn(`Element not found for event: ${event}`);
  }
}

function updateLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Update Display and Calculations
function updateDisplay() {
  updateBasicInfo();
  calculateAverages();
  updateAveragesDisplay();
  calculateProjectedExpenses();
  updateProjectionsDisplay();
  renderGraphs();
  updateCigaretteTimesList();
  updateTimer();
  updateLongestNonSmokingTime();
}

function updateBasicInfo() {
  elements.remainingEl.textContent = cigarettesRemaining;
  elements.spentEl.textContent = totalSpent.toFixed(2);
  elements.costPerCigEl.textContent = costPerCigarette.toFixed(2);
  elements.cigsTodayEl.textContent = getCigarettesSmokedToday();
}

function updateAveragesDisplay() {
  elements.avgDailyCigsEl.textContent = averageDailyCigarettes.toFixed(2);
  elements.avgDailySpentEl.textContent = averageDailyMoneySpent.toFixed(2);
}

function updateProjectionsDisplay() {
  elements.projectedCigarettes.textContent = projectedCigs.toFixed(2);
  elements.projectedCigarettesYear.textContent = projectedCigsYear.toFixed(2);
  elements.projectedExpenses.textContent = projectedExp.toFixed(2);
  elements.projectedExpensesYear.textContent = projectedExpYear.toFixed(2);
}

function calculateAverages() {
  const dailyStats = getFromLocalStorage('dailyStats', {});
  const days = Object.keys(dailyStats);
  
  if (days.length === 0) {
    averageDailyCigarettes = 0;
    averageDailyMoneySpent = 0;
    return;
  }

  let totalCigarettes = 0;
  let totalSpent = 0;

  days.forEach(day => {
    totalCigarettes += dailyStats[day].cigarettes;
    totalSpent += dailyStats[day].spent;
  });

  averageDailyCigarettes = totalCigarettes / days.length;
  averageDailyMoneySpent = totalSpent / days.length;
}

function calculateProjectedExpenses() {
  projectedCigs = averageDailyCigarettes * remainingDaysLeft;
  projectedCigsYear = averageDailyCigarettes * 365;
  projectedExp = averageDailyMoneySpent * remainingDaysLeft;
  projectedExpYear = averageDailyMoneySpent * 365;
}

// Timer and Cigarette Logging
function updateTimer() {
  const lastCigaretteTime = getLastCigaretteTime();
  clearInterval(timerInterval);

  if (lastCigaretteTime) {
    timerInterval = setInterval(() => {
      const elapsed = Date.now() - lastCigaretteTime;
      displayElapsedTime(elapsed);
      updateLongestNonSmokingTime(elapsed);
    }, 1000);
  } else {
    elements.timerSinceLastCig.textContent = 'No cigarettes logged today.';
  }
}

function getLastCigaretteTime() {
  const dailyStats = getFromLocalStorage('dailyStats', {});
  const today = getToday();
  return dailyStats[today]?.timestamps?.length > 0 ? new Date(dailyStats[today].timestamps.slice(-1)[0]).getTime() : null;
}

function getCigarettesSmokedToday() {
  const today = getToday();
  const dailyStats = getFromLocalStorage('dailyStats', {});
  return dailyStats[today]?.cigarettes || 0;
}

function displayElapsedTime(elapsed) {
  const hours = Math.floor(elapsed / (1000 * 60 * 60));
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

  elements.timerSinceLastCig.textContent = `${hours}h ${minutes}m ${seconds}s ago`;
}

function updateLongestNonSmokingTime() {
  const lastCigaretteTime = getLastCigaretteTime();
  if (!lastCigaretteTime) return;

  const currentNonSmokingTime = Date.now() - lastCigaretteTime;
  if (currentNonSmokingTime > longestNonSmokingTime) {
    longestNonSmokingTime = currentNonSmokingTime;
    updateLocalStorage('longestNonSmokingTime', longestNonSmokingTime);
  }
  displayLongestNonSmokingTime();
}

function displayLongestNonSmokingTime() {
  const hours = Math.floor(longestNonSmokingTime / (1000 * 60 * 60));
  const minutes = Math.floor((longestNonSmokingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((longestNonSmokingTime % (1000 * 60)) / 1000);

  elements.longestNonSmokingTimeEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
}

function updateCigaretteTimesList() {
  const today = getToday();
  const dailyStats = getFromLocalStorage('dailyStats', {});
  const timestamps = dailyStats[today]?.timestamps || [];

  let lastFiveTimestamps = timestamps.slice(-5).reverse();
  elements.cigaretteTimesList.innerHTML = lastFiveTimestamps.length
    ? lastFiveTimestamps.map(time => `<li>${new Date(time).toLocaleTimeString()}</li>`).join('')
    : '<li>No cigarettes logged today.</li>';
}

// Logging Buttons
elements.logCigaretteBtn.addEventListener('click', logCigarette);
elements.logPackBtn.addEventListener('click', logPack);
elements.eraseDataBtn.addEventListener('click', eraseData);

function logCigarette() {
  if (cigarettesRemaining > 0) {
    cigarettesRemaining--;
    totalSpent += costPerCigarette;

    updateLongestNonSmokingTime();
    saveLoggingData();
    updateDailyStats(true);
    updateDisplay();
  } else {
    alert('No cigarettes left! Log a new pack.');
  }
}

function logPack() {
  const packSize = parseInt(elements.packSizeInput.value);
  const packCost = parseFloat(elements.packCostInput.value);

  if (packSize && packCost) {
    cigarettesRemaining += packSize;
    costPerCigarette = costPerCigarette ? (costPerCigarette + (packCost / packSize)) / 2 : packCost / packSize;
    saveLoggingData();
    updateDisplay();
  } else {
    alert('Please enter valid pack details.');
  }
}

function saveLoggingData() {
  updateLocalStorage('cigarettesRemaining', cigarettesRemaining);
  updateLocalStorage('totalSpent', totalSpent);
  updateLocalStorage('cigsToday', cigarettesSmokedToday);
  updateDailyStats();
}

function eraseData() {
  localStorage.clear();
  cigarettesRemaining = totalSpent = costPerCigarette = cigarettesSmokedToday = 0;
  updateDisplay();
}

// Daily Statistics
function updateDailyStats(incrementCigarettes = false) {
  const today = getToday();
  const dailyStats = getFromLocalStorage('dailyStats', {});

  if (!dailyStats[today]) {
    dailyStats[today] = { cigarettes: 0, spent: 0, timestamps: [] };
  }

  if (incrementCigarettes) {
    dailyStats[today].cigarettes++;
    dailyStats[today].spent += costPerCigarette;
    dailyStats[today].timestamps.push(new Date().toISOString());
  }

  updateLocalStorage('dailyStats', dailyStats);
}

// Graphs
function renderGraphs() {
  renderCigaretteGraph();
  renderMoneyGraph();
}

function renderCigaretteGraph() {
  const ctx = document.getElementById('cigarettesChart').getContext('2d');
  const dailyStats = getFromLocalStorage('dailyStats', {});
  const { labels, cigarettesData } = getLastWeekData(dailyStats);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Cigarettes Smoked', data: cigarettesData, backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] },
    options: { scales: { y: { beginAtZero: true } } }
  });
}

function renderMoneyGraph() {
  const ctx = document.getElementById('moneyChart').getContext('2d');
  const dailyStats = getFromLocalStorage('dailyStats', {});
  const { labels, moneySpentData } = getLastWeekData(dailyStats);

  if (moneyChartInstance) moneyChartInstance.destroy();

  moneyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Money Spent', data: moneySpentData, backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1 }] },
    options: { scales: { y: { beginAtZero: true } } }
  });
}

function getLastWeekData(dailyStats) {
  const labels = [];
  const cigarettesData = [];
  const moneySpentData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const day = date.toISOString().split('T')[0];

    labels.push(day);
    cigarettesData.push(dailyStats[day]?.cigarettes || 0);
    moneySpentData.push(dailyStats[day]?.spent || 0);
  }

  return { labels, cigarettesData, moneySpentData };
}

// Date Utility
function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getRemainingDaysInYear() {
  const today = new Date();
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  return Math.ceil((endOfYear - today) / (1000 * 60 * 60 * 24));
}

// Export Data
function exportData() {
  const data = {
    cigarettesRemaining,
    totalSpent,
    costPerCigarette,
    longestNonSmokingTime,
    dailyStats: getFromLocalStorage('dailyStats', {})
  };

  const dataStr = JSON.stringify(data);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

  const exportFileDefaultName = 'cigarette_tracker_data.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

// Import Data
function importData(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        
        cigarettesRemaining = data.cigarettesRemaining;
        totalSpent = data.totalSpent;
        costPerCigarette = data.costPerCigarette;
        longestNonSmokingTime = data.longestNonSmokingTime;

        updateLocalStorage('cigarettesRemaining', cigarettesRemaining);
        updateLocalStorage('totalSpent', totalSpent);
        updateLocalStorage('costPerCigarette', costPerCigarette);
        updateLocalStorage('longestNonSmokingTime', longestNonSmokingTime);
        updateLocalStorage('dailyStats', data.dailyStats);

        updateDisplay();
        alert('Data imported successfully!');
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  }
}

// Event Listeners
safeAddEventListener(elements.logCigaretteBtn, 'click', logCigarette);
safeAddEventListener(elements.logPackBtn, 'click', logPack);
safeAddEventListener(elements.eraseDataBtn, 'click', eraseData);
safeAddEventListener(elements.exportDataBtn, 'click', exportData);
safeAddEventListener(elements.importDataInput, 'change', importData);

// Trigger file input when import button is clicked
safeAddEventListener(elements.importDataBtn, 'click', () => {
  elements.importDataInput?.click();
});

// Initial Display Update
updateDisplay();
