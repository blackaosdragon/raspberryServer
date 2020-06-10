//let years_in_data_base = document.createElement('option');
let year_options = document.getElementById('year');
let carga_year = document.getElementById('cargaYear');
let boton_envio_year = document.getElementById('botonYear');

let month_options = document.getElementById('month');
let carga_mes = document.getElementById('cargaMes');
let boton_envio_mes_year = document.getElementById('botonMesYear');

//let month_options; 
let day_options = document.getElementById('day'); 
let carga_dia = document.getElementById('cargaDia');
let boton_carga_ubicaciones = document.getElementById('botonUbicaciones');

let sensor_options = document.getElementById('sensor');
let carga_Ubicaciones = document.getElementById('cargaUbicaciones');

let options_horas = document.getElementById('horasDesde');
let options_minutos = document.getElementById('minutosDesde');

let options_horas_hasta = document.getElementById('horasHasta');
let options_minutos_hasta = document.getElementById('minutosHasta');

let datos_consulta = document.getElementById('datos_consulta');

let horas_dia = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
let arreglo_0_60 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59];


//let sensor_options;
let ids = ['year','month','day','sensor'];
//let ip = 'instrumentacionline.ddns.net'
let ip = '192.168.0.13';
let puerto = 5000;
let endpoint = '/consulta';
let endPoint_mes = '/mes';
let endPoint_dia = '/dia';
let endPoint_ubicacion = '/ubicaciones';
let endPoint_consulta = '/buscar';

envioYear = () =>{
    carga_mes.style.visibility = 'visible';
    let year = {year: `${parseInt(year_options.value)}`};

    fetch(`http://${ip}:${puerto}${endPoint_mes}`,{
        method: 'POST',
        body: JSON.stringify(year),
        headers:{
            'Content-Type': 'application/json' 
        }
    }).then(response=>{
        carga_mes.style.visibility = 'collapse';
        return response.json();
    }).then(data=>{
        console.log(data);
        month_options.style.visibility = 'visible';
        carga_mes.style.visibility = 'collapse';
        data.forEach((element,id)=>{
            //console.log('Element: '+element);
            //console.log('id: '+id);
            let month_in_data_base = document.createElement('option');
            month_in_data_base.setAttribute('id',id);
            month_options.appendChild(month_in_data_base);
            month_in_data_base.innerHTML = element;
        })
        boton_envio_mes_year.style.visibility = 'visible';        
    })
}
envioMesYear = (mes,year) => {
    carga_dia.style.visibility = 'visible';
    let info = {year: `${year_options.value}`,mes: `${month_options.value}`}
    console.log("Enviando data: ",info);
    fetch(`http://${ip}:${puerto}${endPoint_dia}`,{
            method: 'POST',
            body: JSON.stringify(info),
            headers:{
                'Content-Type': 'application/json' 
              },
        }).then(response=>{
            return response.json();
        }).then((data)=>{
            console.log(data)
            let day_in_database = null;
            data.forEach((element,id)=>{
                day_in_database = document.createElement('option');
                day_in_database.setAttribute('id',id);
                day_options.appendChild(day_in_database);
                day_in_database.innerHTML = element;
            })
            day_options.style.visibility = 'visible';
            carga_dia.style.visibility = 'collapse';
            boton_carga_ubicaciones.style.visibility = 'visible';
        }).catch( err => {
            console.log("Error: ",err);
        }).then(respuesta=>{
            console.log("Termindo!");
        })
}
cargaUbicaciones = () =>{
    carga_Ubicaciones.style.visibility = 'visible'
    fetch(`http://${ip}:${puerto}${endPoint_ubicacion}`)
    .then(response=>{
        return response.json();
    }).then(data=>{
        console.log(data);
        let ubicaciones_in_database = null;
        data.forEach((element,id)=>{
            ubicaciones_in_database = document.createElement('option');
            ubicaciones_in_database.setAttribute('id',id);
            sensor_options.appendChild(ubicaciones_in_database);
            ubicaciones_in_database.innerHTML = element;

        })
        carga_Ubicaciones.style.visibility = 'collapse';
        sensor_options.style.visibility = 'visible';
        boton_carga_ubicaciones.style.visibility = 'visible';

    })
}
colocar_intervalo_tiempo = (horas,minutos) => {
    let opciones_minutos = null;
    let opciones_horas = null;
    let opciones_horas_hasta = null;
    let opciones_minutos_hasta = null;

    horas.forEach( (element,id) => {
        opciones_horas = document.createElement('option');
        opciones_horas_hasta = document.createElement('option');
        opciones_horas.setAttribute('id',`hora${id}`);
        opciones_horas_hasta.setAttribute('id',`horasHasta${id}`);
        options_horas.appendChild(opciones_horas);
        options_horas_hasta.appendChild(opciones_horas_hasta);
        opciones_horas.innerHTML = element; 
        opciones_horas_hasta.innerHTML = element;
    });
    minutos.forEach( (element,id) => {
        opciones_minutos = document.createElement('option');
        opciones_minutos_hasta = document.createElement('option');
        opciones_minutos.setAttribute('id',`minuto${id}`);
        opciones_minutos_hasta.setAttribute('id',`minutoHasta${id}`);
        options_minutos.appendChild(opciones_minutos);
        options_minutos_hasta.appendChild(opciones_minutos_hasta);
        opciones_minutos.innerHTML = element;
        opciones_minutos_hasta.innerHTML = element;
    })

}
consultarBase = () => {
    let years = parseInt(year_options.value);
    let mes = month_options.value;
    let dia = day_options.value;
    let lugar = sensor_options.value;
    let horas = options_horas.value;
    let minutos = options_minutos.value;
    let hora_final = options_horas_hasta.value;
    let minuto_final = options_minutos_hasta.value;
    //console.log(Number.isInteger(years));
    /*
    if (){
        console.log('Se enviaran los datos');
    } else {
        alert('Los datosingresados son incorrectos, porfavor verifiquelos');
    }*/
    let payload = {
        minutos: minutos,
        horas: horas,
        minutoFinal: minuto_final,
        horaFinal: hora_final,
        year: years,
        mes: mes,
        dia: dia,
        lugar: lugar
    }
    console.log(payload);
    fetch(`http://${ip}:${puerto}${endPoint_consulta}`,{
        method: 'POST',
        body: JSON.stringify(payload),
        headers:{
            'Content-Type': 'application/json' 
          },
    }).then(response=>{return response.json()})
    .then(data=>{
        console.log(data);
        data.forEach( (element,id) => {
            let fila_de_datos = document.createElement('tr');
            datos_consulta.appendChild(fila_de_datos);
            fila_de_datos.innerHTML = `<td class="celda"> ${element.ubicacion} </td><td class="celda"> ${element.temperatura}°C </td><td class="celda"> ${element.fecha} </td>`;
        });
    })
    .catch(err=>console.log(err));

}

fetch(`http://${ip}:${puerto}${endpoint}`).then(response => {
    //console.log(response);
    return response.json();
}).then((data => {
    year_options.style.visibility = 'visible';
    carga_year.style.visibility = 'collapse';
    boton_envio_year.style.visibility = 'visible';
    data.forEach((element,id)=>{
        let year_in_data_base = document.createElement('option');
        year_in_data_base.setAttribute(`id`,id);
        year_options.appendChild(year_in_data_base);
        year_in_data_base.innerHTML = null;
        year_in_data_base.innerHTML = year_in_data_base.innerHTML+element;
    })

})).catch(err=>{console.warn(err)});

asignacion_de_opciones = (elemento,indice,arr) => {
    let opcion_a_elegir = document.createElement('option');
    opcion_a_elegir.setAttribute('id','item');
    //`${ids[0]}`.appendChild()
}
colocar_intervalo_tiempo(horas_dia,arreglo_0_60);
//years_in_data_base.setAttribute('id',`${id}`);
//document.getElementById('year').appendChild(option);