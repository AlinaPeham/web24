// ListController.js
import ListModel from "./ListModel.js";
import ListView from "../ListView.js";

class ListController {
    constructor() {
        this.model = new ListModel();
        this.view = new ListView();

        this.view.bindAddList(this.handleAddList.bind(this));
        this.view.bindRenameList(this.handleRenameList.bind(this));
        this.view.bindDeleteList(this.handleDeleteList.bind(this)); // Hinzugefügt
        this.view.renderLists(this.model.getLists());

        this.model.subscribe(this.updateView.bind(this));
        this.updateView();
    }

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

    updateView() {
        this.view.renderLists(this.model.getLists());
    }
}

export default ListController;
