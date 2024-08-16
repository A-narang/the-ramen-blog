// imports
import express from 'express';
import debugModule from 'debug';
import pkg from 'mongodb';
import dotenv from 'dotenv';

import passport from 'passport';
import {LocalStrategy} from 'passport-local'


var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var db = require('../db');

const debug = debugModule('app:authRouter');

const { MongoClient } = pkg;
dotenv.config();

// constants
const authRouter = express.Router();
const url = process.env.MONGODB_URL;
const dbName = 'test';
const collection = 'testers'

authRouter.get('/sign-in', (req, res) => {
    res.render('sign-in')
})

authRouter.get('/sign-up', (req, res) => {
    res.render('sign-up')
})

export default authRouter;