// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {AuthedMarket} from "../src/AuthedMarket.sol";

contract CounterScript is Script {

    function setUp() public {}

    function run() public {
        address operator = address(0x842e7691f576BB2503c6B706A619f95f96e1eFD1);
        address identityVerificationHub = address(0x77117D60eaB7C044e785D68edB6C7E0e134970Ea);
        uint256 scope = 1;
        uint256 attestationId = 1;

        bool olderThanEnabled = false;
        uint256 olderThan = 0;

        bool forbiddenCountriesEnabled = false;
        uint256[4] memory forbiddenCountriesListPacked = [uint256(0), uint256(0), uint256(0), uint256(0)];

        bool[3] memory ofacEnabled = [true, false, false];


        vm.startBroadcast();

        AuthedMarket market = new AuthedMarket(
            operator,
            identityVerificationHub,
            scope,
            attestationId,
            olderThanEnabled,
            olderThan,
            forbiddenCountriesEnabled,
            forbiddenCountriesListPacked,
            ofacEnabled);
        console.log("Contract deployed at: ", address(market));

        vm.stopBroadcast();
    }
}
