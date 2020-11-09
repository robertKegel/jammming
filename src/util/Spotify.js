let accessToken;
const clientID = "f9ccd4db726047378c81f074cd7e8615"; 
const redirectURI = "https://jammming.iamrobertkegel.com/"

export const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken
        } else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
            accessToken = window.location.href.match(/access_token=([^&]*)/)[0].slice(13);
            console.log(accessToken);
            let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[0].slice(11);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },
    search (term) {
        this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        }).then(response => { return response.json()
        }).then(jsonResponse => {
            console.log(jsonResponse);
            return jsonResponse.tracks.items.map(track => {
                console.log(track)
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }
            })
        })
    },
    async savePlaylist(playlistName, trackURIs) {
        
        if (playlistName == null || trackURIs == null) {
            return
        }
        
        //get user id
        let userID = await fetch('https://api.spotify.com/v1/me', {
            headers: {Authorization: `Bearer ${accessToken}`}
        }).then(response => {
            return response.json()
        }).then(jsonResponse => {
            return jsonResponse.id
        });
        
        
        
        
        //post playlist name
        let playlistID = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                "name": playlistName,
                "description": "Jammming Playlist. iamRobertKegel.com"
            })
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            return jsonResponse.id
        });
        
        
        //post playlist URIs
        return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "uris": trackURIs
            })
        }).then(response => {
            if(!response.ok) {
                throw new Error('Response Not Ok')
            }
            return response.json()
        }).then(jsonResponse => {
            return jsonResponse
        });
        
    }
}
