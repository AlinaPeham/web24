class List {
    constructor(name) {
        this.id = List.generateId(); // Jede Liste bekommt eine eindeutige ID
        this.name = name;
        this.items = []; // Initial leer
        this.isCompleted = false; // Standardmäßig nicht abgeschlossen
    }

    // Statische Methode zur ID-Generierung
    static generateId() {
        return Math.floor(Math.random() * 10000); // Zufällige ID für die Liste
    }

    // Methode zum Hinzufügen eines Artikels
    addItem(item) {
        this.items.push(item);
    }

    // Methode zum Entfernen eines Artikels
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    // Methode zum Markieren der Liste als abgeschlossen
    markAsCompleted() {
        this.isCompleted = true;
    }
}
