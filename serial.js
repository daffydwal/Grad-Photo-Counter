let port;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;

async function connect(){
    port = await navigator.serial.requestPort();
    await port.open({baudRate: 9600});

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