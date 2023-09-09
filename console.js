require("dotenv").config();
const db = require('./models')

const repl = require('node:repl');

repl.start('> ').context.db = db;
