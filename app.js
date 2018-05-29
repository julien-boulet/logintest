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
  .post("/connectAccount", (request, response) => {
    const login = request.body.login;
    const mdp = request.body.mdp;

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
    const login = request.body.login;
    const mdp = request.body.mdp;

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
    const login = request.body.login;
    const oldPW = request.body.oldPW;
    const newPW = request.body.newPW;

    Client.changMDP(login, oldPW, newPW, result => {
      if (result.affectedRows == 1) {
        request.flash("success", "MDP changé");
        response.render("info-page.ejs", { login: login });
      } else {
        request.flash("error", "une erreur s'est produite");
        response.render("info-page.ejs", { login: login });
      }
    });
  });

server.listen(8081);
