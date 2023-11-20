const express = require('express');
const router = express.Router();
const axios = require('axios');
const { URL } = require('url');
const Links = require('../models/links');

// Function to extract domain without protocol and "www"
const extractDomain = (url) => {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname.replace(/^www\./, '');
};

// Display links
router.get('/', async (req, res) => {
  try {
    const links = await Links.find({});
    res.render('links/main', { links });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving links');
  }
});

// Add item with fetching favicon
router.post('/', async (req, res) => {
  const { name, link } = req.body;
  let iconURL = 'https://i.postimg.cc/KvMQdmMb/OIG.jpg'; // Default icon URL

  try {
    const domain = extractDomain(link);

    // Fetching favicon using favicongrabber.com
    const faviconResponse = await axios.get(`https://favicongrabber.com/api/grab/${domain}`);
    if (faviconResponse.data.icons && faviconResponse.data.icons.length > 0) {
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
    res.status(500).send('Error adding link');
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

module.exports = router;
