const express = require('express');
const app = express();
const SerialPort = require('serialport');
const puerto = 3001;
const server = app.listen(puerto,()=>{
    console.log(`Server corriendo en el puerto ${puerto}`);
});
const io = require('socket.io')(server);

const ReadLine = SerialPort.parsers.Readline;
const port = new SerialPort('dev/ttyUSB0');
const parser = port.pipe(new ReadLine({delimiter: '\n\r'}));

parser.on('data', temp => {
    io.emit('temp',temp => {
        console.log(temp)
    });
})



