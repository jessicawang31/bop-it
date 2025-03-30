import express from 'express';

const router = express.Router();

router.get('/myIdentity', (req, res) => {
    if (!req.session.account) {
        return res.json({ status: "loggedout" });
    } 
    res.json({
        status: "loggedin",
        userInfo: {
            name: req.session.account.name,
            username: req.session.account.username
        }
    });
});

export default router;