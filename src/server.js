const express = require('express');
const fs = require('fs');
const PDFDocument = require('pdfkit'); // Make sure to install pdfkit
const app = express();
const PORT = 3000;

// Middleware to serve files from the public directory and to parse JSON bodies
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));

// Route to save the signature as an image
app.post('/save-image', (req, res) => {
    const imageData = req.body.imageData;
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");

    fs.writeFile("signature.png", base64Data, 'base64', function(err) {
        if (err) {
            console.log(err);
            return res.status(500).send({ status: 'error', message: 'Failed to save image' });
        }
        res.send({ status: 'success', message: 'Image saved successfully!' });
    });
});


// Route to save the signature as a PDF
app.post('/save-pdf', (req, res) => {
    const doc = new PDFDocument();
    const imageData = req.body.imageData;
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');

    const stream = fs.createWriteStream('signature.pdf');
    doc.pipe(stream);
    doc.image(imageBuffer, {
        fit: [500, 300],
        align: 'center',
        valign: 'center'
    });
    doc.end();

    stream.on('finish', () => {
        res.send({ status: 'success', message: 'PDF saved successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
