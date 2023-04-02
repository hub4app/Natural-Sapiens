// Comunicación con la tabla'productos' de la bbdd

const connection = require('./db.model');

exports.getAllCategories = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await connection.query("SELECT * FROM categorias");
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })

};

exports.getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await connection.query("SELECT * FROM productos");
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })

};

exports.getAllProductsByCategory = (categoryID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await connection.query("SELECT * FROM productos WHERE categoria_id = " + categoryID);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })

};

exports.getProductByID = (productID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await connection.query(`SELECT * FROM productos WHERE ID = ${productID}`)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
};

exports.insertSingleProduct = (nombreCategorías) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await connection.query(`
            INSERT INTO productos (Categorías) VALUES ("${nombreCategorías}")`)
            resolve(result)
        } catch (error) {
            reject(error)
        }

    })
};

exports.updateProduct = (id, nuevaCategoría) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `
            UPDATE productos
            SET categorías = "${nuevaCategoría}"
            WHERE ID = ${id};
            `
            const result = await connection.query(sql);
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
};

exports.removeProduct = (id) => {

    return new Promise(async (resolve, reject) => {
        try {
            const sql = `DELETE FROM productos WHERE ID = ${id}`;
            const result = await connection.query(sql);
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })

};



