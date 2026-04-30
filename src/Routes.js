import express, { Router } from "express";
import sql from "./bd.js";
import { CompararHash, CriarHash } from "./utils.js";

const routes = express.Router();
