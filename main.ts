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
const {initializeDependencies} = require('./application/dependencyInjection');
initializeDependencies();


//Poner a escuchar el servidor (que se mantenga activo y no cierre la app)
app.listen(port, () => {
  console.log("Corriendo API...");
});
