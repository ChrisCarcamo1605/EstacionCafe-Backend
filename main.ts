//Cargamos variables de entorno PRIMERO
require('dotenv').config({ path: './DB_CREDENTIALS.env' });

//Cargamos dependencias
const express = require("express");
const cors = require("cors");
const routes = require("./application/Routes/routes").default;
  
//Creamos el servidor
const app = express();
const port = 3484;

//Configuramos CORS
app.use(cors());

//Covertimos datos del body a objetos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar las rutas del router
app.use('/api', routes);


//Inyectamos dependencias
const {initializeDependencies} = require('./core/dependencyInjection');



initializeDependencies()
  .then(() => {
    console.log("Iniciando servidor...");

    //Poner a escuchar el servidor solo después de que las dependencias estén listas
    app.listen(port, () => {
      console.log(`Servidor corriendo en puerto ${port}`);
    });
  })
  .catch((error: any) => {
    console.error("Error al inicializar la aplicación:", error);
    process.exit(1);
  }); 
