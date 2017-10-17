contract('Conference', function(accounts) {
	console.log(accounts);
	var owner_account = accounts[0];
  var sender_account = accounts[1];


  it("Initial conference settings should match", function(done) {
  	
  	Conference.new({from: owner_account}).then(
  		function(conference) {
  			conference.quota.call().then(
  				function(quota) { 
  					assert.equal(quota, 100, "Quota doesn't match!"); 
  			}).then(
  				function() { 
  					return conference.numRegistrants.call(); 
  			}).then(
  				function(num) { 
  					assert.equal(num, 0, "Registrants doesn't match!");
  					return conference.organizer.call();
  			}).then(
  				function(organizer) { 
  					assert.equal(organizer, owner_account, "Owner doesn't match!");
  					done();
  			}).catch(done);
  	}).catch(done);
  });

  it("Should update quota", function(done) {
  	
  	Conference.new({from: owner_account}).then(
  		function(conference) {
  			conference.quota.call().then(
  				function(quota) { 
  					assert.equal(quota, 100, "Quota doesn't match!"); 
  			}).then(
  				function() { 
  					return conference.changeQuota(300);
  			}).then(
  				function() { 
  					return conference.quota.call()
  			}).then(
  				function(quota) { 
  					assert.equal(quota, 300, "New quota is not correct!");
  					done();
  			}).catch(done);
  	}).catch(done);
  });


  it("Should let you buy a ticket", function(done) {

  	Conference.new({ from: accounts[0] }).then(
  		function(conference) {

        var ticketPrice = web3.toWei(.05, 'ether');
        var initialBalance = web3.eth.getBalance(conference.address).toNumber();  

  			conference.buyTicket({ from: accounts[1], value: ticketPrice }).then(
          function() {
  					var newBalance = web3.eth.getBalance(conference.address).toNumber();
            var difference = newBalance - initialBalance;
  					assert.equal(difference, ticketPrice, "Difference should be what was sent");
  					return conference.numRegistrants.call(); 
  			}).then(
  				function(num) { 
  					assert.equal(num, 1, "there should be 1 registrant");
  					return conference.registrantsPaid.call(sender_account);
  			}).then(
  				function(amount) {
  					assert.equal(amount.toNumber(), ticketPrice, "Sender's paid but is not listed as paying");	
  					return web3.eth.getBalance(conference.address);
  			}).then(
  				function(bal) {
            assert.equal(bal.toNumber(), ticketPrice, "Final balance mismatch");
  					done();
  			}).catch(done);
  	}).catch(done);
  });

  it("Should issue a refund by owner only", function(done) {
    
    Conference.new({ from: accounts[0] }).then(
      function(conference) {

        var ticketPrice = web3.toWei(.05, 'ether');
        var initialBalance = web3.eth.getBalance(conference.address).toNumber(); 

        conference.buyTicket({ from: accounts[1], value: ticketPrice }).then(
          function() {
            var newBalance = web3.eth.getBalance(conference.address).toNumber();
            var difference = newBalance - initialBalance;
            assert.equal(difference, ticketPrice, "Difference should be what was sent");

            // Now try to issue refund as second user - should fail
            return conference.refundTicket(accounts[1], ticketPrice, {from: accounts[1]});
        }).then(
          function() {  
            var balance = web3.eth.getBalance(conference.address);
            assert.equal(balance, ticketPrice, "Balance should be unchanged");
            // Now try to issue refund as organizer/owner
            return conference.refundTicket(accounts[1], ticketPrice, {from: accounts[0]});
        }).then(
          function() {
            var postRefundBalance = web3.eth.getBalance(conference.address).toNumber();
            assert.equal(postRefundBalance, initialBalance, "Balance should be initial balance");
            done();
        }).catch(done);
      }).catch(done);
    });

});

