class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
        this.shoppingLists = []; // Liste der Listen des Nutzers
    }

    // Methode zum Erstellen einer neuen Liste
    createList(name) {
        const newList = new ListModel(name);
        this.shoppingLists.push(newList);
        return newList;
    }

    // Methode zum Hinzufügen eines Artikels zu einer Liste
    addItemToList(listId, item) {
        const list = this.shoppingLists.find(list => list.id === listId);
        if (list) {
            list.addItem(item);
        }
    }

    // Methode zum Entfernen eines Artikels aus einer Liste
    removeItemFromList(listId, itemId) {
        const list = this.shoppingLists.find(list => list.id === listId);
        if (list) {
            list.removeItem(itemId);
        }
    }

    // Methode zum Markieren einer Liste als abgeschlossen
    markListAsCompleted(listId) {
        const list = this.shoppingLists.find(list => list.id === listId);
        if (list) {
            list.markAsCompleted();
        }
    }
}
