import Model from "./model.js";
import View from "./view.js";

class Controller {
    constructor() {
        this.model = new Model();
        this.view = new View();

        //Lists
        this.view.bindAddList(this.handleAddList.bind(this));
        this.view.bindRenameList(this.handleRenameList.bind(this));
        this.view.bindDeleteList(this.handleDeleteList.bind(this));
        this.view.renderLists(this.model.getLists());

        //Artikel
        this.view.bindAddArticle(this.handleAddArticle.bind(this));
        this.view.renderArticles(this.model.getArticles());
        this.view.setArticles(this.model.getArticles());
        this.view.bindDeleteArticle(this.handleDeleteArticle.bind(this));
        this.view.bindEditArticle(this.handleEditArticle.bind(this));
    }

    //Lists
    handleAddList(name) {
        this.model.addList(name);
        this.view.renderLists(this.model.getLists());
    }

    handleRenameList(oldName, newName) {
        this.model.renameList(oldName, newName);
        this.view.renderLists(this.model.getLists());
    }

    handleDeleteList(name) {
        this.model.deleteList(name); // Löschen der Liste aus dem Modell
        this.view.renderLists(this.model.getLists());
    }


    //Article
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

}

export default Controller;
