const mongoose = require('mongoose')
const Links = require('./models/links')

mongoose.connect('mongodb+srv://devkirkbugayong:qwerty123@kodego.btziqza.mongodb.net/linksResource')

const links = [{
    name: "Font Awesome",
    link: "https://fontawesome.com/",
    icon: "https://fontawesome.com/images/favicon/icon-192.png",
  },
  {
    name: "UI Verse",
    link: "https://uiverse.io/",
    icon: "https://uiverse.io/apple-touch-icon.png",
  },
]


Links.insertMany(links)