// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

// External packages
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Local base
import "./AdminOwnable.sol";


// Interfaces
import "./interfaces/IAEOS.sol";

/**
 * @title AeosVesting
 * @dev Main orchestrator for AEOS vesting system
 * Manages all 8 allocation modules:
 * 1. Team & Founders (10%) — AeosVestingTeam
 * 2. Strategic Investors (10%) — AeosVestingStrategic
 * 3. Advisors & Partnerships (5%) — AeosVestingAdvisors
 * 4. Treasury, Liquidity, Community Tracking — AeosVestingReserves
 * 5. Community Incentives (20%)
 * 6. Ecosystem Development (15%)
 * 7. Community Growth (5%)
 * 8. (Tracked via Reserves module)
 *
 * Total: 1,000,000,000 AEOS
 */
contract AeosVesting is AdminOwnable {
 

    // Token references
    address public usdtToken;


    constructor(address _aeosToken, address _usdtToken) {
        require(_usdtToken != address(0), "Invalid USDT token");
        usdtToken = _usdtToken;
    }
 
 
    /**
     * @dev Emergency withdraw AEOS tokens (owner only)
     * Used only if tokens are stuck (should not happen in normal operation)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(token != address(0), "Invalid token");
        require(amount > 0, "Amount must be > 0");

        IERC20(token).transfer(msg.sender, amount);
    }
}
