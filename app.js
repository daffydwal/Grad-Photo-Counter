
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
let currentIndex = -1;
let currentPhotos = [];
let studentsDB;
let photosDB;
let ceremonyStarted = false;
let finishedStudents = [];

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

    studentsDB = localforage.createInstance({name: selected, storeName: 'ListOfStudents'});
    photosDB = localforage.createInstance({name: selected, storeName: 'Photos'})
    const listBox = document.querySelector('#list')
    const list = document.createElement('ul');
    listBox.textContent = '';
    studentsDB.iterate(function (value, key, i){
        const item = document.createElement('li');
        item.textContent = i + '  -  ' + value.Name;
        list.appendChild(item);
    })

    listBox.appendChild(list);
    orderedList = listBox.firstChild;
    listOfStudents = orderedList.childNodes;
    studentNameDisplay.textContent = 'Pre-student photos...'
    currentStudentNum = '000000'
    currentStudentName = 'Pre-students'
    ceremonyStarted = true;
})

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 't':
            e.preventDefault();
            takePhoto();
            break;
        case 'Enter':
            e.preventDefault();
            if(ceremonyStarted){
                addAndMove();
            }else{
                return;
            }
            break;
        case 'ArrowDown':
            e.preventDefault();
            selectDown();
            break;
        case 'ArrowUp':
            e.preventDefault();
            selectUp();
            break;
    }
})

// ****************
//
// functions
//
// ****************

function createCeremonyDB(dbName){
    studentsDB = localforage.createInstance({name: dbName, storeName: 'ListOfStudents'});
    let ittNum = "1000";
    studentList.forEach(item =>{
        studentsDB.setItem(ittNum, {StudNum: item.StudNum, Name: item.Name}).then(function (){});
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
    let photoNumString = photoNum.toString();
    photoNumString = photoNumString.padStart(4, '0');
    currentPhotos.push(photoNumString);
    listOfPhotosDisplay.textContent += photoNumString + ",  "
    photoNum++;
}

function setStudent(){
    studentsDB.key(currentIndex).then(function (keyName){
        currentStudentKey = keyName;
        studentsDB.getItem(keyName).then(function (value){
            currentStudentName = value.Name;
            currentStudentNum = value.StudNum;
            studentNameDisplay.textContent = currentStudentName;
            listOfPhotosDisplay.textContent = '';
            currentPhotos = [];
        })
    })
}


function addAndMove(){
    let i = 0
    while(i < currentPhotos.length -1){
        photosDB.setItem(currentPhotos[i], {Name: currentStudentName, StudNum: currentStudentNum})
        i++
    };

    if(currentPhotos.length > 0){
        photosDB.setItem(currentPhotos[i], {Name: currentStudentName, StudNum: currentStudentNum}).then(function (){
            finishedStudents.push(currentIndex);
            if(currentIndex >= 0){
                listOfStudents[currentIndex].classList.remove('selected');
                listOfStudents[currentIndex].classList.add('hidden');
            }
            currentIndex++;
            while(finishedStudents.includes(currentIndex)){currentIndex++};
            listOfStudents[currentIndex].classList.add('selected');
            setStudent();
        })
    }else{
        finishedStudents.push(currentIndex);
        if(currentIndex >= 0){
            listOfStudents[currentIndex].classList.remove('selected');
            listOfStudents[currentIndex].classList.add('hidden');
        }
        currentIndex++;
        while(finishedStudents.includes(currentIndex)){currentIndex++};
        listOfStudents[currentIndex].classList.add('selected');
        setStudent();
    }
}

function selectDown(){
    if(currentIndex +1 >= listOfStudents.length){return;};
    listOfStudents[currentIndex].classList.remove('selected');
    currentIndex++;
    while(finishedStudents.includes(currentIndex)){currentIndex++};
    listOfStudents[currentIndex].classList.add('selected');

    setStudent();
}

function selectUp(){
    if(currentIndex == 0){return;}
    listOfStudents[currentIndex].classList.remove('selected');
    currentIndex--;
    while(finishedStudents.includes(currentIndex)){currentIndex--};
    listOfStudents[currentIndex].classList.add('selected');

    setStudent();
}