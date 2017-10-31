pragma solidity ^0.4.0;

contract Conference {

 	address public organizer;
 	mapping (address => uint) public registrantsPaid;
 	uint public numRegistrants;
 	uint public quota;

    event Deposit(address _from, uint _amount);
 	event Refund(address _to, uint _amount);



 	function Conference() payable {
 		organizer = msg.sender;
 		quota = 100;
 		numRegistrants = 0;
 	}


 	function buyTicket() payable {
 		require(quota > numRegistrants);

 		registrantsPaid[msg.sender] = msg.value;
 		numRegistrants++;
 		Deposit(msg.sender, msg.value);
 	}

 	function changeQuota(uint _amount) payable {
 	    require(_amount >= numRegistrants);
 		quota = _amount;
 	}
}
