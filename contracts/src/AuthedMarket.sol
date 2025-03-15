// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


import { IERC20, SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ISelfVerificationRoot } from "@selfxyz/contracts/interfaces/ISelfVerificationRoot.sol";
import { SelfVerificationRoot } from "@selfxyz/contracts/abstract/SelfVerificationRoot.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import  {IVcAndDiscloseCircuitVerifier } from "@selfxyz/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";
import { Formatter } from "@selfxyz/contracts/libraries/Formatter.sol";
import { CircuitAttributeHandler } from "@selfxyz/contracts/libraries/CircuitAttributeHandler.sol";
import { CircuitConstants } from "@selfxyz/contracts/constants/CircuitConstants.sol";
import { IIdentityVerificationHubV1 } from "@selfxyz/contracts/interfaces/IIdentityVerificationHubV1.sol";

contract AuthedMarket is SelfVerificationRoot {
    using SafeERC20 for IERC20;

    IERC20 public operatingToken;

    struct Order {
        uint256 id;
        address customer;
        address curator;
        address facilitator;
        address driver;
        uint256 bid;
        string orderDetails;
        uint8 status;
        uint256 createdAt;
    }
    uint256 internal orderCounter;
    mapping(uint256 => Order) orders;

    // Order Statuses
    uint8 public constant STATUS_ORDER_SUBMITTED = 1;
    uint8 public constant STATUS_ORDER_CLAIMED = 2;
    uint8 public constant STATUS_ORDER_FULFILLED = 3;
    uint8 public constant STATUS_ORDER_CANCELLED = 4;






    mapping(address => uint256) busyDrivers;

    mapping(uint256 => address) internal selfAddress;
    mapping(address => uint256) internal selfId;

    event OrderPlaced(uint256 id, address customer, address curator, uint256 bid, string orderDetails);
    event OrderClaimed(uint256 id, address facilitator, address driver);
    event OrderComplete(uint256 id, uint8 status);

    modifier onlyAuth {
        require(selfId[msg.sender] != 0);
        _;
    }

    constructor(
        address _operatingTokenAddress,
        address _identityVerificationHub,
        uint256 _scope,
        uint256 _attestationId,
        bool _olderThanEnabled,
        uint256 _olderThan,
        bool _forbiddenCountriesEnabled,
        uint256[4] memory _forbiddenCountriesListPacked,
        bool[3] memory _ofacEnabled
    )
        SelfVerificationRoot(
            _identityVerificationHub,
            _scope,
            _attestationId,
            _olderThanEnabled,
            _olderThan,
            _forbiddenCountriesEnabled,
            _forbiddenCountriesListPacked,
            _ofacEnabled
        )
    {
        operatingToken = IERC20(_operatingTokenAddress);
        orderCounter = 1;
    }

    function verifySelfProof(
        IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof
    )
        public
        override
    {
        if (_scope != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_SCOPE_INDEX]) {
            revert InvalidScope();
        }

        if (_attestationId != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_ATTESTATION_ID_INDEX]) {
            revert InvalidAttestationId();
        }


        IIdentityVerificationHubV1.VcAndDiscloseVerificationResult memory result = _identityVerificationHub.verifyVcAndDisclose(
            IIdentityVerificationHubV1.VcAndDiscloseHubProof({
                olderThanEnabled: _verificationConfig.olderThanEnabled,
                olderThan: _verificationConfig.olderThan,
                forbiddenCountriesEnabled: _verificationConfig.forbiddenCountriesEnabled,
                forbiddenCountriesListPacked: _verificationConfig.forbiddenCountriesListPacked,
                ofacEnabled: _verificationConfig.ofacEnabled,
                vcAndDiscloseProof: proof
            })
        );
        if (_isOfacApproved(result.revealedDataPacked)) {
            selfId[selfAddress[result.nullifier]] = 0;
            selfAddress[result.nullifier] = address(uint160(result.userIdentifier));
            selfId[address(uint160(result.userIdentifier))] = result.nullifier;
        } else {
            revert("User not ofac approved.");
        }


        // if (_isWithinBirthdayWindow(result.revealedDataPacked)) {
        //     _nullifiers[result.nullifier] = true;
        //     usdc.safeTransfer(address(uint160(result.userIdentifier)), CLAIMABLE_AMOUNT);
        //     emit USDCClaimed(address(uint160(result.userIdentifier)), CLAIMABLE_AMOUNT);
        // } else {
        //     revert("Not eligible: Not within 5 days of birthday");
        // }
    }

    function placeOrder(uint256 bid, string calldata orderDetails) public onlyAuth {
        require(operatingToken.balanceOf(msg.sender) >= bid);

        bool success = operatingToken.transferFrom(msg.sender, address(this), bid);
        if (!success) {
            revert("Unable to lock up bid amount.");
        }

        Order memory order;
        order.id = orderCounter;
        order.customer = msg.sender;
        order.bid = bid;
        order.orderDetails = orderDetails;
        order.createdAt = block.timestamp;
        order.status = STATUS_ORDER_SUBMITTED;

        orders[orderCounter] = order;
        orderCounter++;

        emit OrderPlaced(order.id, order.customer, order.curator, order.bid, order.orderDetails);
    }

    function claimOrder(uint256 id) public onlyAuth {
        if (orders[id].status != STATUS_ORDER_SUBMITTED) {
            revert("Order already claimed.");
        }

        if (busyDrivers[msg.sender] != 0) {
            revert("Driver busy.");
        }

        orders[id].driver = msg.sender;
        orders[id].status = STATUS_ORDER_CLAIMED;

        busyDrivers[msg.sender] = id;

        emit OrderClaimed(id, address(0), msg.sender);
    }

    function fulfillOrder(uint256 id) public onlyAuth {
        if (orders[id].status != STATUS_ORDER_CLAIMED) {
            revert("Order not in claimed status.");
        }

        if (orders[id].driver != msg.sender) {
            revert("Only driver may fulfill order.");
        }

        if (orders[id].bid >= operatingToken.balanceOf(address(this))) {
            revert("Not enough tokens in vault.");
        }

        operatingToken.safeTransfer(msg.sender, orders[id].bid);

        orders[id].status = STATUS_ORDER_FULFILLED;
        busyDrivers[msg.sender] = 0;

        emit OrderComplete(id, STATUS_ORDER_FULFILLED);
    }

    function cancelOrder(uint256 id) public onlyAuth {
        if (!(orders[id].status == STATUS_ORDER_SUBMITTED || orders[id].status == STATUS_ORDER_CLAIMED)) {
            revert("Order not in cancellable state.");
        }

        if (orders[id].customer != msg.sender) {
            revert("Only customer can cancel order.");
        }

        if (orders[id].bid >= operatingToken.balanceOf(address(this))) {
            revert("Not enough tokens in vault.");
        }

        operatingToken.safeTransfer(msg.sender, orders[id].bid);

        orders[id].status = STATUS_ORDER_CANCELLED;
        busyDrivers[orders[id].driver] = 0;

        emit OrderComplete(id, STATUS_ORDER_CANCELLED);
    }

    // INTERNAL

    function _isOfacApproved(uint256[3] memory revealedDataPacked) internal pure returns (bool) {
        bytes memory charcodes = Formatter.fieldElementsToBytes(revealedDataPacked);
        bool ofacApproved = CircuitAttributeHandler.compareOfac(charcodes, true, false, false);

        return ofacApproved;
    }
}
