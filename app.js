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
  .post("/connecter", (request, response) => {
    var login = request.body.login;
    var mdp = request.body.mdp;
    console.log({ login, mdp });

    Client.find(login, mdp, function(client) {
      if (client == undefined) {
        console.log("3 : " + client);
        request.flash("error", "Compte inconnu");
        response.redirect("/");
      }
    });
  });

server.listen(8081);
