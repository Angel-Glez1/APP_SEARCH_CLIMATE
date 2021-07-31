require('dotenv').config();
const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/Busquedas');

const main = async () => {
    let opt;
    const busqueda = new Busquedas();

    //TODO: Mostramos la interfaz de forma infinit...
    do {

        // TODO: Imprimir Menu... 
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostar input 
                const ciudad = await leerInput('¿Que Ciudad Estas Buscando?'.green);

                // Hacer la busqueda.
                const lugares = await busqueda.buscarCiudad(ciudad);

                // Seleccionar una opcion.
                const id_select = await listarLugares(lugares);

                // Mostar clima.
                if (id_select) {

                    console.log('Cargando....'.green);

                    const { nombre, lng, lat } = lugares.find(l => l.id === id_select);
                    const { temp, temp_min, temp_max, description } = await busqueda.climaLugar(lat, lng);
                    busqueda.agregarHistorial(nombre);

                    console.clear();
                    console.log('\nInformacion de la ciudad\n'.green);
                    console.log(`Ciudad : ${ nombre }`);
                    console.log(`Lat : ${lat}`);
                    console.log(`Log : ${lng}`);
                    console.log(`Temp : ${temp}`);
                    console.log(`Temp Min : ${temp_min}`);
                    console.log(`Temp Max : ${temp_max}`);
                    console.log('Descripcion:', description);

                }

            break;
        
            case 2:

                busqueda.historialCapitalizado.forEach((l,i) => {
                    const idx = `${i + 1}`.green;
                    console.log(`${idx} ${l}`);
                })
                
                
                
            break;
        
        }


        if (opt !== 0) await pausa();

    } while (opt !== 0);

}

main();
