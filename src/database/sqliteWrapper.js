const sqlite3 = require("sqlite3");
const DB_FILENAME = "projects.db";
const fs = require('node:fs');




// initialize db file
if (!fs.existsSync(`./${DB_FILENAME}`)) {
    fs.writeFile(`./${DB_FILENAME}`, "", err => {});
}

const sqlErrorHandler = (err) => {
    if (err) {
        db.close();
        console.log("[ SQL ERROR ] :", err.message);
        throw err;
    }
};

function callStatement(sql, params = undefined) {
    console.log(`[ SQL ] : ${sql}`);
    
    const db = new sqlite3.Database(DB_FILENAME, sqlite3.OPEN_READWRITE);
    

    if (params){
        db.run(sql, params, sqlErrorHandler);
    }else {
        db.exec(sql, sqlErrorHandler);
    }

    
    db.close();
}

async function dbAll(db, params, query){
    return new Promise(function(resolve,reject){
        db.all(query, params, function(err,rows){
           if(err){return reject(err);}
           resolve(rows);
         });
    });
}

async function getFromDb(sql, params = undefined){
    console.log(`[ SQL ] : ${sql}`);
    const db = new sqlite3.Database(DB_FILENAME, sqlite3.OPEN_READONLY);
    const output = await dbAll(db, params, sql);
    db.close();
    return output;
}


const schemaTable = {}

function defineTableFromSchema(tableName, schema) {
    // check for duplicates
    if (Object.keys(schemaTable).includes(tableName)){
        throw new Error(`Duplicate table definition ${tableName}`);
    }
    
    // construct sql statement
    let fields = '';
    let iter = 0;
    let key = undefined;
    for (const fieldName in schema){
        const fieldAttributes = schema[fieldName];
        fields += `${fieldName} ${fieldAttributes.type} ${fieldAttributes.key ? fieldAttributes.key : ""}`;
        iter++;
        if (iter < Object.keys(schema).length){
            fields += ',';
        }

        if (fieldAttributes.key){
            key = fieldName;
        }
    }

    console.log(`[ DB ] initializing table : ${tableName}`)

    callStatement(
        `CREATE TABLE IF NOT EXISTS ${tableName} (
        ${fields})`
    )

    // update schema table
    schemaTable[tableName] = 
    { 
        fields: Object.keys(schema), 
        key: key,
    } ;
}
module.exports.defineTableFromSchema = defineTableFromSchema;


function saveObjectToDb(tableName, object){
    // check that table exists
    if (!Object.keys(schemaTable).includes(tableName)){
        throw new Error(`Unknown shema : ${tableName}`);
    }

    const schema = schemaTable[tableName];

    // check that fields match
    for (const fieldName in object){
        if (!Object.values(schema.fields).includes(fieldName)){
            throw new Error(`Schema and object do not match. Field ${fieldName} not found in schema ${tableName}`);
        }
    }

    // find key
    const keyName = schema.key;
    const updateExisting = Object.keys(object).includes(keyName);


    
    // construct sql
    let sql;

    if (updateExisting) {
        // update
        sql = `
            update ${tableName} set
            ${Object.entries(object).map((it) => {
                return `${it[0]} = ?`
            }).join(',')}
            where ${keyName} = ${Object.entries(object).find((it)=>{return it[0] === keyName})[1]}
        `;
    }else {
        // insert
        sql = `
            insert into ${tableName} (${schema.fields.join(",")})
            values (${Object.entries.map((it) => "?").join(",")});
        `;
    }

    callStatement(sql, Object.values(object));    
}
module.exports.saveObjectToDb = saveObjectToDb;



async function getObjectsFromTable(tableName){
    const schema = schemaTable[tableName];

    const sql = `select * from ${tableName}`;
    
    return getFromDb(sql);
}

module.exports.getObjectsFromTable = getObjectsFromTable;