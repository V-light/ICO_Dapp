// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


contract Token  {
    uint public totalSupply ;
    mapping(address=>uint) public balanceOf;
    mapping(address => mapping(address=> uint)) public allowance;
    string public name = "Suraj";
    string public symbol = "SRJ";
    uint8  public decimals = 18;
    
    //Events
    event Transfer(address indexed from , address indexed to, uint amount );
    event Approval(address indexed from , address indexed to, uint amount);

    constructor(uint _totalSupply){
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
    }


    function transfer(address recipient, uint amount) public  returns (bool){
        
        require(balanceOf[msg.sender]>=amount, "Sender has not have enough fund");

        balanceOf[msg.sender]-= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient , amount);
        return true;
    }

  

    function approve(address spender, uint amount) public returns (bool){
        allowance[msg.sender][spender] += amount;
        emit Approval(msg.sender, spender , amount);
        return true;
    }

    function transferFrom(address _from , address _to, uint _amount) public returns(bool){
        require(balanceOf[_from]>=_amount, "Not  have enough amount");
        require(allowance[_from][msg.sender]>= _amount, "spender does not have required allowance");

        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;
        allowance[_from][msg.sender] -= _amount;
        emit Transfer(_from, _to, _amount);
        return true;
    }
}