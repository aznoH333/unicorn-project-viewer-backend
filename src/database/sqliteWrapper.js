const sqlite3 = require("sqlite3");
const DB_FILENAME = "projects.db";
const fs = require('node:fs');




// initialize db file
if (!fs.existsSync(`./${DB_FILENAME}`)) {
    fs.writeFile(`./${DB_FILENAME}`, "", err => {});
}



function callStatement(sql) {
    console.log(`[ SQL ] : ${sql}`);
    
    const db = new sqlite3.Database(DB_FILENAME, sqlite3.OPEN_READWRITE);

    db.exec(sql, (err) => {
        if (err) {
            db.close();
            console.log(err.message);
            throw err;
        }
    });

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
    for (const fieldName in schema){
        const fieldAttributes = schema[fieldName];
        fields += `${fieldName} ${fieldAttributes.type} ${fieldAttributes.key ? fieldAttributes.key : ""}`;
        iter++;
        if (iter < Object.keys(schema).length){
            fields += ',';
        }
    }

    console.log(`[ DB ] initializing table : ${tableName}`)

    callStatement(
        `CREATE TABLE IF NOT EXISTS ${tableName} (
        ${fields})`
    )

    // update schema table
    schemaTable[tableName] = 
    { schema 

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
    for (const filedName in object){
        if (!Object.keys(schema).includes(filedName)){
            throw new Error(`Schema and object do not match. Field ${fieldName} not found in schema ${tableName}`);
        }
    }

    // construct statement
    
}