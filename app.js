// Define the resource structure based on Goblinstadt rules
const resourceTypes = {
    schlitzohr: ['Enterhaken','Seil','Handschuhe','Dietrich','Truhe','Messer','Schloss','Umhang'],
    gelehrter: ['Tinte','Verzauberung','Zauberhut','Feder','Bücher','Zauberstab','Pergament','Amulet'],
    wundpfleger: ['Schere','Bandage','Zutaten','Nadel','Tränke','Wundhaken','Skalpell','Mörser'],
    knappe: ['Axt','Helm','Rüstung','Schleifstein','Kettenringe','Schwert','Schild','Trophäen']
};

// Define category display names (geändert zu einfacheren Namen)
const categoryNames = {
    schlitzohr: 'Schlitzohr',
    gelehrter: 'Magier',
    wundpfleger: 'Heiler',
    knappe: 'Krieger'
};

// Icon-Mapping für alle 32 Ressourcen
const resourceIcons = {
    schlitzohr: {
        'Enterhaken': 'ra ra-grappling-hook',
        'Seil': 'fas fa-link',
        'Handschuhe': 'fas fa-mitten',
        'Dietrich': 'fas fa-key',
        'Truhe': 'fas fa-box',
        'Messer': 'ra ra-plain-dagger',
        'Schloss': 'fas fa-lock',
        'Umhang': 'fas fa-user-secret'
    },
    gelehrter: {
        'Tinte': 'fas fa-flask',
        'Verzauberung': 'ra ra-lightning-bolt',
        'Zauberhut': 'fas fa-hat-wizard',
        'Feder': 'fas fa-feather',
        'Bücher': 'fas fa-book',
        'Zauberstab': 'ra ra-crystal-wand',
        'Pergament': 'fas fa-scroll',
        'Amulet': 'ra ra-gem-pendant'
    },
    wundpfleger: {
        'Schere': 'fas fa-scissors',
        'Bandage': 'fas fa-bandage',
        'Zutaten': 'ra ra-leaf',
        'Nadel': 'fas fa-syringe',
        'Tränke': 'ra ra-potion',
        'Wundhaken': 'fas fa-hand-holding-medical',
        'Skalpell': 'fas fa-cut',
        'Mörser': 'material-icons:science'
    },
    knappe: {
        'Axt': 'ra ra-axe',
        'Helm': 'ra ra-helmet',
        'Rüstung': 'ra ra-vest',
        'Schleifstein': 'material-icons:build',
        'Kettenringe': 'material-icons:link',
        'Schwert': 'ra ra-sword',
        'Schild': 'ra ra-shield',
        'Trophäen': 'fas fa-trophy'
    }
};

// Character Class Embleme für Tabs
const classEmblems = {
    schlitzohr: 'ra ra-hood',
    gelehrter: 'ra ra-book',
    wundpfleger: 'ra ra-potion',
    knappe: 'ra ra-crossed-swords'
};

// Hilfsfunktion zum Abrufen des Icons für eine Ressource
function getResourceIcon(category, resource) {
    return resourceIcons[category]?.[resource] || 'fas fa-cube';
}

// Hilfsfunktion zum Abrufen der Klassenfarbe als CSS-Variable
function getClassColor(category) {
    const colorMap = {
        schlitzohr: 'var(--rogue-primary)',
        gelehrter: 'var(--mage-primary)',
        wundpfleger: 'var(--healer-primary)',
        knappe: 'var(--warrior-primary)'
    };
    return colorMap[category] || 'var(--text-primary)';
}

// State variables - Reihenfolge korrigiert
let activeCategory = 'schlitzohr'; // Default active tab MUSS vor loadState() deklariert werden
let state = loadState() || initializeState();
let currentEditResource = null;

// Function to initialize state
function initializeState() {
    const initialState = {};

    Object.keys(resourceTypes).forEach(category => {
        initialState[category] = {};
        resourceTypes[category].forEach(resource => {
            initialState[category][resource] = 0;
        });
    });

    return initialState;
}

// Function to save state to localStorage
function saveState() {
    localStorage.setItem('goblinstadt-resources', JSON.stringify(state));
    // Also save active tab
    localStorage.setItem('goblinstadt-active-tab', activeCategory);
}

// Function to load state from localStorage
function loadState() {
    const savedState = localStorage.getItem('goblinstadt-resources');

    // Load active tab
    const savedTab = localStorage.getItem('goblinstadt-active-tab');
    if (savedTab) {
        activeCategory = savedTab;
    }

    return savedState ? JSON.parse(savedState) : null;
}

// Animation-Hilfsfunktion: Fügt eine CSS-Animation-Klasse hinzu und entfernt sie nach Ablauf
function animateElement(element, animationClass, duration = 400) {
    if (!element) return;
    element.classList.add(animationClass);
    setTimeout(() => {
        element.classList.remove(animationClass);
    }, duration);
}

// Sparkle-Effekt erstellen (magische Partikel bei Ressourcen-Erhöhung)
function createSparkle(x, y, color) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.color = color;
    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 800);
}

// Function to update a resource count (mit selektiven DOM-Updates)
function updateResource(category, resource, action, value) {
    const previousCount = state[category][resource];

    if (action === 'add') {
        state[category][resource] += value;
    } else if (action === 'subtract') {
        state[category][resource] = Math.max(0, state[category][resource] - value);
    } else if (action === 'set') {
        state[category][resource] = Math.max(0, value);
    }

    const newCount = state[category][resource];

    saveState();

    // Use selective update instead of full renderUI() for instant feedback
    updateResourceDisplay(category, resource);

    // Erstelle Sparkle-Effekte bei Erhöhung
    if (newCount > previousCount) {
        const countElement = document.querySelector(
            `.resource-card[data-resource="${resource}"] .resource-count`
        );
        if (countElement) {
            const rect = countElement.getBoundingClientRect();
            const color = getClassColor(category);
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    createSparkle(
                        rect.left + Math.random() * rect.width,
                        rect.top + Math.random() * rect.height,
                        color
                    );
                }, i * 100);
            }
        }
    }
}

// Function to determine remainder class
function getRemainderClass(remainder) {
    if (remainder <= 4) {
        return 'remainder-0-4';
    } else if (remainder <= 7) {
        return 'remainder-5-7';
    } else {
        return 'remainder-8-9';
    }
}

// Function to show edit modal (mit Klassen-Theming)
function showEditModal(category, resource) {
    currentEditResource = { category, resource };
    const modal = document.getElementById('edit-modal');
    const modalContent = modal.querySelector('.modal-content');
    const resourceNameElement = document.getElementById('edit-resource-name');
    const resourceValueInput = document.getElementById('edit-resource-value');

    // Setze die Klassenfarbe für dynamisches Theming
    const classColor = getClassColor(category);
    modalContent.style.setProperty('--class-primary', classColor);
    modalContent.style.borderColor = classColor;
    resourceNameElement.style.color = classColor;
    resourceNameElement.style.textShadow = `0 0 8px ${classColor}`;

    resourceNameElement.textContent = resource;
    resourceValueInput.value = state[category][resource];

    modal.classList.remove('hidden');
    resourceValueInput.focus();
    resourceValueInput.select();
}

// Function to hide edit modal
function hideEditModal() {
    const modal = document.getElementById('edit-modal');
    modal.classList.add('hidden');
    currentEditResource = null;
}

// Function to save edited value
function saveEditedValue() {
    if (!currentEditResource) return;

    const { category, resource } = currentEditResource;
    const resourceValueInput = document.getElementById('edit-resource-value');
    const newValue = parseInt(resourceValueInput.value) || 0;

    updateResource(category, resource, 'set', newValue);
    hideEditModal();
}

// Function to create a resource card (mit Icons und Ornate Border)
function createResourceCard(category, resource) {
    const count = state[category][resource];
    const stacks = Math.floor(count / 10);
    const remainder = count % 10;

    // Create card element mit data-attributes
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.setAttribute('data-category', category);
    card.setAttribute('data-resource', resource);

    // Ornate Border Element für RPG-Effekt
    const ornateBorder = document.createElement('div');
    ornateBorder.className = 'card-ornate-border';
    card.appendChild(ornateBorder);

    // Create header with icon, resource name and count
    const header = document.createElement('div');
    header.className = 'card-header';

    // Icon Container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'resource-icon';
    const iconClass = getResourceIcon(category, resource);

    // Handle material icons format (library:iconname)
    if (iconClass.startsWith('material-icons:')) {
        const iconName = iconClass.split(':')[1];
        iconContainer.innerHTML = `<span class="material-icons">${iconName}</span>`;
    } else {
        iconContainer.innerHTML = `<i class="${iconClass}"></i>`;
    }

    const resourceName = document.createElement('span');
    resourceName.className = 'resource-name';
    resourceName.textContent = resource;

    const resourceCount = document.createElement('span');
    resourceCount.className = 'resource-count';
    resourceCount.textContent = count;

    header.appendChild(iconContainer);
    header.appendChild(resourceName);
    header.appendChild(resourceCount);

    // Create stacks display
    const stacksDisplay = document.createElement('div');
    stacksDisplay.className = 'stacks-display';

    // Add completed stacks
    for (let i = 0; i < stacks; i++) {
        const stack = document.createElement('div');
        stack.className = 'stack';
        stacksDisplay.appendChild(stack);
    }

    // Add remainder
    const remainderElement = document.createElement('div');
    remainderElement.className = `remainder ${getRemainderClass(remainder)}`;
    remainderElement.textContent = remainder;
    stacksDisplay.appendChild(remainderElement);

    // Create controls with optimized button layout
    const controls = document.createElement('div');
    controls.className = 'controls';

    // Helper to create buttons
    function createButton(action, value, label, className) {
        const button = document.createElement('button');
        button.className = `btn ${className}`;
        button.textContent = label;
        button.addEventListener('click', () => {
            updateResource(category, resource, action, value);
        });
        return button;
    }

    // First row of buttons (increment)
    const incrementRow = document.createElement('div');
    incrementRow.className = 'buttons-row';

    incrementRow.appendChild(createButton('add', 1, '+1', 'btn-inc'));
    incrementRow.appendChild(createButton('add', 5, '+5', 'btn-inc'));
    incrementRow.appendChild(createButton('add', 10, '+10', 'btn-inc'));

    // Second row of buttons (decrement and edit)
    const decrementRow = document.createElement('div');
    decrementRow.className = 'buttons-row';

    decrementRow.appendChild(createButton('subtract', 1, '-1', 'btn-dec'));
    decrementRow.appendChild(createButton('subtract', 5, '-5', 'btn-dec'));
    decrementRow.appendChild(createButton('subtract', 10, '-10', 'btn-dec'));

    // Create the edit button
    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        showEditModal(category, resource);
    });

    // Assemble controls
    controls.appendChild(incrementRow);
    controls.appendChild(decrementRow);
    controls.appendChild(editButton);

    // Assemble card
    card.appendChild(header);
    card.appendChild(stacksDisplay);
    card.appendChild(controls);

    return card;
}

// Hilfsfunktion zum Berechnen der Summe aller Ressourcen einer Kategorie
function getCategoryTotal(category) {
    let total = 0;
    Object.keys(state[category]).forEach(resource => {
        total += state[category][resource];
    });
    return total;
}

// Aktualisierte renderUI Funktion mit Emblems und Animationen
function renderUI() {
    const container = document.getElementById('resources-container');
    container.innerHTML = ''; // Clear existing content

    // Berechne die Summen für jede Kategorie
    const categoryTotals = {};
    Object.keys(resourceTypes).forEach(category => {
        categoryTotals[category] = getCategoryTotal(category);
    });

    // Update tabs mit Emblems und Totals
    document.querySelectorAll('.tab-button').forEach(tab => {
        const category = tab.dataset.category;
        const categoryTotal = categoryTotals[category];
        const emblem = classEmblems[category];

        // Tab-Inhalt mit Emblem und Text strukturieren
        tab.innerHTML = `
            <div class="tab-emblem">
                <i class="${emblem}"></i>
            </div>
            <span class="tab-text">${categoryNames[category]} (${categoryTotal})</span>
        `;

        if (category === activeCategory) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Only show resources for the active category
    resourceTypes[activeCategory].forEach(resource => {
        const card = createResourceCard(activeCategory, resource);
        container.appendChild(card);
    });
}

// Selective update function - updates only one resource without full re-render
// This provides instant feedback for +/- actions without disruptive animations
// Created as part of bugfix: 2025-10-12-critical-bugfixes-icons-and-rerender
function updateResourceDisplay(category, resource) {
    const count = state[category][resource];
    const card = document.querySelector(`.resource-card[data-resource="${resource}"]`);

    if (!card) return; // Card not in current view

    // Update count display
    const countElement = card.querySelector('.resource-count');
    if (countElement) {
        countElement.textContent = count;
    }

    // Update stacks display (rebuild this section only)
    const stacksDisplay = card.querySelector('.stacks-display');
    if (stacksDisplay) {
        const stacks = Math.floor(count / 10);
        const remainder = count % 10;

        stacksDisplay.innerHTML = '';

        // Add completed stacks (each stack = 10 items)
        for (let i = 0; i < stacks; i++) {
            const stack = document.createElement('div');
            stack.className = 'stack';
            stacksDisplay.appendChild(stack);
        }

        // Add remainder badge with color coding
        const remainderElement = document.createElement('div');
        remainderElement.className = `remainder ${getRemainderClass(remainder)}`;
        remainderElement.textContent = remainder;
        stacksDisplay.appendChild(remainderElement);
    }

    // Update tab total for this category
    const categoryTotal = getCategoryTotal(category);
    const tabButton = document.querySelector(`.tab-button[data-category="${category}"]`);
    if (tabButton) {
        const tabText = tabButton.querySelector('.tab-text');
        if (tabText) {
            tabText.textContent = `${categoryNames[category]} (${categoryTotal})`;
        }
    }
}

// Function to handle tab switching
function switchTab(category) {
    activeCategory = category;
    saveState(); // Save active tab
    renderUI();
}

// Updated CSV Export Function - matches Excel format
function exportCSV() {
    // Create CSV content in the same format as the Excel file
    // Format ist: Schlitzohr,count,Magier,count,Krieger,count,Heiler,count
    let csvContent = "";

    // Header row with category names
    csvContent += "Schlitzohr,,Magier,,Krieger,,Heiler\n";

    // Get maximum number of resources in any category to determine row count
    const maxResourceCount = Math.max(
        resourceTypes.schlitzohr.length,
        resourceTypes.gelehrter.length,
        resourceTypes.knappe.length,
        resourceTypes.wundpfleger.length
    );

    // Create rows with resources and counts
    for (let i = 0; i < maxResourceCount; i++) {
        let row = "";

        // Schlitzohr resources
        if (i < resourceTypes.schlitzohr.length) {
            const resource = resourceTypes.schlitzohr[i];
            row += resource + "," + state.schlitzohr[resource] + ",";
        } else {
            row += ",,";
        }

        // Gelehrter/Magier resources
        if (i < resourceTypes.gelehrter.length) {
            const resource = resourceTypes.gelehrter[i];
            row += resource + "," + state.gelehrter[resource] + ",";
        } else {
            row += ",,";
        }

        // Knappe/Krieger resources
        if (i < resourceTypes.knappe.length) {
            const resource = resourceTypes.knappe[i];
            row += resource + "," + state.knappe[resource] + ",";
        } else {
            row += ",,";
        }

        // Wundpfleger/Heiler resources
        if (i < resourceTypes.wundpfleger.length) {
            const resource = resourceTypes.wundpfleger[i];
            row += resource + "," + state.wundpfleger[resource];
        } else {
            row += ",";
        }

        csvContent += row + "\n";
    }

    // Add totals row
    let totalRow = ",";
    // Calculate and add total for Schlitzohr
    let schlitzohrTotal = Object.values(state.schlitzohr).reduce((sum, count) => sum + count, 0);
    totalRow += schlitzohrTotal + ",,";

    // Calculate and add total for Gelehrter/Magier
    let gelehrterTotal = Object.values(state.gelehrter).reduce((sum, count) => sum + count, 0);
    totalRow += gelehrterTotal + ",,";

    // Calculate and add total for Knappe/Krieger
    let knappeTotal = Object.values(state.knappe).reduce((sum, count) => sum + count, 0);
    totalRow += knappeTotal + ",,";

    // Calculate and add total for Wundpfleger/Heiler
    let wundpflegerTotal = Object.values(state.wundpfleger).reduce((sum, count) => sum + count, 0);
    totalRow += wundpflegerTotal;

    // Add grand total if needed
    let grandTotal = schlitzohrTotal + gelehrterTotal + knappeTotal + wundpflegerTotal;
    totalRow += "," + grandTotal;

    csvContent += totalRow;

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'goblinstadt_ressourcen.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Updated CSV Import Function - matches Excel format
function importCSV(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        const csvData = event.target.result;
        const lines = csvData.split('\n');

        // Skip the first line (header)
        const dataLines = lines.slice(1).filter(line => line.trim() !== '');

        // Get categories from the header (position 0, 2, 4, 6)
        const header = lines[0].split(',');
        const categories = [
            { name: header[0].trim(), id: 'schlitzohr', columnIndex: 0 },
            { name: header[2].trim(), id: 'gelehrter', columnIndex: 2 },
            { name: header[4].trim(), id: 'knappe', columnIndex: 4 },
            { name: header[6].trim(), id: 'wundpfleger', columnIndex: 6 }
        ];

        // Prepare a new state
        const importedState = initializeState();

        // Process each data line (skip the last total line)
        for (let i = 0; i < dataLines.length - 1; i++) {
            const columns = dataLines[i].split(',');

            // Process each category in this row
            categories.forEach(category => {
                const resourceName = columns[category.columnIndex]?.trim();
                const resourceCount = parseInt(columns[category.columnIndex + 1]) || 0;

                // Only update if we have a resource name and it's valid
                if (resourceName && resourceTypes[category.id].includes(resourceName)) {
                    importedState[category.id][resourceName] = resourceCount;
                }
            });
        }

        // Update state with imported data
        state = importedState;
        saveState();
        renderUI();

        alert('CSV erfolgreich importiert!');
    };

    reader.onerror = function() {
        alert('Fehler beim Lesen der Datei.');
    };

    reader.readAsText(file);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Setup tab click handlers
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.category);
        });
    });

    // Setup modal close handler
    document.querySelector('.close-modal').addEventListener('click', hideEditModal);

    // Setup save button handler
    document.getElementById('edit-resource-save').addEventListener('click', saveEditedValue);

    // Setup CSV export/import handlers
    document.getElementById('export-button').addEventListener('click', exportCSV);

    document.getElementById('import-button').addEventListener('click', () => {
        document.getElementById('csv-file-input').click();
    });

    document.getElementById('csv-file-input').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            if (confirm('Aktuelle Daten werden ersetzt. Fortfahren?')) {
                importCSV(file);
            }
        }
        // Reset file input to allow selecting the same file again
        event.target.value = '';
    });

    // Add keyboard event for modal
    document.getElementById('edit-resource-value').addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            saveEditedValue();
        } else if (event.key === 'Escape') {
            hideEditModal();
        }
    });

    // Close modal when clicking outside
    document.getElementById('edit-modal').addEventListener('click', (event) => {
        if (event.target === document.getElementById('edit-modal')) {
            hideEditModal();
        }
    });

    renderUI();

    // Add reset button functionality
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', () => {
        if (confirm('Wirklich alle Ressourcen auf 0 zurücksetzen?')) {
            state = initializeState();
            saveState();
            renderUI();
        }
    });
});
