const { query } = require('../../config/db');

// Get all buses
const getAllBuses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams = [];
    let paramCount = 0;

    const conditions = [];
    
    if (search) {
      paramCount++;
      conditions.push(`(bus_number ILIKE $${paramCount} OR driver_name ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      conditions.push(`status = $${paramCount}`);
      queryParams.push(status);
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM buses ${whereClause}`,
      queryParams
    );
    const totalBuses = parseInt(countResult.rows[0].count);

    // Get buses with pagination
    paramCount++;
    const limitParam = `$${paramCount}`;
    paramCount++;
    const offsetParam = `$${paramCount}`;
    queryParams.push(limit, offset);

    const result = await query(
      `SELECT * FROM buses ${whereClause} ORDER BY created_at DESC LIMIT ${limitParam} OFFSET ${offsetParam}`,
      queryParams
    );

    res.status(200).json({
      status: 'success',
      data: {
        buses: result.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(totalBuses / limit),
          total_buses: totalBuses,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get buses error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get bus by ID
const getBusById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM buses WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        bus: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Get bus error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Create new bus
const createBus = async (req, res) => {
  try {
    const { 
      bus_number, 
      driver_name, 
      driver_phone, 
      capacity, 
      model, 
      year, 
      status = 'active',
      route_id 
    } = req.body;

    const result = await query(
      'INSERT INTO buses (bus_number, driver_name, driver_phone, capacity, model, year, status, route_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [bus_number, driver_name, driver_phone, capacity, model, year, status, route_id]
    );

    res.status(201).json({
      status: 'success',
      message: 'Bus created successfully',
      data: {
        bus: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Create bus error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update bus
const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      bus_number, 
      driver_name, 
      driver_phone, 
      capacity, 
      model, 
      year, 
      status,
      route_id 
    } = req.body;

    const result = await query(
      'UPDATE buses SET bus_number = $1, driver_name = $2, driver_phone = $3, capacity = $4, model = $5, year = $6, status = $7, route_id = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [bus_number, driver_name, driver_phone, capacity, model, year, status, route_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Bus updated successfully',
      data: {
        bus: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Update bus error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Delete bus
const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM buses WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Bus deleted successfully'
    });
  } catch (error) {
    console.error('Delete bus error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update bus location
const updateBusLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, speed, direction } = req.body;

    // Update bus location
    const result = await query(
      'UPDATE buses SET current_latitude = $1, current_longitude = $2, speed = $3, direction = $4, last_location_update = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [latitude, longitude, speed, direction, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Bus not found'
      });
    }

    // Insert location history
    await query(
      'INSERT INTO location_history (bus_id, latitude, longitude, speed, direction, timestamp) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)',
      [id, latitude, longitude, speed, direction]
    );

    res.status(200).json({
      status: 'success',
      message: 'Bus location updated successfully',
      data: {
        bus: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Update bus location error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  updateBusLocation
};
