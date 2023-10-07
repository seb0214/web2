const express = require('express');
const path = require('node:path');
const { serialize, parse } = require('../utils/json');

const router = express.Router();

const jsonDbPath = path.join(__dirname, '/../data/films.json');

const FILMS = [
  {
    id: 1,
    title: 'Avatar',
    duration: 162,
    budget: 237000000,
    link: 'https://www.imdb.com/title/tt0499549/',
  },
  {
    id: 2,
    title: 'Le labyrinthe',
    duration: 113,
    budget: 34000000,
    link: 'https://www.imdb.com/title/tt1790864/',
  },
  {
    id: 3,
    title: 'Spider-man : No Way Home',
    duration: 148,
    budget: 200000000,
    link: 'https://www.imdb.com/title/tt10872600/',
  },
];

/* GET read movies in function of minimum duration */
router.get('/', (req, res) => {
  const minimumFilmDuration = req?.query ? Number(req.query['minimum-duration']) : undefined;
  if (typeof minimumFilmDuration !== 'number' || minimumFilmDuration <= 0)
    return res.sendStatus(400);

  const films = parse(jsonDbPath, FILMS);

  if (!minimumFilmDuration) return res.json(films);

  const filmsReachingMinimumDuration = films.filter((film) => film.duration >= minimumFilmDuration);
  return res.json(filmsReachingMinimumDuration);
});

/* GET one movie  */
router.get('/:id', (req, res) => {
  const films = parse(jsonDbPath, FILMS);

  // recherche de l'index du film mis en paramètre dans le browser
  const indexOfMovieFound = films.findIndex((film) => film.id === Number(req.params.id));

  // envoyer un message d'erreur 404 si pas de film trouvé
  if (indexOfMovieFound < 0 || indexOfMovieFound > films.length) return res.sendStatus(404);

  // affichage du film trouvé en paramètre
  return res.json(films[indexOfMovieFound]);
});

/* add a new movie in the tables FILMS  */
router.post('/', (req, res) => {
  const title = req?.body?.title?.trim()?.length !== 0 ? req.body.title : undefined;
  const link = req?.body?.content?.trim().length !== 0 ? req.body.link : undefined;
  const duration =
    typeof req?.body?.duration !== 'number' || req.body.duration < 0
      ? undefined
      : req.body.duration;
  const budget =
    typeof req?.body?.budget !== 'number' || req.body.budget < 0 ? undefined : req.body.budget;

  if (!title || !link || !duration || !budget) return res.sendStatus(400);

  const films = parse(jsonDbPath, FILMS);

  const existingFilm = films.find((film) => film.title.toLowerCase() === title.toLowerCase());
  if (existingFilm) return res.sendStatus(409);

  const lastItemIndex = films?.length !== 0 ? films.length - 1 : undefined;
  const lastId = lastItemIndex !== undefined ? films[lastItemIndex]?.id : 0;
  const nextId = lastId + 1;

  const newFilm = { id: nextId, title, link, duration, budget };

  films.push(newFilm);

  serialize(jsonDbPath, films);

  return res.json(newFilm);
});

// Delete a movie from FILMS based on its id
router.delete('/:id', (req, res) => {
  const films = parse(jsonDbPath, FILMS);

  const foundIndex = films.findIndex((movie) => movie.id === Number(req.params.id));

  if (foundIndex < 0 || foundIndex >= films.length) return res.sendStatus(404);

  const itemsRemovedFromFILMS = films.splice(foundIndex, 1);
  const itemRemoved = itemsRemovedFromFILMS[0];

  serialize(jsonDbPath, films);

  return res.json(itemRemoved);
});

// Update a movie based on its id and new values for its parameters
router.patch('/:id', (req, res) => {
  const title = req?.body?.title?.length !== 0 ? req.body.title : undefined;
  const duration = req?.body?.duration > 0 ? req.body.duration : undefined;
  const budget = req?.body?.budget > 0 ? req.body.budget : undefined;
  const link = req?.body?.link?.length !== 0 ? req.body.link : undefined;

  if (!title && !duration && !budget && !link) return res.sendStatus(400);

  const films = parse(jsonDbPath, FILMS);

  const foundIndex = films.findIndex((movie) => movie.id === Number(req.params.id));

  if (foundIndex < 0 || foundIndex >= films.length) return res.sendStatus(404);

  const updatedMovie = { ...films[foundIndex], ...req.body };

  films[foundIndex] = updatedMovie;

  serialize(jsonDbPath, films);

  return res.json(updatedMovie);
});

// Update or create a movie based on its id and new values for its parameters
router.put('/:id', (req, res) => {
  const title = req?.body?.title?.length !== 0 ? req.body.title : undefined;
  const duration = req?.body?.duration > 0 ? req.body.duration : undefined;
  const budget = req?.body?.budget > 0 ? req.body.budget : undefined;
  const link = req?.body?.link?.length !== 0 ? req.body.link : undefined;

  if (!title || !duration || !budget || !link) return res.sendStatus(400);

  const films = parse(jsonDbPath, FILMS);

  const foundIndex = films.findIndex((movie) => movie.id === Number(req.params.id));

  if (foundIndex < 0) return res.sendStatus(404);

  if (foundIndex >= films.length) {
    // générer un id pour le film crée
    const lastItemIndex = films?.length !== 0 ? films.length - 1 : undefined;
    const lastId = lastItemIndex !== undefined ? films[lastItemIndex]?.id : 0;
    const nextId = lastId + 1;

    // création du nouveau film
    const newMovie = {
      id: nextId,
      title,
      duration,
      budget,
      link,
    };

    // ajout du film dans la liste
    films.push(newMovie);

    serialize(jsonDbPath, films);

    return res.json(newMovie);
  } 
    const updatedMovie = { ...films[foundIndex], ...req.body };

    films[foundIndex] = updatedMovie;

    serialize(jsonDbPath, films);

    return res.json(updatedMovie);
});

module.exports = router;
