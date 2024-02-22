function publicAccess(req, res, next) {
  // Existe una sesión iniciada?
  if (req.session.user) {
    return res.redirect("/");
  }

  next();
}

module.exports = publicAccess;
