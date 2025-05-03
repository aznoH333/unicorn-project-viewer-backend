const sqlite3 = require("sqlite3");
const DB_FILENAME = "projects.db";
const fs = require('node:fs');




// initialize db file
if (!fs.existsSync(`./${DB_FILENAME}`)) {
    fs.writeFile(`./${DB_FILENAME}`, "", err => {});
}

const sqlErrorHandler = (err) => {
    if (err) {
        console.log("[ SQL ERROR ] :", err.message);
        throw err;
    }
};

/**
 * Utility function, connects to the database and executes an sql statement.
 * @param {string} sql sql to execute (uses ? as placeholders)
 * @param {*} params query parrameters
 */
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

/**
 * Utility function, connects to the database and executes an sql statement, returns the result.
 * @param {string} sql sql to execute (uses ? as placeholders)
 * @param {any[]} params query parameters
 * @returns resulting rows
 */
async function getFromDb(sql, params = undefined){
    console.log(`[ SQL ] : ${sql}`);
    const db = new sqlite3.Database(DB_FILENAME, sqlite3.OPEN_READONLY);
    const output = await dbAll(db, params, sql);
    db.close();
    return output;
}


const schemaTable = {}

/**
 * Defines a new table schema in the SQLite database.
 * This function is essential for creating tables and must be called before utilizing other utility functions in this wrapper.
 * It constructs the SQL statement for creating a table based on the provided schema and executes it.
 * 
 * @param {string} tableName - The name of the table to be created. This should be a unique identifier for the table within the database.
 * 
 * @param {object} schema - An object representing the schema of the table. Each key in the object corresponds to a column name, and its value is an object that defines the column's attributes.
 * 
 * @param {object} schema.fieldName - The attributes for each field in the schema. The attributes can include:
 *   - {string} type - The data type of the column (e.g., "INTEGER", "TEXT", etc.).
 *   - {string} key - Optional. Specifies if the column is a key (e.g., "PRIMARY KEY"). If not provided, the column will not be treated as a key.
 *   - {string} foreignKey - Optional. If the column is a foreign key, this should specify the reference to the related table and column (e.g., "project_entity(id)").
 * 
 * @returns {void} This function does not return a value. It performs the action of creating a table in the database.
 * 
 * @throws {Error} Throws an error if a table with the same name has already been defined. This prevents duplicate table definitions.
 * 
 * @example
 * // Example usage of defineTableFromSchema function
 * db.defineTableFromSchema(
 *     TABLE_NAME,
 *     {
 *         id: { type: "INTEGER", key: "PRIMARY KEY" },
 *         title: { type: "TEXT NOT NULL" },
 *         content: { type: "TEXT" },
 *         datePosted: { type: "TEXT" },
 *         projectId: { type: "INTEGER NOT NULL", foreignKey: "project_entity(id)" }
 *     }
 * );
 * 
 * @example
 * // Defining a table for storing blog posts
 * db.defineTableFromSchema('blog_posts', {
 *     id: { type: 'INTEGER', key: 'PRIMARY KEY' },
 *     title: { type: 'TEXT NOT NULL' },
 *     content: { type: 'TEXT' },
 *     datePosted: { type: 'TEXT' },
 *     authorId: { type: 'INTEGER NOT NULL', foreignKey: 'users(id)' }
 * });
 */
function defineTableFromSchema(tableName, schema) {
    // check for duplicates
    if (Object.keys(schemaTable).includes(tableName)){
        throw new Error(`Duplicate table definition ${tableName}`);
    }
    
    // construct sql statement
    let fields = '';
    let iter = 0;
    let key = undefined;
    let foreignKeys = [];
    for (const fieldName in schema){
        const fieldAttributes = schema[fieldName];
        fields += `${fieldName} ${fieldAttributes.type} ${fieldAttributes.key ? fieldAttributes.key : ""}`;
        iter++;
        if (iter < Object.keys(schema).length || fieldAttributes.foreignKey || foreignKeys.length !== 0){
            fields += ',';
        }

        if (fieldAttributes.key){
            key = fieldName;
        }

        if (fieldAttributes.foreignKey) {
            foreignKeys.push({
                fieldName,
                foreignKey: fieldAttributes.foreignKey
            });
        }
    }

    console.log(`[ DB ] initializing table : ${tableName}`)

    callStatement(
        `CREATE TABLE IF NOT EXISTS ${tableName} (
        ${fields}
        ${foreignKeys.map((it)=>`FOREIGN KEY(${it.fieldName}) REFERENCES ${it.foreignKey}`).join(",")}
        )`
    );

    // update schema table
    schemaTable[tableName] = 
    { 
        fields: Object.keys(schema), 
        key: key,
    } ;
}
module.exports.defineTableFromSchema = defineTableFromSchema;

/**
 * Saves an object to the specified table in the SQLite database. 
 * If an object with the same primary key already exists, it updates the existing record; otherwise, it inserts a new record.
 * 
 * @param {string} tableName - The name of the existing table where the object will be saved. This table must have been defined previously using the `defineTableFromSchema` function.
 * 
 * @param {*} object - The object to save to the database. The object's keys should correspond to the fields defined in the table's schema.
 * 
 * @throws {Error} Throws an error if the specified table does not exist in the schema. This ensures that the operation is performed on a valid table.
 * 
 * @throws {Error} Throws an error if any field in the object does not match the fields defined in the table's schema. This prevents mismatches between the object and the database structure.
 * 
 * @example
 * // Example usage of saveObjectToDb function
 * const blogPost = {
 *     id: 1, // Primary key
 *     title: "My First Blog Post",
 *     content: "This is the content of my first blog post.",
 *     datePosted: "2023-10-01",
 *     authorId: 123 // Assuming this is a valid foreign key
 * };
 * 
 * // Saving the blog post to the 'blog_posts' table
 * db.saveObjectToDb('blog_posts', blogPost);
 * 
 * @example
 * // Updating an existing blog post
 * const updatedBlogPost = {
 *     id: 1, // Primary key must be included for updates
 *     title: "My Updated Blog Post",
 *     content: "This is the updated content of my blog post."
 * };
 * 
 * // This will update the existing record with id 1
 * db.saveObjectToDb('blog_posts', updatedBlogPost);
 * 
 * @returns {void} This function does not return a value. It performs the action of saving or updating an object in the database.
 */
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
            insert into ${tableName} (${Object.keys(object).join(",")})
            values (${Object.entries(object).map((it) => "?").join(",")});
        `;

    }
    callStatement(sql, Object.values(object));    
}
module.exports.saveObjectToDb = saveObjectToDb;


/**
 * Retrieves data from the specified table in the SQLite database.
 * This function executes a SELECT query based on the provided table name and optional WHERE clause.
 * 
 * @param {string} tableName - The name of the table from which to retrieve data. This table must exist in the database.
 * 
 * @param {string} where - An optional WHERE clause for filtering the results. Use placeholders (?) for parameterized queries to prevent SQL injection.
 * 
 * @param {string[]} params - An array of parameters to replace the placeholders in the WHERE clause. The order of the parameters should match the order of the placeholders.
 * 
 * @returns {Promise<Array>} A promise that resolves to an array of rows found in the table. Each row is represented as an object with key-value pairs corresponding to the column names and their values.
 * 
 * @throws {Error} Throws an error if the specified table does not exist or if the query fails for any reason.
 * 
 * @example
 * // Example usage of getObjectsFromTable function
 * const results = await db.getObjectsFromTable('blog_posts', 'authorId = ?', [123]);
 * console.log(results); // Outputs an array of blog posts by the author with ID 123
 */
async function getObjectsFromTable(tableName, where, params){
    const sql = `select * from ${tableName} ${where ? `where ${where}` : ""}`;
    
    return getFromDb(sql, params);
}

module.exports.getObjectsFromTable = getObjectsFromTable;


/**
 * Deletes data from the specified table in the SQLite database.
 * This function executes a DELETE query based on the provided table name and optional WHERE clause.
 * 
 * @param {string} tableName - The name of the table from which to delete data. This table must exist in the database.
 * 
 * @param {string} where - An optional WHERE clause for specifying which records to delete. Use placeholders (?) for parameterized queries to prevent SQL injection.
 * 
 * @param {string[]} params - An array of parameters to replace the placeholders in the WHERE clause. The order of the parameters should match the order of the placeholders.
 * 
 * @throws {Error} Throws an error if the specified table does not exist or if the query fails for any reason.
 * 
 * @example
 * // Example usage of deleteObjectsFromTable function
 * db.deleteObjectsFromTable('blog_posts', 'id = ?', [1]);
 * // This will delete the blog post with ID 1 from the 'blog_posts' table
 */
function deleteObjectsFromTable(tableName, where, params) {
    const sql = `delete from ${tableName} ${where ? `where ${where}` : ""}`;
    callStatement(sql, params);
}
module.exports.deleteObjectsFromTable = deleteObjectsFromTable;