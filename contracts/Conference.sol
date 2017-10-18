contract Conference {

 	address public organizer;
 	mapping (address => uint) public registrantsPaid;
 	uint public numRegistrants;
 	uint public quota;

  event Deposit(address _from, uint _amount);
 	event Refund(address _to, uint _amount);



 	function Conference() {

 		organizer = msg.sender;
 		quota = 100;
 		numRegistrants = 0;
 	}


 	function buyTicket() public {
 		if(numRegistrants >= quota) {
 			throw;
 		}

 		registrantsPaid[msg.sender] = msg.value;
 		numRegistrants++;
 		Deposit(msg.sender, msg.value);
 	}

}
