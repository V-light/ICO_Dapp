// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import './Token.sol';

contract TokenSale{
    address payable public admin;

    Token public token;

    uint public tokenprice;
    uint public totalsold;   

    event Sell(address sender, uint totalvalue);

    constructor(address _tokenaddress, uint _tokenvalue){
        admin = payable(msg.sender);
        tokenprice = _tokenvalue;
        token = Token(_tokenaddress);
    }

    function buyTokens() public payable{
        require(token.balanceOf(address(this))>=msg.value*tokenprice , "The smart contract does not have enough token");
        
        token.transfer(msg.sender, msg.value*tokenprice);

        totalsold += msg.value*tokenprice;

        emit Sell(msg.sender, msg.value*tokenprice);
    }

    function endsale( ) public {
        require(msg.sender ==admin, "you are not admin");
        token.transfer(msg.sender, address(this).balance);

        selfdestruct(admin);
    }
}