const fs = require('fs');
const axios = require('axios');
const ejs = require('ejs');

// Replace this URL with your API endpoint that provides the data.
const apiUrl = 'https://www.boredapi.com/api/activity';

async function fetchDataFromApi() {
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error.message);
        return null;
    }
}

async function generateHomepage() {
    const template = fs.readFileSync('./template/homepage.ejs', 'utf8');
    const renderedHtml = ejs.render(template);

    fs.writeFile('index.html', renderedHtml, (err) => {
        if (err) {
            console.error('Error writing file:', err.message);
        } else {
            console.log('Homepage generated successfully.');
        }
    });
}

async function generateStaticSites() {
    for (let i = 0; i < 10; i++) {
        const data = await fetchDataFromApi();

        if (!data) {
            console.error('Data not available.');
            return;
        }

        const template = fs.readFileSync('./template/template.ejs', 'utf8');
        const renderedHtml = ejs.render(template, data);

        const fileName = `site_${i + 1}.html`;

        fs.writeFile(fileName, renderedHtml, (err) => {
            if (err) {
                console.error('Error writing file:', err.message);
            } else {
                console.log(`Static site ${fileName} generated successfully.`);
            }
        });
    }
    await generateHomepage();
}

generateStaticSites();
