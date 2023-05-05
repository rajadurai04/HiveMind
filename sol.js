// Load the web3 library and connect to the Ethereum network
const Web3 = require("web3");
const web3 = new Web3("https://ropsten.infura.io/v3/YOUR_PROJECT_ID");

// Load the contract ABI and address
const MindABI = require("./MindABI.json");
const MindAddress = "0x..."; // Insert the Mind contract address here
const PatentProcessABI = require("./PatentProcessABI.json");
const PatentProcessAddress = "0x..."; // Insert the PatentProcess contract address here
const IdeaDisplayABI = require("./IdeaDisplayABI.json");
const IdeaDisplayAddress = "0x..."; // Insert the IdeaDisplay contract address here

// Create instances of the contract objects
const MindContract = new web3.eth.Contract(MindABI, MindAddress);
const PatentProcessContract = new web3.eth.Contract(
  PatentProcessABI,
  PatentProcessAddress
);
const IdeaDisplayContract = new web3.eth.Contract(
  IdeaDisplayABI,
  IdeaDisplayAddress
);

// Define the functions to interact with the contracts
async function getIdeaDetails() {
  const contractMind = MindContract.methods;
  const contractPatentProcess = PatentProcessContract.methods;
  const contractIdeaDisplay = IdeaDisplayContract.methods;

  // Get the Mind contract details
  const contractAddress = await contractPatentProcess.contractaddress().call();
  const ideaName = await contractMind.Ideaname().call();
  const description = await contractMind.Description().call();
  const domain = await contractMind.Domain().call();

  // Get the IdeaDisplay contract details
  const isApproved = await contractPatentProcess.approved().call();
  let ideaDetails;
  if (isApproved === "yes") {
    ideaDetails = await contractIdeaDisplay.displayIdea().call();
  } else {
    ideaDetails = ["Patent not approved yet", "", ""];
  }

  return {
    contractAddress,
    ideaName,
    description,
    domain,
    isApproved,
    ideaDetails,
  };
}

async function invest(amount) {
  const contractIdeaDisplay = IdeaDisplayContract.methods;
  await contractIdeaDisplay
    .invest()
    .send({ value: amount, from: web3.eth.defaultAccount });
}

async function withdraw(amount) {
  const contractIdeaDisplay = IdeaDisplayContract.methods;
  await contractIdeaDisplay
    .withdraw(amount)
    .send({ from: web3.eth.defaultAccount });
}

async function viewPatentedIdeas() {
  const contractInvestor = InvestorContract.methods;
  const numIdeas = await contractInvestor.patentedIdeas().length().call();
  const ideas = [];
  for (let i = 0; i < numIdeas; i++) {
    const idea = await contractInvestor.patentedIdeas(i).call();
    ideas.push(idea);
  }
  return ideas;
}

// Set the default account to use
web3.eth.defaultAccount = "0x..."; // Insert the default account address here

// Use the functions to interact with the contracts
getIdeaDetails().then((details) => console.log(details));
invest(2 * 10 ** 18); // Invest 2 ETH
withdraw(1 * 10 ** 18); // Withdraw 1 ETH
viewPatentedIdeas().then((ideas) => console.log(ideas));
