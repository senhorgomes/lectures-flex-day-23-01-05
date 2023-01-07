import logo from './logo.svg';
import {useState} from 'react'
import './App.css';
import "@tensorflow/tfjs";
import * as speechCommands from "@tensorflow-models/speech-commands"
function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const labels = ['😶', '👨‍🏫', '🐠','🍕', '🤖'  ]

  const URL = "http://localhost:3000/model/";

    const createModel= async () => {
        const checkpointURL = URL + "model.json"; // model topology
        const metadataURL = URL + "metadata.json"; // model metadata

        const recognizer = speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL);

        // check that model and metadata are loaded via HTTPS requests.
        // recognizer.then(recognizer)
        await recognizer.ensureModelLoaded();

        return recognizer;
    }

    const listen = async() => {
        const recognizer = await createModel();
        const classLabels = recognizer.wordLabels(); // get class labels
        // const scoreResults = [0.008475306443870068, 0.8869879841804504, 0.009482826106250286, 0.001157911610789597, 0.08170322328805923, 0.008568895980715752, 0.003623789642006159, buffer: ArrayBuffer(28), byteLength: 28, byteOffset: 0, length: 7, Symbol(Symbol.toStringTag): 'Float32Array']
        // listen() takes two arguments:
        // 1. A callback function that is invoked anytime a word is recognized.
        // 2. A configuration object with adjustable fields
        recognizer.listen(result => {
            //const scores = result.scores; // probability of prediction for each class
            // render the probability scores per class
            const scores = Array.from(result.scores)//[0.008475306443870068, 0.8869879841804504, ...]
            const biggestNumberInArray = Math.max(...scores) //0.8869879841804504
            const indexOfBiggestNumber = scores.indexOf(biggestNumberInArray)// 1
            // labels[indexOfBiggestNumber]
            indexOfBiggestNumber !== 0 && setCurrentIndex(indexOfBiggestNumber)
        }, {
            includeSpectrogram: true, // in case listen should return result.spectrogram
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
        });

        // Stop the recognition in 5 seconds.
        // setTimeout(() => recognizer.stopListening(), 5000);
    }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-logo" alt="logo" >{labels[currentIndex]}</h1>
        <h1>
          Voice to Emoji
        </h1>
        <button onClick={listen}>Start Listening</button>
      </header>
    </div>
  );
}

export default App;
