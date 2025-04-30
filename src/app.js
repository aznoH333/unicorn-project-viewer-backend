const express = require('express')
const app = express()
const port = 3000
const projectController = require("./projects/projectController");


// initialize server
app.listen(port, () => {
    console.log(`Project viewer backend listening on port : ${port}`);
});

app.use("/api/projects", projectController);


