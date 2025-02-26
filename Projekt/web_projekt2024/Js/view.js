class View {
    constructor() {

        this.newListForm = document.getElementById('newListForm');
        this.listNameInput = document.getElementById('listName');
        this.itemTableContainer = document.getElementById("itemTableContainer");
        this.itemTableBody = document.getElementById("itemTableBody");
    }


    //Lists
    bindAddList(handler) {
        this.newListForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = this.listNameInput.value.trim();
            if (name) {
                handler(name);
                this.listNameInput.value = '';

                // Bootstrap-Modal schließen
                const newListModal = bootstrap.Modal.getInstance(document.getElementById('newListModal'));
                if (newListModal) {
                    newListModal.hide();
                }
            }

        });
    }


    bindRenameList(handler) {
        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("rename-list")) {
                const listElement = event.target.closest(".list-card");
                const oldName = listElement.querySelector(".list-title").textContent;
                this.showRenameModal(oldName, handler);
            }
        });
    }


    bindDeleteList(handler) {
        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("delete-list")) {
                const listElement = event.target.closest(".list-card");
                const listName = listElement.querySelector(".list-title").textContent;
                handler(listName);
            }
        });
    }

    //Name ändern der Liste
    showRenameModal(oldName, handler) {
        const modalHtml = `
        <div class="modal fade" id="renameListModal" tabindex="-1" aria-labelledby="renameListModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="renameListModalLabel">Liste umbenennen</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="renameListForm">
                            <div class="mb-3">
                                <label for="renameListName" class="form-label">Neuer Listenname</label>
                                <input type="text" class="form-control" id="renameListName" value="${oldName}" placeholder="z. B. Supermarkt">
                            </div>
                            <button type="submit" class="btn btn-success">Umbenennen</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const renameListModal = new bootstrap.Modal(document.getElementById('renameListModal'));
        renameListModal.show();

        document.getElementById('renameListForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const newName = document.getElementById('renameListName').value.trim();
            if (newName) {
                handler(oldName, newName);
            }
            renameListModal.hide();
            document.getElementById('renameListModal').remove();
        });
    }

    //Methode zum Zählen der enthaltenen Artikel
    countArticles(list) {
        const itemCount = list.items ? list.items.length : 0;
        return itemCount;
    }

    //Aussehen der Liste
    renderLists(lists) {
        const container = document.getElementById('shoppingLists');
        if (!container) return;
        container.innerHTML = '';

        lists.forEach(list => {
            const itemCount = this.countArticles(list);

            const listElement = document.createElement('div');
            listElement.className = 'col-md-4';
            listElement.innerHTML = `
                <div class="card list-card shadow-sm position-relative"> 
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <h5 class="card-title list-title">${list.name}</h5>
                            <div class="dropdown">
                                <i class="bi bi-three-dots meatball-menu" data-bs-toggle="dropdown"></i>
                                <ul class="dropdown-menu dropdown-menu-end" data-bs-auto-close="outside">
                                    <li><a class="dropdown-item rename-list" href="#"><i class="bi bi-pencil"></i> Umbenennen</a></li>
                                    <li><a class="dropdown-item" href="#"><i class="bi bi-share"></i> Teilen</a></li>
                                    <li><a class="dropdown-item text-danger delete-list" href="#"><i class="bi bi-trash"></i> Löschen</a></li>
                                </ul>
                            </div>
                        </div>
                        <p class="text-muted">Anzahl der Artikel: ${itemCount}</p>
                        <div class="text-end">
                            <a href="./view-list.html?listName=${list.name}" class="btn btn-outline-success">Ansehen</a>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(listElement);
        });
    }



    //Article
    bindAddArticle(handler) {
        document.getElementById("itemForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const itemName = document.getElementById("itemName").value.trim();
            const itemEmoji = document.getElementById("itemEmoji").value.trim();
            const itemCategory = document.getElementById("itemCategory").value.trim();
            if (itemName && itemCategory) {
                handler(itemName, itemCategory, itemEmoji);
                document.getElementById("itemForm").reset();
            }
        });
    }

    // Funktion zum Hinzufügen eines Artikels zur Tabelle
    renderArticles(articles) {
        this.itemTableBody.innerHTML = "";

        articles.forEach((article, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${article.emoji || "❓"}</td>
                <td contenteditable="true" class="editable" data-index="${index}" data-field="name">${article.name}</td>
                <td contenteditable="true" class="editable" data-index="${index}" data-field="category">${article.category}</td>
                <td class="d-flex justify-content-center align-items-center"> <!-- Buttons zentrieren -->
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary btn-sm edit-btn" data-index="${index}">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm delete-btn" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;


            this.itemTableBody.appendChild(row);
        });

        this.itemTableContainer.style.display = articles.length > 0 ? "block" : "none";

        // Event-Listener für das Löschen
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const index = event.target.closest("button").getAttribute("data-index");
                this.handleDelete(index);
            });
        });

        // Event-Listener für das Bearbeiten
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const index = event.target.closest("button").getAttribute("data-index");
                this.handleEdit(index);
            });
        });

        // Event-Listener für das Bearbeiten
        document.querySelectorAll(".editable").forEach(cell => {
            cell.addEventListener("blur", (event) => {
                const index = event.target.getAttribute("data-index");
                const field = event.target.getAttribute("data-field");
                const newValue = event.target.textContent.trim();
                this.handleEditField(index, field, newValue);
            });
        });
    }

   //Umbennen Artikelname und Kategorie
    handleEdit(index) {
        const article = this.articles[index];

        const modalHtml = `
            <div class="modal fade" id="editArticleModal" tabindex="-1" aria-labelledby="editArticleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editArticleModalLabel">Artikel bearbeiten</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editArticleForm">
                                <div class="mb-3">
                                    <label for="editArticleName" class="form-label">Artikelname</label>
                                    <input type="text" class="form-control" id="editArticleName" value="${article.name}">
                                </div>
                                <div class="mb-3">
                                    <label for="editArticleCategory" class="form-label">Kategorie</label>
                                    <input type="text" class="form-control" id="editArticleCategory" value="${article.category}">
                                </div>
                                <button type="submit" class="btn btn-success">Speichern</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            `;

        document.body.insertAdjacentHTML("beforeend", modalHtml);
        const editModal = new bootstrap.Modal(document.getElementById("editArticleModal"));
        editModal.show();

        document.getElementById("editArticleForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const newName = document.getElementById("editArticleName").value.trim();
            const newCategory = document.getElementById("editArticleCategory").value.trim();
            if (newName && newCategory) {
                this.onEditArticle(index, "name", newName);
                this.onEditArticle(index, "category", newCategory);
            }
            editModal.hide();
            document.getElementById("editArticleModal").remove();
        });
    }


    handleEditField(index, field, value) {
        if (this.onEditArticle) {
            this.onEditArticle(index, field, value);
        }
    }

    // Bestätigung zum Löschen eines Artikels
    handleDelete(index) {
        const modalHtml = `
    <div class="modal fade" id="deleteArticleModal" tabindex="-1" aria-labelledby="deleteArticleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteArticleModalLabel">Artikel löschen</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Bist du sicher, dass du diesen Artikel löschen möchtest?</p>
                    <button id="confirmDeleteBtn" class="btn btn-danger">Löschen</button>
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Abbrechen</button>
                </div>
            </div>
        </div>
    </div>
    `;

        document.body.insertAdjacentHTML("beforeend", modalHtml);
        const deleteModal = new bootstrap.Modal(document.getElementById("deleteArticleModal"));
        deleteModal.show();

        document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
            this.onDeleteArticle(index);
            deleteModal.hide();
            document.getElementById("deleteArticleModal").remove();
        });
    }


    // Setze die Callback-Funktionen für Controller
    bindDeleteArticle(callback) {
        this.onDeleteArticle = callback;
    }

    bindEditArticle(callback) {
        this.onEditArticle = callback;
    }

    setArticles(articles) {
        this.articles = articles;  // Speichert die Artikel für spätere Nutzung
    }


}



export default View;
