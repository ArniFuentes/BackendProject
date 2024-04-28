const authRoleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: "error", error: "Forbiden" });
    }
    next();
  };
};

export default authRoleMiddleware;
