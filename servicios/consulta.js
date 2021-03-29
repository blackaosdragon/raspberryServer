'use strict'
const {ok} = require('../respuestas.js')
const getEquipos = (req,res) => {
    console.log(req.body);
    res.status(ok).send({
        message: `Mensaje recibido`,
        ok: 1
    })
}
module.exports = {
    getEquipos,
}