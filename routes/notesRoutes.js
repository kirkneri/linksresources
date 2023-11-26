const express = require('express');
const router = express.Router();
const Notes = require('../models/note');


//Getting favorite links and search results
  router.get('/notes', async (req, res) => {
    try {
      const locals = {
        title: 'Source Kode',
        description: 'Kirk and Henry MP2'
      }

      let query = {};
      const { notekeyword, page = 1, limit = 12 } = req.query;

      if (notekeyword) {
        query = { title: { $regex: new RegExp(notekeyword, 'i') } };
      }

      const notesCount = await Notes.countDocuments(query);
      const totalPages = Math.ceil(notesCount / limit);

      const currentPage = Math.min(Math.max(page, 1), totalPages);
      const startIndex = (currentPage - 1) * limit;

      const notes = await Notes.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex);

      const pagination = {};
      if (currentPage < totalPages) {
        pagination.next = {
          page: currentPage + 1,
          limit: limit
        };
      }

      if (currentPage > 1) {
        pagination.prev = {
          page: currentPage - 1,
          limit: limit
        };
      }

      const favoriteNotes = await Notes.find({ isFavorites: true });

      res.render('notes/notes', {
        favoriteNotes,
        notes,
        pagination,
        totalPages,
        locals });
    } catch (error) {
      console.error(error);
      res.render('links/error');
    }
  });
  
  
  //Add to favorites
  router.post('/add-to-favorites-notes/:id', async (req, res) => {
    const noteId = req.params.id;
  
    try {
        const noteToAddToFavorites = await Notes.findById(noteId);
      if (noteToAddToFavorites) {
        noteToAddToFavorites.isFavorites = true;
        await noteToAddToFavorites.save();
        res.redirect('/notes');
      } else {
        res.render('links/error');
      }
    } catch (error) {
        console.error(error);
        res.render('links/error');
    }
  });
  
  //Remove from favorites
  router.post('/remove-from-favorites-notes/:id', async (req, res) => {
    const noteId = req.params.id;
  
    try {
      const noteToRemoveFromFavorites = await Notes.findByIdAndUpdate(noteId, { isFavorites: false }, { new: true });
  
      if (noteToRemoveFromFavorites) {
        res.redirect('/notes');
      } else {
        res.render('links/error');
      }
    } catch (error) {
      console.error(error);
      res.render('links/error');
    }
  });
  

// Show note
router.get('/show/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const showNote = await Notes.findOne({ slug });
        const locals = {
          title: showNote.title,
          description: 'Kirk and Henry MP2'
        }
        res.render('notes/showNotes', { showNote, locals });
    } catch (err) {
        console.error(err);
        res.render('links/error');
    }
});

// Add notes
router.post('/notes', async (req, res) => {
    try {
        const { title, body, createdAt } = req.body;
        const newNote = new Notes({
        title,
        body,
        createdAt,
      });
  
      await newNote.save();
      res.redirect('/notes');
    } catch (err) {
        console.error(err);
        res.render('links/error');
    }
});

// Update notes
router.get('/edit-notes/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const updatedNote = await Notes.findOne({ slug });
        const locals = {
          title: updatedNote.title,
          description: 'Kirk and Henry MP2'
        }
        res.render('notes/editNotes', { updatedNote, locals });
    } catch (error) {
        console.error(error);
        res.render('links/error');
    }
});

router.put('/notes/:slug', async (req, res) => {
    const { slug } = req.params;
    const { title, body } = req.body;

    try {
        const foundNote = await Notes.findOne({ slug });

        if (foundNote) {
            foundNote.title = title;
            foundNote.body = body;

            await foundNote.save();
            res.redirect('/notes');
        } else {
            res.render('links/error');
        }
    } catch (err) {
        console.error(err);
        res.render('links/error');
    }
});

/// Delete notes
router.delete('/notes/:slug', async (req, res) => {
    const { slug } = req.params;
    console.log('Deleting link with slug:', slug);

    try {
        const deletedNote = await Notes.findOneAndDelete({ slug });

        if (deletedNote) {
            console.log('Deleted Link:', deletedNote);
            res.redirect('/notes');
        } else {
            res.render('links/error');
        }
    } catch (error) {
        console.error(error);
        res.render('links/error');
    }
});







module.exports = router;