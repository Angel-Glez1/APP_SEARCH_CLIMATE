const fs = require('fs');
const axios = require('axios');

class Busquedas {

    history = [];
    dbPath = './db/database.json';

    constructor() {
        // TODO: Leer Base de datos(Archivos Json)
        this.leerDB();

    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY || '',
            'limit': 5,
            'language': 'es'
        }
    }


    get historialCapitalizado() {
        // TODO poner una el inicio de cada palabra en inicio.

        
        return this.history.map( (l) => {
            let palabra = l.split(' ');
            palabra = palabra.map(p => p[0].toUpperCase().green + p.substring(1));
            return palabra.join(' ');
        })

    }

    async buscarCiudad(lugar = 'Madrid') {
        // TODO: Peticion HTTP
        try {

            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await intance.get();

            // Retornar un arreglo solo con la informacion que necesito.
            return resp.data.features.map(l => ({
                id: l.id,
                nombre: l.place_name,
                lng: l.center[0],
                lat: l.center[1],

            }));

        } catch (err) {
            return []; /** Retorna todas las coincidencias de la busqueda */
        }

    }


    async climaLugar(lat, lon) {
        try {
            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    'lat': lat,
                    'lon': lon,
                    'appid': process.env.OPENWEATHER_KEY,
                    'units': 'metric',
                    'lang': 'es'
                }
            });


            
            const resp = await intance.get();
            
            const { temp, temp_min, temp_max } = resp.data.main;
            const { description } = resp.data.weather[0];
            return {
                temp,
                temp_min,
                temp_max,
                description
            };



        } catch (error) {

            console.log(error);

        }
    }


    agregarHistorial(lugare = '') {
        // Todo: Prevenir duplicados
        if (this.history.includes(lugare.toLocaleLowerCase())) {
            return;
        }
        
        // Limitar a solo 6 resgtros
        this.history = this.history.splice(0, 5);
        // Agregar al pincipio
        this.history.unshift(lugare.toLocaleLowerCase());

        this.saveDB();
        

        
    }


    saveDB() {
        const payload = {
            historial : this.history
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) {
            return;
        }

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
        this.history = data.historial;
    }



}


module.exports = Busquedas;
