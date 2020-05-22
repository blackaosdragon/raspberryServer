const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
let port = new SerialPort('/dev/ttyUSB0');
let parser = port.pipe(new Readline({delimiter: '\r\n'}));

parser.on('data',data=>{
    console.log(data);
})