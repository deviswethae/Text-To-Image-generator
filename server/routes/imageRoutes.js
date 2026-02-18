const express = require('express');
const router = express.Router();
const axios = require('axios');
const Prompt = require('../models/Prompt');

// Generate image
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) { 
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const imageUrl = await generateWithStabilityAI(prompt);
    
    // Save to database
    const newPrompt = new Prompt({ text: prompt, imageUrl });
    await newPrompt.save();
    
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get history
router.get('/history', async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 });
    res.json(prompts);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Clear history
router.delete('/history', async (req, res) => {
  try {
    await Prompt.deleteMany({});
    res.json({ message: 'History cleared successfully' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

async function generateWithStabilityAI(prompt) {
  try {
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 640,
        width: 1536,
        steps: 30,
        samples: 1,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.artifacts || response.data.artifacts.length === 0) {
      throw new Error('No image was generated');
    }

    const imageData = response.data.artifacts[0].base64;
    return `data:image/png;base64,${imageData}`;
  } catch (error) {
    console.error('Stability AI API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate image with Stability AI. Please try again later.');
  }
}

module.exports = router;