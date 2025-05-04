const express = require("express");
const Router = express.Router;
const projectService = require("../services/projectService");
const postService = require("../services/postService");
const validator = require("../../utils/requestValidator");

const routes = Router();
const DATE_VALIDATION_REGEX = /^[1-3]?[0-9]-([0-9]|([1][0-2]))-2[0-9][0-9][0-9]$/;
const TITLE_VALIDATION_REGEX = /.{3,}/;


// base projects
routes.get("/", async function (request, response) {
    const out = await projectService.getAllProjects();
    response.send(out);
});

routes.post("/", function(request, response, next) {
    try {
        validator.validateRequest(request.body, {
            title: { type: "string", required: true, matches: TITLE_VALIDATION_REGEX},
            description: { type: "string", required: true },
            dateCreated: { type: "string", required: true, matches: DATE_VALIDATION_REGEX },
            dateEnded: { type: "string", matches: DATE_VALIDATION_REGEX }
        });
        
        
        projectService.addProject(request.body.title, request.body.description, request.body.dateCreated, request.body.dateEnded);
        response.send({});
    } catch (err){
        next(err);
    }
});

routes.post("/:id/update", function(request, response, next) {
    try {
        validator.validateRequest(request.body, {
            title: { type: "string", required: true, matches: TITLE_VALIDATION_REGEX },
            description: { type: "string", required: true },
            dateCreated: { type: "string", required: true, matches: DATE_VALIDATION_REGEX },
            dateEnded: { type: "string", matches: DATE_VALIDATION_REGEX }
        });
        
        projectService.updateProject(request.params.id, request.body.title, request.body.description, request.body.dateCreated, request.body.dateEnded);
        response.send({});
    }catch (err) {
        next(err);
    }
});


routes.get("/:id", async function(request, response, next) {
    try {
        const out = await projectService.getProject(request.params.id);
        response.send(out[0]);
    }catch (err) {
        next(err);
    } 
});


routes.delete("/:id", function (request, response, next) {
    try {
        projectService.deleteProject(request.params.id);
        response.send({});
    }catch (e) {
        next(e);
    }
});


// posts
routes.get("/:id/posts", async function (request, response, next) {
    try {
        const out = await postService.getAllPostForProject(request.params.id);
        response.send(out);
    }catch (e) {
        next(e);
    }
});

routes.post("/:id/posts", async function (request, response, next) {
    try {
        validator.validateRequest(request.body, {
            title: { type: "string", required: true, matches: TITLE_VALIDATION_REGEX },
            content: { type: "string" },
        });

        const exists = await projectService.doesProjectExist(request.params.id);
        if (!exists) {
            throw new Error(`Project with id ${request.params.id} doesn't exist`);
        }

        postService.addPostToProject(request.params.id, request.body.title, request.body.content);
        response.send({});
    }catch (e) {
        next(e);
    }
});

routes.post("/:id/posts/:postId", async function (request, response, next) {
    try {
        validator.validateRequest(request.body, {
            title: { type: "string", required: true, matches: TITLE_VALIDATION_REGEX },
            content: { type: "string" },
        });
        
        const exists = await projectService.doesProjectExist(request.params.id);
        if (!exists) {
            throw new Error(`Project with id ${request.params.id} doesn't exist`);
        }
        postService.updatePost(request.params.id, request.params.postId, request.body.title, request.body.content);
        response.send({});
    }catch (e) {
        next(e);
    }
});

routes.get("/:id/posts/:postId", async function (request, response, next) {
    try {
        const out = await postService.getPostById(request.params.id, request.params.postId);
        response.send(out);
    }catch (e) {
        next(e);
    }
});

routes.delete("/:id/posts/:postId", function (request, response, next) {
    try {
        postService.removeProjectPostById(request.params.id, request.params.postId);
        response.send({});
    }catch (e) {
        next(e);
    }
});


module.exports = routes;