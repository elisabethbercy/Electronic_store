pragma solidity ^0.5.0;

contract Techmat{
    address[16] public buyers;
    //Bying tech
    function buy(uint techId) public returns (uint){
        require(techId >= 0 && techId <=15);

        buyers[techId] = msg.sender;

        return techId;

    }

    //Retrieving the buyers
    function getBuyers() public view returns(address[16] memory){
        return buyers;
    }
}