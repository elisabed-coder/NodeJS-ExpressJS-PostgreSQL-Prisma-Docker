import jwt from "jsonwebtoken";

// the middleware interceps the end point receving a netwoek request. so it gets there just first and its like a security layer.

// the purpose of the middleware is we intercept the Network request and we read in the token and we verify that the token is valid for that particular user.

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    req.userId = decoded.id;
    next();
  });
}

export default authMiddleware;
