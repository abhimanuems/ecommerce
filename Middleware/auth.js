exports.userLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
};

exports.userLogout = (req, res) => {
  req.session.user = false;
  req.session.destroy();
  res.redirect("/");
};

//admin

exports.adminLoggedIn = (req, res, next) => {
  if (req.session.isAdmin) {
    next();   
  } else {
    res.redirect("/admin/login");
  }
};

exports.adminLogout = (req, res) => {
  req.session.admin = false;
  req.session.destroy();
  res.redirect("/admin/login");
};
