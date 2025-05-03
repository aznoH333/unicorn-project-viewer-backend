const db = require("../database/sqliteWrapper");
const TABLE_NAME = "project_post_entity";


db.defineTableFromSchema(
    TABLE_NAME,
    {
        id: { type: "INTEGER", key: "PRIMARY KEY" },
        title: { type: "TEXT NOT NULL" },
        content: { type: "TEXT" },
        datePosted: { type: "TEXT" },
        projectId: { type: "INTEGER NOT NULL", foreignKey: "project_entity(id)" }
    }
);



async function getAllPostForProject(projectId){
    return await db.getObjectsFromTable(TABLE_NAME, "projectId = ?", [projectId]);
}
module.exports.getAllPostForProject = getAllPostForProject;


function addPostToProject(projectId, title, content){
    // TODO : validate
    db.saveObjectToDb(TABLE_NAME, {
        title,
        content,
        datePosted: new Date().toString(),
        projectId,
    })
}
module.exports.addPostToProject = addPostToProject;


function updatePost(projectId, postId, title, content){
    // TODO : validate
    db.saveObjectToDb(TABLE_NAME, {
        id: postId,
        title,
        content,
        datePosted: new Date().toString(),
        projectId,
    })
}
module.exports.updatePost = updatePost;


async function getPostById(projectId, postId) {
    return (await db.getObjectsFromTable(TABLE_NAME, "projectId = ? AND id = ?", [projectId, postId]))[0];
}
module.exports.getPostById = getPostById;

function removeProjectPostById(projectId, postId) {
    db.deleteObjectsFromTable(TABLE_NAME, "projectId = ? AND id = ?", [projectId, postId]);
}
module.exports.removeProjectPostById = removeProjectPostById;


function deleteAllPostsForProject(projectId) {
    db.deleteObjectsFromTable(TABLE_NAME, "projectId = ?", [projectId]);
}
module.exports.deleteAllPostsForProject = deleteAllPostsForProject;