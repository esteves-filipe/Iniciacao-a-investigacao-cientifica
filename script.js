var block_size;
var fat_type;
var file_content;
var xml_content;
var fat_pointer = 0;
var blocks_pointer = 0;
var n_fat_entries = 0;
var fat_entry_size;
var dir_entry_values_to_display = [];
var dir_entry_list = [];
var file;
var numDirEntryAtribs;
var folderToJumpTo;
var fileToJumpTo;
var dirEntrySize = 0;


function displayXMLFields() {
    xml_content = getXMLObject();
    document.getElementById("xmlAttributes").innerHTML = "";
    document.getElementById("treeWrapper").setAttribute("style", "display:none");
    document.getElementById("fatDivWrapper").setAttribute("style", "display:none");
    document.getElementById("dataDivWrapper").setAttribute("style", "display:none");
    document.getElementById("superblock").setAttribute("style", "display:none");
    document.getElementById("myfilesystem").setAttribute("style", "display:none");
    document.getElementById("content").setAttribute("style", "width:" + Math.floor(window.innerWidth - 15) + "px;max-height:" + (window.innerHeight - 105) + "px;height:" + (window.innerHeight - 105) + "px;");

    for (i = 0; i < xml_content.getElementsByTagName("dir_entry")[0].getElementsByTagName("attribute").length; ++i) {
        var elem = xml_content.getElementsByTagName("dir_entry")[0].getElementsByTagName("attribute")[i].childNodes[1].innerHTML;
        form = document.getElementsByTagName("form")[0];
        var child = document.createElement("input");
        child.setAttribute("type", "checkbox");
        if (localStorage.getItem("checked" + i) == "true") {
            child.defaultChecked = true;
        }
        else
            child.defaultChecked = false;
        form.appendChild(child);
        form.innerHTML = form.innerHTML + elem + "<br />";
    }

    var elem = document.createElement("input");
    elem.setAttribute("type", "button");
    elem.setAttribute("value", "Submit");
    elem.setAttribute("onClick", "readFormInput()");
    form.appendChild(elem);
    form.innerHTML = "Select the dir_entry attributes you want to view" + "</br>" + form.innerHTML;
    form.setAttribute("style", "display:inline-block");

    var elem1 = document.createElement("input");
    elem1.setAttribute("type", "button");
    elem1.setAttribute("value", "Select All");
    elem1.setAttribute("onClick", "selectAll()");
    form.appendChild(elem1);

    var elem2 = document.createElement("input");
    elem2.setAttribute("type", "button");
    elem2.setAttribute("value", "Uncheck All");
    elem2.setAttribute("onClick", "clearAll()");
    form.appendChild(elem2);
    window.onresize = firstPageDinamicallyResize;
}
function firstPageDinamicallyResize() {

    document.getElementById("treeWrapper").setAttribute("style", "display:none");
    document.getElementById("fatDivWrapper").setAttribute("style", "display:none");
    document.getElementById("dataDivWrapper").setAttribute("style", "display:none");
    document.getElementById("superblock").setAttribute("style", "display:none");
    document.getElementById("myfilesystem").setAttribute("style", "display:none");
    document.getElementById("content").setAttribute("style", "width:" + Math.floor(window.innerWidth - 15) + "px;max-height:" + (window.innerHeight - 105) + "px;height:" + (window.innerHeight - 105) + "px;");
}

function secondPageDinamicallyResize() {
    document.getElementById("treeWrapper").setAttribute("style", "display:none");
    document.getElementById("fatDivWrapper").setAttribute("style", "display:none");
    document.getElementById("dataDivWrapper").setAttribute("style", "display:none");
    document.getElementById("superblock").setAttribute("style", "display:none");
    document.getElementById("myfilesystem").setAttribute("style", "display:none");
    document.getElementById("content").setAttribute("style", "width:" + Math.floor(window.innerWidth - 15) + "px;max-height:" + (window.innerHeight - 105) + "px;height:" + (window.innerHeight - 105) + "px;");
    document.getElementsByTagName("form")[0].setAttribute("style", "display:none");
    document.getElementById("myfilesystem").setAttribute("style", "display:inline-block");
}

function readFormInput() {
    var form = document.getElementById("xmlAttributes");

    for (i = 0; i < form.getElementsByTagName("input").length - 3; ++i) {
        dir_entry_values_to_display[i] = form.getElementsByTagName("input")[i].checked;
        localStorage.removeItem("checked" + i);
        localStorage.setItem("checked" + i, form.getElementsByTagName("input")[i].checked);
        document.getElementsByTagName("form")[0].setAttribute("style", "display:none");
        document.getElementById("myfilesystem").setAttribute("style", "display:inline-block");
    }
    window.onresize = secondPageDinamicallyResize;
}

function clearAll() {
    var form = document.getElementById("xmlAttributes");
    for (i = 0; i < form.getElementsByTagName("input").length - 1; ++i) {
        document.getElementsByTagName("input")[i].checked = false;
        localStorage.removeItem("checked" + i);
        localStorage.setItem("checked" + i, false);
    }
}

function selectAll() {
    var form = document.getElementById("xmlAttributes");
    for (i = 0; i < form.getElementsByTagName("input").length - 1; ++i) {
        document.getElementsByTagName("input")[i].checked = true;
        localStorage.removeItem("checked" + i);
        localStorage.setItem("checked" + i, true);
    }
}

function formatElements() {
    document.getElementById("treeWrapper").setAttribute("style", "display:inline-block;max-height:" + (window.innerHeight - 105) + "px;max-width:" + window.innerWidth * 0.12 + "px;");
    document.getElementById("tree").setAttribute("style", "display:inline-block;height:" + (window.innerHeight - 105) + "px;max-height:" + (window.innerHeight - 105) + "px;");
    var treeWrapperSize = document.getElementById("treeWrapper").offsetWidth;
    var treeWrapperHeight = document.getElementById("treeWrapper").offsetHeight;
    document.getElementById("content").setAttribute("style", "overflow-y:hidden;width:" + (window.innerWidth - treeWrapperSize - 20) + "px;height:" + (window.innerHeight - 105) + "px;");
    var contentSize = document.getElementById("content").offsetWidth;
    var contentHeight = (window.innerHeight - 105);
    document.getElementById("superblock").setAttribute("style", "display:inline-block;")
    document.getElementById("superblockWrapper").setAttribute("style", "display:inline-block;");
    var superblockWrapperSize = document.getElementById("superblockWrapper").offsetWidth;
    document.getElementById("fatDivWrapper").setAttribute("style", "display:inline-block;max-height:" + (contentHeight) + "px;max-width:" + Math.floor(contentSize * 0.2) + "px;");
    var fatDivWrapperSize = document.getElementById("fatDivWrapper").offsetWidth;
    document.getElementById("dataDivWrapper").setAttribute("style", "display:inline-block;max-height:" + (contentHeight) + "px;max-width:" + (contentSize - (superblockWrapperSize + fatDivWrapperSize + 30)) + "px;");
    var dataDivWrapperSize = document.getElementById("dataDivWrapper").offsetWidth;
    document.getElementById("fatDiv").setAttribute("style", "display:inline-block;max-height:" + (contentHeight - 62) + "px;");
    document.getElementById("dataDiv").setAttribute("style", "display:inline-block;max-height:" + (contentHeight - 62) + "px;min-height:" + (contentHeight - 62) + "px;");
    document.getElementsByTagName("form")[0].setAttribute("style", "display:none");
    document.getElementById("myfilesystem").setAttribute("style", "display:none");

    var blockCells = document.getElementsByClassName("blockCell");
    var dataBlockCells = document.getElementsByClassName("dataBlockCell");
    var unusedBlockCells = document.getElementsByClassName("unusedblockCell");

    for (var i = 0; i < blockCells.length; ++i) {
        blockCells[i].setAttribute("style", "min-height:" + (contentHeight - 62));
        dataBlockCells[i].setAttribute("style", "height:" + (contentHeight - 80));
        unusedBlockCells[i].setAttribute("style", "height:" + (contentHeight - 80));
    }
    window.onresize = formatElements;
}

function readFilesystemFile() {

    var filesysInput = document.getElementById('myfilesystem');
    var filesysReader = new FileReader();

    filesysReader.onload = function (e) {
        file_content = e.target.result;
        parseSuperblock();
        parseFAT();
        parseData();
        formatElements();
    };


    filesysInput.onchange = function (e) {
        file = this.files[0];
        filesysReader.readAsBinaryString(file);
    };

}
function reload() {
    var filesysReader = new FileReader();

    filesysReader.readAsBinaryString(file);

    filesysReader.onload = function (e) {
        file_content = e.target.result;
        document.getElementById("superblock").innerHTML = "<th><strong>Superblock</strong></th>";
        parseSuperblock();
        document.getElementById("fatTable").innerHTML = "";
        parseFAT();
        document.getElementById("dataTable").innerHTML = "";
        dir_entry_list = [];
        document.getElementById("tree").innerHTML = "";
        parseData();
        formatElements();
    };

}

function getXMLObject() {
    var XMLString = readLocalTextFile('attributes.xml');
    var xmlDoc;
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(XMLString, "text/xml");
    } else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xml_content);
    }
    return xmlDoc;
}

// READ LOCAL FILES
// Return String
function readLocalTextFile(file) {
    var cont;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                cont = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return cont;

}

function parseSuperblock() {
    var blockTable = document.getElementById("superblock");
    var pointer = 0;
    numSuperblockAtribs = xml_content.getElementsByTagName("superblock")[0]
			.getElementsByTagName("attribute").length;

    superblockAtribs = xml_content.getElementsByTagName("superblock")[0]
			.getElementsByTagName("attribute");

    fat_entry_size = Number(xml_content.getElementsByTagName("fat_entry")[0].getElementsByTagName("size")[0].innerHTML);

    for (i = 0; i < numSuperblockAtribs; ++i) {
        x = superblockAtribs[i].getElementsByTagName("disk_size_bytes")[0].innerHTML;
        row = blockTable.insertRow(-1);
        cell = row.insertCell(-1);
        cell.setAttribute("title", superblockAtribs[i].getElementsByTagName("name")[0].innerHTML);
        if (i % 2 == 0)
            cell.setAttribute("class", "dark");
        else
            cell.setAttribute("class", "light");
        if (superblockAtribs[i].getElementsByTagName("name")[0].innerHTML == "block_size")
            block_size = get_int_at(pointer);
        if (superblockAtribs[i].getElementsByTagName("name")[0].innerHTML == "fat_type")
            fat_type = get_int_at(pointer);
        cell.innerHTML = get_int_at(pointer);
        pointer += 0;
        pointer += Number(x);
    }
    fat_pointer = block_size;
    n_fat_entries = Math.pow(2, fat_type);
    blocks_pointer = Number(fat_pointer)
			+ ((n_fat_entries * fat_entry_size) / block_size) * block_size;

}

function parseFAT() {
    var fatTable = document.getElementById("fatTable");
    var n_blocks_fat = (n_fat_entries * fat_entry_size) / block_size;
    var n_entries_per_block = block_size / fat_entry_size;

    for (i = 0; i < n_blocks_fat; ++i) {
        for (j = 0; j < n_entries_per_block; ++j) {
            if (i == 0) {
                row = fatTable.insertRow(-1);
                cell = row.insertCell(-1);
                if (j % 2 == 0)
                    cell.setAttribute("class", "dark");
                else
                    cell.setAttribute("class", "light");

                if (get_int_at(block_size * (i + 1) + (j * fat_entry_size)) != 4294967295)
                    cell.innerHTML = get_int_at(block_size * (i + 1)
							+ (j * fat_entry_size));
                else
                    cell.innerHTML = "-1";
            } else {
                row = fatTable.childNodes[0].childNodes[j];
                cell = row.insertCell(-1);
                if (j % 2 == 0)
                    cell.setAttribute("class", "dark");
                else
                    cell.setAttribute("class", "light");
                if (get_int_at(block_size * (i + 1) + (j * fat_entry_size)) != 4294967295)
                    cell.innerHTML = get_int_at(block_size * (i + 1)
							+ (j * fat_entry_size));
                else
                    cell.innerHTML = "-1";
            }
            cell.setAttribute("title", "FAT [" + ((block_size / 4) * (i) + j) + "] = " + cell.innerHTML);
        }
    }
}

var sizes = [];
var types = [];
var n_dir_entries;
function parseData() {
    var n_entries;
    dirEntrySize = 0;
    var dataTable = document.getElementById("dataTable");
    var row = dataTable.insertRow(-1);

    numDirEntryAtribs = xml_content.getElementsByTagName("dir_entry")[0]
			.getElementsByTagName("attribute").length;

    var dirEntryAtribs = xml_content.getElementsByTagName("dir_entry")[0]
			.getElementsByTagName("attribute");

    for (i = 0; i < numDirEntryAtribs; ++i) {
        sizes[i] = Number(dirEntryAtribs[i]
				.getElementsByTagName("disk_size_bytes")[0].innerHTML);
        types[i] = dirEntryAtribs[i].getElementsByTagName("type")[0].innerHTML;
        dirEntrySize += sizes[i];
    }
    n_entries = Math.floor(block_size / dirEntrySize);

    for (i = 0; i < n_fat_entries; ++i) {
        cell = row.insertCell(-1);
        cell.innerHTML = "Block " + (i);
    }

    row = dataTable.insertRow(-1);
    var cell;
    var tableID = -1;

    //For to display all blocks
    for (i = (blocks_pointer / block_size) ; i < n_fat_entries
			+ (blocks_pointer / block_size) ; ++i) {
        cell = row.insertCell(-1);
        cell.setAttribute("class", "blockCell");
        cell.setAttribute("id", "b_id_" + (i - (blocks_pointer / block_size)));
        var pos = i * block_size;
        var dir_entry_index;
        n_dir_entries = 1;

        //For to display all the dir_entries in this block
        for (dir_entry_index = 0; dir_entry_index < n_dir_entries && dir_entry_index < n_entries; dir_entry_index++, pos += dirEntrySize) {
            var nextDirEntryType = parseDirEntry(pos);
            if (nextDirEntryType == null) {
                if (dir_entry_index == 0 && scanFullBlock(pos)) {
                    cell.setAttribute("class", "unusedblockCell");
                    cell.innerHTML = "Free Block";
                }
                break;
            } else {
                //Cria a tabela que vai representar a dir_entry
                var div = document.createElement("div");
                div.setAttribute("class", "dirEntryDiv");
                var table = document.createElement("table");
                tableID++;
                table.setAttribute("id", "id_" + tableID);
                table.setAttribute("state", "compacted");
                var dir_entry_data = [5];
                dir_entry_data[4] = tableID;

                //Verifica se a dir_entry é do tipo 'D'
                if (nextDirEntryType == 'D') {
                    table.setAttribute("class", "folderDirEntryTable");
                    dir_entry_data[3] = 'D';
                }
                    //Verifica se a dir_entry é do tipo 'D'
                else if (nextDirEntryType == 'F') {
                    table.setAttribute("class", "fileDirEntryTable");
                    dir_entry_data[3] = 'F';
                }

                    //Se for bloco de Dados
                else {
                    if (dir_entry_index == 0) {
                        cell.setAttribute("class", "dataBlockCell");
                        cell.innerHTML = "File Data";
                        var textDiv = document.createElement('div');
                        textDiv.setAttribute("style", "background-color:lightgray;");
                        var par = document.createElement('p');
                        for (var p = 0; p < block_size; ++p) {
                            if (file_content.charCodeAt(pos + p) > 0 && file_content.charCodeAt(pos + p) < 32)
                                par.innerHTML += "[#" + file_content.charCodeAt(pos + p).toString() + "]";
                            else
                                par.innerHTML += get_char_at(pos + p);
                            if ((par.innerHTML.length % 8) == 0)
                                par.innerHTML += " ";
                        }
                        textDiv.appendChild(par);
                        cell.appendChild(textDiv);
                        break;
                    } else {
                        break;
                    }
                }
                var elem = generateDirEntryTableContents(pos, dir_entry_index, table, dir_entry_data);
                div.appendChild(elem);
                cell.appendChild(div);
            }
        }
        addNFreeDirEntries(dir_entry_index, cell, dirEntrySize);
    }
    generateTree();
}



function generateTree() {
    var tree = createDirEntryTree(0);
    tree.setAttribute("class", "tree");
    document.getElementById('tree').appendChild(tree);
    console.log(dir_entry_list);
}

function addNFreeDirEntries(dir_entry_index, cell, dirEntrySize) {

    if (Math.floor(block_size / dirEntrySize) - dir_entry_index >= 0 && cell.getAttribute("class") == "blockCell") {
        var di = document.createElement("div");
        di.setAttribute("class", "dirEntryDiv");
        var tab = document.createElement("table");
        tab.setAttribute("class", "folderDirEntryTable");
        var ro = tab.insertRow(-1);
        var cel = ro.insertCell(-1);
        cel.innerHTML = (Math.floor(block_size / dirEntrySize) - dir_entry_index) + ' Free Entries';
        cel.setAttribute("class", "freeEntry")
        di.appendChild(tab);
        cell.appendChild(di);
    }
}

function generateDirEntryTableContents(pos, dir_entry_index, table, dir_entry_data) {
    var pointer = 0;
    for (k = 0; k < numDirEntryAtribs; ++k) {
        r = table.insertRow(-1)
        c = r.insertCell(-1);
        c.setAttribute("onclick", "displayFullTable(" + '"' + "id_" + dir_entry_data[4] + '"' + ")");
        if ((k % 2) == 0)
            c.setAttribute("class", "dark");
        c.setAttribute("title", xml_content.getElementsByTagName("dir_entry")[0].getElementsByTagName("attribute")[k].childNodes[1].innerHTML);
        if (types[k] == "char" || types[k] == "unsigned char") {
            p = get_char_at(pos + pointer);
            if (p != 'D' && p != 'F') {
                c.innerHTML = convert_8bits(file_content
                        .charCodeAt(pos + pointer));
                pointer += sizes[k];
            } else {
                c.innerHTML = get_char_at(pos + pointer);
                pointer += sizes[k];
            }
        } else if (types[k] == "int") {
            c.innerHTML = get_int_at(pos + pointer);
            if (xml_content.getElementsByTagName("dir_entry")[0].getElementsByTagName("attribute")[k].getElementsByTagName("name")[0].innerHTML == "first_block") {
                dir_entry_data[1] = getListOfBlocks(get_int_at(pos + pointer));
            }
            if (dir_entry_index == 0 && xml_content.getElementsByTagName("dir_entry")[0].getElementsByTagName("attribute")[k].getElementsByTagName("name")[0].innerHTML == "size") {
                n_dir_entries = get_int_at(pos + pointer);
            }
            pointer += sizes[k];

        } else if (types[k] == "char[]") {
            for (l = 0; l < sizes[k]; ++l) {
                c.innerHTML += get_char_at(pos + pointer);
                pointer++;
            }
            dir_entry_data[0] = c.innerHTML;
        }
        if (dir_entry_values_to_display[k] != true) {
            r.setAttribute("style", "display:none");
            r.setAttribute("toHide", "yes");
        }
        else r.setAttribute("toHide", "no");
    }
    dir_entry_data[2] = Math.floor((pos - blocks_pointer) / block_size);
    dir_entry_list[dir_entry_list.length] = dir_entry_data;
    return table;
}

function getListOfBlocks(pos) {
    var pointer = pos;
    var elems = [];
    elems[0] = pointer;
    for (var i = 1; pointer != 4294967295; ++i) {
        pointer = get_int_at(fat_pointer + (pointer * fat_entry_size));
        if (pointer != 4294967295)
            elems[i] = pointer;
    }
    return elems;
}
var displayed = false;
function displayFolderPrompt() {
    if (displayed == false) {
        displayed = true;
        var option = prompt("Insert the option corresponding digit you want to execute:\n\n" +
            "1 - View the list of occupied blocks in a new tab\n" +
            "2 - Jump to the first block\n" +
            "3 - Jump to the respective dir_entry\n\n" +
            "Don't forget to give this page permissions to open Pop-up windows\n" +
            "in order to allow you to open contents ia a new tab\n\n");
        switch (Number(option)) {
            case 1: displayBlocks(); break;
            case 2: jumpToFirstBlock(); break;
            case 3: jumpToBlock(); break;
            default: alert("INVALID OPTION!\nPLEASE INSERT A DIGIT BETWEEN 1 ~ 3\n");
        }
    }
    return false;
}

function resetVar() {
    displayed = false;
    fileToJumpTo = null;
    folderToJumpTo = null;
    folder_to = [];
    return false;
}

function displayFilePrompt() {
    if (displayed == false) {
        displayed = true;
        var option = prompt("Insert the option corresponding digit you want to execute:\n\n" +
            "1 - View the list of occupied blocks in a new tab\n" +
            "2 - Jump to the first block\n" +
            "3 - Jump to the respective dir_entry\n" +
            "4 - View ASCII content in a new tab\n" +
            "5 - View ASCII content in a new tab divided per blocks\n" +
            "6 - View BINARY content in a new tab divided per blocks\n" +
            "7 - View HEXADECIMAL content in a new tab divided per blocks\n\n" +
            "Don't forget to give this page permissions to open Pop-up windows\n" +
            "in order to allow you to open contents ia a new tab\n\n");
        switch (Number(option)) {
            case 1: displayBlocks(); break;
            case 2: jumpToFirstBlock(); break;
            case 3: jumpToBlock(); break;
            case 4: displayContent('ASCII'); break;
            case 5: displayContent('ASCII DIVIDED'); break;
            case 6: displayContent('BIN'); break;
            case 7: displayContent('HEX'); break;
            default: alert("INVALID OPTION!\nPLEASE INSERT A DIGIT BETWEEN 1 ~ 7\n");
        }
    }
    return false;
}

function createDirEntryTree(depth) {
    var ol = document.createElement("ol");
    for (var i = 0; i < dir_entry_list.length; ++i) {
        if (dir_entry_list[i][2] == depth) {
            if (dir_entry_list[i][0] == ".") {
                var li = document.createElement("li");
                var label = document.createElement("label");
                label.setAttribute("for", dir_entry_list[i][4]);
                label.innerHTML = dir_entry_list[i][0];
                var input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                li.setAttribute("id", dir_entry_list[i][4]);
                li.setAttribute("oncontextmenu", "setFolder(" + li.getAttribute("id") + ");displayFolderPrompt();return false;");
                li.appendChild(label);
                li.appendChild(input);
                ol.appendChild(li);
                var blocks = "";
                for (var k = 0; k < dir_entry_list[i][1].length - 1; ++k)
                    blocks += dir_entry_list[i][1][k].toString() + ", ";
                blocks += dir_entry_list[i][1][dir_entry_list[i][1].length - 1].toString();
                li.setAttribute("title", "Occupied Blocks: [" + blocks + "]");
            }
            if (dir_entry_list[i][0] == "..") {
                var li = document.createElement("li");
                var label = document.createElement("label");
                label.setAttribute("for", dir_entry_list[i][4]);
                label.innerHTML = dir_entry_list[i][0];
                var input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                li.setAttribute("id", dir_entry_list[i][4]);
                li.setAttribute("oncontextmenu", "setFolder(" + li.getAttribute("id") + ");displayFolderPrompt();return false;");
                li.appendChild(label);
                li.appendChild(input);
                ol.appendChild(li);
                var blocks = "";
                for (var k = 0; k < dir_entry_list[i][1].length - 1; ++k)
                    blocks += dir_entry_list[i][1][k].toString() + ", ";
                blocks += dir_entry_list[i][1][dir_entry_list[i][1].length - 1].toString();
                li.setAttribute("title", "Occupied Blocks: [" + blocks + "]");
            }
            if (dir_entry_list[i][1][0] > depth && dir_entry_list[i][3] == 'D') {
                var li = document.createElement("li");
                var label = document.createElement("label");
                label.setAttribute("for", dir_entry_list[i][4]);
                label.innerHTML = dir_entry_list[i][0];
                var input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                li.setAttribute("id", dir_entry_list[i][4]);
                li.setAttribute("oncontextmenu", "setFolder(" + li.getAttribute("id") + ");displayFolderPrompt();return false;");
                li.appendChild(label);
                li.appendChild(input);
                var xpto = createDirEntryTree(dir_entry_list[i][1][0]);
                for (var x = 1; x < dir_entry_list[i][1].length; ++x) {
                    var xp = createDirEntryTree(dir_entry_list[i][1][x]);
                    for (p = 0; p < xp.getElementsByTagName("li").length; ++p) {
                        xpto.appendChild(xp.getElementsByTagName("li")[p]);
                    }
                }
                li.appendChild(xpto);
                var blocks = "";
                for (var k = 0; k < dir_entry_list[i][1].length - 1; ++k)
                    blocks += dir_entry_list[i][1][k].toString() + ", ";
                blocks += dir_entry_list[i][1][dir_entry_list[i][1].length - 1].toString();
                li.setAttribute("title", "Occupied Blocks: [" + blocks + "]");
                ol.appendChild(li);

            }
            else if (dir_entry_list[i][1][0] > depth && dir_entry_list[i][3] == 'F') {
                var li = document.createElement("li");
                li.setAttribute("class", "file");
                var label = document.createElement("label");
                label.innerHTML = dir_entry_list[i][0];
                li.setAttribute("id", dir_entry_list[i][4]);
                li.setAttribute("oncontextmenu", "setFile(" + li.getAttribute("id") + ");displayFilePrompt();return false;");
                li.appendChild(label);
                var blocks = "";
                for (var k = 0; k < dir_entry_list[i][1].length - 1; ++k)
                    blocks += dir_entry_list[i][1][k].toString() + ", ";
                blocks += dir_entry_list[i][1][dir_entry_list[i][1].length - 1].toString();
                li.setAttribute("title", "Occupied Blocks: [" + blocks + "]");
                ol.appendChild(li);
            }
        }
    }
    return ol;
}

function displayFullTable(id) {
    var elem = document.getElementById(id);
    if (elem.getAttribute("state") == "compacted") {
        for (i = 0; i < elem.childNodes[0].childNodes.length; ++i) {
            if (elem.childNodes[0].childNodes[i].getAttribute("toHide") == "yes")
                elem.childNodes[0].childNodes[i].setAttribute("style", "");
        }
        elem.setAttribute("state", "expanded");
    }
    else {
        for (i = 0; i < elem.childNodes[0].childNodes.length; ++i) {
            if (elem.childNodes[0].childNodes[i].getAttribute("toHide") == "yes")
                elem.childNodes[0].childNodes[i].setAttribute("style", "display:none");
        }
        elem.setAttribute("state", "compacted");
    }
}

function parseDirEntry(pos) {
    var c = get_char_at(pos);
    var charCode = file_content.charCodeAt(pos);
    if ((c == 'D') || (c == 'F')) {
        var d = get_char_at(pos + dirEntrySize);
        if (d == 'F' || d == 'D' || (String.fromCharCode(0) == d && isRemainingBlockFree(pos + dirEntrySize)))
            return c;
        else return 'X';
    }
    if (charCode != 0) {
        return 'X'
    } else {
        bool = false;
        if (func(pos) != null)
            return 'X';
    }
    return null;
}

function isRemainingBlockFree(pos) {
    for (var i = pos - (Math.floor(pos / block_size) * block_size) ; i < block_size; ++i)
        if (file_content.charCodeAt(i) != 0) {
            return false;
        }
    return true;
}

function func(pos) {
    var loop = 0;
    while (loop < block_size) {
        if (file_content.charCodeAt(pos + loop) != 0) {
            bool = true;
            return file_content.charCodeAt(pos + loop);
        }
        ++loop;
    }
    return null;
}

function get_int_at(index) {
    var x = convert_8bits(file_content.charCodeAt(index + 3).toString(2))
			+ convert_8bits(file_content.charCodeAt(index + 2).toString(2))
			+ convert_8bits(file_content.charCodeAt(index + 1).toString(2))
			+ convert_8bits(file_content.charCodeAt(index + 0).toString(2));

    return parseInt(x, 2);

}

function get_char_at(index) {
    var x = file_content.charAt(index);

    return x;

}

function convert_8bits(string) {

    switch (string.length) {
        case 1:
            string = "0000000".concat(string);
            break;
        case 2:
            string = "000000".concat(string);
            break;
        case 3:
            string = "00000".concat(string);
            break;
        case 4:
            string = "0000".concat(string);
            break;
        case 5:
            string = "000".concat(string);
            break;
        case 6:
            string = "00".concat(string);
            break;
        case 7:
            string = "0".concat(string);
            break;
    }

    return string;
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var username = getCookie("username");
    if (username != "") {
        alert("Welcome again " + username);
    } else {
        username = prompt("Please enter your name:", "");
        if (username != "" && username != null) {
            setCookie("username", username, 365);
        }
    }
}

function scanFullBlock(pos) {
    for (var i = 0; i < block_size / 4; ++i)
        if (get_int_at(pos) != 0)
            return false;
    return true;
}


var folder_to = [];

function selectElementText(el, win) {
    win = win || window;
    var doc = win.document, sel, range;
    if (win.getSelection && doc.createRange) {
        sel = win.getSelection();
        range = doc.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (doc.body.createTextRange) {
        range = doc.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
}

function displayBlocks() {
    if (fileToJumpTo != null) {
        var text = document.getElementById(fileToJumpTo).getAttribute("title");
        var win = window.open();
        win.document.open();
        win.document.write("<html><body>" + text + "</body></html>");
        win.document.close();
        win.focus();
        fileToJumpTo = null;
    }
    else {
        var text = document.getElementById(folderToJumpTo).getAttribute("title");
        var win = window.open();
        win.document.open();
        win.document.write("<html><body>" + text + "</body></html>");
        win.document.close();
        win.focus();
    }
    folder_to = [];
}

function readBlockContents(index, mode) {
    var text = "";
    if (mode != 'ASCII')
        text = '<strong style="color:white;">SHOWING DATA OF THE BLOCK ' + index + "</strong><br><br>";
    var pointer = blocks_pointer + index * block_size;
    for (var i = 0; i < block_size; ++i) {
        if (mode == 'ASCII') {
            if (file_content.charCodeAt(pointer + i) > 0 && file_content.charCodeAt(pointer + i) < 32)
                text += "[#" + file_content.charCodeAt(pointer + i).toString() + "]";
            else if (file_content.charCodeAt(pointer + i) > 32)
                text += get_char_at(pointer + i);
        }
        else if (mode == 'ASCII DIVIDED') {
            if (file_content.charCodeAt(pointer + i) > 0 && file_content.charCodeAt(pointer + i) < 32)
                text += "[#" + file_content.charCodeAt(pointer + i).toString() + "]";
            else if (file_content.charCodeAt(pointer + i) > 32)
                text += get_char_at(pointer + i);
        }
        else if (mode == 'BIN') {
            text += "<div style='font-family:Consolas;display:inline'>" + convert_8bits(file_content.charCodeAt(pointer + i).toString(2)) + "</div> ";
        }
        else if (mode == 'HEX') {
            text += "<div style='font-family:Consolas;display:inline'>" + normalizeHexVal(file_content.charCodeAt(pointer + i).toString(16)) + "</div> ";
        }
    }
    console.log(text);
    if (mode != 'ASCII')
        text += "<br><br><hr><hr><br>";
    return text;
}

function normalizeHexVal(val) {
    if (val.length == 1)
        return "0" + val;
    else if (val.length == 2)
        return "" + val;
}

function displayContent(mode) {
    if (mode != 'ASCII')
        var text = "<hr><hr><br>";
    else var text = "";
    console.log(fileToJumpTo);
    if (fileToJumpTo != null) {
        for (var i = 0; i < dir_entry_list.length; ++i) {
            if (fileToJumpTo == dir_entry_list[i][4]) {
                for (var j = 0; j < dir_entry_list[i][1].length; ++j)
                    text += readBlockContents(dir_entry_list[i][1][j], mode);
            }
        }
        var win = window.open();
        win.document.open();
        if (mode == 'ASCII DIVIDED')
            win.document.write('<html><body style="background-color:black; color:#0000ff;"><p>' + text + "</p></body></html>");
        else if (mode == 'BIN')
            win.document.write('<html><body style="background-color:black; color:#00ff00;"><p>' + text + "</p></body></html>");
        else if (mode == 'HEX')
            win.document.write('<html><body style="background-color:black; color:#ff0000;"><p>' + text + "</p></body></html>");
        else
            win.document.write("<html><body><p>" + text + "</p></body></html>");
        win.document.close();
        win.focus();
        fileToJumpTo = null;
    }
    folder_to = [];
}

function jumpToBlock() {
    if (fileToJumpTo != null) {
        window.location.hash = "id_" + fileToJumpTo;
        selectElementText(document.getElementById("id_" + fileToJumpTo))
        fileToJumpTo = null;
    }
    else {
        window.location.hash = "id_" + folderToJumpTo;
        selectElementText(document.getElementById("id_" + folderToJumpTo))
    }
    folder_to = [];
}

function jumpToFirstBlock() {
    if (fileToJumpTo != null) {
        for (var i = 0; i < dir_entry_list.length; ++i) {
            if (fileToJumpTo == dir_entry_list[i][4]) {
                window.location.hash = "b_id_" + dir_entry_list[i][1][0];
                selectElementText(document.getElementById("b_id_" + dir_entry_list[i][1][0]));
            }
        }
        fileToJumpTo = null;
    }
    else {
        for (var i = 0; i < dir_entry_list.length; ++i) {
            if (folderToJumpTo == dir_entry_list[i][4]) {
                window.location.hash = "b_id_" + dir_entry_list[i][1][0];
                selectElementText(document.getElementById("b_id_" + dir_entry_list[i][1][0]));
            }
        }
    }
    folder_to = [];

}

function setFolder(folder) {
    folder_to.push(folder);
    folderToJumpTo = folder_to[0];
}
function setFile(file) {
    fileToJumpTo = file;
}