/**
 * Project Service
 * 
 * This service provides functionality to manage personal projects, such as coding projects.
 * It utilizes the SQLite wrapper to perform CRUD (Create, Read, Update, Delete) operations on a database table named `project_entity`.
 * The service allows users to add, update, retrieve, and delete project records.
 * 
 * The project schema includes the following fields:
 * - id: INTEGER (Primary Key)
 * - title: TEXT (Not Null)
 * - description: TEXT
 * - dateCreated: TEXT
 * - dateEnded: TEXT
 * 
 * @module projectService
 */

const db = require("../../utils/sqliteWrapper");
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

/**
 * Retrieves all projects from the database.
 * 
 * @returns {Promise<Array>} A promise that resolves to an array of project objects.
 * Each object contains the project's details as defined in the schema.
 * 
 * @example
 * const projects = await projectService.getAllProjects();
 * console.log(projects); // Outputs an array of all projects
 */
async function getAllProjects(){
    return await db.getObjectsFromTable(TABLE_NAME);
}
module.exports.getAllProjects = getAllProjects;

/**
 * Adds a new project to the database.
 * 
 * @param {string} title - The title of the project. This field is required.
 * @param {string} description - A brief description of the project. This field is optional.
 * @param {string} dateCreated - The date the project was created. This field is optional.
 * @param {string} dateEnded - The date the project was completed or ended. This field is optional.
 * 
 * @example
 * projectService.addProject("My New Project", "This is a description.", "2023-10-01", "2023-10-31");
 */
function addProject(title, description, dateCreated, dateEnded){
    db.saveObjectToDb(TABLE_NAME, {
        title,
        description,
        dateCreated,
        dateEnded,
    });
}
module.exports.addProject = addProject;


/**
 * Updates an existing project in the database.
 * 
 * @param {number} id - The ID of the project to update. This field is required.
 * @param {string} title - The new title of the project. This field is required.
 * @param {string} description - The new description of the project. This field is optional.
 * @param {string} dateCreated - The new date the project was created. This field is optional.
 * @param {string} dateEnded - The new date the project was completed or ended. This field is optional.
 * 
 * @example
 * projectService.updateProject(1, "Updated Project Title", "Updated description.", "2023-10-01", "2023-10-31");
 */
function updateProject(id, title, description, dateCreated, dateEnded){
    db.saveObjectToDb(TABLE_NAME, {
        id,
        title,
        description,
        dateCreated,
        dateEnded,
    });
}
module.exports.updateProject = updateProject;

/**
 * Retrieves a specific project from the database by its ID.
 * 
 * @param {number} id - The ID of the project to retrieve. This field is required.
 * @returns {Promise<Array>} A promise that resolves to an array containing the project object, or an empty array if not found.
 * 
 * @example
 * const project = await projectService.getProject(1);
 * console.log(project); // Outputs the project with ID 1
 */
async function getProject(id){
    return (await db.getObjectsFromTable(TABLE_NAME, "id = ?", [id]))[0];
}
module.exports.getProject = getProject;

/**
 * Deletes a project from the database by its ID.
 * This function also deletes all associated posts for the project.
 * 
 * @param {number} id - The ID of the project to delete. This field is required.
 * 
 * @example
 * projectService.deleteProject(1); // Deletes the project with ID 1 and its associated posts
 */
function deleteProject(id){
    postService.deleteAllPostsForProject(id);
    db.deleteObjectsFromTable(TABLE_NAME, "id = ?", [id]);
}
module.exports.deleteProject = deleteProject;


/**
 * checks if a project with a specified id exists.
 * @param {number} id - project to search for 
 * @returns {boolean} true if yes, false if no
 */
async function doesProjectExist(id) {
    return (await getProject(id)) !== undefined
}
module.exports.doesProjectExist = doesProjectExist;