import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import session from 'express-session';
import WebAppAuthProvider from 'msal-node-wrapper';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const authConfig = {
  auth: {
    clientId: "6ba2adad-5129-46eb-9989-7ec2d40ef416",
    authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    clientSecret: "-fu8Q~XFAwhptLbE6y6WxOd06MHx~_9xWlLljapf",
    redirectUri: "https://bop-it-final-project-back.onrender.com/redirect"
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 3,
    }
  }
};

import apiV1Router from './routes/api/v1/apiv1.js';
import models from './models.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
app.enable('trust proxy');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: 'https://taiiwininfo441.me', 
  credentials: true
}));

// allow requests from frontend to come here  

// pass models as middleware 
app.use((req, res, next) => {
  req.models = models;
  next();
});

// session middleware
app.use(session({
  secret: "my secret is super secret",
  saveUninitialized: true,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none", // Allow cross-origin cookies
    secure: true, // Ensure cookies are sent over HTTPS
  },
  resave: false,
}));

// debugging
app.use((req, res, next) => {
  console.log("Session:", req.session);
  next();
});

// authentication
const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use('/api/v1', apiV1Router);

// auth routes
app.get('/signin', (req, res, next) => {
  return req.authContext.login({
    postLoginRedirectUri: "https://bop-it-final-project-back.onrender.com/redirect",
  })(req, res, next);
});

app.get('/redirect', (req, res) => {
  if (req.session.account) {
    res.redirect('https://taiiwininfo441.me');
  } else {
    res.status(401).send("Authentication failed.");
  }
});

app.get('/signout', (req, res, next) => {
  return req.authContext.logout({
    postLogoutRedirectUri: "https://taiiwininfo441.me", // redirect to frontend after logout
  })(req, res, next);
});

app.use(authProvider.interactionErrorHandler());

export default app;
