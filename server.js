const Ws = require('ws');
const express = require('express');

const page = express();

const wsPort = 5001;
const pagePort = 5000;


const wss = new Ws.Server({port: wsPort});

page.use('/',express.static(__dirname+'/home'))

page.listen(pagePort);



