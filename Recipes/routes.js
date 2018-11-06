const recipes = require('express').Router();
const service = require('./service');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt(
  {
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://quentinchap.eu.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://beerfactory-recipes.glitch.me/',
    issuer: 'https://quentinchap.eu.auth0.com/',
    algorithms: ['RS256']
  }
).unless({path: [{url:/^\/api\/recipe\.*/, methods: ['GET']}]});

recipes.use(checkJwt);
recipes.use(function(err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
      res.status(err.status).send({message:err.message});
      console.error(err);
      return;
    }
 next();
});

recipes.get('/recipe', (req, res) => { service.getByPage(req.query.page || 1,req.query.per_page || 10).then(recipes => res.status(200).json({ recipes })); });
recipes.get('/updateBrewdogRecipe', (req, res) => { return service.updateBrewdogRecipe().then(response => res.status(200).json(response));});
recipes.get('/recipe/:id', (req, res) => { return service.getById(req.params.id).then(response => res.status(200).json({recipe:response[0]}));});


export default recipes;