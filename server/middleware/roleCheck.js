/**
 * Role-Based Access Control Middleware
 * @param  {...string} allowedRoles - Allowed user roles ('customer', 'provider', 'admin')
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. This action requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

export default requireRole;
