const mongoose = require('mongoose');
const slugify = require('slugify');

const noteSchema = new mongoose.Schema({ 
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    isFavorites : {
        type: Boolean,
        default: false
    },
})

noteSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    next();
})

const Notes = mongoose.model('Note', noteSchema)

module.exports = Notes;
