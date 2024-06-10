document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

    const homeButton = document.querySelector(".nav-item:first-child");

    if (homeButton) {
        homeButton.addEventListener("click", function() {
            console.log("Home button clicked");
            window.location.href = "index.html"; // Change "index.html" to the actual filename of your first page
        });
    } else {
        console.error("Home button not found");
    }

    const showAllSongsButton = document.getElementById("showAllSongsButton");

    if (showAllSongsButton) {
        showAllSongsButton.addEventListener("click", function() {
            console.log("Show All button clicked");
            displayAllSongs();
        });
    } else {
        console.error("Show All button not found");
    }

    const aboutUsButton = document.getElementById("AboutUsButton");

    if (aboutUsButton) {
        aboutUsButton.addEventListener("click", function() {
            console.log("About Us button clicked");
            clearMainContent();
            displayAboutUsContent();
        });
    } else {
        console.error("About Us button not found");
    }

    // Function to display "About Us" content
    function displayAboutUsContent() {
        const mainContent = document.querySelector('main');
        const paragraph1 = document.createElement('li');
        paragraph1.textContent = "We are Sing Online";
        const paragraph2 = document.createElement('li');
        paragraph2.textContent = "This is made by us too";
        mainContent.appendChild(paragraph1);
        mainContent.appendChild(paragraph2);
    }

    // Function to fetch data from API
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

    // Function to display all songs
    async function displayAllSongs() {
        clearMainContent(); // Clear the main content first
        const songs = await fetchDataFromApi();

        if (songs && songs.length > 0) {
            const recommendationBox = document.getElementById("recommendationBox");
            recommendationBox.innerHTML = ''; // Clear existing content

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
        } else {
            console.log("No songs available");
        }
    }

    // Function to get random songs
    function getRandomSongs(songs, count) {
        const shuffled = songs.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Function to display random songs
    async function displayRandomSongs() {
        const songs = await fetchDataFromApi();

        if (songs && songs.length > 0) {
            const randomSongs = getRandomSongs(songs, 5);
            const recommendationBox = document.getElementById("recommendationBox");

            recommendationBox.innerHTML = ''; // Clear existing content

            randomSongs.forEach(song => {
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
        } else {
            console.log("No songs available");
        }
    }

    // Function to clear main content
    function clearMainContent() {
        document.querySelector('main').innerHTML = `
            <div class="recommendations">
                <h2>Recommended</h2>
                <div class="recommendation_Box" id="recommendationBox"></div>
            </div>`;
    }

    // Function to display lyrics
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

    // Call displayRandomSongs to fetch and display the songs when the page loads
    displayRandomSongs();

    // Function to reload the page
});