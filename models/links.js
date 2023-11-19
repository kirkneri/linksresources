const mongoose = require('mongoose')

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
})

const Links = mongoose.model('Link', linksSchema)

module.exports = Links;
