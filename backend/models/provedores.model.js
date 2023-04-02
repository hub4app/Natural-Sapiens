const connection = require('./db.model');

exports.getAllProviders = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await connection.query("SELECT * FROM provedores");
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })

};

exports.getProviderByID = (providerID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await connection.query(`SELECT p.id,p.Nombre,p.Localidad,p.Telefono,p.Mail,p.producto_id,prd.categoria_id FROM provedores p Inner Join productos prd on (prd.id = p.producto_id) where p.id = ${providerID}`)
            if (data && data.length > 0) {
                resolve(data[0]);
            } else {
                resolve(null);
            }
            //resolve(data)
        } catch (error) {
            reject(error)
        }
    })
};

exports.createProvider = (nombre, localidad, telefono, mail, contraseña, fecha_inscripcion, productoID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await connection.query(`
            INSERT INTO provedores (nombre, localidad, telefono, mail, contrasena, fecha_inscripcion, producto_id)
            VALUES ("${nombre}", "${localidad}", ${telefono}, "${mail}", "${contraseña}", NOW(), ${productoID})
            `)
            resolve(result)
        } catch (error) {
            reject(error);

        }
    })

};

exports.updateProvider = (id, nombre, localidad, telefono, mail, contraseña, fecha_inscripcion, fk_productos) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `
            UPDATE provedores SET nombre = "${nombre}", localidad = "${localidad}", telefono = ${telefono}, mail = "${mail}", producto_id = ${fk_productos}
            WHERE ID = ${id};
            `
            console.log("consulta update sql", sql);
            const result = await connection.query(sql);
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
};

exports.removeProvider = (id) => {

    return new Promise(async (resolve, reject) => {
        try {
            const sql = `DELETE FROM provedores WHERE ID = ${id}`;
            const result = await connection.query(sql);
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })

};

// SELECT == READ (CRUD)
exports.getProviderById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await connection.query(`
                SELECT * FROM provedores WHERE ID = ${id};
            `)
            resolve(result)
        } catch (error) {
            reject(error);
        }
    })
};
