document.addEventListener("DOMContentLoaded", function () {
    // Controller: Hier startet das Event, wenn die Seite geladen ist
    const urlParams = new URLSearchParams(window.location.search);
    const listName = urlParams.get("listName");
    const emptyListModalElement = document.getElementById('emptyListModal');
    const emptyListModal = new bootstrap.Modal(emptyListModalElement);

    if (listName) {
        document.getElementById("listName").textContent = `Deine Einkaufsliste: ${listName}`; // View
    }

    const itemDropdown = document.getElementById("itemDropdown");
    const articlesContainer = document.getElementById("articlesContainer");
    const filterDropdown = document.getElementById("filterDropdown");

    // Model: Daten aus dem localStorage holen
    function getStoredItems() {
        const listName = new URLSearchParams(window.location.search).get("listName");
        return JSON.parse(localStorage.getItem(`shoppingList_${listName}`)) || [];
    }

    // Model: Daten im localStorage speichern
    function saveStoredItems(items) {
        const listName = new URLSearchParams(window.location.search).get("listName");
        localStorage.setItem(`shoppingList_${listName}`, JSON.stringify(items));
    }

    let storedItems = getStoredItems();
    let allItems = [...storedItems];

    // Controller: Abrufen von Artikeln aus einer JSON-Datei und Updaten der Ansicht
    fetch('./JSON/data.json')
        .then(response => response.json())
        .then(data => {
            allItems = [...storedItems, ...data.items];
            updateDropdown(data.items); // View
            renderArticles(storedItems); // View
            updateFilterOptions(); // View
            updateItemCount(); // View

            if (storedItems.length === 0) {
                emptyListModal.show(); // View
            }

            // Event-Listener für Modal-Schaltflächen
            document.getElementById('yesAddItemsBtn').addEventListener('click', function () {
                emptyListModal.hide(); // View
            });

            document.getElementById('noBackToListBtn').addEventListener('click', function () {
                emptyListModal.hide(); // View
                window.location.href = "index.html"; // Controller
            });
        })
        .catch(error => console.error('Fehler beim Laden der JSON-Datei:', error));

    // View: Dropdown mit Artikeln füllen
    function updateDropdown(itemsData) {
        itemDropdown.innerHTML = "";
        itemsData.forEach(item => {
            const option = document.createElement("option");
            option.value = item.name;
            option.textContent = `${item.emoji} ${item.name}`;
            itemDropdown.appendChild(option);
        });
    }

    // Zweites "DOMContentLoaded" Event ist unnötig, daher entfernt
    // Button "Alle Artikel einkaufen"
    const confirmBuyAllModalElement = document.getElementById('confirmBuyAllModal');
    const confirmBuyAllModal = new bootstrap.Modal(confirmBuyAllModalElement);

    document.getElementById("buyAllBtn").addEventListener("click", function () {
        if (storedItems.length === 0) {
            alert("Deine Einkaufsliste ist bereits leer!");
            return;
        }
        // Öffnet das Bestätigungsmodal
        confirmBuyAllModal.show();
    });

    // Bestätigung im Modal "Ja, alle einkaufen"
    document.getElementById('confirmBuyAllBtn').addEventListener('click', function () {
        storedItems = []; // Liste leeren
        saveStoredItems(storedItems); // Speichern
        renderArticles(storedItems); // Aktualisieren
        updateItemCount(); // Artikelanzahl updaten
        updateFilterOptions(); // Filter aktualisieren
        confirmBuyAllModal.hide(); // Modal schließen
    });

    // Controller: Artikel aus Dropdown zur Liste hinzufügen
    document.getElementById("addFromDropdownBtn").addEventListener("click", function () {
        const selectedItemName = itemDropdown.value;
        const selectedItem = allItems.find(item => item.name === selectedItemName);
        if (selectedItem) {
            addItemToList(selectedItem); // Controller
        }
    });

    // Controller: Artikel zur Liste hinzufügen
    function addItemToList(item) {
        storedItems.push({ ...item, quantity: 1 });  // Initial quantity is set to 1
        saveStoredItems(storedItems); // Model
        renderArticles(storedItems); // View
        updateFilterOptions(); // View
    }

    // View: Artikel in der Tabelle rendern
    function renderArticles(items) {
        articlesContainer.innerHTML = "";
        items.forEach((item, index) => {
            const articleElement = document.createElement("tr");
            articleElement.innerHTML = `
                <td>${item.emoji}</td>
                <td>${item.name}</td>
                <td>${item.category || 'Unbekannt'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-success" data-index="${index}" onclick="decreaseQuantity(${index})">
                        <i class="bi bi-dash"></i>
                    </button>
                    <span id="quantity-${index}">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-success ms-2" data-index="${index}" onclick="increaseQuantity(${index})">
                        <i class="bi bi-plus"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-success btn-sm delete-btn" data-index="${index}">
                        <i>Eingekauft</i>
                    </button>
                </td>
            `;
            articlesContainer.appendChild(articleElement); // View
        });
    }

    // View: Anzahl der Artikel updaten
    function updateItemCount() {
        const itemCount = storedItems.length;
        document.getElementById("itemCount").textContent = `Anzahl der Artikel: ${itemCount}`;
    }

    // Controller: Artikel aus der Liste entfernen
    articlesContainer.addEventListener("click", function (e) {
        if (e.target.closest(".delete-btn")) {
            const index = e.target.closest(".delete-btn").dataset.index;
            storedItems.splice(index, 1); // Model
            saveStoredItems(storedItems); // Model
            renderArticles(storedItems); // View
            updateItemCount(); // View
            updateFilterOptions(); // View
        }
    });

    // Controller: Neues Artikel-Formular verarbeiten
    document.getElementById("addArticleForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const itemName = document.getElementById("itemName").value;
        const itemCategory = document.getElementById("itemCategory").value;
        const newItem = { name: itemName, category: itemCategory, emoji: "❓", quantity: 1 };
        addItemToList(newItem); // Controller
        document.getElementById("itemName").value = ''; // View
        document.getElementById("itemCategory").value = ''; // View
    });

    // View: Filteroptionen aktualisieren
    function updateFilterOptions() {
        const uniqueCategories = ["Alle", ...new Set(storedItems.map(item => item.category).filter(Boolean))];
        filterDropdown.innerHTML = uniqueCategories.map(category => `<option value="${category}">${category}</option>`).join('');
    }

    // Controller: Filter für Artikel anwenden
    filterDropdown.addEventListener("change", function () {
        const selectedCategory = filterDropdown.value;
        const filteredItems = selectedCategory === "Alle" ? storedItems : storedItems.filter(item => item.category === selectedCategory);
        renderArticles(filteredItems); // View
        updateItemCount(); // View
    });

    // Controller: Menge eines Artikels erhöhen
    window.increaseQuantity = function(index) {
        storedItems[index].quantity++;
        saveStoredItems(storedItems); // Model
        renderArticles(storedItems); // View
    }

    // Controller: Menge eines Artikels verringern
    window.decreaseQuantity = function(index) {
        if (storedItems[index].quantity > 1) {
            storedItems[index].quantity--;
            saveStoredItems(storedItems); // Model
            renderArticles(storedItems); // View
        }
    }
});
