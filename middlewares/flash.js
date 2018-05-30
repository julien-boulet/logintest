module.exports = (request, response, next) => {
  if (request.session.flash) {
    response.locals.flash = request.session.flash;
    request.session.flash = undefined;
  }

  request.flash = (type, content) => {
    if (request.session.flash === undefined) {
      request.session.flash = {};
    }
    request.session.flash[type] = content;
  };

  response.flash = (type, content) => {
    if (response.locals.flash === undefined) {
      response.locals.flash = {};
    }
    response.locals.flash[type] = content;
  };

  next();
};
