const formulario = document.getElementById("formulario");
formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    if (formulario.mnt.value > 0) {
        let transdata = new FormData(formulario);
        let tsObj = convertToTsObj(transdata);
        insertRowInTable(tsObj);
        savetsObj(tsObj);
        formulario.reset();
    } else {
        alert("El monto debe ser mayor a 0.");
    }
});
document.addEventListener("DOMContentLoaded", function (event) {
    let tsObjArray = JSON.parse(localStorage.getItem("transdata"));
    tsObjArray.forEach(function (element) {
        insertRowInTable(element);
    });
})

function getNewTsId() {
    let lastTsId = localStorage.getItem("lastTsId") || "-1";
    let newTsId = JSON.parse(lastTsId) + 1;
    localStorage.setItem("lastTsId", JSON.stringify(newTsId));
    return newTsId;
}

function convertToTsObj(transdata) {
    let tselector = transdata.get("tselector");
    let desc = transdata.get("desc");
    let mnt = transdata.get("mnt");
    let cat = transdata.get("cat");
    let id = getNewTsId();
    return {
        "tselector": tselector,
        "desc": desc,
        "mnt": mnt,
        "cat": cat,
        "id": id
    }
}

function insertRowInTable(tsObj) {
    let tstableref = document.getElementById("tstable");
    let newtsrow = tstableref.insertRow(-1);
    newtsrow.setAttribute("tsId", tsObj["id"]);
    let newtscell = newtsrow.insertCell(0);
    newtscell.textContent = tsObj["tselector"];
    newtscell = newtsrow.insertCell(1);
    newtscell.textContent = tsObj["desc"];
    newtscell = newtsrow.insertCell(2);
    newtscell.textContent = tsObj["mnt"];
    newtscell = newtsrow.insertCell(3);
    newtscell.textContent = tsObj["cat"];
    let newDeleteCell = newtsrow.insertCell(4);
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Borrar";
    newDeleteCell.appendChild(deleteButton);
    deleteButton.addEventListener("click", (event) => {
        let tsRow = event.target.parentNode.parentNode;
        let tsId = tsRow.getAttribute("tsId");
        tsRow.remove();
        deleteTsObj(tsId);
    });
}

function deleteTsObj(tsId) {
    //Obtengo lo que hay en mi base de datos del localstorage (JSON a objeto)
    let tsObjArray = JSON.parse(localStorage.getItem("transdata"));
    //Busco la posición de la transacción a eliminar
    let tsIndex = tsObjArray.findIndex(element => element.id == tsId);
    //Elimino la transacción
    tsObjArray.splice(tsIndex, 1);
    //Convierto el arreglo de objeto a JSONstring
    let tsArrayJSON = JSON.stringify(tsObjArray);
    //Almaceno el arreglo con formato string en el localstorage
    localStorage.setItem("transdata", tsArrayJSON);
}

function savetsObj(tsObj) {
    let myTsArray = JSON.parse(localStorage.getItem("transdata")) || [];
    myTsArray.push(tsObj);
    let tsArrayJSON = JSON.stringify(myTsArray);
    localStorage.setItem("transdata", tsArrayJSON);
}

function insertCategory(categoryName){
    const selectElem = document.getElementById("cat");
    let htmlToInsert = `<option> ${categoryName} </option>`;
    selectElem.insertAdjacentHTML("beforeend",htmlToInsert);
}

function drawCategory(){
    let allCategory = ["Comida","Ocio","Trabajo","Ropa"];
    for(let index = 0; index < allCategory.length; index++){
        insertCategory(allCategory[index]); 
    }
}

drawCategory();
