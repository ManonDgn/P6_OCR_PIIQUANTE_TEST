const SauceModel = require('../models/sauce');

// Appel du package FS de Node pour pouvoir modifier le système de gestion de fichiers
const fs = require('fs');

// Fonction de création d'une sauce sur l'interface
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new SauceModel({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => {res.status(201).json({ message: 'Objet ajouté'})})
    .catch(error => { res.status(400).json( {error} )})
};

// Fonction d'affichage  de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    SauceModel.find()
    .then((sauces) => { res.status(200).json(sauces)})
    .catch(error => { res.status(400).json( {error} )});
};

// Fonction d'affichage d'une sauce
exports.getOneSauce = (req, res, next) => {   
    SauceModel.findOne({ _id: req.params.id})
    .then((sauce) => { res.status(200).json(sauce)})
    .catch(error => { res.status(400).json( {error} )});
};


// Fonction de suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    SauceModel.findOne({ _id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {});
        SauceModel.deleteOne({ _id: req.params.id})
            .then(() => {res.status(200).json({message: 'Objet supprimé !'})})
            .catch(error => res.status(401).json({ error }));
    })
    .catch(error => {
        res.status(500).json({error});
    })
};

// Fonction de modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    SauceModel.findOne({ _id: req.params.id})
        .then((sauce) => {
            SauceModel.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
        })
        .catch(error => { res.status(400).json( {error} )});
};
