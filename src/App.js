import './App.css';
import React,{useState,useEffect,useRef} from 'react';
import axios from 'axios';
import Switch from './Components/Switch';
import soudFile from './Components/sounds/victory.mp3';

let USDT = 0;

function App() {
  let audio = new Audio(soudFile);
  const [data,setData] = useState(0);
  const [conclusion,setConclusion] = useState('');
  //const [targetBuy,setTargetBuy] = useState();
  //const [targetSell,setTargetSell] = useState();

  //const [buyToggle,setBuyToggle] = useState(false);
  //const [sellToggle,setSellToggle] = useState(false);
  const targetBuy = useRef();
  const targetSell = useRef();
  const buyToggle = useRef(false);
  const sellToggle = useRef(false);

  const priceAlert =()=>{
    //console.log(buyToggle.current,sellToggle.current);
    if(buyToggle.current){

      if(buyToggle.current && sellToggle.current){
        setConclusion("Waiting for Buy and Sell USDT!!");
      }
      else{
        setConclusion("Waiting for Buy USDT!!");
      }
      if((+ targetBuy.current.value) >= USDT){
        setConclusion("It's time to Buy USDT!!");
        audio.play();
        return;
      }
    }
    if(sellToggle.current){

      if(buyToggle.current && sellToggle.current){
        setConclusion("Waiting for Buy and Sell USDT!!");
      }
      else{
        setConclusion("Waiting for Sell USDT!!");
      }
      if((+ targetSell.current.value) <= USDT){
        setConclusion("It's time to Sell USDT!!");
        audio.play();
        return;
      }
    }
    if(!buyToggle.current && !sellToggle.current){
      setConclusion("");
    }
  }
  useEffect(()=>{
    const fetchData = async()=>{
      const res = await axios.get('https://api.wazirx.com/api/v2/trades?market=usdtinr&limit=1');
      USDT = (+ res.data[0].price);
      //console.log(res.data[0].price);
      setData(+ res.data[0].price);
      priceAlert();
    }
    fetchData();
    setInterval(()=>{
      fetchData();
    },2700)
  },[]);
  const buyToggleHandler=()=>{
    //console.dir(targetBuy.current.value);
    if(targetBuy.current.value === ''  && buyToggle.current === false){
      alert("Please set the target buy price first!!");
      return;
    }
    //setBuyToggle(!buyToggle);
    buyToggle.current = !buyToggle.current;
    setData(data);
    priceAlert();
    //console.log(buyToggle.current);
  }

  const sellToggleHandler=()=>{
    if(targetSell.current.value === '' && sellToggle.current === false){
      alert("Please set the target sell price first!!");
      return;
    }
    //setSellToggle(!sellToggle);
    sellToggle.current = !sellToggle.current;
    setData(data);
    priceAlert();
    //console.log(sellToggle.current);
  }

  return (
    <div className="container">
      {
        data !== 0 ? 
        <div className='cp'>Current price of USDT {data}</div>
        :
        <div className='cp'>Loading....</div>
      }
      

      <div className='controler'>
          <input type='number' className='target' placeholder='Target Buy Price...'
          ref={targetBuy}
          ></input>
      <Switch isToggle={buyToggle.current} onToggle={buyToggleHandler}/>
      </div>

      <div className='controler'>
          <input type='number' className='target' placeholder='Target Sell Price...'
          ref={targetSell}
          ></input>
          <Switch isToggle={sellToggle.current} onToggle={sellToggleHandler}/>
      </div>

      <div className="cp">{conclusion}
        </div>
    </div>
  );
}

export default App;
