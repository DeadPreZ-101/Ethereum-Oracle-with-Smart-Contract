import React, { useState, useEffect } from "react";
import "./App.css";
import web3 from "./web3";
import StockOracle from "./StockOracle.json";

function App() {
  const [data, setData] = useState([]);
  const [stock, setStock] = useState("MSFT");
  const [price, setPrice] = useState("");
  const [volume, setVolume] = useState("");

  var stockQuote = new web3.eth.Contract(
    StockOracle.abi,
    StockOracle.networks[5777].address
  );
  console.log(stockQuote);

  //Add a new stock to the blockchain
  const sendStock = async (result) => {
    //get the account from ganache
    console.log(result);
    if (result) {
      fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${result["1. symbol"]}&apikey=V31JRSV2BI2YKWOS`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data["Global Quote"]) {
            saveToBlockchain(
              data["Global Quote"]["01. symbol"],
              parseInt(data["Global Quote"]["05. price"]),
              parseInt(data["Global Quote"]["06. volume"])
            );
            console.log(
              data["Global Quote"]["01. symbol"],
              parseInt(data["Global Quote"]["05. price"]),
              parseInt(data["Global Quote"]["06. volume"])
            );
            alert("Stock was successfully added. You can now get the Price and Volume of the stock.");
          } else {
            alert("The stock was not added. Please wait a few seconds before adding another stock (Due to API restrictions).");
          }
        })
        .catch((e) => alert(e));
    }
    //
  };
  const saveToBlockchain = async (symbol, price, volume) => {
    const accounts = await new web3.eth.getAccounts();
    const pushData = await stockQuote.methods
      .setStock(web3.utils.fromAscii(symbol), price, volume)
      .send({ from: accounts[0] });
    console.log(pushData);
  };
  const stockPrice = async (check) => {
    console.log(check);
    const accounts = await new web3.eth.getAccounts();
    const symbol = web3.utils.fromAscii(stock);
    console.log(symbol);
    const getData = await stockQuote.methods
      .getStockPrice(symbol)
      .call({ from: accounts[0] });
    setPrice(getData);
    console.log(getData);
  };

  const stockVolume = async (check) => {
    const accounts = await new web3.eth.getAccounts();
    const getData = await stockQuote.methods
      .getStockVolume(web3.utils.fromAscii(stock))
      .call({ from: accounts[0] });
    setVolume(getData);
    console.log(getData);
  };

  useEffect(() => {
    fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stock}&apikey=V31JRSV2BI2YKWOS`
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.bestMatches) {
          console.log(result.bestMatches);
          setData(result.bestMatches);
        } else {
          setData([]);
        }
      })
      .catch((e) => console.log(e));
  }, [stock]);

  return (
    <div className="App">
      <form onSubmit={sendStock}>
        <label>
          Set Stock:
          <input
            type="text"
            name="setStock"
            onChange={(e) => setStock(e.target.value)}
          />
          <br />
          <input type="button" value="Get Price" onClick={stockPrice} />
          <input type="button" value="Get Volume" onClick={stockVolume} />
          <span>Price: {price}</span>
          <br></br>
          <span>Volume: {volume}</span>
        </label>
      </form>
      <br />

      {data.length > 0 &&
        data.map((res) => {
          console.log(res["2. name"]);
          return (
            <div key={res["1. symbol"]}>
              <p key={res["1. symbol"]}>
                {res["2. name"]}&nbsp; {res["1. symbol"]}
              </p>{" "}
              <input
                type="button"
                value="Set Stock"
                onClick={() => sendStock(res)}
              />
            </div>
          );
        })}
      
    </div>

    
  );
}

export default App;
