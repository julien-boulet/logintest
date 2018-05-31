const app = require("express")();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const Client = require("./models/client");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./profilPictures");
  },
  filename: function(req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + currentClient.id + "-" + file.originalname
    );
  }
});
const upload = multer({ storage: storage }).array("profilPicture", 2);

// Moteur de template
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("./middlewares/session"));
app.use(require("./middlewares/flash"));

// stock le client logguer
var currentClient = null;

// Routes
app
  .get("/", (request, response) => {
    if (request.session.id) {
      const clientId = request.session.clientId;
      Client.findbyId(clientId, client => {
        if (client != undefined) {
          request.session.clientId = client.id;
          response.render("info-page.ejs", { login: client.login });
        } else {
          response.render("login-page.ejs");
        }
      });
    } else {
      response.render("login-page.ejs");
    }
  })
  .get("/logout", function(req, res) {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
      } else {
        currentClient = null;
        res.redirect("/");
      }
    });
  })
  .post("/connectAccount", (request, response) => {
    const login = request.body.login;
    const mdp = request.body.mdp;

    Client.findByLoginAndMdp(login, mdp, client => {
      if (client == undefined) {
        currentClient = null;
        request.flash("error", "Compte inconnu");
        response.redirect("/");
      } else {
        currentClient = client;
        request.session.clientId = client.id;
        response.render("info-page.ejs", { login: login });
      }
    });
  })
  .post("/createAccount", (request, response) => {
    const login = request.body.login;
    const mdp = request.body.mdp;

    if (mdp === undefined || mdp == "") {
      request.flash("error", "Le MDP ne doit pas etre vide");
      response.redirect("/");
    } else if (login === undefined || login == "") {
      request.flash("error", "Le login ne doit pas etre vide");
      response.redirect("/");
    } else {
      Client.findByLogin(login, client => {
        if (client != undefined) {
          request.flash("error", "login déjà utilisé");
          response.redirect("/");
        } else {
          Client.create(login, mdp, result => {
            if (result.affectedRows == 1) {
              // todo : faire un select pour recuperer le client et le mettre dans currentClient

              response.flash("success", "Compte créé");
              request.session.clientId = result.insertId;
              response.render("info-page.ejs", { login: login });
            } else {
              request.flash("error", "une erreur s'est produite");
              response.redirect("/");
            }
          });
        }
      });
    }
  })
  .post("/changeMDP", (request, response) => {
    const login = request.body.login;
    const oldPW = request.body.oldPW;
    const newPW = request.body.newPW;

    if (newPW === undefined || newPW == "") {
      response.flash("error", "Le nouveau MDP ne doit pas etre vide");
      response.render("info-page.ejs", { login: login });
    } else if (newPW == oldPW) {
      response.flash("error", "Le nouveau MDP doit etre different de l'ancien");
      response.render("info-page.ejs", { login: login });
    } else {
      Client.changMDP(login, oldPW, newPW, result => {
        if (result.affectedRows == 1) {
          response.flash("success", "MDP changé");
        } else {
          response.flash("error", "une erreur s'est produite");
        }
        response.render("info-page.ejs", { login: login });
      });
    }
  })
  .post("/upload/profilPicture", (req, res) => {
    upload(req, res, err => {
      if (err) {
        return res.end("Something went wrong!");
      }
    });
  });

server.listen(8081);
