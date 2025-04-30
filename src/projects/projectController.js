const express = require("express");
const Router = express.Router;
const projectService = require("./projectService")

const routes = Router();

routes.post("/test", function (request, response, next) {
    console.log("got here");
    
    projectService.test();

    response.send("aaaa");

});

module.exports = routes;