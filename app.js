//const localforage = require("localforage");

//console.log('Localforage is: ', localforage)

const theForm = document.querySelector('#theForm');
const csvFile = document.querySelector('#csvFile');

let studentList = [];

theForm.addEventListener('submit', function (e){
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        studentList = csvToArray(text);
        studentsToList(studentList);
    };

    reader.readAsText(input);
})


//functions be here

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