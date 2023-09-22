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

/* GET movies page. */
router.get('/', function(req, res, next) {
  res.json(FILMS);
});

module.exports = router;
