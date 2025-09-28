const { query } = require('../../config/db');

// Get all routes
const getAllRoutes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause = `WHERE route_name ILIKE $${paramCount} OR description ILIKE $${paramCount}`;
      queryParams.push(`%${search}%`);
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM routes ${whereClause}`,
      queryParams
    );
    const totalRoutes = parseInt(countResult.rows[0].count);

    // Get routes with pagination
    paramCount++;
    const limitParam = `$${paramCount}`;
    paramCount++;
    const offsetParam = `$${paramCount}`;
    queryParams.push(limit, offset);

    const result = await query(
      `SELECT * FROM routes ${whereClause} ORDER BY created_at DESC LIMIT ${limitParam} OFFSET ${offsetParam}`,
      queryParams
    );

    res.status(200).json({
      status: 'success',
      data: {
        routes: result.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(totalRoutes / limit),
          total_routes: totalRoutes,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get route by ID
const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM routes WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Route not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        route: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Create new route
const createRoute = async (req, res) => {
  try {
    const { route_name, description, start_location, end_location, distance, estimated_duration } = req.body;

    const result = await query(
      'INSERT INTO routes (route_name, description, start_location, end_location, distance, estimated_duration) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [route_name, description, start_location, end_location, distance, estimated_duration]
    );

    res.status(201).json({
      status: 'success',
      message: 'Route created successfully',
      data: {
        route: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update route
const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { route_name, description, start_location, end_location, distance, estimated_duration } = req.body;

    const result = await query(
      'UPDATE routes SET route_name = $1, description = $2, start_location = $3, end_location = $4, distance = $5, estimated_duration = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [route_name, description, start_location, end_location, distance, estimated_duration, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Route not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Route updated successfully',
      data: {
        route: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Delete route
const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM routes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Route not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute
};
