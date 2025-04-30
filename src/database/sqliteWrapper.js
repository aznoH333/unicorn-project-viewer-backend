const sqlite3 = require("sqlite3");
const DB_FILENAME = "projects.db";
const fs = require('node:fs');




// initialize db file
if (!fs.existsSync(`./${DB_FILENAME}`)) {
    fs.writeFile(`./${DB_FILENAME}`, "", err => {});
}

function callStatement(sql, params = undefined) {
    console.log(`[ SQL ] : ${sql}`);
    
    const db = new sqlite3.Database(DB_FILENAME, sqlite3.OPEN_READWRITE);
    const errorHandler = (err) => {
        if (err) {
            db.close();
            console.log("[ SQL ERROR ] :", err.message);
            throw err;
        }
    };

    if (params){
        db.run(sql, params, errorHandler);
    }else {
        db.exec(sql, errorHandler);
    }


    db.close();
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
        console.log(fieldName);
        if (!Object.values(schema.fields).includes(fieldName)){
            throw new Error(`Schema and object do not match. Field ${fieldName} not found in schema ${tableName}`);
        }
    }

    // construct sql
    let sql = `insert or replace into ${tableName} (${schema.fields.join(",")}) values (
    ${Object.entries(object).map((it)=> {
        if (schema.key === it[0]){
            return `(select ${schema.key} from ${tableName} where ${schema.key} = ?)`
        }else {
            return "?";
        }
    }).join(",")});`;

    callStatement(sql, Object.values(object));    
}
module.exports.saveObjectToDb = saveObjectToDb;