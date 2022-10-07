const Pool = require('pg').Pool;

class DB {
    constructor(options = { database: undefined, port: undefined, user: undefined, password: undefined, host: undefined } || undefined) {
        this.name = options.database;
        this.options = options;
        this.pool = undefined;
        this.Table = class Table {
            constructor (columns, tableName) {
                this.colums = columns;
                this.name = tableName
            };
            createQuery () {
                try {
                    let mainQuery = `CREATE TABLE ${this.name} `;
                    let query = `CREATE SEQUENCE ${this.name}_id_seq;\n(${this.name}_id smallint NOT NULL DEFAULT nextval('${this.name}_id_seq')`
                    for (const colume in this.colums) {
                        query += `${colume} `;
                        query += this.colums[colume]['type'];
                        if (this.colums[colume]['required'] != undefined) {
                            if (this.colums[colume]['required']) query += ` NOT NULL,`;
                            else query += ` ,`;
                        }
                    }
                    query.at(-1) = '';
                    query += `);\nALTER SEQUENCE ${this.name}_id_seq OWNED BY ${this.name}.${this.name}_id;`;
                    return query;
                } catch (e) {
                    console.log('Something went wrong at cerate query', e)
                }
            }
        }
    };
    connect () {
        if (this.options != undefined) {
            try {
                this.pool = new Pool(this.options);
            } catch (e) {
                console.log('Something went wrong at DB connect', e);
            }
        } else {
            try {
                this.pool = new Pool({
                    database: process.env['DB_DATABASE'],
                    user: process.env['DB_USER'],
                    password: process.env['DB_PASSWORD'],
                    host: process.env['DB_HOST'],
                    port: process.env['DB_PORT']
                });
            } catch (e) {
                console.log('Something went wrong on DB connect', e);
            }
        }
    };
    async createTable (table) {
        await this.pool.query(`SHOW TABLES FROM ${this.name} like '${table.name}';`)
            .then( res => {
                if (res) {
                    console.log(`Table with name ${table.name} has been created`);
                } else {
                    this.pool.query(table.createQuery())
                }
            })
            .catch( err => {
                console.log('Something went wrong on create table', err);
            })
        let dataSch = {};
        for (const colume in table.colums) {
            dataSch[colume] = undefined;
        }
        class Table {
            constructor(data = dataSch || undefined) {
                this.name = table.name;
                this.data = data;
                this.pool = DB.prototype.pool;
            };
            save () {
                return new Promise( (resolve, reject) => {
                    if (this.data == undefined) reject('Data is empty')
                    let query = `INSERT INTO ${this.name} (`;
                    for (const colume in this.data != undefined) {
                        if (this.data[colume]) query += colume +',';
                    }
                    query.at(-1) = ') VALUES (';
                    for (const colume in this.data) {
                        if (this.data[colume] != undefined) query += this.data[colume] += ',';
                    }
                    query.at(-1) = ');';
                    this.pool.query(query)
                        .then( res => {
                            resolve(res)
                        })
                        .catch( err => {
                            reject(err)
                        })
                })
            };

            static find (data = dataSch || undefined) {
                return new Promise( (resolve, reject) => {
                    let isEmpty = true;
                    for (const key in data) {
                        if (data[key] != undefined) isEmpty = false;
                    };
                    if (isEmpty) data = undefined;
                    if (data == undefined) {
                        Table.prototype.pool.query(`SELECT * FROM ${Table.prototype.name}`)
                            .then( res => {
                                resolve(res)
                            })
                            .catch
                    } else {
                        let query = `SELECT * FROM ${Table.prototype.name} WHERE `;
                        for (const key in data) {
                            if (data[key] != undefined) {
                                query += `${key}=${data[key]} AND `;
                            }
                        }
                        query.substring(query.length - 5);
                        Table.prototype.pool.query(query)
                            .then( res => {
                                resolve(res);
                            })
                            .catch( err => {
                                reject(err);
                            })
                    }
                })
            }
        };
    }
};