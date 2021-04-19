'use strict'
const llamada_a_bd = require('../querys.js')
const {ok,failed} = require('../respuestas.js')
const id_length = 3;
const getEquipos = (req,res) => {
    //console.log(req.body);
    llamada_a_bd.getMesas().then( data => {
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
const obtenerEquipos = (req,res) => {
    const {payload,unidad,level} = req.body.payload
    llamada_a_bd.busqueda(unidad,payload,level).then( data => {
        console.log(data);
        let payload = {
            data: data,
            status: ok
        }
        res.status(ok).send(payload)
    }).catch ( err => {
        console.log(err);
        let fallido = {
            error: err,
            status: failed
        }
        res.status(failed).send(fallido);
    })
    // if(payload.length>id_length){
    //     llamada_a_bd.busqueda(unidad,payload,level)
    // } else {

    // }

}
module.exports = {
    getEquipos,
    getMesas,
    obtenerEquipos
}
