// ArticleModel.js
class ArticleModel {
    constructor() {
        this.articles = JSON.parse(localStorage.getItem('articles')) || [];
        this.itemEmojis = {};
        this.loadInitialData();
    }

    // JSON-Datei laden und Emojis in Objekt speichern
    async loadInitialData() {

        try {
            const response = await fetch('../Data/data.json');
            const data = await response.json();
            data.items.forEach(item => {
                this.itemEmojis[item.name.toLowerCase()] = item.emoji; // Kleinbuchstaben für besseren Vergleich
            });
        } catch (error) {
            console.error("❌ Fehler beim Laden der JSON-Datei:", error);
        }
    }

    saveArticles() {
        localStorage.setItem('articles', JSON.stringify(this.articles));
    }

    getArticles() {
        return this.articles;
    }

    addArticle(itemName, itemCategory, itemEmoji) {
        const cleanName = itemName.toLowerCase().trim(); // Bereinigen
        const emoji = itemEmoji || this.itemEmojis[cleanName] || "❓"; // Standard-Emoji

        const newArticle = { name: itemName, category: itemCategory, emoji: emoji };
        this.articles.push(newArticle);
        this.saveArticles();
    }

    deleteArticle(index) {
        this.articles.splice(index, 1);
        this.saveArticles();
    }

    editArticle(index, field, value) {
        if (this.articles[index]) {
            this.articles[index][field] = value;
            this.saveArticles();
        }
    }
}

export default ArticleModel;
