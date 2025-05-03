/**
 * Post Service
 * 
 * This service provides functionality to manage posts associated with personal projects, such as blog posts.
 * It utilizes the SQLite wrapper to perform CRUD (Create, Read, Update, Delete) operations on a database table named `project_post_entity`.
 * The service allows users to add, update, retrieve, and delete posts related to specific projects.
 * 
 * The post schema includes the following fields:
 * - id: INTEGER (Primary Key)
 * - title: TEXT (Not Null)
 * - content: TEXT
 * - datePosted: TEXT
 * - projectId: INTEGER (Not Null, Foreign Key referencing project_entity(id))
 * 
 * @module postService
 */

const db = require("../../utils/sqliteWrapper");
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


/**
 * Retrieves all posts associated with a specific project from the database.
 * 
 * @param {number} projectId - The ID of the project for which to retrieve posts. This field is required.
 * @returns {Promise<Array>} A promise that resolves to an array of post objects associated with the specified project.
 * Each object contains the post's details as defined in the schema.
 * 
 * @example
 * const posts = await postService.getAllPostForProject(1);
 * console.log(posts); // Outputs an array of posts for the project with ID 1
 */
async function getAllPostForProject(projectId){
    return await db.getObjectsFromTable(TABLE_NAME, "projectId = ?", [projectId]);
}
module.exports.getAllPostForProject = getAllPostForProject;


/**
 * Adds a new post to a specific project in the database.
 * 
 * @param {number} projectId - The ID of the project to which the post will be added. This field is required.
 * @param {string} title - The title of the post. This field is required.
 * @param {string} content - The content of the post. This field is optional.
 * 
 * @example
 * postService.addPostToProject(1, "New Post Title", "This is the content of the new post.");
 */
function addPostToProject(projectId, title, content){
    db.saveObjectToDb(TABLE_NAME, {
        title,
        content,
        datePosted: new Date().toString(),
        projectId,
    })
}
module.exports.addPostToProject = addPostToProject;



/**
 * Updates an existing post associated with a specific project in the database.
 * 
 * @param {number} projectId - The ID of the project to which the post belongs. This field is required.
 * @param {number} postId - The ID of the post to update. This field is required.
 * @param {string} title - The new title of the post. This field is required.
 * @param {string} content - The new content of the post. This field is optional.
 * 
 * @example
 * postService.updatePost(1, 1, "Updated Post Title", "Updated content for the post.");
 */
function updatePost(projectId, postId, title, content){
    db.saveObjectToDb(TABLE_NAME, {
        id: postId,
        title,
        content,
        datePosted: new Date().toString(),
        projectId,
    })
}
module.exports.updatePost = updatePost;


/**
 * Retrieves a specific post by its ID associated with a specific project.
 * 
 * @param {number} projectId - The ID of the project to which the post belongs. This field is required.
 * @param {number} postId - The ID of the post to retrieve. This field is required.
 * @returns {Promise<Object|null>} A promise that resolves to the post object if found, or null if not found.
 * 
 * @example
 * const post = await postService.getPostById(1, 1);
 * console.log(post); // Outputs the post with ID 1 for the project with ID 1
 */
async function getPostById(projectId, postId) {
    return (await db.getObjectsFromTable(TABLE_NAME, "projectId = ? AND id = ?", [projectId, postId]))[0];
}
module.exports.getPostById = getPostById;


/**
 * Removes a specific post by its ID associated with a specific project.
 * 
 * @param {number} projectId - The ID of the project to which the post belongs. This field is required.
 * @param {number} postId - The ID of the post to delete. This field is required.
 */
function removeProjectPostById(projectId, postId) {
    db.deleteObjectsFromTable(TABLE_NAME, "projectId = ? AND id = ?", [projectId, postId]);
}
module.exports.removeProjectPostById = removeProjectPostById;

/**
 * Deletes all posts that belong to a specific project.
 * 
 * @param {number} projectId - The ID of the project to which the posts belongs. This field is required.
 */
function deleteAllPostsForProject(projectId) {
    db.deleteObjectsFromTable(TABLE_NAME, "projectId = ?", [projectId]);
}
module.exports.deleteAllPostsForProject = deleteAllPostsForProject;