var express = require('express');
var router = express.Router();

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
  // récupère la durée minimum et la stocké dans une variable
  const minimumDuration = req?.query['minimum-duration'] ? req.query['minimum-duration'] : undefined;

  // trie le tableau par ordre décroissant de durée
  let orderedMovies = [...FILMS].sort((a, b) => b.duration - a.duration);

  // parcourir le tableau en ne gardant que ceux avec une durée minimum écris en paramètre dans le browser

  for (let i = orderedMovies.length - 1; i >= 0; i--) {
    console.log(orderedMovies[i].duration);
    if (orderedMovies[i].duration < minimumDuration) {
      orderedMovies.pop();
    } else {
      if(orderedMovies[i].duration > minimumDuration) {
        break;
      }
    }
  };

  res.json(orderedMovies);
});

/* GET movies page. */
router.get('/', function (req, res, next) {
  res.json(FILMS);
});

/* GET one movie  */
router.get('/:id', function (req, res, next) {
  // recherche de l'index du film mis en paramètre dans le browser
  const indexOfMovieFound = FILMS.findIndex((film) => film.id == req.params.id);

  // envoyer un message d'erreur 404 si pas de film trouvé
  if (indexOfMovieFound < 0 || indexOfMovieFound > FILMS.length) return res.sendStatus(404);

  // affichage du film trouvé en paramètre
  res.json(FILMS[indexOfMovieFound]);
});

/* add a new movie in the tables FILMS  */
router.post('/', function (req, res, next) {

  // vérifie les paramètres du film à créer
  const title = req?.body?.title?.length !== 0 ? req.body.title : undefined;
  const duration = req?.body?.duration > 0 ? req.body.duration : undefined;
  const budget = req?.body?.budget > 0 ? req.body.budget : undefined;
  const link = req?.body?.link?.length !== 0 ? req.body.link : undefined;

  // si une des propriété est pas défini, on renvoi l'erreur 404
  if(!title || !duration || !budget || !link) return res.sendStatus(404);

  // générer un id pour le film crée
  const lastItemIndex = FILMS?.length !== 0 ? FILMS.length - 1 : undefined;
  const lastId = lastItemIndex !== undefined ? FILMS[lastItemIndex]?.id : 0;
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
  FILMS.push(newMovie);

  res.json(newMovie);
});

module.exports = router;
