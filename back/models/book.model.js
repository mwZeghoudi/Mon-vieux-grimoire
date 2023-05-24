const mongoose = require("mongoose");
const bookSchema = mongoose.Schema({
    userId : { type: String, required: true },
    title : { type: String, required: true },
    author : { type: String, required: true },
    imageUrl : { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    // ratings : [
    //     {
    //         userId : String - identifiant MongoDB unique de l'utilisateur qui a noté le livre
    //         grade : Number - note donnée à un livre
    //     }
    // ]
    averageRating : { type: Number, required: true }
})