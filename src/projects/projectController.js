const express = require("express");
const Router = express.Router;
const projectService = require("./projectService");
const postService = require("./postService");

const routes = Router();


// base projects
routes.get("/", async function (request, response) {
    const out = await projectService.getAllProjects();
    response.send(out);
});

routes.post("/", function(request, response) {
    try {
        projectService.addProject(request.body.title, request.body.description, request.body.dateCreated, request.body.dateEnded);
        response.send({});
    } catch (err){
        response.send(err);
    }
})

routes.post("/:id/update", function(request, response) {
    try {
        projectService.updateProject(request.params.id, request.body.title, request.body.description, request.body.dateCreated, request.body.dateEnded);
        response.send({});
    }catch (err) {
        response.send(err);
    }
});


routes.get("/:id", async function(request, response) {
    try {
        const out = await projectService.getProject(request.params.id);
        response.send(out[0]);
    }catch (err) {
        response.send(err);
    } 
});


routes.delete("/:id", function (request, response) {
    try {
        projectService.deleteProject(request.params.id);
        response.send({});
    }catch (e) {
        response.send(e);
    }
});


// posts
routes.get("/:id/posts", async function (request, response) {
    try {
        const out = await postService.getAllPostForProject(request.params.id);
        response.send(out);
    }catch (e) {
        response.send(e);
    }
});

routes.post("/:id/posts", function (request, response) {
    try {
        postService.addPostToProject(request.params.id, request.body.title, request.body.content);
        response.send({});
    }catch (e) {
        response.send(e);
    }
});

routes.post("/:id/posts/:postId", function (request, response) {
    try {
        postService.updatePost(request.params.id, request.params.postId, request.body.title, request.body.content);
        response.send({});
    }catch (e) {
        response.send(e);
    }
});

routes.get("/:id/posts/:postId", async function (request, response) {
    try {
        const out = await postService.getPostById(request.params.id, request.params.postId);
        response.send(out);
    }catch (e) {
        response.send(e);
    }
});

routes.delete("/:id/posts/:postId", function (request, response) {
    try {
        postService.removeProjectPostById(request.params.id, request.params.postId);
        response.send({});
    }catch (e) {
        response.send(e);
    }
});


module.exports = routes;