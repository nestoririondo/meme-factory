import { useState, useEffect } from "react";
import axios from "axios";
import domtoimage from "dom-to-image";
import "./Home.css";

const Home = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMeme, setCurrentMeme] = useState([]);
  const [firstLine, setFirstLine] = useState("");
  const [secondLine, setSecondLine] = useState("");
  const [uploadFile, setUploadFile] = useState("");

  const fetchMemes = async () => {
    try {
      const response = await axios.get("https://api.imgflip.com/get_memes");
      setMemes(response.data.data.memes);
      setCurrentMeme(response.data.data.memes[3]);
      console.log(response.data.data.memes);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const handleClick = (direction) => {
    if (direction === "next") {
      if (memes.indexOf(currentMeme) === memes.length - 1) {
        setCurrentMeme(memes[0]);
        return;
      }
      setCurrentMeme(memes[memes.indexOf(currentMeme) + 1]);
      console.log(memes.indexOf(currentMeme));
    }
    if (direction === "prev") {
      if (memes.indexOf(currentMeme) === 0) {
        setCurrentMeme(memes[memes.length - 1]);
        return;
      }
      setCurrentMeme(memes[memes.indexOf(currentMeme) - 1]);
    }
    setFirstLine("");
    setSecondLine("");
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    if (!uploadFile) return;
    const file = uploadFile;
    console.log(file);
    const newMeme = {
      id: "custom",
      name: "custom",
      url: URL.createObjectURL(file),
    };
    setCurrentMeme(newMeme);
  };

  const handleDownload = () => {
    const node = document.getElementById("meme-container");
    domtoimage.toJpeg(node, { quality: 0.95 }).then(function (dataUrl) {
      let link = document.createElement("a");
      link.download = "my-image-name.jpeg";
      link.href = dataUrl;
      link.click();
    });
  };
  const handleReset = () => {
    setCurrentMeme(memes[3]);
    setFirstLine("");
    setSecondLine("");
  };
  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <>
      <div className="container" id="container">
        <h1>Meme Factory</h1>
        <div className="buttons">
          <button onClick={() => handleClick("prev")}>Previous</button>
          <button onClick={() => handleClick("next")}>Next</button>
        </div>
        <div id="meme-container">
          <div className="meme" key={currentMeme.id}>
            <img src={currentMeme.url} alt={currentMeme.name} />

            <p className="first-line">{firstLine}</p>
            <p className="second-line">{secondLine}</p>
          </div>
        </div>
        <div className="inputs">
          <div className="input1">
            <label>First Line</label>
            <input
              type="text"
              value={firstLine}
              onChange={(e) => setFirstLine(e.target.value)}
            ></input>
          </div>
          <div className="input2">
            <label>Second Line</label>
            <input
              className="input2"
              type="text"
              value={secondLine}
              onChange={(e) => setSecondLine(e.target.value)}
            ></input>
          </div>
        </div>
        <input
          type="button"
          value="Download"
          id="btnSave"
          onClick={handleDownload}
        />
        <form className="upload" onSubmit={(e) => handleFileUpload(e)}>
          <label htmlFor="Upload">Upload your own meme</label>
          <input
            type="file"
            id="Upload"
            name="Upload"
            accept="image/*"
            onChange={(e) => setUploadFile(e.target.files[0])}
          />
          <button type="submit">Submit</button>
        </form>
        <button value="Reset" id="btnReset" onClick={handleReset}>
          Reset
        </button>
      </div>
    </>
  );
};
export default Home;
