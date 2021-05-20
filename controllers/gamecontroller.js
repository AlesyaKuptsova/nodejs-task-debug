var router = require('express').Router();
var Game = require('../db').import('../models/game');

router.use(require('../middleware/validate-session'));

router.get('/all', (req, res) => {
    Game.findAll({ where: { owner_id: req.user.id } })
        .then(
            function findSuccess(games) {
                res.status(200).json({
                    games: games,
                    message: "Data fetched."
                })
            },

            function findFail() {
                res.status(500).json({
                    message: "Data not found"
                })
            }
        )
})

router.get('/:id', (req, res) => {
    Game.findOne({ where: { id: req.params.id, owner_id: req.user.id } })
        .then(
            function findSuccess(game) {
                if(game){
                    res.status(200).json({
                        game: game
                    })
                } else {
                    res.status(404).json({ message: 'Not found'} );
                }
            },

            function findFail(err) {
                res.status(500).send(err.message)
            }
        )
})

router.post('/create', (req, res) => {
    Game.create({
        title: req.body.game.title,
        owner_id: req.user.id,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played
    })
        .then(
            function createSuccess(game) {
                res.status(200).json({
                    game: game,
                    message: "Game created."
                })
            },

            function createFail(err) {
                res.status(500).send(err.message)
            }
        )
})

router.put('/update/:id', (req, res) => {
    Game.update({
        title: req.body.game.title,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played,
    },
        {
            where: {
                id: req.params.id,
                owner_id: req.user.id,
            }
        })
        .then(
            function updateSuccess(count) {
                if(count > 0) {
                    res.status(200).json({
                        message: "Successfully updated."
                    })
                }else {
                    res.status(404).json({ message: 'Not found'} );
                }
            },

            function updateFail(err) {
                res.status(500).json({
                    message: err.message
                })
            }

        )
})

router.delete('/remove/:id', (req, res) => {
    Game.destroy({
        where: {
            id: req.params.id,
            owner_id: req.user.id
        }
    })
    .then(
        function deleteSuccess(count) {
            if(count > 0) {
                res.status(200).json({
                    message: "Successfully deleted"
                })
            }else {
                res.status(404).json({ message: 'Not found'} );
            }
        },

        function deleteFail(err) {
            res.status(500).json({
                error: err.message
            })
        }
    )
})

module.exports = router;