/**
 * Image handling middleware for Vercel deployment
 * This middleware converts between file paths and base64 data
 */

// Helper to check if a string is base64 encoded
function isBase64(str) {
  try {
    return str.includes('base64') ||
           (str.length > 100 && !str.includes('http') && !str.startsWith('/'));
  } catch {
    return false;
  }
}

// Middleware to handle image display in templates
function imageHandlerMiddleware(req, res, next) {
  // Add helper function to convert images for display
  res.locals.getImageUrl = (imageData) => {
    // If it's a URL, just return it
    if (typeof imageData === 'string' &&
       (imageData.startsWith('http') || imageData.startsWith('/'))) {
      return imageData;
    }

    // If it's base64 data with data:image prefix, return as is
    if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
      return imageData;
    }

    // If it's base64 data without prefix, add the prefix
    if (isBase64(imageData)) {
      // Detect image type if possible
      const imageType = 'jpeg'; // Default to JPEG
      return `data:image/${imageType};base64,${imageData}`;
    }

    // Default placeholder
    return '/images/room-placeholder.jpg';
  };

  next();
}

module.exports = imageHandlerMiddleware;