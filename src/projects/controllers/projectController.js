const express = require("express");
const Router = express.Router;
const projectService = require("../services/projectService");
const postService = require("../services/postService");
const validator = require("../../utils/requestValidator");

const routes = Router();


// base projects
routes.get("/", async function (request, response) {
    const out = await projectService.getAllProjects();
    response.send(out);
});

routes.post("/", function(request, response, next) {
    try {
        validator.validateRequest(request.body, {
            title: { type: "string", required: true },
            description: { type: "string", required: true },
            dateCreated: { type: "string", required: true },
            dateEnded: { type: "string" }
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
            title: { type: "string", required: true },
            description: { type: "string", required: true },
            dateCreated: { type: "string", required: true },
            dateEnded: { type: "string" }
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

routes.post("/:id/posts", function (request, response, next) {
    try {
        validator.validateRequest(request.body, {
            title: { type: "string", required: true },
            content: { type: "string" },
        });
        postService.addPostToProject(request.params.id, request.body.title, request.body.content);
        response.send({});
    }catch (e) {
        next(e);
    }
});

routes.post("/:id/posts/:postId", function (request, response, next) {
    try {
        validator.validateRequest(request.body, {
            title: { type: "string", required: true },
            content: { type: "string" },
        });
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