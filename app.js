
const uploadForm = document.querySelector('#uploadForm');
const csvFile = document.querySelector('#csvFile');
const fullList = localforage.createInstance({name: 'FullList'});
const cereName = document.querySelector('#cereName');
const cereList = document.querySelector('#ceremoniesList');
const cereSelectForm = document.querySelector('#ceremonySelector');
const studentNameDisplay = document.querySelector('#studName');
const listOfPhotosDisplay = document.querySelector('#listOfPhotos');
const serialMessage = document.querySelector('#serialMessage');
const addBtn = document.querySelector('#addBtn');
const loadBtn = document.querySelector('#loadBtn');
const exportBtn = document.querySelector('#exportBtn');
const connBtn = document.querySelector('#connBtn');
const loadedCountTxt = document.querySelector('#loadedCount');
const finishedCountTxt = document.querySelector('#finishedCount');
let listOfStudents;

populateCeremoniesList();

let studentList = [];
let tempPhotoNum = '';
let currentStudentKey = '';
let currentStudentName = '';
let currentStudentNum = '';
let currentIndex = -1;
let currentPhotos = [];
let studentsDB;
let photosDB;
let loadedCereName;
let ceremonyStarted = false;
let studentIsUnknown = false;
let finishedStudents = [];
let totalFinished = -1;

//**********
//
//event listeners
//
//**********

addBtn.addEventListener('click', function(){
    if(uploadForm.classList.contains('hidden')){
        uploadForm.classList.remove('hidden');
    }else{
        uploadForm.classList.add('hidden');
    }
})

loadBtn.addEventListener('click', function(){
    if(cereSelectForm.classList.contains('hidden')){
        cereSelectForm.classList.remove('hidden');
    }else{
        cereSelectForm.classList.add('hidden');
    }
})

exportBtn.addEventListener('click', function(){
    exportPhotos();
})

connBtn.addEventListener('click', function(){
    connect();
})

uploadForm.addEventListener('submit', function (e){
    e.preventDefault();
    if(!cereName.value){alert("Please enter a name"); return;}
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
    loadedCereName = selected;
    const listBox = document.querySelector('#list')
    const list = document.createElement('ul');
    listBox.textContent = '';
    studentsDB.iterate(function (value, key, i){
        const item = document.createElement('li');
        item.textContent = i + '  -  ' + value.Name;
        list.appendChild(item);
    }).then(function () {

        listBox.appendChild(list);
        orderedList = listBox.firstChild;
        listOfStudents = orderedList.childNodes;
        studentNameDisplay.textContent = 'Pre-student photos...'
        currentStudentNum = '000000'
        currentStudentName = 'Pre-students'
        ceremonyStarted = true;
        cereSelectForm.classList.add('hidden');
        loadedCountTxt.textContent = listOfStudents.length;
    })
})

document.addEventListener('keydown', (e) => {
    switch (e.key) {
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
        case 'u':
            unknownStudent();
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
            uploadForm.classList.add('hidden');
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

function takePhoto(num){
    console.log("Received: " + num);
    tempPhotoNum += num.toString();
    if (!tempPhotoNum.includes('$')){
        return;
    }
    let photoNumString = tempPhotoNum.slice(0, -1).padStart(4, '0');
    currentPhotos.push(photoNumString);
    const p = document.createElement('p');
    p.textContent = photoNumString;
    listOfPhotosDisplay.appendChild(p);
    tempPhotoNum = '';
}

function setStudent(clear){
    studentsDB.key(currentIndex).then(function (keyName){
        currentStudentKey = keyName;
        studentsDB.getItem(keyName).then(function (value){
            currentStudentName = value.Name;
            currentStudentNum = value.StudNum;
            studentNameDisplay.textContent = currentStudentName;
            if(clear){
                listOfPhotosDisplay.textContent = '';
                currentPhotos = [];
            }
        })
    })
}


function addAndMove(){
    totalFinished = totalFinished+1;
    finishedCountTxt.textContent = totalFinished;
    
    let i = 0
    while(i < currentPhotos.length -1){
        photosDB.setItem(currentPhotos[i], {Name: currentStudentName, StudNum: currentStudentNum})
        i++
    };

    if(currentPhotos.length > 0){
        photosDB.setItem(currentPhotos[i], {Name: currentStudentName, StudNum: currentStudentNum}).then(function (){
            moveOn();
        })
    }else{
        moveOn();
    }
}

function moveOn(){
    if(studentIsUnknown){studentIsUnknown = false; setStudent(true); return;}
    finishedStudents.push(currentIndex);
    if(currentIndex >= 0){
        listOfStudents[currentIndex].classList.remove('selected');
        listOfStudents[currentIndex].classList.add('hidden');
    }
    currentIndex++;
    if (currentIndex >= listOfStudents.length){ceremonyStarted = false; return;}
    while(finishedStudents.includes(currentIndex)){currentIndex++};
    listOfStudents[currentIndex].classList.add('selected');
    setStudent(true);
}

function selectDown(){
    if(currentIndex +1 >= listOfStudents.length){return;};
    listOfStudents[currentIndex].classList.remove('selected');
    currentIndex++;
    while(finishedStudents.includes(currentIndex)){currentIndex++};
    listOfStudents[currentIndex].classList.add('selected');

    setStudent(false);
}

function selectUp(){
    if(currentIndex == 0){return;}
    listOfStudents[currentIndex].classList.remove('selected');
    currentIndex--;
    while(finishedStudents.includes(currentIndex)){
        if(currentIndex <= 0){return;}
        currentIndex--;
    };
    listOfStudents[currentIndex].classList.add('selected');

    setStudent(false);
}

function unknownStudent(){
    studentIsUnknown = true;
    currentStudentName = 'Unknown';
    currentStudentNum = '111111';
    studentNameDisplay.textContent = 'Unknown Student';
}

function exportPhotos(){
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += 'PhotoNum,Name,StudNum\r\n'
    photosDB.iterate(function (value, key, iNum){
        const row = 'IMG_' + key + ',' + value.Name + ',' + value.StudNum + '\r\n';
        csvContent += row;
    }).then(function(){
        const encodedUri = encodeURI(csvContent);
        let link = document.createElement('a');
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", loadedCereName + " Photos.csv");
        document.body.appendChild(link);
        link.click();
        console.log('Got to the end')
    })
}