// Commented out for now until revert on fail == false per function customization is implemented

// // SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import { Test } from "forge-std/Test.sol";
// import { ERC20Mock } from "@openzeppelin/contracts/mocks/ERC20Mock.sol"; Updated mock location
import { ERC20Mock } from "../../mocks/ERC20Mock.sol";

import { MockV3Aggregator } from "../../mocks/MockV3Aggregator.sol";
import { DSCEngine, AggregatorV3Interface } from "../../../src/DSCEngine.sol";
import { DecentralizedStableCoin } from "../../../src/DecentralizedStableCoin.sol";
// import {Randomish, EnumerableSet} from "../Randomish.sol"; // Randomish is not found in the codebase, EnumerableSet
// is imported from openzeppelin
import { console } from "forge-std/console.sol";

contract ContinueOnRevertHandler is Test {
    // using EnumerableSet for EnumerableSet.AddressSet;
    // using Randomish for EnumerableSet.AddressSet;

    // Deployed contracts to interact with
    DSCEngine public dscEngine;
    DecentralizedStableCoin public dsc;
    MockV3Aggregator public ethUsdPriceFeed;
    MockV3Aggregator public btcUsdPriceFeed;
    ERC20Mock public weth;
    ERC20Mock public wbtc;

    // Ghost Variables
    uint96 public constant MAX_DEPOSIT_SIZE = type(uint96).max;

    constructor(DSCEngine _dscEngine, DecentralizedStableCoin _dsc) {
        dscEngine = _dscEngine;
        dsc = _dsc;

        address[] memory collateralTokens = dscEngine.getCollateralTokens();
        weth = ERC20Mock(collateralTokens[0]);
        wbtc = ERC20Mock(collateralTokens[1]);

        ethUsdPriceFeed = MockV3Aggregator(dscEngine.getCollateralTokenPriceFeed(address(weth)));
        btcUsdPriceFeed = MockV3Aggregator(dscEngine.getCollateralTokenPriceFeed(address(wbtc)));
    }

    // FUNCTIONS TO INTERACT WITH

    ///////////////
    // DSCEngine //
    ///////////////
    function mintAndDepositCollateral(uint256 collateralSeed, uint256 amountCollateral) public {
        amountCollateral = bound(amountCollateral, 0, MAX_DEPOSIT_SIZE);
        ERC20Mock collateral = _getCollateralFromSeed(collateralSeed);
        collateral.mint(msg.sender, amountCollateral);
        dscEngine.depositCollateral(address(collateral), amountCollateral);
    }

    function redeemCollateral(uint256 collateralSeed, uint256 amountCollateral) public {
        amountCollateral = bound(amountCollateral, 0, MAX_DEPOSIT_SIZE);
        ERC20Mock collateral = _getCollateralFromSeed(collateralSeed);
        dscEngine.redeemCollateral(address(collateral), amountCollateral);
    }

    function burnDsc(uint256 amountDsc) public {
        amountDsc = bound(amountDsc, 0, dsc.balanceOf(msg.sender));
        dsc.burn(amountDsc);
    }

    function mintDsc(uint256 amountDsc) public {
        amountDsc = bound(amountDsc, 0, MAX_DEPOSIT_SIZE);
        dsc.mint(msg.sender, amountDsc);
    }

    function liquidate(uint256 collateralSeed, address userToBeLiquidated, uint256 debtToCover) public {
        ERC20Mock collateral = _getCollateralFromSeed(collateralSeed);
        dscEngine.liquidate(address(collateral), userToBeLiquidated, debtToCover);
    }

    /////////////////////////////
    // DecentralizedStableCoin //
    /////////////////////////////
    function transferDsc(uint256 amountDsc, address to) public {
        amountDsc = bound(amountDsc, 0, dsc.balanceOf(msg.sender));
        vm.prank(msg.sender);
        dsc.transfer(to, amountDsc);
    }

    /////////////////////////////
    // Aggregator //
    /////////////////////////////
    function updateCollateralPrice(uint128, /* newPrice */ uint256 collateralSeed) public {
        // int256 intNewPrice = int256(uint256(newPrice));
        int256 intNewPrice = 0;
        ERC20Mock collateral = _getCollateralFromSeed(collateralSeed);
        MockV3Aggregator priceFeed = MockV3Aggregator(dscEngine.getCollateralTokenPriceFeed(address(collateral)));

        priceFeed.updateAnswer(intNewPrice);
    }

    /// Helper Functions
    function _getCollateralFromSeed(uint256 collateralSeed) private view returns (ERC20Mock) {
        if (collateralSeed % 2 == 0) {
            return weth;
        } else {
            return wbtc;
        }
    }

    function callSummary() external view {
        console.log("Weth total deposited", weth.balanceOf(address(dscEngine)));
        console.log("Wbtc total deposited", wbtc.balanceOf(address(dscEngine)));
        console.log("Total supply of DSC", dsc.totalSupply());
    }
}
