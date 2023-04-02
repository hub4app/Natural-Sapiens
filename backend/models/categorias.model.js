const connection = require('./db.model');

exports.getAllCategorias= () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await connection.query("SELECT * FROM categorias");
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })

};

exports.getCategoriaByID = (categoriasID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await connection.query(`SELECT * FROM categorias WHERE ID = ${categoriasID}`)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
};

exports.insertSingleCategoria = (descripcion) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await connection.query(`
            INSERT INTO categorias (descripcion) VALUES ("${descripcion}")`)
            resolve(result)
        } catch (error) {
            reject(error)
        }

    })
};

exports.updateSingleCategoria = (id, descripcion) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `
            UPDATE aceite
            SET nombre = "${descripcion}"
            WHERE ID = ${id};
            `
            const result = await connection.query(sql);
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
};

exports.removeCategoria= (id) => {

    return new Promise(async (resolve, reject) => {
        try {
            const sql = `DELETE FROM categorias WHERE ID = ${id}`;
            const result = await connection.query(sql);
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })

};