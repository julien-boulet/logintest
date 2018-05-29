const app = require("express")();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const Client = require("./models/client");
const session = require("express-session");

// Moteur de template
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "aazeazeeaz",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);
app.use(require("./middlewares/flash"));

// Routes
app
  .get("/", (request, response) => {
    response.render("login-page.ejs");
  })
  .get("/info", (request, response) => {
    response.render("info-page.ejs");
  })
  .post("/connectAccount", (request, response) => {
    var login = request.body.login;
    var mdp = request.body.mdp;

    Client.findByLoginAndMdp(login, mdp, client => {
      if (client == undefined) {
        request.flash("error", "Compte inconnu");
        response.redirect("/");
      } else {
        response.render("info-page.ejs", { login: login });
      }
    });
  })
  .post("/createAccount", (request, response) => {
    var login = request.body.login;
    var mdp = request.body.mdp;

    Client.findByLogin(login, client => {
      if (client != undefined) {
        request.flash("error", "login déjà utilisé");
        response.redirect("/");
      } else {
        Client.create(login, mdp, result => {
          if (result.affectedRows == 1) {
            request.flash("success", "Compte créé");
            response.render("info-page.ejs", { login: login });
          } else {
            request.flash("error", "une erreur s'est produite");
            response.redirect("/");
          }
        });
      }
    });
  })
  .post("/changeMDP", (request, response) => {
    var login = request.body.login;
    var oldPW = request.body.oldPW;
    var newPW = request.body.newPW;

    console.log({ login, oldPW, newPW });
      Client.changMDP(login, oldPW, newPW, result => {
          if (result.affectedRows == 1) {
              request.flash("success", "MDP changé");
              response.render("info-page.ejs", { login: login });
          } else {
              request.flash("error", "une erreur s'est produite");
              response.redirect("/");
          }
      });
  });

server.listen(8081);
