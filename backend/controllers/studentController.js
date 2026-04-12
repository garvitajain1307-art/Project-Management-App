import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import { check, validationResult } from 'express-validator';
import pkg from '../models/user.js';
const User = pkg;