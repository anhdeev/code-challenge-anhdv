const fs = require("fs");
const path = require("path");

// Path to the tokens directory
const tokensDir = path.join(__dirname, "public/assets/tokens");

// Output file path
const outputFile = path.join(__dirname, "src/data/tokens.js");

// Helper function to format token data
const formatTokenData = (filename) => {
  const id = path.basename(filename, path.extname(filename)).toLowerCase();
  const name = id.charAt(0).toUpperCase() + id.slice(1); // Capitalize first letter
  const symbol = id.toUpperCase();
  const icon = `/assets/tokens/${filename}`;
  return {
    id,
    name,
    symbol,
    icon,
  };
};

// Generate tokens array
const generateTokens = () => {
  try {
    const files = fs.readdirSync(tokensDir).filter((file) => {
      return path.extname(file).toLowerCase() === ".svg"; // Only process .svg files
    });

    const tokens = files.map(formatTokenData);

    // Write tokens array to a JavaScript file
    const fileContent = `export const tokens = ${JSON.stringify(
      tokens,
      null,
      2
    )};\n`;
    fs.writeFileSync(outputFile, fileContent, "utf-8");

    console.log(
      `Tokens data generated successfully and saved to ${outputFile}`
    );
  } catch (error) {
    console.error("Error generating tokens data:", error);
  }
};

// Execute the script
generateTokens();
