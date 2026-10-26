# University logo assets

The student dashboard and landing page support a 44-university catalog. Add each logo to this folder using the university name in lowercase kebab-case, followed by `.webp`, `.png`, `.jpg`, or `.jpeg`.

For example, `Arba Minch University` can use `arba-minch-university.png`. The UI tries these extensions in order and shows a monogram until an image is available. Do not add a logo under a different university's name.

The logos currently available are:

- Addis Ababa University: `addis.jpeg`
- Bahir Dar University: `bahir-dar-university.jpg`
- Hawassa University: `hawassa-university.webp`
- Haramaya University: `haramaya-university.png`
- Adama Science and Technology University: `adama.jpeg`
- University of Gondar: `gondar-university.png`
- Samara University: `semera.jpeg`

The 44 university names used by the student selector and landing-page directory are maintained in `frontend/src/data/universities.js`; the backend seed scripts also create those catalog entries. University logo filenames are derived from the names automatically, except for the existing logo files listed above.
