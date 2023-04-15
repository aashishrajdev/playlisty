function getId() {
  let playlistUrl = document.querySelector(".playlist-url");
  let playlistUrlEl = playlistUrl.value;
  playlistIdEl = playlistUrlEl.split("?list=")[1];
  return playlistIdEl;
}

function loadClient() {
  gapi.client.setApiKey("AIzaSyBFOaWElyt2CaLxs3uuKnjuNZgDIoUDRMk");
  return gapi.client
    .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(
      function () {
        console.log("GAPI client loaded for API");
      },
      function (err) {
        console.error("Error loading GAPI client for API", err);
      }
    );
}
// Make sure the client is loaded before calling this method.
function execute() {
  return gapi.client.youtube.playlistItems
    .list({
      part: ["Snippet"],
      maxResults: 50,
      playlistId: getId(),
    })
    .then(
      function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log(response.result.items[1]);
        createPlaylist(response);
      },
      function (err) {
        console.error("Execute error", err);
      }
    );
}

function createPlaylist(response) {
  const playlistItems = response.result.items;
  const playlistData = playlistItems.map((item) => {
    return {
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      videoId: item.snippet.resourceId.videoId,
    };
  });

  // Create new HTML elements for each playlist and append them to the document
  const playlistContainer = document.querySelector(".playlist-container");
  for (let i = 0; i < playlistData.length; i++) {
    const playlist = playlistData[i];

    // Create a new <div> element to hold the playlist information
    const playlistElement = document.createElement("div");
    playlistElement.classList.add("playlist");

    // Create a new <img> element to display the thumbnail
    const thumbnailElement = document.createElement("img");
    thumbnailElement.setAttribute("src", playlist.thumbnailUrl);
    thumbnailElement.setAttribute("alt", playlist.title);
    playlistElement.appendChild(thumbnailElement);

    // Create a new <h3> element to display the title
    const titleElement = document.createElement("h3");
    titleElement.textContent = playlist.title;
    playlistElement.appendChild(titleElement);

    playlistElement.addEventListener("click", () =>
      changeVideo(playlist.videoId)
    );

    // Append the new element to the playlist container
    playlistContainer.appendChild(playlistElement);
  }
}

function changeVideo(videoId) {
  const videoEl = document.querySelector("#video");
  videoEl.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

// https://www.youtube.com/embed/hUUZbgOPFLY?autoplay=1&rel=0

gapi.load("client");
