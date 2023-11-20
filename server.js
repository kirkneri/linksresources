const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const axios = require('axios'); // Adding axios for making HTTP requests
const { URL } = require('url'); // Node.js URL module to parse URLs
const methodOverride = require('method-override')
const port = 8080
const Links = require('./models/links')

// Function to extract domain without protocol and "www"
const extractDomain = (url) => {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace(/^www\./, '');
  };

//MongoDB
mongoose.connect('mongodb+srv://devkirkbugayong:qwerty123@kodego.btziqza.mongodb.net/linksResource')
.then(() => {
    console.log('MongoDB connection established.')
}) .catch((err) => {
    console.error('Error has occured', err)
})

//Middleware
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

// Add item with fetching favicon
app.post('/', async (req, res) => {
    const { name, link } = req.body;
    let iconURL = 'https://i.postimg.cc/KvMQdmMb/OIG.jpg'; // Default icon URL
  
    try {
      const domain = extractDomain(link);
  
      // Fetching favicon using favicongrabber.com
      const faviconResponse = await axios.get(`https://favicongrabber.com/api/grab/${domain}`);
      if (faviconResponse.data.icons && faviconResponse.data.icons.length > 0) {
        // Use the first icon found
        iconURL = faviconResponse.data.icons[0].src;
      }
  
      const newLink = new Links({
        name,
        link,
        icon: iconURL,
      });
  
      await newLink.save();
      res.redirect('/');
    } catch (error) {
      console.error(error);
      const newLink = new Links({
        name,
        link,
        icon: iconURL,
      });
      await newLink.save();
        res.redirect('/');
    }
  });

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
    console.log('Deleting link with ID:', id);
  
    try {
      const deletedLink = await Links.findByIdAndDelete(id);
      console.log('Deleted Link:', deletedLink); // Check the deleted link (if needed)
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting the link');
    }
  });
  

// PORT
app.listen(port, () => {
    console.log(`Listen on port ${port}`)
})