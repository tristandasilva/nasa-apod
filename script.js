// Targeting Elements
const imagesContainer = document.querySelector('.images-container'),
      resultsNav      = document.getElementById('results-nav'),
      favouritesNav   = document.getElementById('favourites-nav'),
      saveConfirmed   = document.querySelector('.save-confirmed'),
      loader          = document.querySelector('.loader');

// NASA API Fetch Parameters
const apiKey = 'rWQw8BQwdoipsSktADpnJQYxr89BsNnsaZ1RNFoh',
      count  = 10,
      apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArr = [];
let favourites = {};

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArr : Object.values(favourites);
    currentArray.forEach((result) => {
        // Card Container
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card');
        // Link To Image
        const imageLink = document.createElement('a');
        imageLink.href = result.hdurl;
        imageLink.title = 'View Full Image';
        imageLink.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title')
        cardTitle.textContent = result.title;
        // Add to Favourites Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add To Favourites';
            saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove From Favourites';
            saveText.setAttribute('onclick', `removeFavourite('${result.url}')`);
        }

        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright Info
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        // Appending elements to appropriate parent elements
        footer.append(date, copyright);
        imageLink.append(image);
        cardBody.append(cardTitle, cardText, saveText, footer);
        cardContainer.append(imageLink, cardBody);
        imagesContainer.append(cardContainer);
    });
}

// Show results page or favourites page
function showContent(page) {
    // Scroll to top of page
    window.scrollTo({top: 0, behavior: 'instant'});
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favouritesNav.classList.add('hidden');
    } else {
        favouritesNav.classList.remove('hidden');
        resultsNav.classList.add('hidden');
    }
    loader.classList.add('hidden');
}

function updateDOM(page) {
    // Retrieve favourites from local storage
    if (localStorage.getItem('favouriteImages')) {
        favourites = JSON.parse(localStorage.getItem('favouriteImages'));
    }
    // Reset images container, removed favourites are deleted from page
    imagesContainer.textContent = '';
    // Rebuild page
    createDOMNodes(page);
    // Show page accordingly
    showContent(page);
}

// Get Images From NASA API
async function getNasaImages() {
    // Show Loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArr = await response.json();
        updateDOM('results');
    } catch (err) { // Catch Error
        console.log(err);
    }

}

// Add Image to Favourites
function saveFavourite(itemUrl) {
    // Loop through results to select favourite
    resultsArr.forEach((item) => {
        if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
            favourites[itemUrl] = item;
            // Show save confirmation
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            // Save favourite to local storage
            localStorage.setItem('favouriteImages', JSON.stringify(favourites));
        }
    });
}

// Remove from favourites
function removeFavourite(itemUrl) {
    if (favourites[itemUrl]) {
        delete favourites[itemUrl];
        // Save favourite to local storage
        localStorage.setItem('favouriteImages', JSON.stringify(favourites));
        updateDOM('favourites');
    }
}

// On Load
getNasaImages();
