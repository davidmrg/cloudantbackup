/* 

Configurar previamente las credenciales de acceso a la bdd 
(url, nombre de bdd y apikey) en archivo .env 
puesto en directorio raiz del proyecto


formato .env:
URL=https://xxxxxxxx-bluemix.cloudantnosqldb.appdomain.cloud
DB=nombre_db
IAMAPIKEY=iamapikey

*/

require('dotenv').config()
const fs = require('fs');

var url = process.env.URL;
var bdd = process.env.DB
var empleados = require('cloudant-quickstart')(url, bdd);

const Cloudant = require("@cloudant/cloudant");
cloudant();

// **** Conexión a bdd **** //
async function cloudant() {

    console.log('---- Prueba Conexión a Cloudant desde Node ----');
    try {
        console.log("Estableciendo Conexión con Cloudant...");
        const cloudant = Cloudant({
            url: process.env.URL,
            plugins: {
                iamauth: {
                    iamApiKey: process.env.IAMAPIKEY
                }
            }
        })
        console.log("Conexión establecida");
        console.log("Obteniendo las BDDs Cloudant...");

        let allDB = await cloudant.db.list();
        console.log(`Cloudand DBs: [${allDB}]`);

        // **** Apuntar a la base "offboarding" previamente creada **** //
        const db = cloudant.db.use(process.env.DB);

        // Imprimir el array de objetos 
        // empleados.all().then(console.log);

        // Generar archivo .txt con el array de objetos de la bdd
        empleados.all().then((result) => {

            // TimeStamp
            let date_ob = new Date();

            // current date
            // adjust 0 before single digit date
            let date = ("0" + date_ob.getDate()).slice(-2);

            // current month
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

            // current year
            let year = date_ob.getFullYear();

            // current hours
            let hours = date_ob.getHours();

            // current minutes
            let minutes = date_ob.getMinutes();

            // current seconds
            let seconds = date_ob.getSeconds();

            // prints date in YYYY-MM-DD format
            // console.log(year + "-" + month + "-" + date);

            // prints date & time in YYYY-MM-DD HH:MM:SS format
            // console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
            
            var ts = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            // prints time in HH:MM format
            // console.log(hours + ":" + minutes);

            console.log("Archivo generado el " + ts);

            fs.writeFile(`queryOffboarding_${ts}.txt`, JSON.stringify(result, null, 2), function (err) {
                if (err) {
                    return console.log(err);
                }
            });

        }).catch((error) => {
            console.log(error);
        });

    } catch (error) {
        console.log(error);
    }
}