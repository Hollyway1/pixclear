
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const multer = require("multer");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: {
    error: "Too many requests. Please try again later.",
  },
});

app.use("/api/", limiter);

// Image upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 12 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Please upload a valid image."));
    }

    cb(null, true);
  },
});

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Pixclear API is running!",
    status: "success",
  });
});

// Remove image background
app.post(
  "/api/remove-background",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!process.env.REMOVE_BG_API_KEY) {
        return res.status(500).json({
          error: "Remove.bg API key is not configured.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: "Please upload an image.",
        });
      }

      const formData = new FormData();

      const imageBlob = new Blob([req.file.buffer], {
        type: req.file.mimetype,
      });

      formData.append("image_file", imageBlob, req.file.originalname);
      formData.append("size", "auto");

      const response = await fetch(
        "https://api.remove.bg/v1.0/removebg",
        {
          method: "POST",
          headers: {
            "X-Api-Key": process.env.REMOVE_BG_API_KEY,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error("remove.bg error:", errorText);

        return res.status(response.status).json({
          error: "Background removal failed. Check your API key and credits.",
        });
      }

      const imageBuffer = Buffer.from(
        await response.arrayBuffer()
      );

      res.set({
        "Content-Type": response.headers.get("content-type") || "image/png",
        "Content-Disposition": 'inline; filename="pixclear-result.png"',
      });

      return res.send(imageBuffer);
    } catch (error) {
      console.error("Background removal error:", error);

      return res.status(500).json({
        error: "An error occurred while processing your image.",
      });
    }
  }
);

// Error handling
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      error: "Image upload error. Maximum file size is 12MB.",
    });
  }

  console.error(error);

  res.status(400).json({
    error: error.message || "Something went wrong.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Pixclear server running at http://localhost:${PORT}`);
});
