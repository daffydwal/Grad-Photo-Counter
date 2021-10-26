let port;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;

navigator.serial.addEventListener("disconnect", (event) => {
    console.log('Lost connection to serial.')
    if(serialMessage.classList.contains('connected')){
        serialMessage.classList.remove('connected');
    }
    serialMessage.textContent = 'CAMERA CONNECTION LOST';
    serialMessage.classList.add('warning');
  });

  navigator.serial.addEventListener("connect", (event) => {
    console.log('Serial has returned')
    serialMessage.textContent = '<<<CAMERA FOUND: PLEASE CONNECT';
  });

async function connect(){
    port = await navigator.serial.requestPort();
    await port.open({baudRate: 9600});
    serialMessage.textContent = 'Camera connected'
    if(serialMessage.classList.contains('warning')){
        serialMessage.classList.remove('warning');
    }
    serialMessage.classList.add('connected');
    let decoder = new TextDecoderStream();
    inputDone = port.readable.pipeTo(decoder.writable);
    inputStream = decoder.readable;

    reader = inputStream.getReader();
    readLoop();
}

async function readLoop(){
    try {
        while(true){
            const { value, done } = await reader.read();

            if(done) {
                reader.releaseLock();
                break;
            }

            if (value){
                takePhoto(value);
            }
        }
    } catch (error) {
        console.log('There was an error! ' + error);
    }

    //console.log(value)
}