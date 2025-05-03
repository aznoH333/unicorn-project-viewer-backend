const express = require("express");
const Router = express.Router;
const projectService = require("./projectService")

const routes = Router();

routes.post("/test", function (request, response) {
    projectService.test();

    response.send("aaaa");
});


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

module.exports = routes;