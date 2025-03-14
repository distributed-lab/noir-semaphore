<p align="center">
    <h1 align="center">
       Semaphore Protocol with Noir
    </h1>
    <p align="center">
      This repository contains functionality needed to use
      <a href="https://semaphore.pse.dev/">semaphore-protocol</a>
      with
      <a href="https://noir-lang.org/">Noir</a>.
    </p>
</p>

<p align="center">
    <a href="https://github.com/distributed-lab/noir-semaphore/blob/main/LICENSE">
        <img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg">
    </a>
</p>

## Circuit

As original one is written in [Circom](https://docs.circom.io/), package in this repository contains
Noir implementation, see [circuits](./packages/circuits/).

## Contracts

As original contracts are designed to verify [SnarkJS](https://github.com/iden3/snarkjs) proofs,
we source minimally updated contracts to work with Barrenberg, see [contracts](./packages/contracts/).

## Typescript

Original [@semaphore-protocol/proof](https://www.npmjs.com/package/@semaphore-protocol/proof)
package works using SnarkJS as a zero-knowledge backeng, while updated in this repository package supports Barrenberg, see [proof](/packages/proof).
