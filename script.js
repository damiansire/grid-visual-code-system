class eventHandler {
    constructor(globalMainHandler) {

        this.globalMainHandler = globalMainHandler;

        this.addRowButton = document.getElementById("add-row")

        this.addRowButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.globalMainHandler.addRow();
        })

        this.columSizeForm = document.getElementById("colum-size-form");

        this.columSizeForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let columnSize = parseInt(event.target["columnSize"].value);
            let columnOffset = parseInt(event.target["columnOffset"].value);
            this.globalMainHandler.addColumn(columnSize, columnOffset);
        })

        this.gridElement = document.getElementById("grid-show-system")

        this.gridElement.addEventListener("click", (event) => {
            let rowId = this.getRowAttribute(event)
            this.globalMainHandler.selectRow(rowId)
        })

        //Cancel menu of default navigator
        this.gridElement.addEventListener('contextmenu', e => {
            e.preventDefault();
            let rowId = this.getRowAttribute(event)
            this.globalMainHandler.selectRow(rowId)
            let menuElement = document.getElementsByClassName("list-group")[0];
            menuElement.style.display = "block";
            this.moveElementTo(menuElement, event.clientX, event.clientY)
        });

        document.getElementsByTagName("body")[0].addEventListener("click", () => {
            document.getElementsByClassName("list-group")[0].style.display = "none"
        })

        document.getElementsByClassName("delete-row-button")[0].addEventListener("click", (event) => {
            this.globalMainHandler.deleteSelectedRow()
        })

    }

    moveElementTo(element, x, y) {
        element.style.left = x + "px";
        element.style.top = y + "px";
    }

    getRowAttribute(event) {
        let rowId;
        if (event.target.getAttribute("data-row-id") != undefined) {
            rowId = event.target.getAttribute("data-row-id")
        } else {
            rowId = event.target.parentElement.getAttribute("data-row-id");
        }
        return rowId;
    }
}

class mainHandler {

    constructor(guiHandler) {
        this.lastRowCount = 0;
        this.rows = []
        this.selectedRow = null;
        this.globalGuiHandler = guiHandler;
        this.generateFakeData()
    }

    addRow() {
        if (!this.selectedRow || this.selectedRow.columnsSize != 0) {
            let newRow = new row(this.lastRowCount);
            this.rows.push(newRow);
            this.selectedRow = newRow;
            this.redraw()
            this.lastRowCount++;
        } else {
            alert("The current row is empty, add a column before creating a new row.")
        }
    }

    addColumn(size, offset) {
        if (this.selectedRow) {
            this.selectedRow.addColumn(size, offset)
            this.redraw()
        }
    }

    redraw() {
        let selectedRowId = this.selectedRow != undefined ? this.selectedRow.id : undefined;
        this.globalGuiHandler.redraw(this.rows, selectedRowId);
    }

    generateFakeData() {
        this.addRow();
        this.addColumn(12)
        this.addRow();
        this.addColumn(4, 1)
        this.addColumn(4, 2)
    }

    selectRow(id) {
        this.selectedRow = this.rows.find(row => row.id == id);
        this.redraw();
    }

    deleteSelectedRow() {
        this.rows = this.rows.filter(element => element.id != this.selectedRow.id)
        this.selectedRow = null;
        this.redraw();
    }

}

class guiHandler {

    constructor() {
        this.gridDiv = document.getElementById("grid-show-system");
    }

    redraw(rows, selectedRowId) {
        this.gridDiv.innerHTML = "";

        for (let rowNumber = 0; rowNumber < rows.length; rowNumber++) {
            let rowHtml = rows[rowNumber].getHtmlElement(rowNumber);
            if (selectedRowId == rows[rowNumber].id) {
                rowHtml.classList.add("selectedRow")
            }
            this.gridDiv.appendChild(rowHtml);
        }

        let code = this.gridDiv.innerHTML;
        document.getElementById("code-div").innerText = code;
    }

};

class row {

    constructor(id) {
        this.columnsSize = 0;
        this.columns = [];
        this.id = id;
    }

    addColumn(size, offset = 0) {
        if (this.columnsSize + size + offset <= 12) {
            let column = new col(size, offset)
            this.columnsSize += size + offset
            this.columns.push(column)
        } else {
            alert("There is not enough space in the row to add this column. \n You need create a new row.")
        }
    }

    getHtmlElement() {
        let rowElement = document.createElement("div");
        rowElement.className = "row";
        rowElement.setAttribute("data-row-id", this.id)
        this.columns.forEach(column => {
            let columnHtml = column.getHtmlElement()
            rowElement.appendChild(columnHtml)
        })
        return rowElement;
    }

}

class col {

    constructor(size, offset = 0) {
        this.size = size;
        this.offset = offset;
    }

    getHtmlElement() {
        let divElement = document.createElement("div");
        divElement.classList = `col-sm-${this.size } ` + this.getOffsetHtml();
        divElement.innerText = `col-sm-${this.size}`;
        return divElement;
    }

    getOffsetHtml() {
        return this.offset == 0 ? "" : `offset-${this.offset}`
    }

}

class handlerManager {

    constructor() {
        this.globalGuiHandler = new guiHandler(this);
        this.globalMainHandler = new mainHandler(this.globalGuiHandler);
        this.globalEventHandler = new eventHandler(this.globalMainHandler);
    }

}

let globalHandlerManager = new handlerManager();