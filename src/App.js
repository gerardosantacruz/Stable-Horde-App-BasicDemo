import './App.css';
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {    
  const [img64, setImg64] = useState('');
  const [prompt, setPrompt] = useState('');
  const [txtprompt, setTxtPrompt] = useState('');
  
  const headers = {
    'Content-Type': 'application/json',
    'apikey': '0000000000',
    'accept': 'application/json'
  }

  const data = {
    "prompt": `${prompt}`
  }

  useEffect(() => {  
    if (prompt !== '')  {      
      getId()
      
    }    
  }, [prompt]);

  function getStatus(idGeneated){
    const timer = setInterval(() => {          
    if (idGeneated !== ''){    
    axios.get("https://stablehorde.net/api/v2/generate/check/" + idGeneated)
      .then((response) => {                
        if (response.data.finished !== 1) {
          console.log("Imagen aun no finalizada...")
        }
        if (response.data.finished === 1) {
          console.log("Imagen FINALIZADA")
          getImg(idGeneated)
          clearInterval(timer)
        }        
      })
      .catch("Error");    
    }          
  }, 10000)
  }

  async function getId(){
    console.log("Obteniendo id")                         
    const res = await axios.post("https://stablehorde.net/api/v2/generate/async", data, {
      headers: headers
    })
      .then((response) => {        
        console.log("Id Obtenienda " + response.data.id)     
        getStatus(response.data.id)
      })
      .catch("Error");  
    return res;
  }

  function getImg(id){    
    axios.get("https://stablehorde.net/api/v2/generate/status/" + id)
      .then((response) => {        
        setImg64(response.data.generations[0].img)        
        if (response.data.finished === 1) {
          console.log("Imagen Descargada")                         
        }        
      })
      .catch("Error");    
  }

  function ChangePrompt(){
    setImg64('')
    setPrompt(txtprompt)
  }

  return (
    <div className="App">
      <input type="text" id="txtPrompt" value={txtprompt} onChange={e => setTxtPrompt(e.target.value)}/>
      <button onClick={() => ChangePrompt()}>Generar</button>
      {img64 === '' && prompt !== '' &&
      <div>
      CARGANDO...
      </div>
      }

      {img64 !== '' &&
      <div>
      <img src={`data:image/png;base64, ${img64}`} alt={prompt} />
      </div>
      }
    </div>
  );
}


export default App;
