const db = require("../utils/sqliteWrapper");
const postService = require("./postService");
const TABLE_NAME = "project_entity"

db.defineTableFromSchema(
    TABLE_NAME,
    {
        id: { type: "INTEGER", key: "PRIMARY KEY" },
        title: { type: "TEXT NOT NULL" },
        description: { type: "TEXT" },
        dateCreated: { type: "TEXT" },
        dateEnded: { type: "TEXT" },
    }
)


async function getAllProjects(){
    return await db.getObjectsFromTable(TABLE_NAME);
}
module.exports.getAllProjects = getAllProjects;


function addProject(title, description, dateCreated, dateEnded){
    // TODO : validate data
    
    db.saveObjectToDb(TABLE_NAME, {
        title,
        description,
        dateCreated,
        dateEnded,
    });
}
module.exports.addProject = addProject;


function updateProject(id, title, description, dateCreated, dateEnded){
    // TODO : validate data
    db.saveObjectToDb(TABLE_NAME, {
        id,
        title,
        description,
        dateCreated,
        dateEnded,
    });
}
module.exports.updateProject = updateProject;


async function getProject(id){
    return await db.getObjectsFromTable(TABLE_NAME, "id = ?", [id]);
}
module.exports.getProject = getProject;


function deleteProject(id){
    postService.deleteAllPostsForProject(id);
    db.deleteObjectsFromTable(TABLE_NAME, "id = ?", [id]);
}
module.exports.deleteProject = deleteProject;
