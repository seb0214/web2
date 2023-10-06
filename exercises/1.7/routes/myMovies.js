var express = require('express');
const { serialize, parse } = require('../utils/json');
var router = express.Router();

const jsonDbPath = __dirname + '/../data/films.json';

const FILMS = [
  {
    id: 1,
    title: "Avatar",
    duration: 162,
    budget: 237000000,
    link: 'https://www.imdb.com/title/tt0499549/'
  },
  {
    id: 2,
    title: "Le labyrinthe",
    duration: 113,
    budget: 34000000,
    link: 'https://www.imdb.com/title/tt1790864/'
  },
  {
    id: 3,
    title: "Spider-man : No Way Home",
    duration: 148,
    budget: 200000000,
    link: 'https://www.imdb.com/title/tt10872600/'
  },
];

/* GET read movies in function of minimum duration */
router.get('/', function (req, res, next) {
  const minimumFilmDuration = req?.query
    ? Number(req.query['minimum-duration'])
    : undefined;
  if (typeof minimumFilmDuration !== 'number' || minimumFilmDuration <= 0)
    return res.sendStatus(400);

    const films = parse(jsonDbPath, FILMS);

  if (!minimumFilmDuration) return res.json(films);

  const filmsReachingMinimumDuration = films.filter(
    (film) => film.duration >= minimumFilmDuration
  );
  return res.json(filmsReachingMinimumDuration);
});

/* GET one movie  */
router.get('/:id', function (req, res, next) {
  const films = parse(jsonDbPath, FILMS);   

  // recherche de l'index du film mis en paramètre dans le browser
  const indexOfMovieFound = films.findIndex((film) => film.id == req.params.id);

  // envoyer un message d'erreur 404 si pas de film trouvé
  if (indexOfMovieFound < 0 || indexOfMovieFound > films.length) return res.sendStatus(404);

  // affichage du film trouvé en paramètre
  res.json(films[indexOfMovieFound]);
});

/* add a new movie in the tables FILMS  */
router.post('/', function (req, res, next) {

  // vérifie les paramètres du film à créer
  const title = req?.body?.title?.length !== 0 ? req.body.title : undefined;
  const duration = req?.body?.duration > 0 ? req.body.duration : undefined;
  const budget = req?.body?.budget > 0 ? req.body.budget : undefined;
  const link = req?.body?.link?.length !== 0 ? req.body.link : undefined;

  // si une des propriété est pas défini, on renvoi l'erreur 404
  if (!title || !duration || !budget || !link) return res.sendStatus(404);

  const films = parse(jsonDbPath, FILMS);

  // si le titre du film existe déjà, on renvoi l'erreur 409
  for (const mv of films) {
    if (mv.title === title) {
      return res.sendStatus(409);
    }
  }

  // générer un id pour le film crée
  const lastItemIndex = films?.length !== 0 ? films.length - 1 : undefined;
  const lastId = lastItemIndex !== undefined ? films[lastItemIndex]?.id : 0;
  const nextId = lastId + 1;

  // création du nouveau film
  const newMovie = {
    id: nextId,
    title: title,
    duration: duration,
    budget: budget,
    link: link
  };

  // ajout du film dans la liste
  films.push(newMovie);

  serialize(jsonDbPath, films);

  res.json(newMovie);
});

// Delete a movie from FILMS based on its id
router.delete('/:id', (req, res) => {
  const films = parse(jsonDbPath, FILMS);

  const foundIndex = films.findIndex(movie => movie.id == req.params.id);

  if (foundIndex < 0 || foundIndex >= films.length) return res.sendStatus(404);

  const itemsRemovedFromFILMS = films.splice(foundIndex, 1);
  const itemRemoved = itemsRemovedFromFILMS[0];

  serialize(jsonDbPath, films);

  res.json(itemRemoved);
});

// Update a movie based on its id and new values for its parameters
router.patch('/:id', (req, res) => {
  const title = req?.body?.title?.length !== 0 ? req.body.title : undefined;
  const duration = req?.body?.duration > 0 ? req.body.duration : undefined;
  const budget = req?.body?.budget > 0 ? req.body.budget : undefined;
  const link = req?.body?.link?.length !== 0 ? req.body.link : undefined;

  if (!title && !content && !duration && !budget && !link) return res.sendStatus(400);

  const films = parse(jsonDbPath, FILMS);

  const foundIndex = films.findIndex(movie => movie.id == req.params.id);

  if (foundIndex < 0 || foundIndex >= films.length) return res.sendStatus(404);

  const updatedMovie = { ...films[foundIndex], ...req.body };

  films[foundIndex] = updatedMovie;

  serialize(jsonDbPath, films);

  res.json(updatedMovie);
});

// Update or create a movie based on its id and new values for its parameters
router.put('/:id', (req, res) => {
  const title = req?.body?.title?.length !== 0 ? req.body.title : undefined;
  const duration = req?.body?.duration > 0 ? req.body.duration : undefined;
  const budget = req?.body?.budget > 0 ? req.body.budget : undefined;
  const link = req?.body?.link?.length !== 0 ? req.body.link : undefined;

  if (!title || !duration || !budget || !link) return res.sendStatus(400);

  const films = parse(jsonDbPath, FILMS);

  const foundIndex = films.findIndex(movie => movie.id == req.params.id);

  if (foundIndex < 0) return res.sendStatus(404);

  if (foundIndex >= films.length) {
    // générer un id pour le film crée
    const lastItemIndex = films?.length !== 0 ? films.length - 1 : undefined;
    const lastId = lastItemIndex !== undefined ? films[lastItemIndex]?.id : 0;
    const nextId = lastId + 1;

    // création du nouveau film
    const newMovie = {
      id: nextId,
      title: title,
      duration: duration,
      budget: budget,
      link: link
    };

    // ajout du film dans la liste
    films.push(newMovie);

    serialize(jsonDbPath, films);

    res.json(newMovie);
  } else {
    const updatedMovie = { ...films[foundIndex], ...req.body };

    films[foundIndex] = updatedMovie;

    serialize(jsonDbPath, films);

    res.json(updatedMovie);
  }
});

module.exports = router;
