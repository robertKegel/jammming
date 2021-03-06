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
            searchResults: [],
            playlistTracks: [],
            playlistName: "Playlist Name",
            searchButtonText: "SEARCH"
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
        let newResults = this.state.searchResults.filter(track => !newList.includes(track));
        this.setState({ 
            playlistTracks: newList,
            searchResults: newResults
        });
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
        Spotify.savePlaylist(this.state.playlistName, trackURIs)
        .then(this.setState({ 
            playlistName: "Playlist Saved",
            playlistTracks: []
        }))
        
    }
    async search(term) {
        await this.setState({ searchButtonText: "Searching..." })
        Spotify.search(term).then(results => {
            let playlistIDs = this.state.playlistTracks.map(track => track.id);
            let newResults = results.filter(track => !playlistIDs.includes(track.id));
            this.setState({ searchResults: newResults, searchButtonText: "SEARCH" })
        });
    }
    
    componentDidMount() {
        Spotify.getAccessToken();
    }
    render() {
      return (
        <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search} searchButtonText={this.state.searchButtonText} />
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
