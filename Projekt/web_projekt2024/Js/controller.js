import Model from "../js/model.js";
import View from "../js/view.js";

class Controller {
    constructor() {
        this.model = new Model();
        this.view = new View();

        this.view.bindAddList(this.handleAddList.bind(this));
        this.view.bindRenameList(this.handleRenameList.bind(this));
        this.view.bindDeleteList(this.handleDeleteList.bind(this)); // Hinzugefügt
        this.view.renderLists(this.model.getLists());


        this.view.bindAddArticle(this.handleAddArticle.bind(this));

        // Beim Start die gespeicherten Artikel anzeigen
        this.view.renderArticles(this.model.getArticles());
        this.view.setArticles(this.model.getArticles());




        this.view.bindDeleteArticle(this.handleDeleteArticle.bind(this));
        this.view.bindEditArticle(this.handleEditArticle.bind(this));
    }

    handleAddList(name) {
        this.model.addList(name);
        this.view.renderLists(this.model.getLists());
    }

    async handleAddArticle(itemName, itemCategory, itemEmoji) {
        // Warten, bis die Emoji-Daten geladen sind
        if (Object.keys(this.model.itemEmojis).length === 0) {
            await this.model.loadInitialData();
        }

        this.model.addArticle(itemName, itemCategory, itemEmoji);
        this.view.renderArticles(this.model.getArticles());
    }

    // Artikel löschen
    handleDeleteArticle(index) {
        this.model.deleteArticle(index);
        this.view.renderArticles(this.model.getArticles());
    }

    // Artikel bearbeiten
    handleEditArticle(index, field, value) {
        this.model.editArticle(index, field, value);
        this.view.renderArticles(this.model.getArticles());
    }

    handleRenameList(oldName, newName) {
        this.model.renameList(oldName, newName);
        this.view.renderLists(this.model.getLists());
    }

    handleDeleteList(name) {
        this.model.deleteList(name); // Löschen der Liste aus dem Modell
        this.view.renderLists(this.model.getLists());
    }

}

export default Controller;
