const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

//GET ALL MOVIES
router.get('/', (req, res) => {
    //Grab id, title, poster, and description and sort by title alphabetically
    const queryText = `SELECT "id", "title", "poster", "description" FROM "movies" ORDER BY "title" ASC;`;
    pool.query(queryText)
        .then((result) => {
        res.send(result.rows); 
    })
        .catch((err) => {
            console.log('Error completing SELECT MOVIES query', err);
            res.sendStatus(500);
        });
});

//GET SELECTED MOVIE DETAILS
router.get('/title/:id', (req, res) => {
    console.log('the req is:', req.params.id);
    const queryText = `SELECT * FROM "movies" WHERE "id" = $1`;
    pool.query(queryText, [req.params.id])
        .then((result) => { 
        res.send(result.rows); 
    })
        .catch((err) => {
            console.log('Error completing SELECT MOVIE TITLE DETAILS query', err);
            res.sendStatus(500);
        });
});


//GET MOVIE GENRES
router.get('/genres/:id', (req, res) => {
    console.log('the req is:', req.params.id);
    const queryText = `SELECT "genres"."name" FROM "genres"
    JOIN "movies_genres" ON "genres".id = "movies_genres".genres_id
    JOIN "movies" ON "movies_genres".movies_id = "movies".id
    WHERE "movies".id = $1;`;
    pool.query(queryText, [req.params.id])
    .then((result) => {
        res.send(result.rows);
    })
        .catch((err) => {
            console.log('Error completing SELECT MOVIE GENRE DETAILS query', err);
            res.sendStatus(500);
        })
})

//UPDATE MOVIE INFORMATION
router.put('/', (req, res) => {
    console.log('the req is', req)
    let queryText = `UPDATE "movies"
    SET "title" = $1, "description" = $2
    WHERE "id" = $3;`;
    pool
        .query(queryText, [req.body.title, req.body.description, req.body.id])
        .then(result => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.sendStatus(500);
        });
});

module.exports = router;