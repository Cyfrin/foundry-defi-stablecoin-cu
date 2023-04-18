// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

library Randomish {
    using EnumerableSet for EnumerableSet.AddressSet;

    function rand(EnumerableSet.AddressSet storage s, uint256 seed) internal view returns (address) {
        if (s.length() > 0) {
            return s.values()[seed % s.length()];
        } else {
            return address(0xc0ffee);
        }
    }
}
