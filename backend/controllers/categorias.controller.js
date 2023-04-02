const categoriasModel = require('../models/categorias.model');
const { validationResult } = require('express-validator');


exports.listCategorias = async (req, res) => {
    try {
        const resultados = await categoriasModel.getAllCategorias();
        res.send(resultados)
    } catch (error) {
        res.send(error)
    }
};

exports.getCategoriaByID = async (req, res) => {
    try {
        // Sacar del path param el ID del producto
        const id = req.params.id;
        //Pedir al Modelo que saque los datos de los aceite por su ID
        const categoria = await categoriasModel.getCategoriaByID(id);
        //Lógica para comprobar que el zumo exista
        if (categoria.length === 0) {
            res.status(400).send({ "message": "Ese ID no existe en la base de datos" })
        } else {
            res.send(categoria)
        }

    } catch (error) {
        res.send(error)
    }
};

exports.NewCategoria = async (req, res) => {
    //Sacar del body la información del nuevo producto
    const errors = validationResult(req) //Ejecuta las validaciones
    if (errors.isEmpty()) {
        const descripcion = req.body.descripcion;

        //Llamar al modelo y pedirle que inserte el aceite
        try {
            const result = await categoriasModel.insertSingleCategoria(descripcion)
            res.send({ "message": "Ok producto añadido", "nuevoId": result.insertId })
        } catch (error) {
            res.send(error)
        }

    } else {
        res.status(400).send({ "error": "El body está mal formado", "explicacion": errors })
    }
};

exports.updateSingleCategoria = async (req, res) => {
    const errors = validationResult(req) //Ejecutar las validaciones
    if (errors.isEmpty()) {
        const id = req.body.id;
        const nombre = req.body.descripcion;
        // Llamo al modelo:
        try {
            const result = await categoriasModel.updateSingleCategoria(id, descripcion);
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

exports.deleteSingleCategoria = async (req, res) => {
    //Coger de los path params el ID
    const id = req.params.id;
    //Pedir al modelo que elimine ese producto
    try {
        const results = await categoriasModel.removeCategoria(id);
        //Comprobar que el ID exista
        if (results.affectedRows > 0) {
            //Enviar confirmación al cliente
            res.send({ "message": `Ok producto con el id ${id} eliminado!` })
        } else {
            res.status(404).send({ "error": "Ese ID no existe." })
        }
    } catch (error) {
        res.send(error)
    }
};
