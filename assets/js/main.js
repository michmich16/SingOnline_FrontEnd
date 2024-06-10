document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

    const homeButton = document.querySelector(".nav-item:first-child");
    const showAllSongsButton = document.getElementById("showAllSongsButton");
    const aboutUsButton = document.getElementById("AboutUsButton");
    const searchInput = document.getElementById('searchInput');

    let allSongs = []; // To store all songs fetched from the API initially

    if (homeButton) {
        homeButton.addEventListener("click", function() {
            console.log("Home button clicked");
            window.location.href = "index.html";
        });
    } else {
        console.error("Home button not found");
    }

    if (showAllSongsButton) {
        showAllSongsButton.addEventListener("click", function() {
            console.log("Show All button clicked");
            clearMainContent(); // Clear the main content first
            displayAllSongs();
        });
    } else {
        console.error("Show All button not found");
    }
    

    if (aboutUsButton) {
        aboutUsButton.addEventListener("click", function() {
            console.log("About Us button clicked");
            clearAllContent();
            displayAboutUsContent();
        });
    } else {
        console.error("About Us button not found");
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = searchInput.value.trim().toLowerCase();
            if (query.length > 0) {
                const filteredSongs = allSongs.filter(song => song.title.toLowerCase().includes(query));
                displayResults(filteredSongs);
            } else {
                displayRandomSongs();
            }
        });
    }

    async function fetchDataFromApi() {
        const apiUrl = "https://gxxdmpccinfzavamuyix.supabase.co/rest/v1/songs";
        const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4eGRtcGNjaW5memF2YW11eWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzODU5MjgsImV4cCI6MjAyOTk2MTkyOH0.Cd-1uPWhRaVK9F5Iu0GlRy8HRK5KF749T4ePOV6wTEA";

        const headers = {
            "apikey": apiKey,
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        };

        try {
            const response = await fetch(apiUrl, { headers });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data fetched from API:", data);
            return data;
        } catch (error) {
            console.error("An error occurred:", error);
            return [];
        }
    }

    function displayResults(songs) {
        const recommendationBox = document.getElementById("recommendationBox");
        recommendationBox.innerHTML = ''; // Clear existing content

        if (songs.length === 0) {
            recommendationBox.innerHTML = '<p>No results found.</p>';
            return;
        }

        songs.forEach(song => {
            const songElement = document.createElement("button");
            songElement.type = "button";
            songElement.innerHTML = `
                <h3>${song.title}</h3>
                <li>
                    <p>${song.artist}</p>
                    <p>${song.album}</p>
                </li>
            `;
            songElement.addEventListener("click", () => displayLyrics(song));
            recommendationBox.appendChild(songElement);
        });
    }

    async function displayAllSongs() {
        clearMainContent(); // Clear the main content first
        displayResults(allSongs);
    }

    async function displayRandomSongs() {
        if (allSongs && allSongs.length > 0) {
            const randomSongs = getRandomSongs(allSongs, 5);
            displayResults(randomSongs);
        } else {
            console.log("No songs available");
        }
    }

    function getRandomSongs(songs, count) {
        const shuffled = songs.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function clearAllContent() {
        document.querySelector('main').innerHTML ='';
    }

    function clearMainContent() {
        document.querySelector('main').innerHTML = `
            <div class="recommendations">
                <h2>Recommended</h2>
                <div class="recommendation_Box" id="recommendationBox"></div>
            </div>`;
    }

    async function displayLyrics(song) {
        clearMainContent();

        const mainContent = document.querySelector('main');
        const lyricsElement = document.createElement('span');
        const lyricsParagraphs = song.lyrics.split('\n').map(line => `<p>${line}</p>`).join('');
        lyricsElement.innerHTML = `
            <h2>${song.title}</h2>
            ${lyricsParagraphs}
        `;
        mainContent.appendChild(lyricsElement);
    }

    async function init() {
        allSongs = await fetchDataFromApi(); // Fetch all songs initially and store them locally
        displayRandomSongs(); // Call displayRandomSongs to fetch and display the songs when the page loads
    }

    init(); // Initialize the app

    function displayAboutUsContent() {
        const mainContent = document.querySelector('main');
        const paragraph1 = document.createElement('ul');
        paragraph1.textContent = "We are Sing Online";
        const paragraph2 = document.createElement('ul');
        paragraph2.textContent = "This is made by us";
        mainContent.appendChild(paragraph1);
        mainContent.appendChild(paragraph2);
    }
});
