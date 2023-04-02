const productosModel = require('../models/productos.model');
const { validationResult } = require('express-validator');

exports.listCategories = async (req, res) => {
    try {
        const resultados = await productosModel.getAllCategories();
        res.send(resultados)
    } catch (error) {
        res.send(error)
    }
};

exports.listProducts = async (req, res) => {
    try {
        const resultados = await productosModel.getAllProducts();
        res.send(resultados)
    } catch (error) {
        res.send(error)
    }
};

exports.listProductsByCategoryID = async (req, res) => {
    try {

        const categoryID = req.query.categoryid;
        const resultados = await productosModel.getAllProductsByCategory(categoryID);
        res.send(resultados)
    } catch (error) {
        res.send(error)
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        // Sacar del path param el ID del producto
        const id = req.params.id;
        //Pedir al Modelo que saque los datos del producto por su ID
        const producto = await productosModel.getProductByID(id);
        //Lógica para comprobar que el producto exista
        if (producto.length === 0) {
            res.status(400).send({ "message": "Ese ID no existe en la base de datos" })
        } else {
            res.send(producto)
        }

    } catch (error) {
        res.send(error)
    }
};

exports.createSingleProduct = async (req, res) => {
    //Sacar del body la información del nuevo producto
    const errors = validationResult(req) //Ejecuta las validaciones
    if (errors.isEmpty()) {
        const categorías = req.body.categorías;

        //Llamar al modelo y pedirle que inserte el producto
        try {
            const result = await productosModel.insertSingleProduct(categorías)
            res.send({ "message": "Ok producto añadido", "nuevoId": result.insertId })
        } catch (error) {
            res.send(error)
        }

    } else {
        res.status(400).send({ "error": "El body está mal formado", "explicacion": errors })
    }
};

exports.updateSingleProduct = async (req, res) => {
    const errors = validationResult(req) //Ejecutar las validaciones
    if (errors.isEmpty()) {
        const categorías = req.body.categorías;
        const id = req.body.id;
        // Llamo al modelo:
        try {
            const result = await productosModel.updateProduct(id, categorías);
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

exports.deleteSingleProduct = async (req, res) => {
    //Coger de los path params el ID
    const id = req.params.id;
    //Pedir al modelo que elimine ese producto
    try {
        const results = await productosModel.removeProduct(id);
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
