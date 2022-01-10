"use strict";

// Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;

// Address of the selected account
let selectedAccount;

/**
 * Setup the orchestra
 */
function init() {

  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  if (location.protocol !== 'https:') {
    // https://ethereum.stackexchange.com/a/62217/620
    const alert = document.querySelector("#alert-error-https");
    alert.style.display = "block";
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    return;
  }

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // Mikko's test key - don't copy as your mileage may vary
        infuraId: "ed6de67cf02f4160b5ed16c680ae5784" //"8043bb2cf99347b1bfadfb233c5325c0",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        key: "pk_live_B426D2BE3A6018B8"
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });
  initPayButton();
  console.log("Web3Modal instance is", web3Modal);

  const form  = document.getElementsByTagName('form')[0];
  const txid = document.getElementById('txt-txhash');
  form.addEventListener('submit', function (event) {
    console.log(txid.value)
    if(isNaN(txid.value) || !validate_txhash(txid.value)) {
      // If it isn't, we display an appropriate error message
      alert("Please enter valid transaction hash. Thank you!")
      // Then we prevent the form from being sent by canceling the event
      event.preventDefault();
    } else {
      alert("We will verify your transaction hash soon. Thank you!")
    }
  });
}

const initPayButton = () => {
  $('#btn-pay').click(() => {
    // paymentAddress is where funds will be send to
    const paymentAddress = '0x2BA7bb4A58232f4d7Ac6110694274B6aa699DbA7'
    let amountTAUM = $('#txt-amount')[0].value;
    let price = 0.035;
    if(!isIDOPage()) price = 0.01;
    let amountEth = parseInt($('#txt-amount')[0].value) * price/500;
    console.log("Amount BNB=", amountEth,". Price : " , price);
    if (isNaN(amountEth) || amountTAUM < 3000 || amountTAUM > 15000) {
      alert("Please input the value between 3,000 and 15,000");
      //amountEth = 0.5
      // $('#status').html('Please input the value between 3,000 and 15,000')
      return
    }
    // Get a Web3 instance for the wallet
    const web3 = new Web3(provider);
    // Get list of accounts of the connected wallet
    web3.eth.defaultAccount = selectedAccount

    web3.eth.sendTransaction({
      to: paymentAddress,
      value: web3.utils.toWei(String(amountEth), 'ether')
    }, (err, transactionId) => {
      if (err) {
        console.log('Payment failed', err)
        // $('#status').html('Payment failed')
      } else {
        console.log('Payment successful', transactionId)
        // $('#status').html('Payment successful')
      }
    })
  })



}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  console.log("Web3 instance is", web3);

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  const chainData = evmChains.getChain(chainId);
  //document.querySelector("#network-name").textContent = chainData.name;

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0]
  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];

  document.querySelector("#selected-account").textContent = selectedAccount.slice(0,5) + "..." + selectedAccount.slice(selectedAccount.length - 5);

  // Get a handl
  // const template = document.querySelector("#template-balance");
  // const accountContainer = document.querySelector("#accounts");

  // Purge UI elements any previously loaded accounts
  // accountContainer.innerHTML = '';

  // Go through all accounts and get their ETH balance
  // const rowResolvers = accounts.map(async (address) => {
  //   const balance = await web3.eth.getBalance(address);
  //   // ethBalance is a BigNumber instance
  //   // https://github.com/indutny/bn.js/
  //   const ethBalance = web3.utils.fromWei(balance, "ether");
  //   const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
  //   // Fill in the templated row and put in the document
  //   const clone = template.content.cloneNode(true);
  //   clone.querySelector(".address").textContent = address;
  //   clone.querySelector(".balance").textContent = humanFriendlyBalance;
  //   accountContainer.appendChild(clone);
  // });

  // Because rendering account does its own RPC commucation
  // with Ethereum node, we do not want to display any results
  // until data for all accounts is loaded
  // await Promise.all(rowResolvers);

  // Display fully loaded UI for wallet data
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "block";
}



/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";
  // Set the UI back to the initial state
  document.querySelector('#network').style.display = "block";
  document.querySelector("#txt-connect").style.display = "none";

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}


/**
 * Connect wallet button pressed.
 */
async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();

}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

  console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  if (provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  // Set the UI back to the initial state

  document.querySelector("#txt-connect").style.display = "block";
  document.querySelector('#network').style.display = "none";
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}

async function addTAUMToken() {
  const tokenAddress = '0x0c747625747f98315602636661B968fdFD5b466b';
  const tokenSymbol = 'TAUM';
  const tokenDecimals = 18;
  const tokenImage = 'https://i.ibb.co/35xQt63/TAUM-Logo.png';

  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });

    if (wasAdded) {
      console.log('Thanks for your interest!');
    } else {
      console.log('Your loss!');
    }
  } catch (error) {
    console.log(error);
  }
}

function validate_txhash(addr)
{
  return /^0x([A-Fa-f0-9]{64})$/.test(addr);
}
function isIDOPage(){
    var check = false;
    if(document.location.pathname === "/ido.html"){
      check=true;
      }
    return check;
}

/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
  document.querySelector("#btn-add-TAUM").addEventListener("click", addTAUMToken);
});
