const db = require("../database/sqliteWrapper");


db.defineTableFromSchema(
    "project_entity",
    {
        id: { type: "INTEGER", key: "PRIMARY KEY" },
        title: { type: "TEXT NOT NULL" },
        description: { type: "TEXT" },
        dateCreated: { type: "TEXT" },
        dateEnded: { type: "TEXT" },
    }
)




function saveProject(project){

}
