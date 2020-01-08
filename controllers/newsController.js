const mongoose = require('mongoose');
const News = require('../models/news');
const Id = require('valid-objectid');
const validateNewsInput = require('../validation/newsValidation');

exports.getAllNews = async(req, res, next) => {
    const news = await News.find().sort('-date');
    res.send(news);
}

exports.getNewsById = async(req, res, next) => {
    const newsId = req.params.id;

    if(!Id.isValid(newsId)) {
        res.status(422);
        return next(new Error('Nieprawidłowy ID'));
    }

    const news = await News.findById(req.paramsid);

    if(!news) return res.status(404).send('Nie znaleziono posta o podanym ID');
    res.send(news)
}

exports.postAddNews = async(req, res, next) => {
    const { error } = validateNewsInput(req.body); 
    if (error) return res.status(400).send(error.message);

    let news = new News({
        title: req.body.title, 
        description: req.body.description,
        url: req.body.url
    })

    try {
        news = await news.save();
        res.send(news);
    } catch(ex) {
        for (field in ex.errors)
            res.send(ex.errors[field].message);
    }
}

exports.deleteNews = async(req, res, next) => {
    const newsId = req.params.id;

    if(!Id.isValid(newsId)) {
        res.status(422);
        return next(new Error('Nieprawidłowe id postu'))
    }
    const news = await News.findByIdAndDelete(newsId, function(err) {
        if (err)
            return res.status(404).send('Nie znaleziono posta od podanym ID');
        else
            res.send({ message: 'Post usunięty'})
    });
}

exports.updateNews = async(req, res, next) => {
    const newsId = req.params.id;

    if(!Id.isValid(newsId)) {    
        return res.status(422).send('Nieprawidłowy ID postu');
    }

    const { error } = validateNewsInput(req.body); 
    if (error) return res.status(400).send(error.message);
        
    const news = await News.findByIdAndUpdate(req.params.id, {
        title: req.body.title, 
        description: req.body.description,
        url: req.body.url
    }, { new: true });

    if(!news) return res.status(404).send('Nieznaleziono posta o podanym ID');
    res.send(news);
}