async function fetchDataFromApi() {
    const apiUrl = "https://gxxdmpccinfzavamuyix.supabase.co/rest/v1/songs"; // fetching songs
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
        return data;
        console.log(data);
    } catch (error) {
        console.error("An error occurred:", error);
        return [];

    }
}

function getRandomSongs(songs, count) {
    const shuffled = songs.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

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

function clearMainContent() {
    document.querySelector('main').innerHTML = '<div class="recommendations"><h2>Lyrics</h2><div class="recommendation_Box" id="recommendationBox"></div></div>';
}

async function displayLyrics(song) {
    clearMainContent();

    // api url til lyrics.
    const lyrics = "https://gxxdmpccinfzavamuyix.supabase.co/rest/v1/songs/lyrics";

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
document.addEventListener("DOMContentLoaded", displayRandomSongs);

function reloadPage() {
    location.reload();
}
