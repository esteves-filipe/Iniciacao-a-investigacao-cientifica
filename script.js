var block_size;
var fat_type;
var file_content;
var xml_content;
var fat_pointer = 0;
var blocks_pointer = 0;
var n_fat_entries = 0;
var int_size = 4;
var dir_entry_values_to_display = [];
var dir_entry_list = [];

function displayXMLFields() {
    xml_content = getXMLObject();
    document.getElementById("fatDivWrapper").setAttribute("style", "display:none");
    document.getElementById("dataDivWrapper").setAttribute("style", "display:none");
    document.getElementById("superblock").setAttribute("style", "display:none");
    document.getElementById("myfilesystem").setAttribute("style", "display:none");
    var form;
    for (i = 0; i < xml_content.getElementsByTagName("dir_entry")[0].getElementsByTagName("attribute").length; ++i) {
        var elem = xml_content.getElementsByTagName("dir_entry")[0].getElementsByTagName("attribute")[i].childNodes[1].innerHTML;
        form = document.getElementsByTagName("form")[0];
        var child = document.createElement("input");
        child.setAttribute("type", "checkbox");
        form.innerHTML = form.innerHTML + "<br /><br />" + elem;
        form.appendChild(child);
    }
    var elem = document.createElement("input");
    elem.setAttribute("type", "button");
    elem.setAttribute("value", "Submit");
    elem.setAttribute("onClick", "readFormInput()");
    form.appendChild(elem);
    form.innerHTML = "Select the dir_entry attributes you want to view" + form.innerHTML;
    form.setAttribute("style", "display:inline-block");
}

function readFormInput() {
    var form = document.getElementById("xmlAttributes");
    for (i = 0; i < form.getElementsByTagName("input").length - 1; ++i) {
        dir_entry_values_to_display[i] = form.getElementsByTagName("input")[i].checked;
    }
    document.getElementsByTagName("form")[0].setAttribute("style", "display:none");
    document.getElementById("myfilesystem").setAttribute("style", "display:inline-block");
}

function readFilesystemFile() {

    document.getElementById("superblock").setAttribute("style", "display:inline-block");
    document.getElementById("fatDivWrapper").setAttribute("style", "display:inline-bock");
    document.getElementById("dataDivWrapper").setAttribute("style", "display:inline-block");
    document.getElementsByTagName("form")[0].setAttribute("style", "display:none");
    document.getElementById("myfilesystem").setAttribute("style", "display:none");
    var filesysInput = document.getElementById('myfilesystem');
    var filesysReader = new FileReader();

    filesysReader.onload = function (e) {
        file_content = e.target.result;
        parseSuperblock();
        parseFAT();
        parseData();
    };

    filesysInput.onchange = function (e) {
        file = this.files[0];
        filesysReader.readAsBinaryString(file);
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
			+ ((n_fat_entries * int_size) / block_size) * block_size;

}

function parseFAT() {
    var fatTable = document.getElementById("fatTable");
    var n_blocks_fat = (n_fat_entries * int_size) / block_size;
    var n_entries_per_block = block_size / int_size;

    for (i = 0; i < n_blocks_fat; ++i) {
        for (j = 0; j < n_entries_per_block; ++j) {
            if (i == 0) {
                row = fatTable.insertRow(-1);
                cell = row.insertCell(-1);
                cell.setAttribute("title", (block_size / 4) * (i) + j);
                if (j % 2 == 0)
                    cell.setAttribute("class", "dark");
                else
                    cell.setAttribute("class", "light");

                if (get_int_at(block_size * (i + 1) + (j * int_size)) != 4294967295)
                    cell.innerHTML = get_int_at(block_size * (i + 1)
							+ (j * int_size));
                else
                    cell.innerHTML = "-1";
            } else {
                row = fatTable.childNodes[0].childNodes[j];
                cell = row.insertCell(-1);
                cell.setAttribute("title", ((block_size / 4) * (i) + j));
                if (j % 2 == 0)
                    cell.setAttribute("class", "dark");
                else
                    cell.setAttribute("class", "light");
                if (get_int_at(block_size * (i + 1) + (j * int_size)) != 4294967295)
                    cell.innerHTML = get_int_at(block_size * (i + 1)
							+ (j * int_size));
                else
                    cell.innerHTML = "-1";
            }
        }
    }
}

function parseData() {

    var sizes = [];
    var types = [];
    var dirEntrySize = 0;
    var n_entries = Math.floor(block_size / dirEntrySize);
    var dataTable = document.getElementById("dataTable");

    var numDirEntryAtribs = xml_content.getElementsByTagName("dir_entry")[0]
			.getElementsByTagName("attribute").length;

    var dirEntryAtribs = xml_content.getElementsByTagName("dir_entry")[0]
			.getElementsByTagName("attribute");

    for (i = 0; i < numDirEntryAtribs; ++i) {
        sizes[i] = Number(dirEntryAtribs[i]
				.getElementsByTagName("disk_size_bytes")[0].innerHTML);
        types[i] = dirEntryAtribs[i].getElementsByTagName("type")[0].innerHTML;
        dirEntrySize += sizes[i];
    }
    var row = dataTable.insertRow(-1);
    for (i = 0; i < n_fat_entries; ++i) {
        cell = row.insertCell(-1);
        cell.innerHTML = "Block " + (i);
    }

    row = dataTable.insertRow(-1);
    var tableID = -1;
    for (i = (blocks_pointer / block_size) ; i < n_fat_entries
			+ (blocks_pointer / block_size) ; ++i) {
        var cell = row.insertCell(-1);
        cell.setAttribute("class", "blockCell");
        var pos = i * block_size;
        for (j = 0; j < n_entries; j++, pos += dirEntrySize) {
            if (parseDirEntry(pos) == null) {
                if (j == 0) {
                    cell.setAttribute("class", "unusedblockCell");
                    cell.innerHTML = "Free Block";
                }
                break;
            } else {
                var div = document.createElement("div");
                div.setAttribute("class", "dirEntryDiv");
                var table = document.createElement("table");
                tableID++;
                table.setAttribute("id", "id_" + tableID);
                table.setAttribute("state", "compacted");
                var nextDirEntryType = parseDirEntry(pos);
                var x = [4];
                if (nextDirEntryType == 'D') {
                    table.setAttribute("class", "folderDirEntryTable");
                    x[3] = 'D';
                }
                else if (nextDirEntryType == 'F') {
                    table.setAttribute("class", "fileDirEntryTable");
                    x[3] = 'F';
                }

                else {
                    if (j == 0) {
                        cell.setAttribute("class", "dataBlockCell");
                        cell.innerHTML = "File Data";
                        break;
                    } else {
                        break;
                    }
                }
                var pointer = 0;
                for (k = 0; k < numDirEntryAtribs; ++k) {
                    r = table.insertRow(-1)
                    c = r.insertCell(-1);
                    c.setAttribute("onclick", "displayFullTable(" + '"' + "id_" + tableID + '"' + ")");
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
                            x[1] = get_int_at(pos + pointer);
                        }
                        pointer += sizes[k];

                    } else if (types[k] == "char[]") {
                        for (l = 0; l < sizes[k]; ++l) {
                            c.innerHTML += get_char_at(pos + pointer);
                            pointer++;
                        }
                        x[0] = c.innerHTML;
                    }
                    if (dir_entry_values_to_display[k] != true) {
                        r.setAttribute("style", "display:none");
                        r.setAttribute("toHide", "yes");
                    }
                    else r.setAttribute("toHide", "no");
                }
                x[2] = Math.floor(pos / block_size) -9;
                dir_entry_list[dir_entry_list.length] = x;
                div.appendChild(table);
            }
            cell.appendChild(div);
        }
    }
    console.log(dir_entry_list);
    var tree =createDirEntryTree(0);
    tree.setAttribute("class", "tree");
    document.getElementById('tree').appendChild(tree);
}

function createDirEntryTree(depth) {
    var ol = document.createElement("ol");
    for (var i = 0; i < dir_entry_list.length; ++i) {
        if (dir_entry_list[i][2] == depth) {
            if (dir_entry_list[i][0] == ".") {
                var li = document.createElement("li");
                var label = document.createElement("label");
                label.setAttribute("for", dir_entry_list[i][0]);
                label.innerHTML = dir_entry_list[i][0];
                var input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                input.setAttribute("id", dir_entry_list[i][0]);
                li.appendChild(label);
                li.appendChild(input);
                ol.appendChild(li);
            }
            if (dir_entry_list[i][0] == "..") {
                var li = document.createElement("li");
                var label = document.createElement("label");
                label.setAttribute("for", dir_entry_list[i][0]);
                label.innerHTML = dir_entry_list[i][0];
                var input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                input.setAttribute("id", dir_entry_list[i][0]);
                li.appendChild(label);
                li.appendChild(input);
                ol.appendChild(li);
            }
            if (dir_entry_list[i][1] > depth && dir_entry_list[i][3] == 'D') {
                var li = document.createElement("li");
                var label = document.createElement("label");
                label.setAttribute("for", dir_entry_list[i][0]);
                label.innerHTML = dir_entry_list[i][0];
                var input = document.createElement("input");
                input.setAttribute("type","checkbox");
                input.setAttribute("id", dir_entry_list[i][0]);
                li.appendChild(label);
                li.appendChild(input);
                li.appendChild(createDirEntryTree(dir_entry_list[i][1]));
                ol.appendChild(li);
            }
            else if (dir_entry_list[i][1] > depth && dir_entry_list[i][3] == 'F') {
                var li = document.createElement("li");
                li.setAttribute("class", "file");
                var a = document.createElement("a");
                a.setAttribute("href", "");
                a.innerHTML = dir_entry_list[i][0];
                li.appendChild(a);
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
        return c;
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
