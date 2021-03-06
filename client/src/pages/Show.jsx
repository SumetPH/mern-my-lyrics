import React, { Component } from "react";
import axios from "axios";

import Lyrics from "../components/song/Lyrics";
import WordsList from "../components/words/WordsList";
import Navbar from "../components/navbar";

class Show extends Component {
  state = {
    song: [],
    lyrics: "",
    youtubeId: "",
    showEditor: false,
    words: []
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.loadSong();
    this.loadWords();
  };

  loadSong = () => {
    axios.get(`/song/${this.props.match.params.id}`).then(res => {
      this.setState({
        song: res.data.song,
        lyrics: res.data.lyrics,
        youtubeId: res.data.youtubeId
      });
    });
  };

  loadWords = () => {
    axios.get(`/word/${this.props.match.params.id}`).then(res => {
      this.setState({ words: res.data.words });
    });
  };

  handleChange = lyrics => {
    this.setState({ lyrics });
  };

  handleEditor = () => {
    this.setState({ showEditor: !this.state.showEditor });
  };

  updateLyrics = () => {
    const { lyrics } = this.state;
    axios({
      url: "/lyrics",
      method: "PUT",
      data: {
        _id: this.state.song._id,
        lyrics: lyrics
      }
    }).then(res => {
      if (res.data.msg === "Success") {
        this.setState({ showEditor: false });
      }
    });
  };

  deleteWord = idWord => {
    if (window.confirm("Would you like to delete it.")) {
      axios({
        url: "/word",
        method: "DELETE",
        data: {
          idWord: idWord
        }
      }).then(res => {
        this.loadWords();
      });
    }
  };

  render() {
    return (
      <div
        className="hero is-dark is-fullheight"
        style={{ backgroundColor: "#4a4a4a" }}
      >
        <Navbar color="is-dark" />
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <div className="column">
                <iframe
                  className="box has-background-dark has-text-light"
                  height="400px"
                  width="100%"
                  src={`https://www.youtube.com/embed/${this.state.youtubeId}`}
                  title="iframe"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="columns" style={{ marginBottom: 0 }}>
              <div className="column">
                <div className="box has-background-dark has-text-light">
                  <Lyrics
                    lyrics={this.state.lyrics}
                    showEditor={this.state.showEditor}
                    handleEditor={this.handleEditor}
                    handleChange={this.handleChange}
                    updateLyrics={this.updateLyrics}
                  />
                </div>
              </div>
              <div className="column">
                <div className="box has-background-dark has-text-light">
                  <WordsList
                    songId={this.state.song._id}
                    words={this.state.words}
                    loadWords={this.loadWords}
                    deleteWord={this.deleteWord}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Show;
