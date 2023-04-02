const provedoresModel = require('../models/provedores.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const restricted = require('../config/restricted');
const { validationResult } = require('express-validator');


exports.listProviders = async (req, res) => {
    try {
        const resultados = await provedoresModel.getAllProviders();
        res.send(resultados)
    } catch (error) {
        res.send(error)
    }
};

exports.getSingleProvider = async (req, res) => {
    try {
        // Sacar del path param el ID del producto
        const id = req.params.id;
        //Pedir al Modelo que saque los datos del producto por su ID
        const proveedor = await provedoresModel.getProviderByID(id);
        //Lógica para comprobar que el proveedor exista
        if (proveedor.length === 0) {
            res.status(400).send({ "message": "Ese ID no existe en la base de datos" })
        } else {
            res.send(proveedor)
        }

    } catch (error) {
        res.send(error)
    }
};

exports.newProvider = async (req, res) => {
    const nombre = req.body.nombre;
    const localidad = req.body.localidad;
    const telefono = req.body.telefono;
    const mail = req.body.mail;
    const now = new Date();
    //const fecha_inscripcion = `${now.getFullYear()}${now.getMonth().toString().padStart(2, "0")}${now.getDate()}`;
    const fecha_inscripcion = new Date();
    const fk_productos = req.body.producto_id;
    // Llama al modelo y pedirle que nos cree un nuevo proveedor
    try {
        const hash = await bcrypt.hash(req.body.contraseña, 15);
        console.log("El hash ya ha sido creado")
        const result = await provedoresModel.createProvider(nombre, localidad, telefono, mail, hash, fecha_inscripcion, fk_productos)
        res.send({ "message": "Ok, proveedor creado!", "ID": result.insertId })
    } catch (error) {
        res.send(error);
    }
};

exports.updateSingleProvider = async (req, res) => {
    console.log("inicio validaciones");
    const errors = validationResult(req) //Ejecutar las validaciones
    console.log("fin validaciones");
    if (errors.isEmpty()) {
        console.log("req.body", req.body);
        const id = req.body.id;
        const nombre = req.body.nombre;
        const localidad = req.body.localidad;
        const telefono = req.body.telefono;
        const mail = req.body.mail;
        const hash = req.body.hash;
        const fecha_inscripcion = req.body.fecha_inscripcion;
        const fk_productos = req.body.producto_id;
        // Llamo al modelo:
        try {
            console.log("vamos a llamar a model update provider");
            const result = await provedoresModel.updateProvider(id, nombre, localidad, telefono, mail, hash, fecha_inscripcion, fk_productos);
            if (result.affectedRows > 0) {
                res.send({ "message": "Dato modyficado con éxito!" })
            } else {
                res.status(404).send({ "error": "Ese ID no existe" })
            }
        } catch (error) {
            res.send(error);
        }
    } else {
        res.status(400).send({ "error": "El body está mal formado", "explicación": errors })
    }
};

exports.deleteSingleProvider = async (req, res) => {
    //Coger de los path params el ID
    const id = req.params.id;
    //Pedir al modelo que elimine ese proveedor
    try {
        const results = await provedoresModel.removeProvider(id);
        //Comprobar que el ID exista
        if (results.affectedRows > 0) {
            //Enviar confirmación al cliente
            res.send({ "message": `Ok proveedor con el id ${id} eliminado!` })
        } else {
            res.status(404).send({ "error": "Ese ID no existe." })
        }
    } catch (error) {
        res.send(error)
    }
};

exports.login = async (req, res) => {
    // Validar el body
    const id = req.body.id;
    const contraseña = req.body.contraseña;
    console.log("req.body", req.body)
    try {
        const provedores = await provedoresModel.getProviderById(id);
        console.log("provedores", provedores);
        const match = await bcrypt.compare(contraseña, provedores[0].Contrasena);
        console.log("El compare ya ha terminado")
        if (match) {

            //Json Web Tokens (JWT)
            jwt.sign({ "provedorID": provedores.id },
                restricted.jwt_key,
                // Función que seejecuta cuando sehaya terminado de crear
                (error, token) => {
                    if (error) {
                        console.log(error);
                        res.sen(error);
                    } else {
                        res.cookie("aqq", token);
                        res.send({ "message": "Ok, estás autorizado", "token": token })
                    }

                }
            )
        } else {
            // Contraseñas no coinciden
            res.status(400).send({ "error": "Las contraseñas no coinciden" })
        }

    } catch (error) {
        console.log(error)
        res.send(error)
    }
};

