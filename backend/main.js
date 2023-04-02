const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const productosController = require('./controllers/productos.controller');
const provedoresController = require('./controllers/provedores.controller');
const categoriasController = require('./controllers/categorias.controller');
const jwtController = require('./controllers/jwt.controller');
const { check } = require('express-validator');
const cors = require('cors');

// Creado el servidor:
const server = express();

// Middleware:
server.use(cors());
server.use(helmet());
server.use(bodyParser.json());
server.use(cookieParser());

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

server.use(jwtController.checkToken);
server.use(express.static('static'));

// Endpoints --> 5 por cada tabla:

server.get('/categorias/list', categoriasController.listCategorias);
server.get('/categoria/:id', categoriasController.getCategoriaByID);
server.post('/newCategoria', [
    check('descripcion').isString().escape().trim(),
], categoriasController.NewCategoria);
server.put('/updateCategoria', [
    check('descripcion').isString().escape().trim(),
], categoriasController.updateSingleCategoria);
server.delete('/categoria/:id', categoriasController.deleteSingleCategoria);

server.get('/products', productosController.listProducts);
server.get('/product/:id', productosController.getSingleProduct);
server.post('/newProduct', [
    check('descripcion').isString().escape().trim(),
    check('categoria_id').isNumeric(),
], productosController.createSingleProduct);
server.put('/updateProduct', [
    check('descripcion').isString().escape().trim(),
    check('categoria_id').isNumeric()
], productosController.updateSingleProduct);
server.delete('/product/:id', productosController.deleteSingleProduct);

server.get('/providers', provedoresController.listProviders);
server.get('/provider/:id', provedoresController.getSingleProvider);
server.post('/newProvider', [
    check('nombre').isString().escape().trim(),
    check('localidad').isString().escape().trim(),
    check('telefono').isNumeric(),
    check('mail').isEmail(),
    check('contrasena').isAlphanumeric,
    check('fecha_inscripcion').isAfter(),
    check('producto_id').isNumeric
], provedoresController.newProvider);
server.put('/updateProvider', [
    check('nombre').isString().escape().trim(),
    check('localidad').isString().escape().trim(),
    check('telefono').isNumeric(),
    check('mail').isEmail(),
    check('contrasena').isAlphanumeric,
    check('fecha_inscripcion').isAfter(),
    check('producto_id').isNumeric
], provedoresController.updateSingleProvider);
server.delete('/deleteprovider/:id', provedoresController.deleteSingleProvider);

server.post('/login', provedoresController.login);

server.get('/', (req, res) => {
    res.send("¡Bienvenido!")
})


// Listening:
const PORT = process.argv[2]

server.listen(PORT, () => {
    console.log(`Servidor listo en el puerto -> ${PORT}`)
})
