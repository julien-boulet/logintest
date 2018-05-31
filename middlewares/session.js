const session = require("express-session");

module.exports = session({
    secret: "aazeazeeaz",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
});
