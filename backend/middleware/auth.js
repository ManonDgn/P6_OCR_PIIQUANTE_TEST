const jwt = require('jsonwebtoken');

// Configuration du Json Web Token pour la connexion d'un utilisateur
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'Z6uG?61Gk:%z@iJ69YCrI;-h"~u)XThX');
       const userId = decodedToken.userId;
       if (req.body.userId && userId != req.body.userId) {
        throw 'identifiant incorrect';
       } else {
        next();
       }
   } catch(error) {
       res.status(401).json({ error });
   }
};