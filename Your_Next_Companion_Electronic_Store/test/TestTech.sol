pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Techmat.sol";

contract TestTech {
 // The address of the Tech contract to be tested
 Techmat purchase = Techmat(DeployedAddresses.Techmat());

 // Testing the buy() function
function testUserCanBuyTech() public {
  uint returnedId = purchase.buy(expectedTechId);
  Assert.equal(returnedId, expectedTechId, "Techmat of the expected tech should match what is returned.");
}

// Testing retrieval of a single tech's owner
function testGetBuyerAddressByTechId() public {
  address buyer = purchase.buyers(expectedTechId);

  Assert.equal(buyer, expectedBuyer, "Owner of the expected tech should be this contract");
}


// Testing retrieval of all tech owners
function testGetBuyerAddressByTechIdInArray() public {
  // Store buyers in memory rather than contract's storage
  address[16] memory buyers = purchase.getBuyers();

  Assert.equal(buyers[expectedTechId], expectedBuyer, "Owner of the expected tech should be this contract");
}

 // The id of the tech that will be used for testing
 uint expectedTechId = 5;

 //The expected owner of tech is this contract
 address expectedBuyer = address(this);

}