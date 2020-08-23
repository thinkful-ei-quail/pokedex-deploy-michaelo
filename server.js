require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
const POKEDEX = require('./pokedex.json');

(process.env.API_TOKEN);

//Validation
app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;
  ('validate bearer token middleware');
  if (!authToken || authToken.split(' ').pop() !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to the next middleware
  next();
});

//Types
const validTypes = ['Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'];
function handleGetTypes(req, res) {
  res.json(validTypes);
}
app.get('/types', handleGetTypes);

//Pokemon
function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;

  // filter our pokemon by name if name query param is present
  if (req.query.name) {
    response = response.filter(pokemon =>
      // case insensitive searching
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    );
  }

  // filter our pokemon by type if type query param is present
  if (req.query.type) {
    response = response.filter(pokemon =>
      pokemon.type.includes(req.query.type)
    );
  }
  res.json(response);
}
app.get('/pokemon', handleGetPokemon);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  (`Server listening at http://localhost:${PORT}`);
});