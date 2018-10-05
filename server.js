const express = require("express");
const action = require("./data/helpers/actionModel.js");
const project = require("./data/helpers/projectModel.js");
const cors = require("cors");

const port = 5000;
const server = express();

server.use(express.json());
server.use(cors({ origin: "http://localhost:3000" }));
server.listen(port, () =>
  console.log(`\n=== API running on port ${port}===\n`)
);

const serverLogger = (req, res, next) => {
  console.log(
    `\n\n\nIncoming Request:\n\nurl: ${req.url}\n\nmethod: ${
      req.method
    }\n\nbody:`
  );
  console.log(req.body);
  next();
};

server.use(serverLogger);

const sanitize = type => {

    const clean = obj => {
        for (let keyName in obj) {
            if (obj[keyName] === undefined) delete obj[keyName];
        }
        return obj;
    };

    return (req, res, next) => {
        if (type === "action") {
            const { project_id, description, notes, completed } = req.body;
            if (
                project_id === undefined ||
                description === undefined ||
                notes === undefined
            ) {
                res
                    .status(400)
                    .json({
                        error: "Project ID, notes and description, please."
                    });
            }
            req.cleanBody = clean({ project_id, description, notes, completed });
        }

        if (type === "project") {
            const { name, description, completed } = req.body;
            if (name === undefined || description === undefined) {
                res
                    .status(400)
                    .json({ error: "Name and description, please." });
            }
            req.cleanBody = clean({ name, description, completed });
        }

        next();
    };
};


const getMidd = db => {
    return (req, res, next) => {
        let getPromise;
        if (req.params.id !== undefined) getPromise = db.get(Number(req.params.id));
        else getPromise = db.get();
        getPromise
            .then(result => {
                req.getResult = result;
                next();
            })
            .catch(() => {
                res
                    .status(500)
                    .json({ error: "Information could not be retrieved." });
            });
    };
};


const postMidd = db => {
    return (req, res, next) => {
        db.insert(req.cleanBody)
            .then(result => {
                req.postResult = result;
                next();
            })
            .catch(() => {
                res
                    .status(500)
                    .json({ error: "Information could not be posted." });
            });
    };
};


const deleteMidd = db => {
    return (req, res, next) => {
        db.remove(Number(req.params.id))
            .then(result => {
                req.deleteResult = result;
                next();
            })
            .catch(() => {
                res
                    .status(500)
                    .json({ error: "Information could not be deleted." });
            });
    };
};


const putMidd = db => {
    return (req, res, next) => {
        db.update(Number(req.params.id), req.cleanBody)
            .then(result => {
                req
                Result = result;
                next();
            })
            .catch(() => {
                res
                    .status(500)
                    .json({ error: "Information could not be updated." });
            });
    };
};




server.get("/api/actions", getMidd(action), (req, res) => {
    res.json(req.getResult);
});

server.get("/api/projects", getMidd(project), (req, res) => {
    res.json(req.getResult);
});


server.get("/api/actions/:id", getMidd(action), (req, res) => {
    res.json(req.getResult);
});

server.get("/api/projects/:id", getMidd(project), (req, res) => {
    res.json(req.getResult);
});


server.get("/api/projects/:id/actions", getMidd(project), (req, res) => {
    if (req.getResult.actions.length) res.json(req.getResult.actions);
    else res.status(404).json({ error: "No actions." });
});


server.post(
    "/api/actions",
    sanitize("action"),
    postMidd(action),
    (req, res) => {
        res.json(req.postResult);
    }
);

server.post(
    "/api/projects",
    sanitize("project"),
    postMidd(project),
    (req, res) => {
        res.json(req.postResult);
    }
);


server.delete("/api/actions/:id", deleteMidd(action), (req, res) => {
    if (req.deleteResult) res.json({ result: "The action was deleted." });
    else res.status(404).json({ error: "No action was found" });
});

server.delete("/api/projects/:id", deleteMidd(project), (req, res) => {
    if (req.deleteResult) res.json({ result: "The project was deleted." });
    else res.status(404).json({ error: "No projects." });
});


server.put(
    "/api/actions/:id",
    sanitize("action"),
    putMidd(action),
    (req, res) => {
        if (req.putResult) res.json(req.putResult);
        else res.status(404).json({ error: "No action was found." });
    }
);

server.put(
    "/api/projects/:id",
    sanitize("project"),
    putMidd(project),
    (req, res) => {
        if (req.putResult) res.json(req.putResult);
        else res.status(404).json({ error: "No project was found." });
    }
);
