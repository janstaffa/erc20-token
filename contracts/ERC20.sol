// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./IERC20.sol";
import "./math/SafeMath.sol";

// Minimal ERC20 compliant contract
contract ERC20 is IERC20 {
    using SafeMath for uint256;

    string internal tokenName;
    string internal tokenSymbol;
    uint8 internal tokenDecimals;
    uint256 internal tokenSupply;

    mapping(address => uint256) internal accountBalances;
    mapping(address => mapping(address => uint256)) internal accountAllowances;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _tokenDecimals,
        uint256 _startingSupply
    ) {
        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
        tokenDecimals = _tokenDecimals;
        tokenSupply = _startingSupply;

        // Assign all token supply to deploying account
        accountBalances[msg.sender] = _startingSupply;
    }

	// Get name of Token
    function name() public view returns (string memory) {
        return tokenName;
    }

	// Get symbol of Token
    function symbol() public view returns (string memory) {
        return tokenSymbol;
    }

	// Get number of decimals of Token (10^decimals == 1 full Token)
    function decimals() public view returns (uint8) {
        return tokenDecimals;
    }

	// Get current total supply of Token
    function totalSupply() public view returns (uint256) {
        return tokenSupply;
    }

	// Query a balance of specified account
    function balanceOf(address _owner) public view returns (uint256) {
        return accountBalances[_owner];
    }

	// Transfers ammount of Token from sender account to another account
    function transfer(address _to, uint256 _value) public returns (bool) {
        accountBalances[msg.sender] = accountBalances[msg.sender].sub(_value);
        accountBalances[_to] = accountBalances[_to].add(_value);

        emit Transfer(msg.sender, _to, _value);

        return true;
    }
	
	// Transfers ammount of Token from one account to another up to allowed ammount
    function transferFrom(address _from, address _to, uint256 _value) public returns(bool) {
        require(
            accountAllowances[_from][_to] >= _value,
            "Insufficent allowance."
        );

        // If allowance is max u256, it is considered infinite
        if (accountAllowances[_from][_to] < type(uint256).max) {
            accountAllowances[_from][_to] -= _value;
        }
        accountBalances[_from] = accountBalances[_from].sub(_value);
        accountBalances[_to] = accountBalances[_to].add(_value);

        emit Transfer(_from, _to, _value);

		return true;
    }

	// Approve another address to spend senders Tokens
    function approve(address _spender, uint256 _value) public returns(bool) {
        accountAllowances[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

		return true;
    }

	// Get allowance of address provided to another address
    function allowance(
        address _owner,
        address _spender
    ) public view returns (uint256) {
        return accountAllowances[_owner][_spender];
    }
}
