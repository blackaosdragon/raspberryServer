'use strict'

const express = require('express');
const servicios = require('../servicios/consulta.js');

const api = express.Router();

api.post('./ginecologia/3a/mesas',servicios.getEquipos);