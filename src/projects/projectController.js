const express = require("express");
const Router = express.Router;
const projectService = require("./projectService")

const routes = Router();

routes.post("/test", function (request, response, next) {
    
    projectService.test();

    response.send("aaaa");

});


routes.get("/", async function (request, response, next) {
    const out = await projectService.getAllProjects();
    response.send(out);
})

module.exports = routes;