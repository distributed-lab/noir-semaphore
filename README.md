# Semaphore in Noir

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This repository contains functionality needed to use [semaphore-protocol](https://semaphore.pse.dev/)
with [Noir](https://noir-lang.org/).

## Circuit

As original one is written in [Circom](https://docs.circom.io/), package in this repository contains
Noir implementation, see [circuits](./packages/circuits/).

## Contracts

As original contracts are designed to verify [SnarkJS](https://github.com/iden3/snarkjs) proofs,
we source minimally updated contracts to work with Barrenberg UltraPlonk, see [contracts](./packages/contracts/).

## Typescript

Original [@semaphore-protocol/proof](https://www.npmjs.com/package/@semaphore-protocol/proof)
package works using SnarkJS as a zero-knowledge backeng, while updated in this repository package supports Barrenberg UltraPlonk, see [proof](/packages/proof).
