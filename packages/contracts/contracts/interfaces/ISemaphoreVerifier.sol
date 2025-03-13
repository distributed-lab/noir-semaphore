//SPDX-License-Identifier: MIT
pragma solidity >=0.8.23 <=0.8.28;

/// @title SemaphoreVerifier contract interface.
interface ISemaphoreVerifier {
    /// @dev Returns true if the proof was successfully verified.
    /// @param _proof: Serialized zero-knowledge proof.
    /// @param _pubSignals: Public signals.
    /// @return True if the proof was successfully verified, false otherwise.
    function verify(
        bytes calldata _proof,
        uint[4] calldata _pubSignals,
    ) external view returns (bool);
}
