const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

const prisma = new PrismaClient();

module.exports = prisma;
