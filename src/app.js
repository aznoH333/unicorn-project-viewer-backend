const express = require('express')
const app = express()
const port = 3000
const projectController = require("./projects/controllers/projectController");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initialize server
app.listen(port, () => {
    console.log(`Project viewer backend listening on port : ${port}`);
});

app.use("/api/projects", projectController);


