'use strict'
const llamada_a_bd = require('../querys.js')
const {ok,failed} = require('../respuestas.js')
const getCamas = (req,res) => {
    //console.log(req.body);
    llamada_a_bd.getCamas().then( data => {
        //console.log(data);
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
const getMesas = (req,res) => {
    const {usuario,equipos,unidad} = req.body
    //console.log(`Usuario: ${usuario} Equipo: ${equipos} Unidad: ${unidad}`)
    llamada_a_bd.getEquipos(unidad,equipos).then( respuesta => {
        let payload = {
            ok: 1,
            data: respuesta
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
    // let respuesta = {
    //     ok: "respuesta recibida"
    // }
    // res.status(ok).send(respuesta);
}
module.exports = {
    getCamas,
    getMesas
}
