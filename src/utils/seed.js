import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Route from '../models/route.model.js';
import Bus from '../models/bus.model.js';
import Trip from '../models/trip.model.js';
import Location from '../models/location.model.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

const MONGO_URI = process.env.MONGO_URI;
const SALT_ROUNDS = 10;

const routesData = [
  {
    code: 'COLOM-KANDY-01',
    name: 'Colombo – Kandy',
    origin: 'Colombo',
    destination: 'Kandy',
    distance_km: 115,
    stops: [
      { name: 'Colombo Fort', lat: 6.9348, lng: 79.8468 },
      { name: 'Uh... Kandy Central', lat: 7.2906, lng: 80.6337 }
    ]
  },
  {
    code: 'COLOM-GALLE-01',
    name: 'Colombo – Galle',
    origin: 'Colombo',
    destination: 'Galle',
    distance_km: 119,
    stops: [{ name: 'Colombo Fort', lat: 6.9348, lng: 79.8468 }, { name: 'Galle Fort', lat: 6.032, lng: 80.216 }]
  },
  {
    code: 'COLOM-TRINCO-01',
    name: 'Colombo – Trincomalee',
    origin: 'Colombo',
    destination: 'Trincomalee',
    distance_km: 260,
    stops: []
  },
  {
    code: 'COLOM-JAFFNA-01',
    name: 'Colombo – Jaffna',
    origin: 'Colombo',
    destination: 'Jaffna',
    distance_km: 394,
    stops: []
  },
  {
    code: 'COLOM-BATT-01',
    name: 'Colombo – Batticaloa',
    origin: 'Colombo',
    destination: 'Batticaloa',
    distance_km: 310,
    stops: []
  }
];

const BUS_OPERATORS = ['ABC Travels', 'Saman Transport', 'Lakpahana', 'Sugath', 'BlueLine'];

const randomBetween = (min, max) => Math.random()*(max-min)+min;
const addMinutes = (d, mins) => new Date(d.getTime() + mins*60000);

const createSeed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('connected to db');

  // clear collections
  await Promise.all([Route.deleteMany({}), Bus.deleteMany({}), Trip.deleteMany({}), Location.deleteMany({}), User.deleteMany({})]);

  const createdRoutes = [];
  for (const r of routesData) {
    const route = await Route.create(r);
    createdRoutes.push(route);
  }

  // Create 25 buses, distributed across the 5 routes
  const buses = [];
  for (let i=1;i<=25;i++) {
    const route = createdRoutes[i % createdRoutes.length];
    const bus = await Bus.create({
      plateNumber: `WP-${1000 + i}`,
      operatorName: BUS_OPERATORS[i % BUS_OPERATORS.length],
      capacity: 50,
      model: `Volvo-${i%5 + 1}`,
      assignedRoute: route._id,
      status: 'idle'
    });
    buses.push(bus);
  }

  // Create trips for next 7 days for each route (2 trips per day per route)
  const trips = [];
  const now = new Date();
  for (let d=0; d<7; d++) {
    for (const route of createdRoutes) {
      for (let t=0; t<2; t++) { // two trips per day
        const departure = addMinutes(new Date(now.getFullYear(), now.getMonth(), now.getDate()+d, 6 + t*8, 0), Math.floor(Math.random()*60)); // 6:00 or 14:00 +- random
        const bus = buses[Math.floor(Math.random()*buses.length)];
        const trip = await Trip.create({
          bus: bus._id,
          route: route._id,
          departureTime: departure,
          status: 'scheduled'
        });
        trips.push(trip);
      }
    }
  }

  // create one admin and one operator and one commuter
  const adminPass = await bcrypt.hash('adminpass', SALT_ROUNDS);
  const opPass = await bcrypt.hash('operatorpass', SALT_ROUNDS);
  const commuterPass = await bcrypt.hash('commuterpass', SALT_ROUNDS);

  const admin = await User.create({ name: 'Admin User', email: 'admin@example.com', password: adminPass, role: 'admin' });
  const operator = await User.create({ name: 'Operator One', email: 'operator@example.com', password: opPass, role: 'operator' });
  const commuter = await User.create({ name: 'Commuter One', email: 'commuter@example.com', password: commuterPass, role: 'commuter' });

  // generate a few random locations for each bus to simulate movement
  const locations = [];
  for (const bus of buses) {
    const baseLat = randomBetween(6.5, 7.5);
    const baseLng = randomBetween(79.8, 80.6);
    for (let k=0; k<5; k++) {
      const loc = await Location.create({
        bus: bus._id,
        timestamp: addMinutes(new Date(), -k*5),
        lat: baseLat + randomBetween(-0.1, 0.1),
        lng: baseLng + randomBetween(-0.1, 0.1),
        speed_kmph: Math.floor(randomBetween(40,90)),
      });
      locations.push(loc);
    }
    // set bus currentLocation to last created
    bus.currentLocation = locations[locations.length - 1]._id;
    bus.status = 'enroute';
    await bus.save();
  }

  // write simulation JSON file with routes, buses, trips, locations
  const out = {
    generatedAt: new Date(),
    routes: createdRoutes,
    buses: buses,
    trips: trips,
    locations: locations,
    users: [admin, operator, commuter]
  };

  const outPath = path.join(process.cwd(), 'seeds', 'simulation.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log('seed complete - simulation written to seeds/simulation.json');

  await mongoose.disconnect();
  console.log('disconnected');
};

createSeed().catch(err => {
  console.error(err);
  process.exit(1);
});
