import recipes from '../Recipes/routes';

const express = require('express');
const app = express();
const routes = require('express').Router();
const bodyParser = require('body-parser');

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: true }));

routes.use('/api', recipes);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = routes;