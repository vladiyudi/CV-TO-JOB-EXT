function autoMatchMiddleware(User) {
  return function(req, res, next) {
    if (req.query.autoMatch === 'true') {
      User.findById(req.user.id)
        .then(user => {
          if (user && user.jobDescription) {
            req.body.jobDescription = user.jobDescription;
            next();
          } else {
            res.status(400).json({ message: 'No job description found' });
          }
        })
        .catch(error => {
          res.status(500).json({ message: 'Error retrieving job description' });
        });
    } else {
      next();
    }
  };
}

module.exports = { autoMatchMiddleware };