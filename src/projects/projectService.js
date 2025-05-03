const db = require("../database/sqliteWrapper");
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




function saveProject(project){

}


function test(){
    db.saveObjectToDb(TABLE_NAME, {
        id: 0,
        title: "test",
        description: "beams",
        dateCreated: "0",
        dateEnded: "0",
    })
}

module.exports.test = test;



async function getAllProjects(){
    return await db.getObjectsFromTable(TABLE_NAME);
}
module.exports.getAllProjects = getAllProjects;


function addProject(title, description, dateCreated, dateEnded){

}
module.exports.addProject = addProject;


function updateProject(id, title, description, dateCreated, dateEnded){

}
module.exports.updateProject = updateProject;


function deleteProject(id){

}
module.exports.deleteProject = deleteProject;
