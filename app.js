const uploadForm = document.querySelector('#uploadForm');
const csvFile = document.querySelector('#csvFile');
const fullList = localforage.createInstance({name: 'FullList'});
const cereName = document.querySelector('#cereName');
const cereList = document.querySelector('#ceremoniesList');
const cereSelectForm = document.querySelector('#ceremonySelector');

populateCeremoniesList();

let studentList = [];

// event listeners

uploadForm.addEventListener('submit', function (e){
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        studentList = csvToArray(text);
        //studentsToList(studentList);
        listCeremonyDB(cereName.value);
    };
    reader.readAsText(input);
})

cereSelectForm.addEventListener('submit', function(e){
    e.preventDefault();

    const selected = cereList.value;

    const db = localforage.createInstance({name: selected});
    const ListBox = document.querySelector('#list')
    const list = document.createElement('ol');
    ListBox.textContent = '';
    db.iterate(function (value, key, i){
        const item = document.createElement('li');
        item.textContent = 'Name: ' + value.Name + ',   Student Number: ' + value.StudNum;
        list.appendChild(item);
    })

    ListBox.appendChild(list);
    
})


//functions be here

function createCeremonyDB(dbName){
    const db = localforage.createInstance({name: dbName});
    let ittNum = "1000";
    studentList.forEach(item =>{
        db.setItem(ittNum, {StudNum: item.StudNum, Name: item.Name}).then(function (){});
        ittNum++
        ittNum = ittNum.toString();
    })

}

function listCeremonyDB(dbName){
    fullList.getItem(dbName, function (err, value){
        if (value !== null){
            alert(value + ' already exists!');
            return;
        }else{
            fullList.setItem(dbName, dbName)
            createCeremonyDB(dbName);
        }
    })
}

function csvToArray(str, delimiter = ","){
    const headers = str.slice(0, str.indexOf("\r")).split(delimiter);
    const rows = str.slice(str.indexOf('\n') + 1).split("\r\n");

    const arr = rows.map(function (row){
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index){
            object[header] = values[index];
            return object;
        }, {});
        return el;
    })

    return arr;
}

function studentsToList (array){
    const ListBox = document.querySelector('#list')
    const list = document.createElement('ol');

    array.forEach(student => {
        const item = document.createElement('li');
        item.textContent = student.Name + ': ' + student.StudNum;
        list.appendChild(item);
    });

    ListBox.appendChild(list);
}

function populateCeremoniesList(){
    fullList.iterate(function(value, key, iterationNumber){
        item = document.createElement('option');
        item.value = value;
        item.textContent = value;
        cereList.appendChild(item);
    })
}