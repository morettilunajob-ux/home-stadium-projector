const fs = require('fs');
const https = require('https');

const url = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Gr%C3%AAmio_FBPA.svg/512px-Gr%C3%AAmio_FBPA.svg.png";
const dest = "c:\\Users\\Davi\\Documents\\ia\\home-stadium-projector\\public\\gremio-logo.png";

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
    if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log("Download completed.");
        });
    } else {
        console.error("Failed to download: " + response.statusCode);
    }
}).on('error', (err) => {
    console.error("Error: " + err.message);
});
