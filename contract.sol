//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Mind {
    string public Ideaname;
    string public Description;
    string public Domain;
    address public creator;
    
    constructor() {
        creator = msg.sender;
    }
    
    function setName(string memory Idea, string memory d, string memory field) public {
        require(msg.sender == creator, "Only the creator can modify the idea details");
        Ideaname = Idea;
        Description = d;
        Domain = field;
    }
}

contract PatentProcess {
    string public approved;
    address public contractaddress;
    address public creator;
    
    constructor(address _contractaddress) {
        contractaddress = _contractaddress;
        creator = msg.sender;
    }
    
    function setName(string memory Result) public {
        require(msg.sender == creator, "Only the creator can approve the patent");
        approved = Result;
    }
    
    function getIdeaDetails() public view returns (string memory, string memory, string memory) {
        Mind contractMind = Mind(contractaddress);
        return (contractMind.Ideaname(), contractMind.Description(), contractMind.Domain());
    }
}

contract IdeaDisplay {
    PatentProcess public patentProcess;
    mapping(address => uint) public investment;
    mapping(address => bool) public investors;
    uint public totalInvestment;
    uint public defaultInvestAmount = 2 ether;
    
    constructor(address _patentProcess) {
        patentProcess = PatentProcess(_patentProcess);
    }
    
    function displayIdea() public view returns (string memory, string memory, string memory) {
        require(keccak256(bytes(patentProcess.approved())) == keccak256(bytes("yes")), "Patent not approved yet");
        Mind contractMind = Mind(patentProcess.contractaddress());
        return (contractMind.Ideaname(), contractMind.Description(), contractMind.Domain());
    }
    
    function invest() public payable {
        require(msg.value > 0, "Investment amount should be greater than zero");
        require(keccak256(bytes(patentProcess.approved())) == keccak256(bytes("yes")), "Cannot invest until the patent is approved");
        require(!investors[msg.sender], "Investor can invest only once");
        investors[msg.sender] = true;
        investment[msg.sender] = msg.value;
        totalInvestment += msg.value;
    }
    
    function withdraw(uint amount) public {
        require(investment[msg.sender] >= amount, "Insufficient balance to withdraw");
        investment[msg.sender] -= amount;
        totalInvestment -= amount;
        payable(msg.sender).transfer(amount);
    }
}

contract Investor {
    mapping(address => bool) public approvedInvestors;
    mapping(address => bool) public invested;
    IdeaDisplay[] public patentedIdeas;
    
    modifier onlyApprovedInvestor() {
        require(approvedInvestors[msg.sender], "Only approved investors can invest");
        _;
    }
    
    function addApprovedInvestor(address investor) public {
        approvedInvestors[investor] = true;
    }
    
    function viewPatentedIdeas() public view returns (string[] memory, string[] memory, string[] memory) {
        uint length = patentedIdeas.length;
        string[] memory names = new string[](length);
        string[] memory descriptions = new string[](length);
        string[] memory domains = new string[](length);
        for (uint i = 0; i < length; i++) {
            (string memory name, string memory description, string memory domain) = patentedIdeas[i].displayIdea();
            names[i] = name;
            descriptions[i] = description;
            domains[i] = domain;
        }
        return (names, descriptions, domains);
    }
}