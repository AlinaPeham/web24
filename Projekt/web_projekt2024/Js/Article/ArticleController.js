// ArticleController.js
import ArticleModel from "./ArticleModel.js";
import ArticleView from "./ArticleView.js";

class ArticleController {
    constructor() {
        this.model = new ArticleModel();
        this.view = new ArticleView();

        this.view.bindAddArticle(this.handleAddArticle.bind(this));

        // Beim Start die gespeicherten Artikel anzeigen
        this.view.renderArticles(this.model.getArticles());
        this.view.setArticles(this.model.getArticles());




        this.view.bindDeleteArticle(this.handleDeleteArticle.bind(this));
        this.view.bindEditArticle(this.handleEditArticle.bind(this));

        this.updateView();
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


    updateView() {
        this.view.renderArticles(this.model.getArticles());
    }
}

export default ArticleController;
