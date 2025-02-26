class Item {
    constructor(name, category, quantity, emoji) {
        this.id = Item.generateId(); // Jedes Item bekommt eine eindeutige ID
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.emoji = emoji;
    }

    // Statische Methode zur ID-Generierung
    static generateId() {
        return Math.floor(Math.random() * 10000); // Zufällige ID für das Item
    }

    // Methode zum Aktualisieren der Menge
    updateQuantity(quantity) {
        this.quantity = quantity;
    }

    // Methode zum Aktualisieren der Kategorie
    updateCategory(category) {
        this.category = category;
    }
}
