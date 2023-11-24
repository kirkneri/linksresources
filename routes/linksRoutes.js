const express = require('express');
const router = express.Router();
const axios = require('axios');
const { URL } = require('url');
const Links = require('../models/links');
const axiosRetry = require("axios-retry")

axiosRetry(axios, { retries:3 });

//Extract domain
const extractDomain = (url) => {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname.replace(/^www\./, '');
};

//Getting favorite links
router.get('/', async (req, res) => {
  try {
    const favoriteLinks = await Links.find({ isFavorite: true });
    res.render('links/main', { favoriteLinks });
  } catch (error) {
    console.error(error);
    res.render('links/error');
  }
});

//Add to favorites
router.post('/add-to-favorites/:id', async (req, res) => {
  const linkId = req.params.id;

  try {
    const linkToAddToFavorites = await Links.findById(linkId);
    if (linkToAddToFavorites) {
      linkToAddToFavorites.isFavorite = true;
      await linkToAddToFavorites.save();
      res.redirect('/resources');
    } else {
      res.render('links/error');
    }
  } catch (error) {
    console.error(error);
    res.render('links/error');
  }
});

//Remove from favorites
router.post('/remove-from-favorites/:id', async (req, res) => {
  const linkId = req.params.id;

  try {
    const linkToRemoveFromFavorites = await Links.findById(linkId);
    if (linkToRemoveFromFavorites) {
      linkToRemoveFromFavorites.isFavorite = false;
      await linkToRemoveFromFavorites.save();
      res.redirect('/');
    } else {
      res.render('links/error');
    }
  } catch (error) {
    console.error(error);
    res.render('error');
  }
});


//Display all resources, filter, and search results
router.get('/resources', async (req, res) => {
  try {
    const { category, keyword } = req.query;

    const options = {
      method: 'GET',
      url: 'https://dad-jokes.p.rapidapi.com/random/joke',
      headers: {
        'X-RapidAPI-Key': '596ebaa8e9msh46eea9ad2049120p1e5a3bjsn88969e26e6cc',
        'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com'
      }
    };
    
    let query = {};

    if (category && category.length > 0) {
      query.category = { $in: Array.isArray(category) ? category : [category] };
    }

    if (keyword && keyword.trim() !== '') {
      query.name = { $regex: keyword.trim(), $options: 'i' };
    }

    const links = await Links.find(query);
    const allCategories = await Links.distinct('category');

    let jokes = []; // Initialize jokes outside the inner try block

    try {
      const response = await axios.request(options);
      jokes = response.data.body;
      console.log(response.data);
    } catch (error) {
      console.error(error);
      // Handle error or set jokes to a default value if needed
    }

    res.render('links/resources', {
      links,
      selectedCategory: category,
      allCategories,
      keyword,
      jokes: jokes
    });
  } catch (error) {
    console.error(error);
    res.render('links/error');
  }
});



//Function to fetch favicon with formatted link
async function fetchFavicon(link, icon) {
  try {
    const domain = extractDomain(link);
    link = link.startsWith('http') ? link : `https://${link}`; //Add http if not present

    if (icon && icon !== '') {
      return icon;
    } else {
      const faviconResponse = await axios.get(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`, { responseType: 'arraybuffer' });

      const faviconURL = Buffer.from(faviconResponse.data, 'binary').toString('base64');
      return `data:${faviconResponse.headers['content-type']};base64,${faviconURL}`;
    }
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return 'https://i.postimg.cc/QMTQXH6k/6b112d96-b771-490a-aad2-05fd67e915d2.jpg'; //Default icon URL
  }
}

//Add item with formatted link and fetching favicon
router.post('/', async (req, res) => {
  const { name, link, isFavorite, category, icon } = req.body;
  const categories = Array.isArray(category) ? category : [category];

  try {
    const formattedLink = link.startsWith('http') ? link : `https://${link}`; //Add http if not present
    const existingLink = await Links.findOne({ link: formattedLink });

    let iconURL;
    if (icon && icon !== '') {
      iconURL = icon;
    } else if (existingLink && existingLink.icon) {
      iconURL = existingLink.icon;
    } else {
      iconURL = await fetchFavicon(formattedLink);
    }

    const newLink = new Links({
      name,
      link: formattedLink,
      icon: iconURL,
      category: categories,
      isFavorite: isFavorite === 'on',
    });

    await newLink.save();
    res.redirect('/resources');
  } catch (error) {
    console.error(error);
    const iconURL = await fetchFavicon(link, '');

    const newLink = new Links({
      name,
      link,
      icon: iconURL,
      category: categories,
      isFavorite: isFavorite === 'on',
    });

    await newLink.save();
    res.redirect('/resources');
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
    res.render('links/error');
  }
});

//Update item
router.put('/:slug', async (req, res) => {
  const { slug } = req.params;
  const { name, link, isFavorite, category, icon } = req.body;
  const categories = Array.isArray(category) ? category : [category];

  try {
    const existingLink = await Links.findOne({ slug });
    const formattedLink = link.startsWith('http') ? link : `https://${link}`; //Add http if not present

    let iconURL;

    if (icon && icon !== '') {
      iconURL = icon;
    } else if (existingLink && existingLink.icon) {
      iconURL = await fetchFavicon(formattedLink);
    } else {
      iconURL = existingLink.icon;
    }

    const updatedLink = {
      name: name,
      link: formattedLink,
      icon: iconURL,
      category: categories,
      isFavorite: isFavorite === 'on',
    };

    await Links.findOneAndUpdate({ slug }, updatedLink, { runValidators: true, new: true });
    res.redirect('/resources');
  } catch (error) {
    console.error(error);
    res.render('links/error');
  }
});

//Delete item
router.delete('/:slug', async (req, res) => {
  const { slug } = req.params;
  console.log('Deleting link with slug:', slug);

  try {
    const deletedLink = await Links.findOneAndDelete({ slug });
    console.log('Deleted Link:', deletedLink);
    res.redirect('/resources');
  } catch (error) {
    console.error(error);
    res.render('links/error');
  }
});

//Delete multiple items
router.post('/delete-multiple', async (req, res) => {
  const linkIds = req.body.linkIds;

  try {
    await Links.deleteMany({ _id: { $in: linkIds } });
    res.redirect('/resources');
  } catch (error) {
    console.error(error);
    res.render('links/error');
  }
});


module.exports = router;
