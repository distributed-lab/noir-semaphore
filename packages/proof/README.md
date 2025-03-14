<p align="center">
    <h1 align="center">
        Semaphore proof with Noir
    </h1>
    <p align="center">A library to generate and verify Semaphore proofs with Noir.</p>
</p>

<p align="center">
    <a href="https://github.com/distributed-lab/noir-semaphore/blob/main/LICENSE">
        <img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg">
    </a>
</p>

| This library provides utility functions to generate and verify Semaphore proofs compatible with the Noir Semaphore [circuits](https://github.com/distributed-lab/noir-semaphore/tree/main/circuits). |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## 🛠 Install

### npm or yarn

Install the `@noir-semaphore/proof` package and its peer dependencies with npm:

```bash
npm i @semaphore-protocol/identity @semaphore-protocol/group @noir-semaphore/proof
```

or yarn:

```bash
yarn add @semaphore-protocol/identity @semaphore-protocol/group @noir-semaphore/proof
```

## 📜 Usage

### Generate Proof

```typescript
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@noir-semaphore/proof"

const identity1 = new Identity()
const identity2 = new Identity()
const identity3 = new Identity()

const group = new Group([identity1.commitment, identity2.commitment, identity3.commitment])

const message = "Hello world"
const scope = "Semaphore"

const proof1 = await generateProof(identity1, group, message, scope)

// You can also specify the maximum tree depth supported by the proof.
const proof2 = await generateProof(identity2, group, message, scope, 20)

// You can also override our default zkey/wasm files.
const proof3 = await generateProof(identity3, group, message, scope, 20, {
    wasm: "./semaphore.wasm",
    zkey: "./semaphore.zkey"
})
```

### Verify Proof

```typescript
import { verifyProof } from "@semaphore-protocol/proof"

await verifyProof(proof1)
```
