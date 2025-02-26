// ListModel.js
class ListModel {
    constructor() {
        this.lists = this.loadLists();
        this.subscribers = [];
    }

    // Lädt die Listen aus dem localStorage
    loadLists() {
        const data = localStorage.getItem('shoppingLists');
        return data ? JSON.parse(data) : [];
    }

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

export default ListModel;
