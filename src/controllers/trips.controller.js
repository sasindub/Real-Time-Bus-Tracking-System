const { query } = require('../../config/db');

// Get all trips
const getAllTrips = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, bus_id, route_id } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams = [];
    let paramCount = 0;

    const conditions = [];
    
    if (search) {
      paramCount++;
      conditions.push(`(trip_name ILIKE $${paramCount} OR b.bus_number ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      conditions.push(`t.status = $${paramCount}`);
      queryParams.push(status);
    }

    if (bus_id) {
      paramCount++;
      conditions.push(`t.bus_id = $${paramCount}`);
      queryParams.push(bus_id);
    }

    if (route_id) {
      paramCount++;
      conditions.push(`t.route_id = $${paramCount}`);
      queryParams.push(route_id);
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM trips t 
       LEFT JOIN buses b ON t.bus_id = b.id 
       LEFT JOIN routes r ON t.route_id = r.id 
       ${whereClause}`,
      queryParams
    );
    const totalTrips = parseInt(countResult.rows[0].count);

    // Get trips with pagination and joins
    paramCount++;
    const limitParam = `$${paramCount}`;
    paramCount++;
    const offsetParam = `$${paramCount}`;
    queryParams.push(limit, offset);

    const result = await query(
      `SELECT t.*, b.bus_number, b.driver_name, r.route_name, r.start_location, r.end_location
       FROM trips t 
       LEFT JOIN buses b ON t.bus_id = b.id 
       LEFT JOIN routes r ON t.route_id = r.id 
       ${whereClause} 
       ORDER BY t.created_at DESC 
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      queryParams
    );

    res.status(200).json({
      status: 'success',
      data: {
        trips: result.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(totalTrips / limit),
          total_trips: totalTrips,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get trip by ID
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT t.*, b.bus_number, b.driver_name, b.driver_phone, r.route_name, r.start_location, r.end_location
       FROM trips t 
       LEFT JOIN buses b ON t.bus_id = b.id 
       LEFT JOIN routes r ON t.route_id = r.id 
       WHERE t.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        trip: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Create new trip
const createTrip = async (req, res) => {
  try {
    const { 
      trip_name, 
      bus_id, 
      route_id, 
      scheduled_departure, 
      scheduled_arrival,
      status = 'scheduled'
    } = req.body;

    const result = await query(
      'INSERT INTO trips (trip_name, bus_id, route_id, scheduled_departure, scheduled_arrival, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [trip_name, bus_id, route_id, scheduled_departure, scheduled_arrival, status]
    );

    res.status(201).json({
      status: 'success',
      message: 'Trip created successfully',
      data: {
        trip: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update trip
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      trip_name, 
      bus_id, 
      route_id, 
      scheduled_departure, 
      scheduled_arrival,
      actual_departure,
      actual_arrival,
      status 
    } = req.body;

    const result = await query(
      'UPDATE trips SET trip_name = $1, bus_id = $2, route_id = $3, scheduled_departure = $4, scheduled_arrival = $5, actual_departure = $6, actual_arrival = $7, status = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [trip_name, bus_id, route_id, scheduled_departure, scheduled_arrival, actual_departure, actual_arrival, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Trip updated successfully',
      data: {
        trip: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Delete trip
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM trips WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Start trip
const startTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE trips SET status = $1, actual_departure = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['in_progress', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Trip started successfully',
      data: {
        trip: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Start trip error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Complete trip
const completeTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE trips SET status = $1, actual_arrival = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['completed', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Trip completed successfully',
      data: {
        trip: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Complete trip error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  startTrip,
  completeTrip
};
