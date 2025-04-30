const express = require("express");
const Router = express.Router;
const project = require("./projectService")

const routes = Router();

routes.post("/test", function (request, response, next) {
    console.log("got here");
    response.send("aaaa");
});

module.exports = routes;