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

        gridElement.addEventListener("click", (event) => {
            let rowId;
            if (targetElement != null) {
                rowId = eventElement.target.getAttribute("data-row-id")
            } else {
                rowId = eventElement.target.parentElement.getAttribute("data-row-id")
            }
        })
    }
}

class mainHandler {
    constructor(guiHandler) {
        this.rows = []
        this.selectedRow = null;
        this.globalGuiHandler = guiHandler;
        this.generateFakeData()
    }
    addRow() {
        let newRow = new row();
        this.rows.push(newRow);
        this.selectedRow = newRow;
        this.redraw()
    }
    addColumn(size, offset) {
        this.selectedRow.addColumn(size, offset)
        this.redraw()
    }
    redraw() {
        this.globalGuiHandler.redraw(this.rows);
    }
    generateFakeData() {
        this.addRow();
        this.addColumn(12)
        this.addRow();
        this.addColumn(4, 1)
        this.addColumn(4, 2)
        this.addRow();
        this.addColumn(10, 1)
    }

}

class guiHandler {
    constructor() {
        this.gridDiv = document.getElementById("grid-show-system");
    }

    redraw(rows) {
        this.gridDiv.innerHTML = "";

        for (let rowNumber = 0; rowNumber < rows.length; rowNumber++) {
            let rowHtml = rows[rowNumber].getHtmlElement(rowNumber);
            this.gridDiv.appendChild(rowHtml);
        }

        let code = this.gridDiv.innerHTML;
        document.getElementById("code-div").innerText = code;
    }

};

class row {
    constructor() {
        this.columnsSize = 0;
        this.columns = []
    }
    addColumn(size, offset = 0) {
        if (this.columnsSize + size + offset <= 12) {
            let column = new col(size, offset)
            this.columnsSize += size + offset
            this.columns.push(column)
        }
    }
    getHtmlElement(rowNumber) {
        let rowElement = document.createElement("div");
        rowElement.className = "row";
        rowElement.setAttribute("data-row-id", rowNumber)
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