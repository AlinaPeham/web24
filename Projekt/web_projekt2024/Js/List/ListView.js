// ListView.js
class ListView {
    constructor() {
        this.listContainer = document.getElementById('shoppingLists');
        this.newListForm = document.getElementById('newListForm');
        this.listNameInput = document.getElementById('listName');
    }

    bindAddList(handler) {
        this.newListForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = this.listNameInput.value.trim();
            if (name) {
                handler(name);  // Liste hinzufügen
                this.listNameInput.value = '';  // Eingabefeld leeren

                // Bootstrap-Modal schließen
                const newListModal = bootstrap.Modal.getInstance(document.getElementById('newListModal'));
                if (newListModal) {
                    newListModal.hide();
                }
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

    bindRenameList(handler) {
        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("rename-list")) {
                const listElement = event.target.closest(".list-card");
                const oldName = listElement.querySelector(".list-title").textContent;
                this.showRenameModal(oldName, handler);
            }
        });
    }

    renderLists(lists) {
        const container = document.getElementById('shoppingLists');
        if (!container) return;
        container.innerHTML = '';

        lists.forEach(list => {
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
                        <div class="text-end">
                            <a href="../html/view-list.html?listName=${list.name}" class="btn btn-outline-success">Ansehen</a>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(listElement);
        });
    }

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
            document.getElementById('renameListModal').remove(); // Entferne das Modal nach dem Schließen
        });
    }
}

export default ListView;
