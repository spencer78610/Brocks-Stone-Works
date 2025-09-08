const fs = require("fs");
const path = require("path");

// Define your folders and categories
const folders = {
  wallstone: "images/wallstone",
  fireplace: "images/fireplaces",
  chimney: "images/chimneys",
  posts: "images/gate-posts",
  flagstone: "images/flagstones"
};

let gallery = [];

for (const [set, folder] of Object.entries(folders)) {
  const files = fs.readdirSync(folder);
  files.forEach(file => {
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) return; // skip non-images

    const slug = path.parse(file).name.toLowerCase();
    gallery.push({
      slug: slug,
      set: set,
      src: `${folder}/${file}`,
      alt: `${set} - ${slug}`
    });
  });
}

// Save to gallery.json
fs.writeFileSync("gallery.json", JSON.stringify(gallery, null, 2));
console.log("✅ gallery.json created with", gallery.length, "images");
