import React, { useEffect, useState } from "react";
import Helloabi from "./contracts/Hello.json";
import Web3 from "web3";
import Navbar from "./Navbar";
import Tokenabi from "./contracts/Tokenabi.json";
import CrowdSale from "./contracts/CrowdSaleabi.json";

const App = () => {
  const [refresh, setrefresh] = useState(0);

  let content;
  const [loading2, setloading2] = useState(false);

  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [Hello, setHello] = useState({});

  const [token_name , setTokenName] = useState("");
  const [token_symbol , setSymbol] = useState("");
  const [token_decimals , setDecimals] = useState("");
  const [balanceOfUser, setBalanceOfUser] = useState(0);
  const [total_supply, setTotalSupply] = useState(0);
  const [token_sale , setTokenSale] = useState("");
  const [token_price, setTokenPrice] = useState(0);
  const [token_sold, setTokenSold] = useState(0);

  const [inputfieldchange,setinputfieldchange] = useState(0)
  const [presalecontractinstance,setpresalecontractinstance] =useState({});

  const loadWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchainData = async () => {
    setLoading(true);
    if (typeof window.ethereum == "undefined") {
      return;
    }
    const web3 = new Web3(window.ethereum);

    let url = window.location.href;
    console.log(url);

    const accounts = await web3.eth.getAccounts();

    if (accounts.length == 0) {
      return;
    }
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();

    if (networkId == 4) {
      const tokenContract = new web3.eth.Contract(
        Tokenabi.abi,
        "0x9D183045d98a98b67f8F01dFdcb4b12425bc7902"
      );
      const  tokenName =  await tokenContract.methods.name().call();
      setTokenName(tokenName);
      
      //Symbol
      const  tokenSymbol =  await tokenContract.methods.symbol().call();
      setSymbol(tokenSymbol);
      
      //decimals
      const  tokenDecimal =  await tokenContract.methods.decimals().call();
      setDecimals(tokenDecimal);
      
      //Total Supply
      let totalSupply =  await tokenContract.methods.totalSupply().call();
      totalSupply =  web3.utils.fromWei(totalSupply, 'ether');
      setTotalSupply(totalSupply);

      

     const balanceOf = await tokenContract.methods.balanceOf(accounts[0]).call();
     setBalanceOfUser(web3.utils.fromWei(balanceOf, 'ether'));
      // const hello = {}
      // setHello(hello);
        //0xF66eAb26C40a622Bbf81ed9850915413d749476a  
      const  crowdSaleContract = new web3.eth.Contract(CrowdSale.abi, "0x3744f563B4AFDbfd373aD727648Baeb25aBe4147");
      setpresalecontractinstance(crowdSaleContract);
      
      const  tokenCrowdSale = await crowdSaleContract.methods.token().call();
      setTokenSale(tokenCrowdSale);

      const tokenPriceCrowdSale = await crowdSaleContract.methods.tokenprice().call();
      setTokenPrice(web3.utils.fromWei(tokenPriceCrowdSale, 'ether'));

      const tokenSoldCrowdSale = await crowdSaleContract.methods.totalsold().call();
      setTokenSold(web3.utils.fromWei(tokenSoldCrowdSale, 'ether'))


      setLoading(false);
    } else {
      window.alert("the contract not deployed to detected network.");
      setloading2(true);
    }
  };

  const changeininputfield = (e)=>{
    console.log(e.target.value)
     setinputfieldchange(e.target.value);
  }

  const onsubmit  = async ()=>{
    console.log(parseFloat(inputfieldchange))
    if(parseFloat(inputfieldchange) > 0){
     await  onsendbuytransaction(inputfieldchange)
    }else{
      window.alert("null value not allowed")
    }
  }

  const onsendbuytransaction = async (a) => {
    const web3 = new Web3(window.ethereum);
 
    const amountofethinwei = await web3.utils.toWei(a.toString())
 

    await presalecontractinstance
    .methods
    .buyTokens()
    .send({from:account , value : amountofethinwei })
      .once("recepient", (recepient) => {
       window.alert("sucess")
      })
      .on("error", () => {
        window.alert("error ")
      });
   
  };

  const onclick = async (a) => {
    const web3 = new Web3(window.web3);
    await Hello.methods
      .setCompleted(a.toString())
      .send({ from: account })
      .once("recepient", (recepient) => {
        console.log("success");
      })
      .on("error", () => {
        console.log("error");
      });
  };

  const walletAddress = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    window.location.reload();
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();

    if (refresh == 1) {
      setrefresh(0);
      loadBlockchainData();
    }
    //esl
  }, [refresh]);

  if (loading === true) {
    content = (
      <p className="text-center">
        Loading...{loading2 ? <div>loading....</div> : ""}
      </p>
    );
  } else {
    content = (
      <div class="container">
        <main role="main" class="container">
          <div class="jumbotron">
            <h1>CrowdSale</h1>
            {/* <div className="row" style={{ paddingTop: "30px" }}> */}
              {" "}
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>Token Name : {token_name}</h3>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3> Token Symbol : {token_symbol}</h3>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>Decimals : {token_decimals}</h3>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>Balance : {balanceOfUser}</h3>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>Total Supply : {total_supply}</h3>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>Token : </h3> {token_sale}
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>Token Price : {token_price} ether </h3>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>Total Sold : {token_sold}</h3>
              </div>

              <div className="row" style={{ paddingLeft: "40px" }}>
                <input
                 value="0"
                 placeholder="input the eth amount"
                 value={inputfieldchange}
                 onChange={changeininputfield}
                />
                  <button className="btn btn-primary" onClick={onsubmit}>Buy TOken</button>
              </div>

              
            {/* </div> */}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar account={account} />

      {account == "" ? (
        <div className="container">
          {" "}
          Connect your wallet to application{"   "}{" "}
          <button onClick={walletAddress}>metamask</button>
        </div>
      ) : (
        content
      )}
      {/* {content} */}
    </div>
  );
};

export default App;
