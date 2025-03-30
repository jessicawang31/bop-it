import express from 'express';
const router = express.Router();

// POST method endpoint submit a new score when a user finishes 
router.post('/game', async(req, res) => {
    if(!req.session.isAuthenticated){
        return res.status(401).json({
            error: 'you are not logged in, please login!'
        });
    }
    try {
        console.log("did it work");
        const { score } = req.body;
        const newScore = new req.models.Scores({
            username: req.session.account.username, 
            score: score,
            timestamp: new Date()
        })

        await newScore.save();

        res.status(201).json({
            message: 'successfully recorded user score'
        })
    } catch(error){
        res.status(500).json({ error: 'Failed to record score' });
    }
})



// GET method endpoint to retrieve top scores per user 
router.get('/leaderboard', async (req, res) => {
    try {
        // Find the highest score per user
        const topScores = await req.models.Scores.aggregate([   // mongoose has an aggregate func
            { $sort: { score: -1 } },       // sort by highest score
            { 
                $group: { 
                    _id: "$username", 
                    highestScore: { $first: "$score" } 
                }
            },
            { $sort: { highestScore: -1 } },     // after grouping, sort again by highest score
            { $limit: 10 }      // limit leaderboard to show top 10 users
        ]);
        res.json({ leaderboard: topScores });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve leaderboard' });
    }
});

// GET method endpoint to get the analystics for current user 
router.get('/analytics', async (req, res) => {
    try {
        const { username } = req.query;

        const userScores = await req.models.Scores.find({ username });  // get all the scores

        if (userScores.length === 0) {
            return res.status(404).json({ 
                error: 'this user has not played any games yet' 
            });
        }

        // aggregate
        const totalGames = userScores.length;
        const highestScore = Math.max(...userScores.map(score => score.score));
        const meanScore = userScores.reduce((acc, score) => acc + score.score, 0) / totalGames;

        res.json({
            username,
            totalGames,
            highestScore,
            meanScore: meanScore.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user analytics' });
    }
});

export default router;