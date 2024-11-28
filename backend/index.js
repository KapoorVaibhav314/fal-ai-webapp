const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { fal } = require("@fal-ai/client");

const app = express();
app.use(cors());
app.use(express.json());

fal.config({
  credentials: process.env.FAL_API_KEY,
});

app.post("/generate", async (req, res) => {
  const { object, material } = req.body;

  if (!object || !material) {
    return res.status(400).json({ message: "Object and material are required." });
  }

  try {
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: `${material} ${object}`,
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log("Queue Update:", update.status);
      },
    });

    res.json({
      imageUrl: result.data.images[0].url,
      prompt: result.data.prompt,
    });
  } catch (error) {
    console.error("Fal-AI Error:", error);
    res.status(500).json({
      message: error.message || "Error generating the image.",
    });
  }
});

const PORT = 5098;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
