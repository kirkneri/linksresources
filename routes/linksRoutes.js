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

// Display all resources
router.get('/resources', async (req, res) => {
  try {
    const links = await Links.find({});
    res.render('links/resources', { links });
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
    res.redirect('/resources');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding link');
  }
});

//Update item
router.get('/edit/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const updateLink = await Links.findOne({ slug });
    res.render('links/edit', { updateLink });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error finding link to edit');
  }
});

router.put('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const existingLink = await Links.findOne({ slug });
    const updatedIcon = req.body.icon ? req.body.icon : existingLink.icon;

    const updatedLink = {
      name: req.body.name,
      link: req.body.link,
      icon: updatedIcon,
    };

    await Links.findOneAndUpdate({ slug }, updatedLink, { runValidators: true, new: true });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating the link');
  }
});

// Delete
router.delete('/:slug', async (req, res) => {
  const { slug } = req.params;
  console.log('Deleting link with slug:', slug);

  try {
    const deletedLink = await Links.findOneAndDelete({ slug });
    console.log('Deleted Link:', deletedLink); // Check the deleted link (if needed)
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting the link');
  }
});

module.exports = router;
