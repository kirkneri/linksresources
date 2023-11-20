const mongoose = require('mongoose');
const slugify = require('slugify');

const linksSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    category: {
        type: String,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})

linksSchema.pre('validate', function(next) {
    if (this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true })
    }

    next();
})

const Links = mongoose.model('Link', linksSchema)

module.exports = Links;
