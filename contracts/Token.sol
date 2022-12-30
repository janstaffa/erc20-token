// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./ERC20.sol";

// Extension of minimal ERC20 requirements
contract Token is ERC20 {
    using SafeMath for uint256;

    event Mint(address _account, uint256 _ammount);
    event Burn(address _account, uint256 _ammount);

    bool isCapped;
    uint256 tokenCap;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _tokenDecimals,
        uint256 _startingSupply,
        uint256 _tokenCap
    ) ERC20(_tokenName, _tokenSymbol, _tokenDecimals, _startingSupply) {
        isCapped = _tokenCap > 0;
        if (isCapped) {
            require(
                _tokenCap > _startingSupply,
                "Starting supply cannot be greater than token cap."
            );
            tokenCap = _tokenCap;
        }
    }


	// Get fixed cap of the Token
    function cap() public view returns (uint256) {
        return tokenCap;
    }
	   
	// Set a new token cap (internal only)
    function _setCap(uint256 _cap) internal returns (bool) {
		tokenCap = _cap;
		return true;
    }

	// Create an ammount of new Tokens for specified address (internal only)
    function _mint(address _account, uint256 _ammount) internal returns (bool) {
        if (isCapped) require((tokenSupply + _ammount) <= tokenCap);
	
	tokenSupply = tokenSupply.add(_ammount);
        accountBalances[_account] = accountBalances[_account].add(_ammount);
        emit Mint(_account, _ammount);

        return true;
    }

	// Destroy an ammount of Token from specified address (internal only)
    function _burn(address _account, uint256 _ammount) internal returns (bool) {
        require((tokenSupply - _ammount) >= 0);
	
	tokenSupply = tokenSupply.sub(_ammount);
        accountBalances[_account] = accountBalances[_account].sub(_ammount);
        emit Burn(_account, _ammount);

        return true;
    }
}
