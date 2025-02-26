class Model {
    constructor() {
        this.lists = this.loadLists();
        this.subscribers = [];
        this.articles = JSON.parse(localStorage.getItem('articles')) || [];
        this.itemEmojis = {};
        this.loadInitialData();
    }

    // Lädt die Listen aus dem localStorage
    loadLists() {
        const data = localStorage.getItem('shoppingLists');
        return data ? JSON.parse(data) : [];
    }

    // JSON-Datei laden und Emojis in Objekt speichern
    async loadInitialData() {

        try {
            const response = await fetch('../JSON/data.json');
            const data = await response.json();
            data.items.forEach(item => {
                this.itemEmojis[item.name.toLowerCase()] = item.emoji; // Kleinbuchstaben für besseren Vergleich
            });
        } catch (error) {
            console.error("❌ Fehler beim Laden der JSON-Datei:", error);
        }
    }


    //Article
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



    //List
    saveLists() {
        localStorage.setItem('shoppingLists', JSON.stringify(this.lists));
    }

    getLists() {
        return this.lists;
    }

    addList(name) {
        const newList = { id: Date.now(), name, items: [] };
        this.lists.push(newList);
        this.saveLists();
        this.notify();
    }

    renameList(oldName, newName) {
        const list = this.lists.find(list => list.name === oldName);
        if (list) {
            list.name = newName;
            this.saveLists();
            this.notify();
        }
    }

    deleteList(name) {
        const index = this.lists.findIndex(list => list.name === name);
        if (index !== -1) {
            this.lists.splice(index, 1);
            this.saveLists();
            this.notify();
        }
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notify() {
        this.subscribers.forEach(callback => callback(this.lists));
    }
}

export default Model;
