import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [
            {
                name: "Purple Haze",
                artist: "Jimi Hendrix",
                album: "Experienced",
                id: 28
            }, {
                name: "Master of Puppets",
                artist: "Metalica",
                album: "Master of Puppets",
                id: 49
            }, {
                name: "ABCs",
                artist: "Unknown",
                album: "Unknown",
                id: 70
            }],
            playlistTracks: [
            {
                name: "123s",
                artist: "Arcamedies",
                album: "The First",
                id: 1
            }],
            playlistName: "workout playlist"
        }
        
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }
    addTrack(track) {
        if (this.state.playlistTracks.some(savedTrack => savedTrack.id === track.id)) {
            return;
        }
        let newList = this.state.playlistTracks;
        newList.push(track);
        this.setState({ playlistTracks: newList });
    }
    removeTrack(track) {
        let newList = this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
        this.setState({ playlistTracks: newList });
    }
    updatePlaylistName(name) {
        this.setState({ playlistName: name })
    }
    savePlaylist() {
        let trackURIs = this.state.playlistTracks.map(track => track.uri);
        console.log(trackURIs);
        
    }
    search(term) {
        Spotify.search(term).then(results => {
            this.setState({ searchResults: results })
        });
    }
    render() {
      return (
        <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search} />
            <div className="App-playlist">
              <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults} />
              <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} />
            </div>
          </div>
        </div>
      );
    }
}

export default App;