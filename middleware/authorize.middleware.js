const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role?.toLowerCase();
      const isAllowed = allowedRoles.map(r => r.toLowerCase()).includes(userRole);
      if (!isAllowed) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    };
  };
  
  export default authorizeRoles;
  