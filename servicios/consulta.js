'use strict'
const llamada_a_bd = require('../querys.js')
const {ok,failed} = require('../respuestas.js')
const getEquipos = (req,res) => {
    console.log(req.body);
    llamada_a_bd.getEquipos().then( data => {
        console.log(data);
        let payload = {
            ok: 1,
            data: data,

        }
        res.status(ok).send(payload);
    }).catch( err => {
        console.log(err);
        let payload = {
            ok: 0,
            message: err
        }
        res.status(failed).send(payload);
    })
    /*
    res.status(ok).send({
        message: `Mensaje recibido`,
        ok: 1
    })
    */
}
module.exports = {
    getEquipos,
}