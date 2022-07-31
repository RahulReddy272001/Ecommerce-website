const jwt = require("jsonwebtoken")




const verifyToken = (req, resp, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) resp.status(403).json("Token is not valid!")
      req.user = user;
      next();
    })
  } else {
    return resp.status(401).json("you are not authenticated!")
  }
}

const verifyTokenAndAuthorization = (req, resp, next) => {
  verifyToken(req, resp, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    }
    else {
      resp.status(403).json("you are not alowed to do that!")
    }
  })
}


const verifyTokenAndadmin = (req, resp, next) => {
  verifyToken(req, resp, () => {
    if (
      req.user.isAdmin) {
      next();
    }
    else {
      resp.status(403).json("you are not alowed to do that!")
    }
  })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndadmin }