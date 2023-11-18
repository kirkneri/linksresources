const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const port = 8080
const Links = require('./models/links')

mongoose.connect('mongodb+srv://devkirkbugayong:qwerty123@kodego.btziqza.mongodb.net/linksResource')
.then(() => {
    console.log('MongoDB connection established.')
}) .catch((err) => {
    console.error('Error has occured', err)
})

app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))

//Display
app.get('/', async (req, res) => {
    const links = await Links.find({})
    res.render('links/main', { links: links })
})

//Add item
app.post('/', async (req, res) => {
    const { name, link, icon } = req.body;
    let iconURL = icon || 'https://i.postimg.cc/KvMQdmMb/OIG.jpg'
    const newLink = new Links({
        name,
        link,
        icon: iconURL,
    })

    try {
        await newLink.save()
        res.redirect('/')
    } catch (error) {
        console.error(error)
        res.status(500).send('Error creating a new link');
    }
})

//Update item
app.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const updateLink = await Links.findById(id);
    res.render('links/edit', { updateLink: updateLink })
})

app.put('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const existingLink = await Links.findById(id);
        const updatedIcon = req.body.icon ? req.body.icon : existingLink.icon;

        const updatedLink = {
            name: req.body.name,
            link: req.body.link,
            icon: updatedIcon,
        };

        await Links.findByIdAndUpdate(id, updatedLink, { runValidators: true, new: true });
        res.redirect('/');
    } catch (error) {
        // Handle the error appropriately
        console.error(error);
        res.status(500).send('Error updating the link');
    }
});

//Delete
app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Links.findByIdAndDelete(id, req.body);
    res.redirect('/');
});

// PORT
app.listen(port, () => {
    console.log(`Listen on port ${port}`)
})