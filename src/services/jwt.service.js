const jwt = require('jsonwebtoken');

class JWTService {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN || '24h';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  // Generate access token
  generateToken(payload) {
    try {
      return jwt.sign(payload, this.secret, {
        expiresIn: this.accessTokenExpiry,
        issuer: 'ntc-bus-tracker',
        audience: 'ntc-bus-tracker-users'
      });
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Token generation failed');
    }
  }

  // Generate refresh token
  generateRefreshToken(payload) {
    try {
      return jwt.sign(payload, this.refreshSecret, {
        expiresIn: this.refreshTokenExpiry,
        issuer: 'ntc-bus-tracker',
        audience: 'ntc-bus-tracker-users'
      });
    } catch (error) {
      console.error('Error generating refresh token:', error);
      throw new Error('Refresh token generation failed');
    }
  }

  // Generate both access and refresh tokens
  generateTokenPair(payload) {
    const accessToken = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken({ id: payload.id });
    
    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.accessTokenExpiry
    };
  }

  // Verify access token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      throw error;
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshSecret);
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      }
      throw error;
    }
  }

  // Decode token without verification (for inspection)
  decodeToken(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Get token expiration time
  getTokenExpiration(token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(token) {
    try {
      const expiration = this.getTokenExpiration(token);
      if (!expiration) return true;
      return expiration < new Date();
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Generate token with custom expiry
  generateTokenWithExpiry(payload, expiresIn) {
    try {
      return jwt.sign(payload, this.secret, {
        expiresIn,
        issuer: 'ntc-bus-tracker',
        audience: 'ntc-bus-tracker-users'
      });
    } catch (error) {
      console.error('Error generating token with custom expiry:', error);
      throw new Error('Token generation failed');
    }
  }

  // Generate password reset token
  generatePasswordResetToken(userId) {
    const payload = {
      id: userId,
      type: 'password_reset'
    };
    
    return this.generateTokenWithExpiry(payload, '1h'); // 1 hour expiry for password reset
  }

  // Generate email verification token
  generateEmailVerificationToken(userId) {
    const payload = {
      id: userId,
      type: 'email_verification'
    };
    
    return this.generateTokenWithExpiry(payload, '24h'); // 24 hours for email verification
  }

  // Verify password reset token
  verifyPasswordResetToken(token) {
    try {
      const decoded = this.verifyToken(token);
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw error;
    }
  }

  // Verify email verification token
  verifyEmailVerificationToken(token) {
    try {
      const decoded = this.verifyToken(token);
      if (decoded.type !== 'email_verification') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw error;
    }
  }

  // Extract token from Authorization header
  extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  // Get token info (without verification)
  getTokenInfo(token) {
    try {
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded) {
        return null;
      }

      return {
        header: decoded.header,
        payload: decoded.payload,
        signature: decoded.signature,
        expiresAt: decoded.payload.exp ? new Date(decoded.payload.exp * 1000) : null,
        issuedAt: decoded.payload.iat ? new Date(decoded.payload.iat * 1000) : null,
        issuer: decoded.payload.iss,
        audience: decoded.payload.aud
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      return null;
    }
  }
}

// Create singleton instance
const jwtService = new JWTService();

module.exports = jwtService;
