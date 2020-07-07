'use strict';

const morgan = require('morgan');
const express = require('express');

const { top50 } = require('./data/top50');

const PORT = process.env.PORT || 8000;

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

const title = (req, res) => {
    res.render('pages/top50', {
        title: 'Top 50 Songs Streamed on Spotify',
        top50: top50,
    })
}

// endpoints here
app.get('/top50', title);

const pageLoad = () => {
    if (top50.find(song => song.rank <= 50)) {
        app.get('/top50/song/:currentSong', (req, res) => {
            let songRank = req.params.currentSong;
            const song = top50.find(song => song.rank == songRank)
            res.render('pages/songPage', {
                content: song,
                title: `Song #${songRank}`
            })
        });
    } else {
    // handle 404s
        app.get('*', (req, res) => {
            res.status(404);
            res.render('pages/fourOhFour', {
                title: 'I got nothing',
                path: req.originalUrl
            });
        });
    }
}

pageLoad();

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
