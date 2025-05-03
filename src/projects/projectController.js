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

module.exports = routes;