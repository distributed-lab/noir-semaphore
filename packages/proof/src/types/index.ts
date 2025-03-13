import type { NumericString } from "snarkjs"

export type SemaphoreProof = {
    merkleTreeDepth: number
    merkleTreeRoot: NumericString
    message: NumericString
    nullifier: NumericString
    scope: NumericString
    proof: NumericString
}
