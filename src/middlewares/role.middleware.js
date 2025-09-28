// Role-based access control middleware

// Check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Admin access required'
    });
  }

  next();
};

// Check if user is admin or moderator
const requireAdminOrModerator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }

  const allowedRoles = ['admin', 'moderator'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      status: 'error',
      message: 'Admin or moderator access required'
    });
  }

  next();
};

// Check if user can access resource (owner or admin)
const requireOwnershipOrAdmin = (resourceUserIdField = 'user_id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId.toString() === req.user.id.toString()) {
      return next();
    }

    return res.status(403).json({
      status: 'error',
      message: 'Access denied - insufficient permissions'
    });
  };
};

// Check if user can modify their own data or admin can modify any
const requireSelfOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }

  const targetUserId = req.params.userId || req.params.id;
  
  // Admin can modify any user
  if (req.user.role === 'admin') {
    return next();
  }

  // User can only modify their own data
  if (targetUserId && targetUserId.toString() === req.user.id.toString()) {
    return next();
  }

  return res.status(403).json({
    status: 'error',
    message: 'Access denied - can only modify own data'
  });
};

// Check if user has permission for specific action
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Define role permissions
    const rolePermissions = {
      admin: [
        'users.read', 'users.write', 'users.delete',
        'routes.read', 'routes.write', 'routes.delete',
        'buses.read', 'buses.write', 'buses.delete',
        'trips.read', 'trips.write', 'trips.delete',
        'locations.read', 'locations.write', 'locations.delete',
        'reports.read', 'reports.write'
      ],
      moderator: [
        'users.read',
        'routes.read', 'routes.write',
        'buses.read', 'buses.write',
        'trips.read', 'trips.write',
        'locations.read', 'locations.write',
        'reports.read'
      ],
      user: [
        'routes.read',
        'buses.read',
        'trips.read',
        'locations.read'
      ]
    };

    const userPermissions = rolePermissions[req.user.role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        status: 'error',
        message: `Permission '${permission}' required`
      });
    }

    next();
  };
};

// Check if user can access bus data (driver or admin)
const requireBusAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }

  // Admin can access all buses
  if (req.user.role === 'admin') {
    return next();
  }

  // Driver can only access their assigned bus
  if (req.user.role === 'driver') {
    const busId = req.params.busId || req.params.id;
    
    if (!busId) {
      return res.status(400).json({
        status: 'error',
        message: 'Bus ID required'
      });
    }

    // Check if user is assigned to this bus
    // This would require a driver_bus_assignment table or similar
    // For now, we'll allow access if the user has driver role
    return next();
  }

  return res.status(403).json({
    status: 'error',
    message: 'Access denied - insufficient permissions for bus data'
  });
};

// Check if user can access trip data
const requireTripAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }

  // Admin and moderator can access all trips
  if (['admin', 'moderator'].includes(req.user.role)) {
    return next();
  }

  // Regular users can only view trip information
  if (req.method === 'GET') {
    return next();
  }

  return res.status(403).json({
    status: 'error',
    message: 'Access denied - insufficient permissions for trip modification'
  });
};

// Rate limiting based on user role
const roleBasedRateLimit = (limits) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    const userLimit = limits[userRole] || limits.default || { requests: 100, window: 15 * 60 * 1000 }; // 15 minutes

    // This is a basic implementation
    // In production, you'd want to use a proper rate limiting library like express-rate-limit
    // with Redis or similar for distributed systems
    
    req.rateLimit = userLimit;
    next();
  };
};

module.exports = {
  requireRole,
  requireAdmin,
  requireAdminOrModerator,
  requireOwnershipOrAdmin,
  requireSelfOrAdmin,
  requirePermission,
  requireBusAccess,
  requireTripAccess,
  roleBasedRateLimit
};
