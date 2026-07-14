// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

/*
 * ███╗   ███╗ ██████╗ ██╗   ██╗██╗
 * ████╗ ████║██╔═══██╗██║   ██║██║      MoVi Community — Let's Mov'It Together
 * ██╔████╔██║██║   ██║██║   ██║██║      Affiliate (unilevel) genealogy + rewards plan
 * ██║╚██╔╝██║██║   ██║╚██╗ ██╔╝██║      Single-file, self-contained. Token = USDT (BSC, 18 dp).
 * ██║ ╚═╝ ██║╚██████╔╝ ╚████╔╝ ██║
 * ╚═╝     ╚═╝ ╚═════╝   ╚═══╝  ╚═╝
 *
 * Genealogy model adapted from AeosGenealogy (affiliate tree: parent + children).
 * Ownership model adapted from AdminOwnable (Ownable + admin layer). Both inlined
 * below so this compiles as one file with zero external imports.
 *
 * Rewards (all amounts admin-configurable; defaults mirror the published plan):
 *   Registration       30 USDT (one-time; joins the tree → treasury)
 *   Subscription       30 USDT / 30 days (funds the four bonuses below)
 *   Direct Referral    10 USDT  → the subscriber's direct sponsor
 *   Unilevel           1 USDT × 10 levels, AUTO-COMPRESS (skip inactive, force full 10)
 *   Team Power         1.5 USDT for every 3 direct subscriptions (metered, carries)
 *   Leadership         1 USDT   → the subscriber's inherited Origin Wallet (tagged Leader)
 *   Withdraw           24h cooldown, 10% processing fee
 *
 * Money flow: deposit → internal `balance`; subscribe/withdraw spend it; Direct +
 * Leadership credit `balance` directly; Unilevel + Team Power accrue to `pending*`
 * and must be Collected into `balance` before Withdraw. Undistributed shares and
 * fees accrue to `treasury` (owner-withdrawable).
 */

/* -------------------------------------------------------------------------- */
/*                                  IERC20                                     */
/* -------------------------------------------------------------------------- */
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/* -------------------------------------------------------------------------- */
/*                          Ownable (minimal, inlined)                        */
/* -------------------------------------------------------------------------- */
abstract contract Ownable {
    address private _owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address initialOwner) {
        require(initialOwner != address(0), "OWNABLE_ZERO_OWNER");
        _owner = initialOwner;
        emit OwnershipTransferred(address(0), initialOwner);
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "NOT_OWNER");
        _;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ZERO_ADDRESS");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    function renounceOwnership() external onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }
}

/* -------------------------------------------------------------------------- */
/*                     AdminOwnable (from the code model)                     */
/* -------------------------------------------------------------------------- */
abstract contract AdminOwnable is Ownable {
    mapping(address => bool) public isAdmin;

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    modifier onlyAdmin() {
        require(msg.sender == owner() || isAdmin[msg.sender], "NOT_AUTHORIZED_ADMIN");
        _;
    }

    function addAdmin(address adminAddress) external onlyOwner {
        require(adminAddress != address(0), "ZERO_ADDRESS");
        require(!isAdmin[adminAddress], "ALREADY_ADMIN");
        isAdmin[adminAddress] = true;
        emit AdminAdded(adminAddress);
    }

    function removeAdmin(address adminAddress) external virtual onlyOwner {
        require(adminAddress != address(0), "ZERO_ADDRESS");
        require(isAdmin[adminAddress], "NOT_ADMIN");
        isAdmin[adminAddress] = false;
        emit AdminRemoved(adminAddress);
    }

    function checkIsAdmin(address addr) external view returns (bool) {
        return addr == owner() || isAdmin[addr];
    }
}

/* -------------------------------------------------------------------------- */
/*                       ReentrancyGuard (minimal, inlined)                   */
/* -------------------------------------------------------------------------- */
abstract contract ReentrancyGuard {
    uint256 private _status = 1; // 1 = not entered, 2 = entered

    modifier nonReentrant() {
        require(_status == 1, "REENTRANCY");
        _status = 2;
        _;
        _status = 1;
    }
}

/* ========================================================================== */
/*                                   MoVi                                      */
/* ========================================================================== */
contract MoVi is AdminOwnable, ReentrancyGuard {
    /* --------------------------- Immutables ---------------------------- */
    IERC20 public immutable usdt; // payment token (BSC USDT, 18 decimals)

    /* ---------------------------- Genealogy ---------------------------- */
    struct Affiliate {
        address parent;      // referral sponsor (unilevel upline)
        address[] children;  // direct referrals
    }

    mapping(address => bool) public isUser;
    mapping(address => Affiliate) private _affiliate;
    address public root;
    uint256 public totalUsers;

    /* --------------------------- Subscription -------------------------- */
    mapping(address => uint256) public subscriptionExpiry; // unix ts; active while > now

    /* ----------------------------- Balances ---------------------------- */
    mapping(address => uint256) public balance;         // in-contract wallet (withdrawable)
    mapping(address => uint256) public pendingUnilevel; // collect → balance
    mapping(address => uint256) public pendingTeamPower;// collect → balance
    uint256 public treasury;                            // owner-withdrawable (fees + leftovers)

    /* ------------------------ Counters / lifetime ---------------------- */
    mapping(address => uint256) public teamPowerCounter;      // direct subs, metered by teamPowerPer
    mapping(address => uint256) public totalDirectEarned;
    mapping(address => uint256) public totalUnilevelEarned;
    mapping(address => uint256) public totalTeamPowerEarned;
    mapping(address => uint256) public totalLeadershipEarned;

    /* --------------------------- Leadership ---------------------------- */
    mapping(address => address) public originWallet; // inherited from sponsor at registration
    mapping(address => bool) public isLeader;        // tagged leaders (dashboards / off-chain)

    /* ---------------------------- Cooldowns ---------------------------- */
    mapping(address => uint256) public lastCallBlock;
    mapping(address => uint256) public lastCallTime;
    mapping(address => uint256) public lastWithdraw;
    mapping(address => uint256) public lastCollect;

    /* -------------------- Configurable parameters ---------------------- */
    uint256 public registrationFee      = 30e18;   // 30 USDT
    uint256 public subscriptionFee      = 30e18;   // 30 USDT
    uint256 public subscriptionPeriod   = 30 days;
    uint256 public directBonus          = 10e18;   // 10 USDT
    uint256 public unilevelBonusPerLevel= 1e18;    // 1 USDT
    uint256 public unilevelLevels       = 10;      // levels paid per subscription
    uint256 public teamPowerBonus       = 15e17;   // 1.5 USDT
    uint256 public teamPowerPer         = 3;       // per 3 direct subscriptions
    uint256 public leadershipBonus      = 1e18;    // 1 USDT
    uint256 public withdrawFeeBps       = 1000;    // 10% (basis points)
    uint256 public withdrawCooldown     = 24 hours;
    uint256 public collectCooldown      = 0;       // owner can raise (e.g. 7 days)
    uint256 public transactionCooldown  = 9 seconds;
    uint256 public maxUnilevelScan      = 200;     // gas bound for auto-compress skips
    bool    public paused;

    uint256 private constant BPS = 10_000;

    /* ------------------------------ Events ----------------------------- */
    event Registered(address indexed user, address indexed sponsor, address origin);
    event Subscribed(address indexed user, uint256 expiry);
    event Deposited(address indexed user, uint256 amount);
    event DirectBonus(address indexed earner, address indexed from, uint256 amount);
    event UnilevelBonus(address indexed earner, address indexed from, uint256 level, uint256 amount);
    event TeamPowerBonus(address indexed earner, uint256 amount, uint256 counter);
    event LeadershipBonus(address indexed earner, address indexed from, uint256 amount);
    event Collected(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 net, uint256 fee);
    event TreasuryWithdrawn(address indexed to, uint256 amount);
    event OriginWalletSet(address indexed user, address indexed origin);
    event LeaderTagged(address indexed user, bool leader);
    event AffiliateParentUpdated(address indexed user, address indexed newParent);
    event ParamsUpdated();
    event PausedSet(bool paused);

    /* ---------------------------- Modifiers ---------------------------- */
    // Anti-spam (from the genealogy model): EOA-only, one call/block, cooldown.
    modifier antiSpam() {
        require(msg.sender == tx.origin, "CALLER_NOT_EOA");
        require(block.number > lastCallBlock[msg.sender], "ONE_CALL_PER_BLOCK");
        require(block.timestamp >= lastCallTime[msg.sender] + transactionCooldown, "TX_COOLDOWN");
        lastCallBlock[msg.sender] = block.number;
        lastCallTime[msg.sender] = block.timestamp;
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "PAUSED");
        _;
    }

    /* --------------------------- Constructor --------------------------- */
    constructor(address _usdt, address _root) Ownable(msg.sender) {
        require(_usdt != address(0), "ZERO_USDT");
        require(_root != address(0), "ZERO_ROOT");
        usdt = IERC20(_usdt);

        root = _root;
        isUser[_root] = true;
        isAdmin[_root] = true;
        isLeader[_root] = true;
        originWallet[_root] = _root;               // top of every Leadership chain
        subscriptionExpiry[_root] = type(uint256).max; // root is always active (unilevel terminus)
        totalUsers = 1;

        _requireSolvent();
    }

    /* ==================================================================== */
    /*                            USER — JOIN / PAY                          */
    /* ==================================================================== */

    /**
     * @notice Register into the network under `sponsor`. Pays `registrationFee`
     *         via USDT transferFrom (approve first). Inherits the sponsor's
     *         Origin Wallet for Leadership rewards.
     */
    function register(address sponsor) external antiSpam nonReentrant whenNotPaused {
        require(!isUser[msg.sender], "ALREADY_REGISTERED");
        require(isUser[sponsor], "SPONSOR_NOT_FOUND");
        require(sponsor != msg.sender, "SELF_SPONSOR");

        // Pull the one-time registration fee straight to treasury.
        _safeTransferFrom(msg.sender, address(this), registrationFee);
        treasury += registrationFee;

        isUser[msg.sender] = true;
        _affiliate[msg.sender].parent = sponsor;
        _affiliate[sponsor].children.push(msg.sender);

        // Inherit the sponsor's origin (falls back to the sponsor itself).
        address o = originWallet[sponsor];
        originWallet[msg.sender] = o == address(0) ? sponsor : o;

        totalUsers += 1;
        emit Registered(msg.sender, sponsor, originWallet[msg.sender]);
    }

    /**
     * @notice Deposit USDT into your in-contract wallet `balance` (used to pay for
     *         subscriptions; earnings also land here and are withdrawable).
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        require(isUser[msg.sender], "NOT_REGISTERED");
        require(amount > 0, "ZERO_AMOUNT");
        _safeTransferFrom(msg.sender, address(this), amount);
        balance[msg.sender] += amount;
        emit Deposited(msg.sender, amount);
    }

    /**
     * @notice Subscribe for one period (default 30 days). Deducts `subscriptionFee`
     *         from your `balance` and distributes the four bonuses. Extends the
     *         active window (stacks if already active).
     */
    function subscribe() external antiSpam nonReentrant whenNotPaused {
        require(isUser[msg.sender], "NOT_REGISTERED");
        require(balance[msg.sender] >= subscriptionFee, "INSUFFICIENT_BALANCE");

        balance[msg.sender] -= subscriptionFee;

        uint256 base = subscriptionExpiry[msg.sender] > block.timestamp
            ? subscriptionExpiry[msg.sender]
            : block.timestamp;
        subscriptionExpiry[msg.sender] = base + subscriptionPeriod;

        uint256 distributed = _distribute(msg.sender);
        if (subscriptionFee > distributed) {
            treasury += (subscriptionFee - distributed);
        }

        emit Subscribed(msg.sender, subscriptionExpiry[msg.sender]);
    }

    /* ==================================================================== */
    /*                       INTERNAL — DISTRIBUTION                         */
    /* ==================================================================== */

    /// @dev Splits one subscription fee across the four bonuses. Returns the total
    ///      credited (caller sends the remainder to treasury). Never exceeds the fee
    ///      because `_requireSolvent()` enforces it in the constructor/setters.
    function _distribute(address u) internal returns (uint256 paid) {
        address sponsor = _affiliate[u].parent;

        // 1) Direct Referral → direct sponsor (credited to withdrawable balance).
        if (sponsor != address(0) && directBonus > 0) {
            balance[sponsor] += directBonus;
            totalDirectEarned[sponsor] += directBonus;
            paid += directBonus;
            emit DirectBonus(sponsor, u, directBonus);

            // 2) Team Power → sponsor, metered: award every `teamPowerPer` direct subs.
            if (teamPowerPer > 0 && teamPowerBonus > 0) {
                uint256 c = ++teamPowerCounter[sponsor];
                if (c % teamPowerPer == 0) {
                    pendingTeamPower[sponsor] += teamPowerBonus;
                    totalTeamPowerEarned[sponsor] += teamPowerBonus;
                    paid += teamPowerBonus;
                    emit TeamPowerBonus(sponsor, teamPowerBonus, c);
                }
            }
        }

        // 3) Unilevel (auto-compress) — always accounts for the full block.
        paid += _payUnilevel(u);

        // 4) Leadership → inherited Origin Wallet.
        address origin = originWallet[u];
        if (origin != address(0) && leadershipBonus > 0) {
            balance[origin] += leadershipBonus;
            totalLeadershipEarned[origin] += leadershipBonus;
            paid += leadershipBonus;
            emit LeadershipBonus(origin, u, leadershipBonus);
        }
    }

    /// @dev Auto-compress unilevel: walk up the sponsor chain, pay `unilevelBonusPerLevel`
    ///      to each ACTIVE ancestor, skipping inactive ones, until `unilevelLevels` active
    ///      ancestors are paid or the chain/scan-cap ends. Always ACCOUNTS for the full
    ///      block (unilevelLevels × perLevel); any unpaid shares go to treasury.
    function _payUnilevel(address u) internal returns (uint256 fullBlock) {
        uint256 per = unilevelBonusPerLevel;
        uint256 target = unilevelLevels;
        fullBlock = target * per;
        if (fullBlock == 0) return 0;

        uint256 paidCount;
        uint256 scans;
        uint256 maxScan = maxUnilevelScan;
        address cursor = _affiliate[u].parent;

        while (cursor != address(0) && paidCount < target && scans < maxScan) {
            unchecked { scans++; }
            if (_isActive(cursor)) {
                pendingUnilevel[cursor] += per;
                totalUnilevelEarned[cursor] += per;
                unchecked { paidCount++; }
                emit UnilevelBonus(cursor, u, paidCount, per);
            }
            cursor = _affiliate[cursor].parent;
        }

        // Force full distribution: unpaid levels → treasury.
        uint256 distributed = paidCount * per;
        if (fullBlock > distributed) {
            treasury += (fullBlock - distributed);
        }
        // `fullBlock` is what the subscription fee is charged for this bonus.
        return fullBlock;
    }

    /* ==================================================================== */
    /*                        USER — COLLECT / WITHDRAW                      */
    /* ==================================================================== */

    /// @notice Move pending Unilevel + Team Power bonuses into your withdrawable balance.
    function collect() external nonReentrant whenNotPaused {
        require(isUser[msg.sender], "NOT_REGISTERED");
        require(block.timestamp >= lastCollect[msg.sender] + collectCooldown, "COLLECT_COOLDOWN");

        uint256 amount = pendingUnilevel[msg.sender] + pendingTeamPower[msg.sender];
        require(amount > 0, "NOTHING_TO_COLLECT");

        pendingUnilevel[msg.sender] = 0;
        pendingTeamPower[msg.sender] = 0;
        balance[msg.sender] += amount;
        lastCollect[msg.sender] = block.timestamp;

        emit Collected(msg.sender, amount);
    }

    /// @notice Withdraw USDT from your balance. 24h cooldown; `withdrawFeeBps` fee.
    function withdraw(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "ZERO_AMOUNT");
        require(balance[msg.sender] >= amount, "INSUFFICIENT_BALANCE");
        require(block.timestamp >= lastWithdraw[msg.sender] + withdrawCooldown, "WITHDRAW_COOLDOWN");

        balance[msg.sender] -= amount;
        lastWithdraw[msg.sender] = block.timestamp;

        uint256 fee = (amount * withdrawFeeBps) / BPS;
        uint256 net = amount - fee;
        treasury += fee;

        _safeTransfer(msg.sender, net);
        emit Withdrawn(msg.sender, net, fee);
    }

    /* ==================================================================== */
    /*                               VIEWS                                  */
    /* ==================================================================== */

    function isActive(address user) external view returns (bool) {
        return _isActive(user);
    }

    function _isActive(address a) internal view returns (bool) {
        return isUser[a] && subscriptionExpiry[a] > block.timestamp;
    }

    function getAffiliate(address user) external view returns (address parent, uint256 directCount) {
        Affiliate storage a = _affiliate[user];
        return (a.parent, a.children.length);
    }

    function getChildren(address user, uint256 offset, uint256 limit)
        external view returns (address[] memory result, uint256 total)
    {
        address[] storage ch = _affiliate[user].children;
        total = ch.length;
        if (offset >= total) return (new address[](0), total);
        uint256 end = offset + limit > total ? total : offset + limit;
        result = new address[](end - offset);
        for (uint256 i = 0; i < result.length; i++) result[i] = ch[offset + i];
    }

    struct UserView {
        bool registered;
        bool active;
        uint256 subscriptionExpiry;
        address sponsor;
        address origin;
        bool leader;
        uint256 directCount;
        uint256 balance;
        uint256 pendingUnilevel;
        uint256 pendingTeamPower;
        uint256 collectable;
        uint256 teamPowerCounter;
        uint256 totalDirect;
        uint256 totalUnilevel;
        uint256 totalTeamPower;
        uint256 totalLeadership;
    }

    /// @notice One-call dashboard snapshot for the frontend.
    function getUser(address user) external view returns (UserView memory v) {
        Affiliate storage a = _affiliate[user];
        v.registered = isUser[user];
        v.active = _isActive(user);
        v.subscriptionExpiry = subscriptionExpiry[user];
        v.sponsor = a.parent;
        v.origin = originWallet[user];
        v.leader = isLeader[user];
        v.directCount = a.children.length;
        v.balance = balance[user];
        v.pendingUnilevel = pendingUnilevel[user];
        v.pendingTeamPower = pendingTeamPower[user];
        v.collectable = pendingUnilevel[user] + pendingTeamPower[user];
        v.teamPowerCounter = teamPowerCounter[user];
        v.totalDirect = totalDirectEarned[user];
        v.totalUnilevel = totalUnilevelEarned[user];
        v.totalTeamPower = totalTeamPowerEarned[user];
        v.totalLeadership = totalLeadershipEarned[user];
    }

    /// @notice Max USDT that can be paid out from a single subscription (solvency bound).
    function maxPayoutPerSubscription() public view returns (uint256) {
        return directBonus
            + (unilevelLevels * unilevelBonusPerLevel)
            + teamPowerBonus
            + leadershipBonus;
    }

    /* ==================================================================== */
    /*                          ADMIN — GENEALOGY                           */
    /* ==================================================================== */

    /// @notice Correct a user's sponsor (migration). Guards against cycles.
    function updateAffiliateParent(address user, address newParent) external onlyAdmin {
        require(isUser[user], "USER_NOT_FOUND");
        require(isUser[newParent], "NEW_PARENT_NOT_FOUND");
        require(newParent != user, "SELF_PARENT");
        require(newParent != _affiliate[user].parent, "ALREADY_SAME_PARENT");

        // Cycle check: user must not be an ancestor of newParent.
        address cursor = newParent;
        for (uint256 i = 0; i < 500; i++) {
            if (cursor == address(0)) break;
            if (cursor == user) revert("CIRCULAR_PARENT");
            cursor = _affiliate[cursor].parent;
        }

        address oldParent = _affiliate[user].parent;
        if (oldParent != address(0)) {
            address[] storage oc = _affiliate[oldParent].children;
            for (uint256 i = 0; i < oc.length; i++) {
                if (oc[i] == user) {
                    oc[i] = oc[oc.length - 1];
                    oc.pop();
                    break;
                }
            }
        }
        _affiliate[user].parent = newParent;
        _affiliate[newParent].children.push(user);
        emit AffiliateParentUpdated(user, newParent);
    }

    /// @notice Set/override a user's Origin Wallet (Leadership target).
    function setOriginWallet(address user, address origin) external onlyAdmin {
        require(isUser[user], "USER_NOT_FOUND");
        require(origin != address(0), "ZERO_ADDRESS");
        originWallet[user] = origin;
        emit OriginWalletSet(user, origin);
    }

    /// @notice Tag/untag a Leader.
    function setLeader(address user, bool leader) external onlyAdmin {
        require(isUser[user], "USER_NOT_FOUND");
        isLeader[user] = leader;
        emit LeaderTagged(user, leader);
    }

    /// @notice Admin grant/extend subscription (promos/migration) without payment.
    function grantSubscription(address user, uint256 periods) external onlyAdmin {
        require(isUser[user], "USER_NOT_FOUND");
        require(periods > 0, "ZERO_PERIODS");
        uint256 base = subscriptionExpiry[user] > block.timestamp ? subscriptionExpiry[user] : block.timestamp;
        subscriptionExpiry[user] = base + (subscriptionPeriod * periods);
        emit Subscribed(user, subscriptionExpiry[user]);
    }

    /* ==================================================================== */
    /*                          ADMIN — PARAMETERS                          */
    /* ==================================================================== */

    function setFees(uint256 _registrationFee, uint256 _subscriptionFee, uint256 _period) external onlyAdmin {
        require(_period >= 1 days, "PERIOD_TOO_SHORT");
        registrationFee = _registrationFee;
        subscriptionFee = _subscriptionFee;
        subscriptionPeriod = _period;
        _requireSolvent();
        emit ParamsUpdated();
    }

    function setBonuses(
        uint256 _direct,
        uint256 _unilevelPerLevel,
        uint256 _unilevelLevels,
        uint256 _teamPower,
        uint256 _teamPowerPer,
        uint256 _leadership
    ) external onlyAdmin {
        require(_unilevelLevels > 0 && _unilevelLevels <= 50, "BAD_LEVELS");
        require(_teamPowerPer > 0, "BAD_TEAMPOWER_PER");
        directBonus = _direct;
        unilevelBonusPerLevel = _unilevelPerLevel;
        unilevelLevels = _unilevelLevels;
        teamPowerBonus = _teamPower;
        teamPowerPer = _teamPowerPer;
        leadershipBonus = _leadership;
        _requireSolvent();
        emit ParamsUpdated();
    }

    function setWithdrawParams(uint256 _feeBps, uint256 _cooldown) external onlyAdmin {
        require(_feeBps <= 3000, "FEE_TOO_HIGH"); // hard cap 30%
        require(_cooldown <= 30 days, "COOLDOWN_TOO_LONG");
        withdrawFeeBps = _feeBps;
        withdrawCooldown = _cooldown;
        emit ParamsUpdated();
    }

    function setCollectCooldown(uint256 _cooldown) external onlyAdmin {
        require(_cooldown <= 30 days, "COOLDOWN_TOO_LONG");
        collectCooldown = _cooldown;
        emit ParamsUpdated();
    }

    function setTransactionCooldown(uint256 secs) external onlyAdmin {
        require(secs <= 5 minutes, "COOLDOWN_TOO_LONG");
        transactionCooldown = secs;
        emit ParamsUpdated();
    }

    function setMaxUnilevelScan(uint256 max) external onlyAdmin {
        require(max >= unilevelLevels && max <= 1000, "BAD_SCAN");
        maxUnilevelScan = max;
        emit ParamsUpdated();
    }

    function setPaused(bool _paused) external onlyAdmin {
        paused = _paused;
        emit PausedSet(_paused);
    }

    /// @dev Guarantees a single subscription can never pay out more than its fee.
    function _requireSolvent() internal view {
        require(subscriptionFee >= maxPayoutPerSubscription(), "FEE_BELOW_MAX_PAYOUT");
    }

    /* ==================================================================== */
    /*                          ADMIN — TREASURY                            */
    /* ==================================================================== */

    /// @notice Withdraw accrued treasury (registration fees, withdraw fees, unpaid shares).
    function withdrawTreasury(address to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "ZERO_ADDRESS");
        require(amount <= treasury, "EXCEEDS_TREASURY");
        treasury -= amount;
        _safeTransfer(to, amount);
        emit TreasuryWithdrawn(to, amount);
    }

    /// @notice Rescue non-USDT tokens sent by mistake. Cannot touch the USDT that
    ///         backs user balances/pending/treasury.
    function rescueToken(address token, address to, uint256 amount) external onlyOwner {
        require(token != address(usdt), "USE_WITHDRAW_TREASURY");
        require(to != address(0), "ZERO_ADDRESS");
        (bool ok, bytes memory data) = token.call(
            abi.encodeWithSelector(IERC20.transfer.selector, to, amount)
        );
        require(ok && (data.length == 0 || abi.decode(data, (bool))), "RESCUE_FAILED");
    }

    /// @notice Root cannot be removed from admin (override, from the genealogy model).
    function removeAdmin(address adminAddress) external override onlyOwner {
        require(adminAddress != address(0), "ZERO_ADDRESS");
        require(adminAddress != root, "CANNOT_REMOVE_ROOT_ADMIN");
        require(isAdmin[adminAddress], "NOT_ADMIN");
        isAdmin[adminAddress] = false;
        emit AdminRemoved(adminAddress);
    }

    /* ==================================================================== */
    /*                       INTERNAL — SAFE ERC20                          */
    /* ==================================================================== */

    function _safeTransfer(address to, uint256 amount) internal {
        (bool ok, bytes memory data) = address(usdt).call(
            abi.encodeWithSelector(IERC20.transfer.selector, to, amount)
        );
        require(ok && (data.length == 0 || abi.decode(data, (bool))), "TRANSFER_FAILED");
    }

    function _safeTransferFrom(address from, address to, uint256 amount) internal {
        (bool ok, bytes memory data) = address(usdt).call(
            abi.encodeWithSelector(IERC20.transferFrom.selector, from, to, amount)
        );
        require(ok && (data.length == 0 || abi.decode(data, (bool))), "TRANSFER_FROM_FAILED");
    }
}
