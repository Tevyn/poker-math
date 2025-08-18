// Application state
let currentMode = 'study';
let selectedAction = 'raise';
let userSelections = {};
let editMode = false;
let currentCategory = 'open_raises';
let currentRangeId = 'lj';
let savedRanges = {};
let editingRange = {};
let isDragging = false;
let dragStarted = false;
let currentView = 'pattern'; // 'grid' or 'pattern' - default to pattern
let defaultView = 'pattern'; // User's preferred default view

// Category testing state
let categoryTestMode = false; // true when testing a whole category
let categoryTestData = {
    category: '',
    situations: [],
    currentIndex: 0,
    results: [] // Store results for each situation in category
};

// Hand practice state
let handPracticeMode = false;
let currentPracticeHand = null;
let practiceStats = {
    correct: 0,
    total: 0,
    streak: 0
};

// Multi-range practice state
let multiRangePracticeMode = false;
let currentPracticeCategory = 'open_raises';
let multiRangeAnswers = {}; // Store user selections per range {rangeId: action}
let multiRangeResults = {}; // Store results per range {rangeId: {correct: boolean, correctAction: string}}

// Generate the hand matrix
function generateHandMatrix() {
    const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    const hands = [];
    
    for (let i = 0; i < 13; i++) {
        for (let j = 0; j < 13; j++) {
            let hand;
            if (i === j) {
                // Pocket pairs (diagonal)
                hand = ranks[i] + ranks[j];
            } else if (i < j) {
                // Suited hands (above diagonal)
                hand = ranks[i] + ranks[j] + 's';
            } else {
                // Offsuit hands (below diagonal)
                hand = ranks[j] + ranks[i] + 'o';
            }
            hands.push(hand);
        }
    }
    
    return hands;
}

// Generate pattern view layout
function generatePatternLayout() {
    const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    const pattern = [];
    
    // Generate each row based on highest rank
    for (let i = 0; i < 13; i++) {
        const row = [];
        const highRank = ranks[i];
        const lowerRanks = ranks.slice(i + 1); // Only ranks lower than current
        
        // Add offsuit hands (high rank first, in ascending order of low rank)
        for (let j = lowerRanks.length - 1; j >= 0; j--) {
            row.push(highRank + lowerRanks[j] + 'o');
        }
        
        // Add pocket pair (center)
        row.push(highRank + highRank);
        
        // Add suited hands (high rank first, in descending order of low rank)
        for (let j = 0; j < lowerRanks.length; j++) {
            row.push(highRank + lowerRanks[j] + 's');
        }
        
        // Calculate padding to center the row
        const totalHands = row.length;
        const maxWidth = 25; // Width of top row (Aces)
        const totalPadding = maxWidth - totalHands;
        const leftPadding = Math.floor(totalPadding / 2);
        const rightPadding = totalPadding - leftPadding;
        
        // Add left padding (empty cells)
        for (let p = 0; p < leftPadding; p++) {
            row.unshift('');
        }
        
        // Add right padding (empty cells)
        for (let p = 0; p < rightPadding; p++) {
            row.push('');
        }
        
        pattern.push(row);
    }
    
    return pattern;
}

// Create the range grid
function createRangeGrid() {
    const grid = document.getElementById('rangeGrid');
    grid.innerHTML = ''; // Clear existing content
    
    if (currentView === 'grid') {
        createGridView(grid);
    } else {
        createPatternView(grid);
    }
}

// Create grid view (original 13x13 layout)
function createGridView(grid) {
    grid.className = 'range-grid';
    const hands = generateHandMatrix();
    
    hands.forEach(hand => {
        const cell = document.createElement('div');
        cell.className = 'hand-cell';
        cell.textContent = hand;
        cell.dataset.hand = hand;
        
        // Set initial state based on current mode and range
        updateCellDisplay(cell, hand);
        
        // Add event handlers for both click and drag
        cell.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (currentMode === 'test') {
                handleCellClick(cell, hand);
                isDragging = true;
                dragStarted = true;
                // Add dragging class to all cells to disable hover effects
                document.querySelectorAll('.hand-cell').forEach(c => c.classList.add('dragging'));
            } else if (editMode) {
                handleEditClick(cell, hand);
                isDragging = true;
                dragStarted = true;
                // Add dragging class to all cells to disable hover effects
                document.querySelectorAll('.hand-cell').forEach(c => c.classList.add('dragging'));
            }
        });
        
        cell.addEventListener('mouseenter', () => {
            if (isDragging) {
                if (currentMode === 'test') {
                    handleCellClick(cell, hand);
                } else if (editMode) {
                    handleEditClick(cell, hand);
                }
            }
        });
        
        cell.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                dragStarted = false;
                // Remove dragging class from all cells
                document.querySelectorAll('.hand-cell').forEach(c => c.classList.remove('dragging'));
            }
        });
        
        // Prevent text selection during drag
        cell.addEventListener('selectstart', (e) => e.preventDefault());
        
        grid.appendChild(cell);
    });
}

// Create pattern view (new layout)
function createPatternView(grid) {
    grid.className = 'range-grid pattern-view';
    const pattern = generatePatternLayout();
    
    pattern.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        rowElement.className = 'pattern-row';
        
        row.forEach(hand => {
            if (hand === '') {
                // Create empty cell for padding
                const emptyCell = document.createElement('div');
                emptyCell.className = 'hand-cell empty-cell';
                emptyCell.style.visibility = 'hidden';
                rowElement.appendChild(emptyCell);
            } else {
                const cell = document.createElement('div');
                cell.className = 'hand-cell';
                cell.textContent = hand;
                cell.dataset.hand = hand;
                
                // Set initial state based on current mode and range
                updateCellDisplay(cell, hand);
                
                // Add event handlers for both click and drag
                cell.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    if (currentMode === 'test') {
                        handleCellClick(cell, hand);
                        isDragging = true;
                        dragStarted = true;
                        // Add dragging class to all cells to disable hover effects
                        document.querySelectorAll('.hand-cell').forEach(c => c.classList.add('dragging'));
                    } else if (editMode) {
                        handleEditClick(cell, hand);
                        isDragging = true;
                        dragStarted = true;
                        // Add dragging class to all cells to disable hover effects
                        document.querySelectorAll('.hand-cell').forEach(c => c.classList.add('dragging'));
                    }
                });
                
                cell.addEventListener('mouseenter', () => {
                    if (isDragging) {
                        if (currentMode === 'test') {
                            handleCellClick(cell, hand);
                        } else if (editMode) {
                            handleEditClick(cell, hand);
                        }
                    }
                });
                
                cell.addEventListener('mouseup', () => {
                    if (isDragging) {
                        isDragging = false;
                        dragStarted = false;
                        // Remove dragging class from all cells
                        document.querySelectorAll('.hand-cell').forEach(c => c.classList.remove('dragging'));
                    }
                });
                
                // Prevent text selection during drag
                cell.addEventListener('selectstart', (e) => e.preventDefault());
                
                rowElement.appendChild(cell);
            }
        });
        
        grid.appendChild(rowElement);
    });
}

// Switch between grid and pattern views
function switchView(view) {
    currentView = view;
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(view + 'ViewBtn').classList.add('active');
    
    // Recreate the grid with new layout
    createRangeGrid();
}

// Handle cell click in test mode
function handleCellClick(cell, hand) {
    const currentAction = userSelections[hand] || 'fold';
    
    // Toggle logic: if current action matches selected action, toggle to fold
    let newAction;
    if (currentAction === selectedAction) {
        newAction = 'fold';
        delete userSelections[hand]; // Remove from selections when folding
    } else {
        newAction = selectedAction;
        userSelections[hand] = selectedAction;
    }
    
    // Remove existing user classes
    cell.classList.remove('user-raise', 'user-call', 'user-fold');
    
    // Add new user selection
    if (newAction !== 'fold') {
        cell.classList.add(`user-${newAction}`);
    } else {
        cell.classList.add('fold');
    }
}

// Switch between modes
function switchMode(mode) {
    // Exit edit mode if switching modes
    if (editMode) {
        exitEditMode();
    }
    
    currentMode = mode;
    
    // Update navigation button states
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(mode + 'Mode').classList.add('active');
    
    // Show/hide control panels based on mode
    document.querySelectorAll('.control-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(mode + 'Controls').classList.add('active');
    
    // Handle header selectors visibility
    const headerPracticeCategoryGroup = document.getElementById('headerPracticeCategoryGroup');
    const headerSituationGroup = document.querySelector('.header-selector-group:first-child'); // Situation selector group
    const rangeContainer = document.querySelector('.range-container');
    const legend = document.querySelector('.legend');
    
    if (mode === 'settings') {
        // Hide grid and legend in settings mode, keep situation selector in header
        headerPracticeCategoryGroup.style.display = 'none';
        headerSituationGroup.style.display = 'flex';
        rangeContainer.style.display = 'none';
        legend.style.display = 'none';
    } else if (mode === 'handpractice') {
        // In hand practice mode, show only practice category selector in header
        headerPracticeCategoryGroup.style.display = 'flex';
        headerSituationGroup.style.display = 'none'; // Hide situation selector
        rangeContainer.style.display = 'none';
        legend.style.display = 'none';
    } else {
        // Hide practice category selector and show grid in other modes
        headerPracticeCategoryGroup.style.display = 'none';
        headerSituationGroup.style.display = 'flex'; // Show situation selector
        rangeContainer.style.display = 'block';
        legend.style.display = 'flex';
        
        // Enable situation selector in test mode for category/situation selection
        const situationSelect = document.getElementById('situationSelect');
        situationSelect.disabled = false;
    }
    
    // Clear category test when switching modes
    if (mode !== 'test' && categoryTestMode) {
        exitCategoryTest();
    }
    
    // Exit hand practice when switching modes
    if (mode !== 'handpractice' && handPracticeMode) {
        exitHandPractice();
    }
    
    // Exit multi-range practice when switching modes
    if (mode !== 'handpractice' && multiRangePracticeMode) {
        exitMultiRangePractice();
    }
    
    // Update grid display
    updateGridDisplay();
}

// Update grid display based on current mode
function updateGridDisplay() {
    const cells = document.querySelectorAll('.hand-cell');
    
    cells.forEach(cell => {
        const hand = cell.dataset.hand;
        updateCellDisplay(cell, hand);
    });
}

// Clear all user selections and result markers
function clearSelections() {
    userSelections = {};
    
    // Clear result highlighting
    document.querySelectorAll('.hand-cell').forEach(cell => {
        cell.classList.remove('correct', 'incorrect');
    });
    
    // Hide test results
    document.getElementById('testResults').style.display = 'none';
    
    updateGridDisplay();
}

// Check results and show check/X marks in cells
function checkResults() {
    let correct = 0;
    let incorrect = 0;
    let total = 0;
    
    const cells = document.querySelectorAll('.hand-cell');
    const currentRange = getCurrentRange();
    
    cells.forEach(cell => {
        const hand = cell.dataset.hand;
        const correctAction = getHandAction(currentRange, hand);
        const userAction = userSelections[hand] || 'fold';
        
        total++;
        
        if (userAction === correctAction) {
            correct++;
            cell.classList.add('correct');
        } else {
            incorrect++;
            cell.classList.add('incorrect');
        }
    });
    
    const accuracy = ((correct / total) * 100).toFixed(1);
    
    // Handle category testing
    if (categoryTestMode) {
        // Store results for this situation
        const situationName = savedRanges.categories?.[currentCategory]?.ranges?.[currentRangeId]?.name || 'Unknown';
        categoryTestData.results.push({
            situationId: currentRangeId,
            situationName: situationName,
            correct: correct,
            incorrect: incorrect,
            total: total,
            accuracy: parseFloat(accuracy)
        });
        
        // Show current situation results with next button
        showCategoryTestResults(accuracy, correct, incorrect, total);
    } else {
        // Regular single situation test
        showSingleTestResults(accuracy, correct, incorrect, total);
    }
}

function showSingleTestResults(accuracy, correct, incorrect, total) {
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    const testResults = document.getElementById('testResults');
    
    accuracyDisplay.innerHTML = `
        <div style="margin-bottom: 8px; font-size: 24px;">${accuracy}% Correct</div>
        <div style="font-size: 14px; color: #cccccc; font-weight: normal;">
            ${correct} correct • ${incorrect} incorrect • ${total} total
        </div>
    `;
    
    testResults.style.display = 'block';
}

function showCategoryTestResults(accuracy, correct, incorrect, total) {
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    const testResults = document.getElementById('testResults');
    
    const isLastSituation = categoryTestData.currentIndex >= categoryTestData.situations.length - 1;
    
    if (isLastSituation) {
        // Show final category results
        showFinalCategoryResults();
    } else {
        // Show current situation results with next button
        accuracyDisplay.innerHTML = `
            <div style="margin-bottom: 8px; font-size: 20px;">${accuracy}% Correct</div>
            <div style="font-size: 14px; color: #cccccc; font-weight: normal; margin-bottom: 12px;">
                ${correct} correct • ${incorrect} incorrect • ${total} total
            </div>
            <button id="nextSituationBtn" class="action-btn primary" style="margin-top: 8px;">
                Next Situation (${categoryTestData.currentIndex + 2}/${categoryTestData.situations.length})
            </button>
        `;
        
        // Add event listener for next button
        document.getElementById('nextSituationBtn').addEventListener('click', advanceToNextSituation);
    }
    
    testResults.style.display = 'block';
}

function showFinalCategoryResults() {
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    
    // Calculate overall category accuracy
    const totalCorrect = categoryTestData.results.reduce((sum, result) => sum + result.correct, 0);
    const totalQuestions = categoryTestData.results.reduce((sum, result) => sum + result.total, 0);
    const overallAccuracy = ((totalCorrect / totalQuestions) * 100).toFixed(1);
    
    const categoryName = savedRanges.categories?.[categoryTestData.category]?.name || 'Unknown Category';
    
    // Build detailed breakdown
    let breakdown = '';
    categoryTestData.results.forEach(result => {
        breakdown += `<div style="margin: 4px 0; font-size: 13px;">
            ${result.situationName}: ${result.accuracy.toFixed(1)}% (${result.correct}/${result.total})
        </div>`;
    });
    
    accuracyDisplay.innerHTML = `
        <div style="margin-bottom: 12px; font-size: 22px; color: #4CAF50;">${categoryName} Complete!</div>
        <div style="margin-bottom: 8px; font-size: 20px;">${overallAccuracy}% Overall</div>
        <div style="font-size: 14px; color: #cccccc; font-weight: normal; margin-bottom: 12px;">
            ${totalCorrect} correct • ${totalQuestions - totalCorrect} incorrect • ${totalQuestions} total
        </div>
        <div style="border-top: 1px solid #444; padding-top: 12px; margin-top: 12px;">
            <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">Breakdown:</div>
            ${breakdown}
        </div>
        <button id="restartCategoryBtn" class="action-btn secondary" style="margin-top: 12px;">
            Test ${categoryName} Again
        </button>
    `;
    
    // Add event listener for restart button
    document.getElementById('restartCategoryBtn').addEventListener('click', () => {
        startCategoryTest(categoryTestData.category);
    });
}

function advanceToNextSituation() {
    categoryTestData.currentIndex++;
    const nextSituationId = categoryTestData.situations[categoryTestData.currentIndex];
    
    // Switch to next situation
    currentRangeId = nextSituationId;
    
    // Clear selections and results
    clearSelections();
    
    // Update display
    updateGridDisplay();
    updateRangeTitle();
    updateTestProgress();
}

// Select action for painting
function selectAction(action) {
    selectedAction = action;
    
    // Update button states
    document.querySelectorAll('.action-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(action + 'Action').classList.add('active');
}

// Helper function to create empty range (all hands fold)
    function createEmptyRange() {
        return {};
    }

    // Helper function to get action for a hand from new array-based range format
    function getHandAction(range, hand) {
        if (range.raise && range.raise.includes(hand)) return 'raise';
        if (range.call && range.call.includes(hand)) return 'call';
        return 'fold';
    }

    // Helper function to set action for a hand in new array-based range format
    function setHandAction(range, hand, action) {
        // Remove hand from all action arrays first
        if (range.raise) {
            range.raise = range.raise.filter(h => h !== hand);
            if (range.raise.length === 0) delete range.raise;
        }
        if (range.call) {
            range.call = range.call.filter(h => h !== hand);
            if (range.call.length === 0) delete range.call;
        }
        
        // Add hand to appropriate action array (unless folding)
        if (action === 'raise') {
            if (!range.raise) range.raise = [];
            range.raise.push(hand);
        } else if (action === 'call') {
            if (!range.call) range.call = [];
            range.call.push(hand);
        }
        // fold is implicit - don't store anything
    }

// Initialize default ranges with categories
function initializeDefaultRanges() {
    return {
        "categories": {
        "open_raises": {
            "name": "Open Raises",
            "ranges": {
                "lj": {
                    "name": "LJ (Lojack)",
                    "range": {
                        "raise": ["77", "88", "99", "AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "QJs", "QTs", "Q9s", "JTs", "T9s", "AKo", "AQo", "AJo", "ATo", "KQo", "KJo", "QJo"]
                    }
                },
                "hj": {
                    "name": "HJ (Highjack)",
                    "range": {
                        "raise": ["66", "77", "88", "99", "AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "QJs", "QTs", "Q9s", "Q8s", "JTs", "J9s", "T9s", "AKo", "AQo", "AJo", "ATo", "A9o", "KQo", "KJo", "QJo", "QTo", "KTo"]
                    }
                },
                "co": {
                    "name": "CO (Cutoff)",
                    "range": {
                        "raise": ["22", "33", "44", "55", "66", "77", "88", "99", "AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "JTs", "J9s", "J8s", "J7s", "T9s", "T8s", "98s", "AKo", "AQo", "AJo", "ATo", "A9o", "A8o", "KQo", "KJo", "QJo", "JTo", "QTo", "KTo", "K9o"]
                    }
                },
                "btn": {
                    "name": "BTN (Button) / SB (Small Blind)",
                    "range": {
                        "raise": ["22", "33", "44", "55", "66", "77", "88", "99", "AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "T9s", "T8s", "T7s", "T6s", "98s", "97s", "96s", "87s", "86s", "76s", "75s", "65s", "54s", "AKo", "AQo", "AJo", "ATo", "A9o", "A8o", "A7o", "A6o", "A5o", "A4o", "A3o", "KQo", "KJo", "QJo", "JTo", "QTo", "KTo", "T9o", "Q9o", "K9o", "K8o", "J9o"]
                    }
                }
            }
        },
        "vs_lj": {
            "name": "vs. LJ",
            "ranges": {
                "hj_vs_lj": {
                    "name": "HJ vs LJ",
                    "range": {
                        "raise": ["AA", "KK", "QQ", "JJ", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo", "KQo"]
                    }
                },
                "co_vs_lj": {
                    "name": "CO vs LJ",
                    "range": {
                        "raise": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo", "KQo"]
                    }
                },
                "btn_vs_lj": {
                    "name": "BTN vs LJ",
                    "range": {
                        "raise": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo", "KQo"],
                        "call": ["55", "66", "77", "88", "99", "98s", "87s", "76s", "65s", "54s", "44"]
                    }
                },
                "sb_vs_lj": {
                    "name": "SB vs LJ",
                    "range": {
                        "raise": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo"]
                    }
                },
                "bb_vs_lj": {
                    "name": "BB vs LJ",
                    "range": {
                        "raise": ["AA", "KK", "QQ", "AKs", "AQs", "AJs", "ATs", "A5s", "A4s", "KQs", "KJs", "AKo", "KQo"],
                        "call": ["22", "33", "44", "55", "66", "77", "88", "99", "JJ", "TT", "A9s", "A8s", "A7s", "A6s", "A3s", "A2s", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "JTs", "J9s", "J8s", "T9s", "T8s", "T7s", "98s", "97s", "96s", "87s", "86s", "76s", "75s", "65s", "64s", "54s", "53s", "43s", "AQo", "AJo", "ATo"]
                    }
                }
            }
        },
        "vs_hj": {
            "name": "vs. HJ",
            "ranges": {
                "co_vs_hj": {
                    "name": "CO vs HJ",
                    "range": {
                        "raise": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo", "AJo", "KQo"]
                    }
                },
                "btn_vs_hj": {
                    "name": "BTN vs HJ",
                    "range": {
                        "raise": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo", "AJo", "KQo"],
                        "call": ["55", "66", "77", "88", "99", "98s", "87s", "76s"]
                    }
                },
                "sb_vs_hj": {
                    "name": "SB vs HJ",
                    "range": {
                        "raise": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo", "AJo", "KQo"]
                    }
                },
                "bb_vs_hj": {
                    "name": "BB vs HJ",
                    "range": {
                        "raise": ["AA", "KK", "QQ", "JJ", "AKs", "AQs", "A6s", "A5s", "A4s", "A3s", "A2s", "K6s", "K5s", "K4s", "K3s", "K2s", "AKo", "KQo"],
                        "call": ["22", "33", "44", "55", "66", "77", "88", "99", "TT", "AJs", "ATs", "A9s", "A8s", "A7s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "JTs", "J9s", "J8s", "T9s", "T8s", "T7s", "98s", "97s", "96s", "87s", "86s", "85s", "76s", "75s", "65s", "64s", "54s", "53s", "43s", "AQo", "AJo", "ATo", "KJo", "QJo"]
                    }
                }
            }
        },
        "vs_co": {
            "name": "vs. CO",
            "ranges": {
                "btn_vs_co": {
                    "name": "BTN vs CO",
                    "range": {
                        "raise": ["A9s", "ATs", "AJs", "AQs", "AKs", "AA", "A5s", "A4s", "K9s", "KTs", "KJs", "KQs", "KK", "AKo", "QTs", "QJs", "QQ", "KQo", "AQo", "JTs", "JJ", "QJo", "KJo", "AJo", "TT", "ATo"],
                        "call": ["99", "98s", "88", "87s", "77", "76s"]
                    }
                },
                "sb_vs_co": {
                    "name": "SB vs CO",
                    "range": {
                        "raise": ["A9s", "ATs", "AJs", "AQs", "AKs", "AA", "A5s", "A4s", "A3s", "KTs", "KJs", "KQs", "KK", "AKo", "QTs", "QJs", "QQ", "KQo", "AQo", "KJo", "AJo", "JJ", "JTs", "TT", "99"]
                    }
                },
                "bb_vs_co": {
                    "name": "BB vs CO",
                    "range": {
                        "raise": ["AQs", "AKs", "AA", "KK", "QQ", "JJ", "AJo", "AQo", "AKo", "KQo", "A6s", "A5s", "A4s", "A3s", "A2s", "K2s", "K3s", "K4s", "K5s", "K6s"],
                        "call": ["A7s", "A8s", "A9s", "ATs", "AJs", "K7s", "K8s", "KTs", "KJs", "KQs", "Q5s", "Q6s", "Q7s", "Q8s", "QTs", "QJs", "K9s", "Q9s", "J6s", "J7s", "J8s", "J9s", "JTs", "A9o", "ATo", "KTo", "KJo", "QTo", "QJo", "JTo", "TT", "99", "88", "77", "66", "55", "44", "33", "22", "98s", "T7s", "T8s", "T9s", "96s", "97s", "86s", "87s", "75s", "76s", "64s", "65s", "53s", "54s", "43s"]
                    }
                }
            }
        },
        "vs_btn": {
            "name": "vs. BTN",
            "ranges": {
                "sb_vs_btn": {
                    "name": "SB vs BTN",
                    "range": {
                        "raise": ["A3s", "A4s", "A5s", "A6s", "A7s", "A8s", "A9s", "ATs", "AJs", "AQs", "AKs", "AA", "K9s", "KTs", "KJs", "KQs", "KK", "AKo", "Q9s", "QTs", "QJs", "QQ", "KQo", "AQo", "KJo", "AJo", "ATo", "JJ", "JTs", "TT", "T9s", "99", "88", "77"]
                    }
                },
                "bb_vs_btn": {
                    "name": "BB vs BTN",
                    "range": {
                        "raise": ["A5s", "A4s", "ATs", "AJs", "AQs", "AKs", "AA", "K9s", "KTs", "KJs", "KQs", "KK", "AKo", "Q9s", "QTs", "QJs", "QQ", "KQo", "AQo", "J8s", "J9s", "JTs", "JJ", "T8s", "T9s", "TT", "99", "98s", "KJo", "AJo", "ATo"],
                        "call": ["A9s", "A8s", "A7s", "A6s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "A3s", "A2s", "J4s", "J5s", "J6s", "J7s", "T6s", "T7s", "QJo", "QTo", "JTo", "J9o", "T9o", "K9o", "KTo", "A5o", "A6o", "A7o", "A8o", "A9o", "97s", "96s", "88", "87s", "86s", "85s", "77", "76s", "75s", "74s", "66", "65s", "64s", "55", "54s", "53s", "44", "43s", "33", "22"]
                    }
                }
            }
        },
        "vs_sb": {
            "name": "vs. SB",
            "ranges": {
                "bb_vs_sb": {
                    "name": "BB vs SB",
                    "range": {
                        "raise": ["ATs", "AJs", "AQs", "AKs", "AA", "A5s", "A4s", "KTs", "KJs", "KQs", "KK", "AKo", "QJs", "QQ", "AQo", "JJ", "TT", "Q8o", "K7o", "K6o", "K5o", "A7o", "A6o", "A5o", "A4o", "A3o", "A2o", "T5s", "T4s", "T3s", "T2s"],
                        "call": ["A9s", "A8s", "A7s", "A6s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "A2s", "A3s", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "T9s", "T8s", "T7s", "T6s", "99", "88", "77", "66", "55", "44", "33", "22", "K8o", "K9o", "KTo", "KJo", "KQo", "A8o", "A9o", "ATo", "AJo", "Q9o", "QTo", "QJo", "J9o", "JTo", "T8o", "T9o", "98s", "97s", "96s", "95s", "87s", "86s", "85s", "84s", "76s", "75s", "74s", "65s", "64s", "63s", "54s", "53s", "52s", "43s", "42s", "32s"]
                    }
                }
            }
        },
        "facing_3bet": {
            "name": "Facing a 3-bet",
            "ranges": {
                "lj_vs_hj_3bet": {
                    "name": "LJ vs HJ 3-bet",
                    "range": {
                        "raise": ["AKs", "AA", "KJs", "KQs", "KK", "AKo", "QQ", "JJ", "A5s", "A4s"],
                        "call": ["ATs", "AJs", "AQs", "TT", "99", "88"]
                    }
                },
                "lj_vs_co_3bet": {
                    "name": "LJ vs CO 3-bet",
                    "range": {
                        "raise": ["AKs", "AA", "KTs", "KJs", "KQs", "KK", "AKo", "QQ", "JJ", "A5s", "A4s"],
                        "call": ["TT", "99", "88", "ATs", "AJs", "AQs"]
                    }
                },
                "lj_vs_btn_3bet": {
                    "name": "LJ vs BTN 3-bet",
                    "range": {
                        "raise": ["AKs", "AA", "A5s", "A4s", "KTs", "KJs", "KQs", "KK", "AKo", "QQ", "JJ"],
                        "call": ["ATs", "AJs", "AQs", "TT", "99", "88", "77"]
                    }
                },
                "lj_vs_sb_3bet": {
                    "name": "LJ vs SB 3-bet",
                    "range": {
                        "raise": ["AKs", "AA", "KQs", "KK", "AKo", "A5s", "A4s"],
                        "call": ["ATs", "AJs", "AQs", "QQ", "JJ", "TT", "99", "88"]
                    }
                },
                "lj_vs_bb_3bet": {
                    "name": "LJ vs BB 3-bet",
                    "range": {
                        "raise": ["AKs", "AA", "AKo", "KK", "A5s", "A4s"],
                        "call": ["ATs", "AJs", "AQs", "KJs", "KQs", "QJs", "QQ", "JJ", "TT", "99"]
                    }
                },
                "hj_vs_co_3bet": {
                    "name": "HJ vs CO 3-bet",
                    "range": {
                        "raise": ["A5s", "AKs", "AA", "KTs", "KJs", "KQs", "KK", "AKo", "QQ", "AQo", "JJ"],
                        "call": ["ATs", "AJs", "AQs", "TT", "99", "88"]
                    }
                },
                "hj_vs_sb_3bet": {
                    "name": "HJ vs SB / BTN 3-bet",
                    "range": {
                        "raise": ["AKs", "AA", "KK", "QQ", "JJ", "AQo", "AKo", "KTs", "KJs", "KQs", "A5s"],
                        "call": ["ATs", "AJs", "AQs", "TT", "99", "88", "77"]
                    }
                },
                "hj_vs_bb_3bet": {
                    "name": "HJ vs BB 3-bet",
                    "range": {
                        "raise": ["AKs", "AA", "AKo", "KK", "AQo", "A5s"],
                        "call": ["ATs", "AJs", "AQs", "QQ", "KQs", "JJ", "TT", "99", "88", "77"]
                    }
                },
                "co_vs_btn_3bet": {
                    "name": "CO vs BTN 3-bet",
                    "range": {
                        "raise": ["ATo", "AJo", "AQo", "AKo", "AA", "KK", "AKs", "A5s", "QQ", "JJ", "JTs"],
                        "call": ["ATs", "AJs", "AQs", "KTs", "KJs", "KQs", "TT", "T9s", "99", "98s", "88", "77"]
                    }
                },
                "co_vs_sb_3bet": {
                    "name": "CO vs SB 3-bet",
                    "range": {
                        "raise": ["A5s", "AKo", "AQo", "AA", "KK", "AKs", "ATs", "KTs", "QQ", "JJ", "TT"],
                        "call": ["AJs", "KJs", "KQs", "AQs", "JTs", "99", "88", "77"]
                    }
                },
                "co_vs_bb_3bet": {
                    "name": "CO vs BB 3-bet",
                    "range": {
                        "raise": ["A5s", "KK", "AA", "AKs", "AKo", "AQo", "QQ", "JJ"],
                        "call": ["A9s", "ATs", "AJs", "AQs", "KTs", "KJs", "KQs", "QJs", "JTs", "TT", "99", "88", "77"]
                    }
                },
                "btn_vs_sb_3bet": {
                    "name": "BTN vs SB 3-bet",
                    "range": {
                        "raise": ["AQs", "AKs", "AA", "AQo", "AKo", "KK", "QQ", "JJ", "TT", "A9s", "A8s", "A5s"],
                        "call": ["ATs", "AJs", "KTs", "KQs", "KJs", "QTs", "QJs", "JTs", "T9s", "99", "98s", "88", "77"]
                    }
                },
                "btn_vs_bb_3bet": {
                    "name": "BTN vs BB 3-bet",
                    "range": {
                        "raise": ["AQs", "AKs", "AA", "KK", "AKo", "AQo", "QQ", "JJ", "TT", "A5s"],
                        "call": ["A8s", "A9s", "ATs", "AJs", "K9s", "KTs", "KJs", "KQs", "QTs", "QJs", "JTs", "T9s", "99", "88", "77", "66", "55", "98s", "87s", "76s", "65s"]
                    }
                },
                "sb_vs_bb_3bet": {
                    "name": "SB vs BB 3-bet",
                    "range": {
                        "raise": ["A7s", "A6s", "A5s", "A4s", "AQs", "AKs", "AA", "ATo", "AJo", "AQo", "AKo", "KK", "QQ", "JJ", "TT"],
                        "call": ["ATs", "AJs", "K9s", "KTs", "KJs", "KQs", "Q9s", "QTs", "QJs", "J9s", "JTs", "T9s", "99", "88", "77"]
                    }
                }
            }
        },
        "facing_4bet": {
            "name": "Facing a 4-bet",
            "ranges": {
                "hj_vs_lj_4bet": {
                    "name": "HJ / CO / SB / BTN vs LJ 4-bet",
                    "range": {
                        "raise": ["AA", "KK", "AKs", "AKo"],
                        "call": ["QQ", "JJ", "AQs", "KQs", "AJs"]
                    }
                },
                "bb_vs_lj_4bet": {
                    "name": "BB vs LJ 4-bet",
                    "range": {
                        "raise": ["AA", "KK", "AKs", "AKo"],
                        "call": ["QQ", "AQs"]
                    }
                },
                "co_vs_hj_4bet": {
                    "name": "CO vs HJ 4-bet",
                    "range": {
                        "raise": ["AA", "KK", "AKs", "AKo"],
                        "call": ["QQ", "JJ", "AQs", "KQs", "AJs", "KJs", "TT"]
                    }
                },
                "sb_vs_hj_4bet": {
                    "name": "SB / BTN vs HJ 4-bet",
                    "range": {
                        "raise": ["AA", "KK", "AKs", "AKo", "QQ"],
                        "call": ["JJ", "AQs", "KQs", "KJs", "AJs", "TT"]
                    }
                },
                "bb_vs_hj_4bet": {
                    "name": "BB vs HJ 4-bet",
                    "range": {
                        "raise": ["AA", "KK", "AKs", "AKo", "QQ"],
                        "call": ["JJ", "AQs"]
                    }
                },
                "btn_vs_co_4bet": {
                    "name": "BTN vs CO 4-bet",
                    "range": {
                        "raise": ["KK", "AKs", "AKo", "A5s", "QQ", "JJ"],
                        "call": ["AQs", "KQs", "AA", "ATs", "AJs", "KTs", "KJs", "TT"]
                    }
                },
                "sb_vs_co_4bet": {
                    "name": "SB vs CO 4-bet",
                    "range": {
                        "raise": ["AA", "KK", "AKs", "AKo", "QQ", "JJ", "TT", "A5s"],
                        "call": ["AQs", "KQs", "99", "AJs"]
                    }
                },
                "bb_vs_co_4bet": {
                    "name": "BB vs CO 4-bet",
                    "range": {
                        "raise": ["AA", "KK", "AKs", "AKo", "QQ", "JJ"],
                        "call": ["AQs"]
                    }
                },
                "sb_vs_btn_4bet": {
                    "name": "SB vs BTN 4-bet",
                    "range": {
                        "raise": ["AA", "KK", "AKs", "AKo", "A5s", "AQs", "AQo", "QQ", "JJ", "TT"],
                        "call": ["KQs", "ATs", "AJs", "99", "88"]
                    }
                },
                "bb_vs_btn_4bet": {
                    "name": "BB vs BTN 4-bet",
                    "range": {
                        "raise": ["AA", "KK", "AKs", "AKo", "AQs", "A5s", "A4s", "QQ", "JJ", "TT"],
                        "call": ["AJs", "KQs", "AQo", "99"]
                    }
                },
                "bb_vs_sb_4bet": {
                    "name": "BB vs SB 4-bet",
                    "range": {
                        "raise": ["KK", "AKs", "AKo", "A5s", "A4s", "QQ", "JJ", "AQo"],
                        "call": ["AQs", "KQs", "AA", "AJs", "ATs", "KTs", "KJs", "QJs"]
                    }
                }
            }
        },
        "facing_5bet_allin": {
            "name": "Facing an all-in 5-bet",
            "ranges": {
                "lj_vs_hj_5bet": {
                    "name": "LJ vs HJ 5-bet all-in / LJ vs CO 5-bet all-in / LJ vs SB 5-bet all-in / LJ vs BB 5-bet all-in / HJ vs BB 5-bet all-in / LJ vs BTN 5-bet all-in",
                    "range": {
                        "call": ["AA", "KK", "AKs", "AKo"]
                    }
                },
                "hj_vs_co_5bet": {
                    "name": "HJ vs CO 5-bet all-in / HJ vs SB 5-bet all-in / HJ vs BTN 5-bet all-in",
                    "range": {
                        "call": ["AA", "KK", "QQ", "AKs", "AKo"]
                    }
                },
                "co_vs_sb_5bet": {
                    "name": "CO vs SB 5-bet all-in",
                    "range": {
                        "call": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AKo"]
                    }
                },
                "co_vs_bb_5bet": {
                    "name": "CO vs BB 5-bet all-in / CO vs BTN 5-bet all-in / BTN vs BB 5-bet all-in",
                    "range": {
                        "call": ["AA", "KK", "QQ", "JJ", "AKs", "AKo"]
                    }
                },
                "btn_vs_sb_5bet": {
                    "name": "BTN vs SB 5-bet all-in",
                    "range": {
                        "call": ["AA", "KK", "QQ", "JJ", "AKs", "AQs", "AKo"]
                    }
                },
                "sb_vs_bb_5bet": {
                    "name": "SB vs BB 5-bet all-in",
                    "range": {
                        "call": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AKo"]
                    }
                }
            }
        }
    }
};
}

// LocalStorage functions
function loadSavedRanges() {
    // Force reinitialize to get all new categories
    localStorage.removeItem('pokerRanges');
    savedRanges = initializeDefaultRanges();
    saveSavedRanges();
}

// Load user settings
function loadUserSettings() {
    const savedDefaultView = localStorage.getItem('pokerDefaultView');
    if (savedDefaultView) {
        defaultView = savedDefaultView;
        currentView = defaultView;
    }
}

// Save user settings
function saveUserSettings() {
    localStorage.setItem('pokerDefaultView', defaultView);
}

// Update default view setting
function updateDefaultView(view) {
    defaultView = view;
    saveUserSettings();
}

function saveSavedRanges() {
    // Update current selections
    savedRanges.currentCategory = currentCategory;
    savedRanges.currentRange = currentRangeId;
    localStorage.setItem('pokerRanges', JSON.stringify(savedRanges));
}

// Range management functions
function getCurrentRange() {
    return savedRanges.categories?.[currentCategory]?.ranges?.[currentRangeId]?.range || {};
}

function updateCellDisplay(cell, hand) {
    // Clear all classes
    cell.className = 'hand-cell';
    
    if ((currentMode === 'study' || currentMode === 'ranges') && !editMode) {
        const action = getHandAction(getCurrentRange(), hand);
        cell.classList.add(action);
    } else if ((currentMode === 'study' || currentMode === 'ranges') && editMode) {
        const action = getHandAction(editingRange, hand);
        cell.classList.add(action);
    } else if (currentMode === 'test') {
        const userAction = userSelections[hand] || 'fold';
        if (userSelections[hand]) {
            cell.classList.add(`user-${userAction}`);
        } else {
            cell.classList.add('fold');
        }
    }
}

function handleEditClick(cell, hand) {
    const currentAction = getHandAction(editingRange, hand);
    
    // Toggle logic: if current action matches selected action, toggle to fold
    let newAction;
    if (currentAction === selectedAction) {
        newAction = 'fold';
    } else {
        newAction = selectedAction;
    }
    
    // Remove existing classes
    cell.classList.remove('raise', 'call', 'fold');
    
    // Add new action
    cell.classList.add(newAction);
    setHandAction(editingRange, hand, newAction);
}

function startEditMode() {
    editMode = true;
    const currentRange = getCurrentRange();
    editingRange = {};
    if (currentRange.raise) editingRange.raise = [...currentRange.raise];
    if (currentRange.call) editingRange.call = [...currentRange.call];
    
    // Switch to ranges mode if not already there
    if (currentMode !== 'ranges') {
        switchMode('ranges');
    }
    
    // Update UI - hide manage actions, show edit actions
    document.querySelector('.manage-actions').style.display = 'none';
    document.getElementById('editActions').style.display = 'block';
    document.getElementById('situationSelect').disabled = true;
    
    updateGridDisplay();
}

function saveRange() {
    if (currentRangeId && savedRanges.categories?.[currentCategory]?.ranges?.[currentRangeId]) {
        savedRanges.categories[currentCategory].ranges[currentRangeId].range = { ...editingRange };
        saveSavedRanges();
    }
    
    exitEditMode();
}

function cancelEdit() {
    exitEditMode();
}

function exitEditMode() {
    editMode = false;
    editingRange = {};
    
    // Update UI - show manage actions, hide edit actions
    document.querySelector('.manage-actions').style.display = 'flex';
    document.getElementById('editActions').style.display = 'none';
    document.getElementById('situationSelect').disabled = false;
    
    updateGridDisplay();
}

function createNewRange() {
    const name = prompt('Enter name for new range:');
    if (!name) return;
    
    const id = 'range_' + Date.now();
    if (!savedRanges.categories[currentCategory]) {
        savedRanges.categories[currentCategory] = { name: currentCategory, ranges: {} };
    }
    
    savedRanges.categories[currentCategory].ranges[id] = {
        name: name,
        range: {} // Empty range - all fold by default
    };
    
    saveSavedRanges();
    populateSituationSelector();
    switchToSituation(`${currentCategory}:${id}`);
    startEditMode();
}

function deleteCurrentRange() {
    if (currentRangeId === 'lj' && currentCategory === 'open_raises') {
        alert('Cannot delete the default LJ range.');
        return;
    }
    
    const rangeName = savedRanges.categories?.[currentCategory]?.ranges?.[currentRangeId]?.name;
    if (confirm(`Delete range "${rangeName}"?`)) {
        delete savedRanges.categories[currentCategory].ranges[currentRangeId];
        saveSavedRanges();
        
        // Switch to first available range in category
        const firstRangeId = Object.keys(savedRanges.categories[currentCategory].ranges)[0];
        if (firstRangeId) {
            currentRangeId = firstRangeId;
        } else {
            // Switch to LJ range if no ranges left
            currentCategory = 'open_raises';
            currentRangeId = 'lj';
        }
        
        populateSituationSelector();
        updateGridDisplay();
        updateRangeTitle();
    }
}

// Range deduplication tools
function normalizeRangeForComparison(rangeObj) {
    // Create a normalized string representation of a range for comparison
    const normalized = {};
    for (const [action, hands] of Object.entries(rangeObj)) {
        if (Array.isArray(hands)) {
            normalized[action] = [...hands].sort();
        }
    }
    return JSON.stringify(normalized);
}

function findDuplicateRangesInCategory(categoryId) {
    const category = savedRanges.categories[categoryId];
    if (!category || !category.ranges) {
        return [];
    }
    
    const rangeGroups = {};
    const rangeDetails = [];
    
    // Group ranges by their normalized representation
    Object.entries(category.ranges).forEach(([rangeId, rangeData]) => {
        const normalizedRange = normalizeRangeForComparison(rangeData.range);
        
        if (!rangeGroups[normalizedRange]) {
            rangeGroups[normalizedRange] = [];
        }
        
        const rangeInfo = {
            rangeId,
            name: rangeData.name,
            range: rangeData.range,
            normalizedRange
        };
        
        rangeGroups[normalizedRange].push(rangeInfo);
        rangeDetails.push(rangeInfo);
    });
    
    // Return only groups with more than one range (duplicates)
    return Object.values(rangeGroups).filter(group => group.length > 1);
}

function consolidateDuplicateRangesInCategory(categoryId) {
    const duplicateGroups = findDuplicateRangesInCategory(categoryId);
    
    if (duplicateGroups.length === 0) {
        console.log(`No duplicate ranges found in category: ${categoryId}`);
        return 0;
    }
    
    let totalConsolidated = 0;
    
    duplicateGroups.forEach((group, groupIndex) => {
        console.log(`\nConsolidating Group ${groupIndex + 1} in ${categoryId}:`);
        
        // Sort by name length to keep the shortest as the base
        group.sort((a, b) => a.name.length - b.name.length);
        
        const keeper = group[0];
        const duplicates = group.slice(1);
        
        // Create concatenated name
        const allNames = group.map(r => r.name);
        const concatenatedName = allNames.join(' / ');
        
        console.log(`Original names: ${allNames.join(', ')}`);
        console.log(`New consolidated name: ${concatenatedName}`);
        
        // Update the keeper with the concatenated name
        savedRanges.categories[categoryId].ranges[keeper.rangeId].name = concatenatedName;
        
        // Remove duplicates
        duplicates.forEach(duplicate => {
            console.log(`Removing duplicate: ${duplicate.name} (${duplicate.rangeId})`);
            delete savedRanges.categories[categoryId].ranges[duplicate.rangeId];
            totalConsolidated++;
        });
    });
    
    return totalConsolidated;
}

function deduplicateAllCategories() {
    console.log('=== RANGE DEDUPLICATION TOOL ===\n');
    
    let totalRangesRemoved = 0;
    const consolidationReport = [];
    
    Object.keys(savedRanges.categories).forEach(categoryId => {
        const categoryName = savedRanges.categories[categoryId].name;
        console.log(`\nAnalyzing category: ${categoryName} (${categoryId})`);
        
        const duplicateGroups = findDuplicateRangesInCategory(categoryId);
        
        if (duplicateGroups.length > 0) {
            console.log(`Found ${duplicateGroups.length} groups of duplicates`);
            
            const removed = consolidateDuplicateRangesInCategory(categoryId);
            totalRangesRemoved += removed;
            
            consolidationReport.push({
                categoryId,
                categoryName,
                duplicateGroups: duplicateGroups.length,
                rangesRemoved: removed
            });
        } else {
            console.log('No duplicates found');
        }
    });
    
    // Save the consolidated ranges
    if (totalRangesRemoved > 0) {
        saveSavedRanges();
        populateSituationSelector();
        updateGridDisplay();
        
        console.log('\n=== CONSOLIDATION SUMMARY ===');
        console.log(`Total ranges removed: ${totalRangesRemoved}`);
        
        consolidationReport.forEach(report => {
            console.log(`${report.categoryName}: ${report.duplicateGroups} groups, ${report.rangesRemoved} ranges removed`);
        });
        
        alert(`Deduplication complete!\nRemoved ${totalRangesRemoved} duplicate ranges.\nCheck console for details.`);
    } else {
        console.log('\nNo duplicate ranges found across all categories.');
        alert('No duplicate ranges found to consolidate.');
    }
    
    return consolidationReport;
}

function analyzeRangeDuplicates() {
    console.log('=== RANGE DUPLICATE ANALYSIS ===\n');
    
    let totalDuplicates = 0;
    
    Object.keys(savedRanges.categories).forEach(categoryId => {
        const categoryName = savedRanges.categories[categoryId].name;
        console.log(`\nCategory: ${categoryName} (${categoryId})`);
        
        const duplicateGroups = findDuplicateRangesInCategory(categoryId);
        
        if (duplicateGroups.length > 0) {
            duplicateGroups.forEach((group, index) => {
                console.log(`\n  Duplicate Group ${index + 1}:`);
                group.forEach(range => {
                    console.log(`    - ${range.name} (${range.rangeId})`);
                });
                console.log(`    Range: ${JSON.stringify(group[0].range)}`);
                totalDuplicates += group.length - 1; // -1 because we keep one
            });
        } else {
            console.log('  No duplicates found');
        }
    });
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Total duplicate ranges that could be removed: ${totalDuplicates}`);
    
    return totalDuplicates;
}

function populateSituationSelector() {
    const select = document.getElementById('situationSelect');
    select.innerHTML = '';
    
    Object.entries(savedRanges.categories || {}).forEach(([categoryId, category]) => {
        // Add category option (for testing entire category)
        const categoryOption = document.createElement('option');
        categoryOption.value = `category:${categoryId}`;
        categoryOption.textContent = category.name;
        categoryOption.style.fontWeight = 'bold';
        categoryOption.style.backgroundColor = '#2a2a2a';
        select.appendChild(categoryOption);
        
        // Add individual situations in this category
        Object.entries(category.ranges || {}).forEach(([rangeId, range]) => {
            const option = document.createElement('option');
            option.value = `${categoryId}:${rangeId}`;
            option.textContent = `  ${range.name}`; // Indent to show hierarchy
            select.appendChild(option);
        });
    });
    
    // Set current selection
    if (categoryTestMode) {
        select.value = `category:${categoryTestData.category}`;
    } else {
        select.value = `${currentCategory}:${currentRangeId}`;
    }
}

function updateRangeTitle() {
    // Title functionality moved to header selectors - this function is now a no-op
    // The situation information is displayed through the situation selector dropdown
}

function updateTestProgress() {
    // This function can be used to update any additional progress indicators
    // For now, the progress is shown in the title
}

function hideTestProgress() {
    // Hide any additional progress indicators when exiting category test
}

function switchToSituation(situationValue) {
    if (situationValue.startsWith('category:')) {
        // Starting category test
        const categoryId = situationValue.substring(9); // Remove 'category:' prefix
        startCategoryTest(categoryId);
    } else {
        // Regular situation selection
        exitCategoryTest(); // Exit category test if active
        const [categoryId, rangeId] = situationValue.split(':');
        currentCategory = categoryId;
        currentRangeId = rangeId;
        
        updateGridDisplay();
        updateRangeTitle();
        saveSavedRanges(); // Save current selection
    }
}

function startCategoryTest(categoryId) {
    const category = savedRanges.categories[categoryId];
    if (!category) return;
    
    categoryTestMode = true;
    categoryTestData = {
        category: categoryId,
        situations: Object.keys(category.ranges),
        currentIndex: 0,
        results: []
    };
    
    // Start with first situation in category
    const firstSituation = categoryTestData.situations[0];
    currentCategory = categoryId;
    currentRangeId = firstSituation;
    
    // Clear any previous selections
    clearSelections();
    
    updateGridDisplay();
    updateRangeTitle();
    updateTestProgress();
}

function exitCategoryTest() {
    if (categoryTestMode) {
        categoryTestMode = false;
        categoryTestData = {
            category: '',
            situations: [],
            currentIndex: 0,
            results: []
        };
        updateRangeTitle();
        hideTestProgress();
    }
}

// Hand practice functions
function generateRandomHand() {
    const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    
    // Generate two random cards
    const suits = ['s', 'h', 'd', 'c'];
    const card1Rank = ranks[Math.floor(Math.random() * ranks.length)];
    const card1Suit = suits[Math.floor(Math.random() * suits.length)];
    
    let card2Rank, card2Suit;
    do {
        card2Rank = ranks[Math.floor(Math.random() * ranks.length)];
        card2Suit = suits[Math.floor(Math.random() * suits.length)];
    } while (card1Rank === card2Rank && card1Suit === card2Suit); // Ensure no duplicate cards
    
    // Convert to poker hand notation
    const isSuited = card1Suit === card2Suit;
    const rankIndex1 = ranks.indexOf(card1Rank);
    const rankIndex2 = ranks.indexOf(card2Rank);
    
    let handNotation;
    if (card1Rank === card2Rank) {
        // Pocket pair
        handNotation = card1Rank + card2Rank;
    } else if (rankIndex1 < rankIndex2) {
        // First card is higher rank
        handNotation = card1Rank + card2Rank + (isSuited ? 's' : 'o');
    } else {
        // Second card is higher rank
        handNotation = card2Rank + card1Rank + (isSuited ? 's' : 'o');
    }
    
    return {
        card1: card1Rank + card1Suit,
        card2: card2Rank + card2Suit,
        handNotation: handNotation
    };
}

function exitHandPractice() {
    handPracticeMode = false;
    currentPracticeHand = null;
    
    // Reset display - only show practice start for multi-range practice
    document.getElementById('practiceStart').style.display = 'block';
}

// Multi-range practice functions
function startMultiRangePractice() {
    multiRangePracticeMode = true;
    handPracticeMode = false;
    
    // Reset state
    multiRangeAnswers = {};
    multiRangeResults = {};
    
    // Generate new hand
    currentPracticeHand = generateRandomHand();
    
    // Show multi-range interface
    document.getElementById('practiceStart').style.display = 'none';
    document.getElementById('multiRangePractice').style.display = 'block';
    
    generateMultiRangeQuestion();
}

function generateMultiRangeQuestion() {
    if (!currentPracticeHand) {
        currentPracticeHand = generateRandomHand();
    }
    
    // Clear previous answers and results
    multiRangeAnswers = {};
    multiRangeResults = {};
    
    // Update hand display with proper card elements
    const handDisplay = document.getElementById('currentHandDisplay');
    handDisplay.innerHTML = ''; // Clear existing content
    
    // Create and add card elements
    const card1El = createCardElement(currentPracticeHand.card1, 'card-1');
    const card2El = createCardElement(currentPracticeHand.card2, 'card-2');
    
    handDisplay.appendChild(card1El);
    handDisplay.appendChild(card2El);
    
    // Generate ranges list
    const rangesContainer = document.getElementById('rangesList');
    rangesContainer.innerHTML = '';
    
    const categoryData = savedRanges.categories?.[currentPracticeCategory];
    if (!categoryData) return;
    
    // Create range rows
    Object.entries(categoryData.ranges).forEach(([rangeId, rangeData]) => {
        const rangeRow = createRangeRow(rangeId, rangeData.name);
        rangesContainer.appendChild(rangeRow);
    });
    
    // Hide results, show check button
    document.getElementById('checkMultiRangeBtn').style.display = 'block';
    document.getElementById('nextMultiHandBtn').style.display = 'none';
}

function createRangeRow(rangeId, rangeName) {
    const row = document.createElement('div');
    row.className = 'range-row';
    row.dataset.rangeId = rangeId;
    
    row.innerHTML = `
        <div class="range-name">${rangeName}</div>
        <div class="action-buttons">
            <button class="multi-action-btn" data-action="raise">Raise</button>
            <button class="multi-action-btn" data-action="call">Call</button>
            <button class="multi-action-btn" data-action="fold">Fold</button>
        </div>
        <div class="range-result" style="display: none;"></div>
    `;
    
    // Add click handlers to buttons
    row.querySelectorAll('.multi-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            selectMultiRangeAction(rangeId, action, row);
        });
    });
    
    return row;
}

function selectMultiRangeAction(rangeId, action, row) {
    // Store the answer
    multiRangeAnswers[rangeId] = action;
    
    // Update button states in this row
    row.querySelectorAll('.multi-action-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    row.querySelector(`[data-action="${action}"]`).classList.add('selected');
}

function submitMultiRangeAnswers() {
    const categoryData = savedRanges.categories?.[currentPracticeCategory];
    if (!categoryData) {
        console.error('Category data not found for:', currentPracticeCategory);
        return;
    }
    
    // Validate that all ranges have been answered
    const rangeIds = Object.keys(categoryData.ranges);
    const unansweredRanges = rangeIds.filter(rangeId => !multiRangeAnswers[rangeId]);
    
    if (unansweredRanges.length > 0) {
        // Highlight unanswered ranges
        unansweredRanges.forEach(rangeId => {
            const row = document.querySelector(`[data-range-id="${rangeId}"]`);
            if (row) {
                row.classList.add('unanswered');
                setTimeout(() => row.classList.remove('unanswered'), 2000);
            }
        });
        
        // Show error message
        showTemporaryMessage('Please answer all ranges before checking results.', 'error');
        return;
    }
    
    let totalQuestions = 0;
    let correctAnswers = 0;
    
    // Check each range
    Object.entries(categoryData.ranges).forEach(([rangeId, rangeData]) => {
        totalQuestions++;
        const userAction = multiRangeAnswers[rangeId];
        const correctAction = getCorrectActionForHand(rangeData.range, currentPracticeHand.handNotation);
        
        const isCorrect = userAction === correctAction;
        if (isCorrect) correctAnswers++;
        
        multiRangeResults[rangeId] = {
            correct: isCorrect,
            correctAction: correctAction,
            userAction: userAction
        };
    });
    
    // Update overall stats
    practiceStats.total += totalQuestions;
    practiceStats.correct += correctAnswers;
    
    if (correctAnswers === totalQuestions) {
        practiceStats.streak++;
    } else {
        practiceStats.streak = 0;
    }
    
    displayMultiRangeResults();
}

function getCorrectActionForHand(rangeData, hand) {
    if (rangeData.raise && rangeData.raise.includes(hand)) {
        return 'raise';
    }
    if (rangeData.call && rangeData.call.includes(hand)) {
        return 'call';
    }
    return 'fold';
}

function displayMultiRangeResults() {
    // Show results for each range
    document.querySelectorAll('.range-row').forEach(row => {
        const rangeId = row.dataset.rangeId;
        const result = multiRangeResults[rangeId];
        
        if (result) {
            const resultDiv = row.querySelector('.range-result');
            const statusIcon = result.correct ? '✓' : '✗';
            const statusClass = result.correct ? 'correct' : 'incorrect';
            
            let resultText = `${statusIcon} ${result.correct ? 'Correct' : 'Should be ' + result.correctAction}`;
            
            resultDiv.innerHTML = `<span class="${statusClass}">${resultText}</span>`;
            resultDiv.style.display = 'block';
        }
    });
    
    // Hide check button, show next button
    document.getElementById('checkMultiRangeBtn').style.display = 'none';
    document.getElementById('nextMultiHandBtn').style.display = 'block';
    
    // Show overall stats
    updateMultiRangeStats();
}

function updateMultiRangeStats() {
    const accuracy = practiceStats.total > 0 ? ((practiceStats.correct / practiceStats.total) * 100).toFixed(1) : 0;
    const statsDiv = document.getElementById('multiRangeStats');
    
    if (statsDiv) {
        statsDiv.textContent = `Accuracy: ${accuracy}% | Streak: ${practiceStats.streak} | Total: ${practiceStats.total}`;
    }
}

function nextMultiRangeHand() {
    // Generate new hand
    currentPracticeHand = generateRandomHand();
    generateMultiRangeQuestion();
}

function exitMultiRangePractice() {
    multiRangePracticeMode = false;
    multiRangeAnswers = {};
    multiRangeResults = {};
    
    // Reset display
    document.getElementById('practiceStart').style.display = 'block';
    document.getElementById('multiRangePractice').style.display = 'none';
}

// Helper function to format cards with proper suit symbols and colors
function formatCard(cardString) {
    if (!cardString || cardString.length < 2) return { rank: '?', suit: '?', color: 'black' };
    
    const rank = cardString[0];
    const suitLetter = cardString[1];
    
    const suitMap = {
        's': { symbol: '♠', color: 'black' },   // spades
        'h': { symbol: '♥', color: 'red' },     // hearts  
        'd': { symbol: '♦', color: 'red' },     // diamonds
        'c': { symbol: '♣', color: 'black' }    // clubs
    };
    
    const suit = suitMap[suitLetter] || { symbol: '?', color: 'black' };
    
    return {
        rank: rank,
        suit: suit.symbol,
        color: suit.color
    };
}

// Create individual card element
function createCardElement(cardString, className = '') {
    const cardData = formatCard(cardString);
    
    const cardEl = document.createElement('div');
    cardEl.className = `poker-card ${cardData.color} ${className}`;
    
    cardEl.innerHTML = `
        <div class="card-rank">${cardData.rank}</div>
        <div class="card-suit">${cardData.suit}</div>
    `;
    
    return cardEl;
}

// Utility function to show temporary messages
function showTemporaryMessage(message, type = 'info', duration = 3000) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.temporary-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `temporary-message ${type}`;
    messageEl.textContent = message;
    
    // Insert at top of practice content
    const practiceContent = document.querySelector('.hand-practice-content');
    if (practiceContent) {
        practiceContent.insertBefore(messageEl, practiceContent.firstChild);
    }
    
    // Auto-remove after duration
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, duration);
}

// Add keyboard shortcuts
function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (!multiRangePracticeMode) return;
        
        // Enter to submit answers
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const checkBtn = document.getElementById('checkMultiRangeBtn');
            if (checkBtn && checkBtn.style.display !== 'none') {
                submitMultiRangeAnswers();
            } else {
                const nextBtn = document.getElementById('nextMultiHandBtn');
                if (nextBtn && nextBtn.style.display !== 'none') {
                    nextMultiRangeHand();
                }
            }
        }
        
        // Space bar for next hand (when results are shown)
        if (e.key === ' ') {
            e.preventDefault();
            const nextBtn = document.getElementById('nextMultiHandBtn');
            if (nextBtn && nextBtn.style.display !== 'none') {
                nextMultiRangeHand();
            }
        }
    });
}

// Initialize the application
function init() {
    // Load saved ranges from localStorage
    loadSavedRanges();
    
    // Load user settings
    loadUserSettings();
    
    // Set current category and range from saved data
    currentCategory = savedRanges.currentCategory || 'open_raises';
    currentRangeId = savedRanges.currentRange || 'lj';
    
    // Create the grid
    createRangeGrid();
    
    // Populate situation selector
    populateSituationSelector();
    
    // Update title
    updateRangeTitle();
    
    // Mode switching
    document.getElementById('studyMode').addEventListener('click', () => switchMode('study'));
    document.getElementById('testMode').addEventListener('click', () => switchMode('test'));
    document.getElementById('handpracticeMode').addEventListener('click', () => switchMode('handpractice'));
    document.getElementById('rangesMode').addEventListener('click', () => switchMode('ranges'));
    document.getElementById('settingsMode').addEventListener('click', () => switchMode('settings'));
    
    // View switching - only available in settings mode
    document.getElementById('gridViewBtn').addEventListener('click', () => switchView('grid'));
    document.getElementById('patternViewBtn').addEventListener('click', () => switchView('pattern'));
    
    // Settings controls
    document.getElementById('defaultViewSelect').addEventListener('change', (e) => {
        updateDefaultView(e.target.value);
    });
    
    // Mobile menu functionality
    setupMobileMenu();
    
    // Action selection
    document.getElementById('raiseAction').addEventListener('click', () => selectAction('raise'));
    document.getElementById('callAction').addEventListener('click', () => selectAction('call'));
    
    // Test mode controls
    document.getElementById('clearBtn').addEventListener('click', clearSelections);
    document.getElementById('checkBtn').addEventListener('click', checkResults);
    
    // Range management controls
    document.getElementById('situationSelect').addEventListener('change', (e) => {
        switchToSituation(e.target.value);
    });
    document.getElementById('newRangeBtn').addEventListener('click', createNewRange);
    document.getElementById('editRangeBtn').addEventListener('click', startEditMode);
    document.getElementById('saveRangeBtn').addEventListener('click', saveRange);
    document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);
    document.getElementById('deleteRangeBtn').addEventListener('click', deleteCurrentRange);
    
    // Range deduplication buttons
    document.getElementById('analyzeRangesBtn').addEventListener('click', analyzeRangeDuplicates);
    document.getElementById('deduplicateRangesBtn').addEventListener('click', deduplicateAllCategories);
    
    // Hand practice event listeners
    document.getElementById('startPracticeBtn').addEventListener('click', () => {
        // Check which mode to use based on category selection
        startMultiRangePractice();
    });

    
    // Multi-range practice event listeners
    document.getElementById('headerPracticeCategorySelect').addEventListener('change', (e) => {
        currentPracticeCategory = e.target.value;
    });
    document.getElementById('checkMultiRangeBtn').addEventListener('click', submitMultiRangeAnswers);
    document.getElementById('nextMultiHandBtn').addEventListener('click', nextMultiRangeHand);
    
    // Global mouse event handlers for drag functionality
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            dragStarted = false;
            // Remove dragging class from all cells
            document.querySelectorAll('.hand-cell').forEach(cell => {
                cell.classList.remove('dragging');
            });
        }
    });
    
    document.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            dragStarted = false;
            // Remove dragging class from all cells
            document.querySelectorAll('.hand-cell').forEach(cell => {
                cell.classList.remove('dragging');
            });
        }
    });
    
    // Set default view selector to current default
    document.getElementById('defaultViewSelect').value = defaultView;
    
    // Set initial view button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(currentView + 'ViewBtn').classList.add('active');
    
    // Initialize keyboard shortcuts
    addKeyboardShortcuts();
    
    // Start in study mode
    switchMode('study');
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const leftNav = document.getElementById('leftNav');
    const navOverlay = document.getElementById('navOverlay');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        const isOpen = leftNav.classList.contains('mobile-open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    // Open mobile menu
    function openMobileMenu() {
        leftNav.classList.add('mobile-open');
        navOverlay.classList.add('active');
        mobileMenuToggle.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        leftNav.classList.remove('mobile-open');
        navOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Event listeners
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    navOverlay.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking nav items (better UX)
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Only close on mobile screens
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
    
    // Close menu on window resize if screen gets larger
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
    
    // Handle escape key to close menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && leftNav.classList.contains('mobile-open')) {
            closeMobileMenu();
        }
    });
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);