/* 
Configurar previamente las credenciales de acceso a la bdd 
(url, nombre de bdd y apikey) en archivo .env 
puesto en directorio raiz del proyecto


formato .env:
URL=https://xxxxxxxx-bluemix.cloudantnosqldb.appdomain.cloud
DB=nombre_db
IAMAPIKEY=iamapikey
*/
const express = require('express');
const moment = require('moment');

require('dotenv').config()
const fs = require('fs');

const port = process.env.PORT || 3000;

const app = express();

var url = process.env.URL;
var bdd = process.env.DB
var empleados = require('cloudant-quickstart')(url, bdd);
const Cloudant = require("@cloudant/cloudant");

let respuesta = () => {
    // **** Conexión a bdd **** //
    cloudant();
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

            // **** Apuntar a la base previamente creada **** //
            // const db = cloudant.db.use(process.env.DB);

            // **** Imprimir el array de objetos **** //
            // empleados.all().then(console.log);

            // **** Generar archivo .txt con el array de objetos de la bdd **** //
            empleados.all().then((result) => {

                let fecha = moment().format('LLL');
                console.log("Archivo generado con fecha " + fecha);

                fs.writeFile(`dbBackup_${fecha}.txt`, JSON.stringify(result, null, 2), function (err) {
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

    let texto = 'Archivo de backup generado en el servidor!'
    return texto
}

app.get('/', function (req, res) {
    let mensaje = respuesta();
    res.send(mensaje)
})

app.listen(3000, () => {
    console.log(`Servidor en http://localhost:${port}`);
})
