// ArticleView.js
class ArticleView {
    constructor() {
        this.itemTableBody = document.getElementById("itemTableBody");
        this.itemForm = document.getElementById("itemForm");
    }

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

    renderArticles(articles) {
        this.itemTableBody.innerHTML = ""; // Leere die Tabelle vorher

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

        // Event-Listener für das Bearbeiten (bei Direktbearbeitung)
        document.querySelectorAll(".editable").forEach(cell => {
            cell.addEventListener("blur", (event) => {
                const index = event.target.getAttribute("data-index");
                const field = event.target.getAttribute("data-field");
                const newValue = event.target.textContent.trim();
                this.handleEditField(index, field, newValue);
            });
        });
    }

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

export default ArticleView;
