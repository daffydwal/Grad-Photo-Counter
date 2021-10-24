
const uploadForm = document.querySelector('#uploadForm');
const csvFile = document.querySelector('#csvFile');
const fullList = localforage.createInstance({name: 'FullList'});
const cereName = document.querySelector('#cereName');
const cereList = document.querySelector('#ceremoniesList');
const cereSelectForm = document.querySelector('#ceremonySelector');
const studentNameDisplay = document.querySelector('#studName');
const listOfPhotosDisplay = document.querySelector('#listOfPhotos');
let listOfStudents;

populateCeremoniesList();

let studentList = [];
let photoNum= 1;
let currentStudentKey = '';
let currentStudentName = '';
let currentStudentNum = '';
let currentIndex = 0;
let currentPhotos = [];
let db;
let ceremonyStarted = false;

//**********
//
//event listeners
//
//**********

uploadForm.addEventListener('submit', function (e){
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        studentList = csvToArray(text);
        listCeremonyDB(cereName.value);
    };
    reader.readAsText(input);
})

cereSelectForm.addEventListener('submit', function(e){
    e.preventDefault();

    const selected = cereList.value;

    db = localforage.createInstance({name: selected});
    const listBox = document.querySelector('#list')
    const list = document.createElement('ul');
    listBox.textContent = '';
    db.iterate(function (value, key, i){
        const item = document.createElement('li');
        item.textContent = i + '  -  ' + value.Name;
        list.appendChild(item);
    })

    listBox.appendChild(list);
    orderedList = listBox.firstChild;
    listOfStudents = orderedList.childNodes;
    studentNameDisplay.textContent = 'Pre-student photos...'
})

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 't':
            takePhoto();
            break;
        case 'Enter':
            if(ceremonyStarted){
                addAndMove();
            }else{
                setStudent();
                currentPhotos = [];
                ceremonyStarted = true;
                listOfStudents[currentIndex].classList.add('selected');
            }
            break;
    }
})

// ****************
//
// functions
//
// ****************

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
            fullList.setItem(dbName, dbName).then(function(){populateCeremoniesList();});
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

function populateCeremoniesList(){
    cereList.innerHTML = '';
    fullList.iterate(function(value, key, iterationNumber){
        item = document.createElement('option');
        item.value = value;
        item.textContent = value;
        cereList.appendChild(item);
    })
}

function takePhoto(){
    currentPhotos.push(photoNum);
    listOfPhotosDisplay.textContent += photoNum + "  "
    photoNum++;
}

function setStudent(){
    db.key(currentIndex).then(function (keyName){
        currentStudentKey = keyName;
        db.getItem(keyName).then(function (value){
            currentStudentName = value.Name;
            currentStudentNum = value.StudNum;
            studentNameDisplay.textContent = currentStudentName;
            listOfPhotosDisplay.textContent = '';
            currentPhotos = [];
        })
    })
}

function addAndMove(){
    db.setItem(currentStudentKey, {Name: currentStudentName, StudNum: currentStudentNum, photos: currentPhotos}).then(function (){
        listOfStudents[currentIndex].classList.remove('selected');
        currentIndex++;
        listOfStudents[currentIndex].classList.add('selected');
        setStudent();
    })
}