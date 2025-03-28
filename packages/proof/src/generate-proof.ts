import type { Group, MerkleProof } from "@semaphore-protocol/group"
import type { Identity } from "@semaphore-protocol/identity"
import { MAX_DEPTH, MIN_DEPTH } from "@semaphore-protocol/utils/constants"
import { requireDefined, requireNumber, requireObject, requireTypes } from "@zk-kit/utils/error-handlers"
import type { BigNumberish } from "ethers"
import { type NumericString } from "snarkjs"
import hash from "./hash"
import toBigInt from "./to-bigint"
import type { SemaphoreProof } from "./types"
import { Noir } from '@noir-lang/noir_js';
import { UltraPlonkBackend, UltraHonkBackend } from '@aztec/bb.js';
import { getOrchestrators } from './circuit';

/**
 * It generates a Semaphore proof, i.e. a zero-knowledge proof that an identity that
 * is part of a group has shared an anonymous message.
 * The message may be any arbitrary user-defined value (e.g. a vote), or the hash of that value.
 * The scope is a value used like a topic on which users can generate a valid proof only once,
 * for example the id of an election in which voters can only vote once.
 * The hash of the identity's scope and secret scalar is called a nullifier and can be
 * used to verify whether that identity has already generated a valid proof in that scope.
 * The depth of the tree determines which zero-knowledge artifacts to use to generate the proof.
 * If it is not defined, it will be inferred from the group or Merkle proof passed as the second parameter.
 * Finally, the artifacts themselves can be passed manually with file paths,
 * or they will be automatically fetched.
 * Please keep in mind that groups with 1 member or 2 members cannot be considered anonymous.

 * @param identity The Semaphore identity.
 * @param groupOrMerkleProof The Semaphore group or its Merkle proof.
 * @param message The Semaphore message.
 * @param scope The Semaphore scope.
 * @param merkleTreeDepth The depth of the tree with which the circuit was compiled.
 * @param noir The compiled Noir circuit.
 * @param backend The compiled UltraPlonk or UltraHonk backend. If backend not supplied, by default UltraHonk will be used.
 * @returns The Semaphore proof ready to be verified.
 */
export default async function generateProof(
    identity: Identity,
    groupOrMerkleProof: Group | MerkleProof,
    message: BigNumberish | Uint8Array | string,
    scope: BigNumberish | Uint8Array | string,
    merkleTreeDepth?: number,
    noir?: Noir,
    backend?: UltraHonkBackend | UltraPlonkBackend,
): Promise<SemaphoreProof> {
    requireDefined(identity, "identity")
    requireDefined(groupOrMerkleProof, "groupOrMerkleProof")
    requireDefined(message, "message")
    requireDefined(scope, "scope")

    requireObject(identity, "identity")
    requireObject(groupOrMerkleProof, "groupOrMerkleProof")
    requireTypes(message, "message", ["string", "bigint", "number", "Uint8Array"])
    requireTypes(scope, "scope", ["string", "bigint", "number", "Uint8Array"])

    if (merkleTreeDepth) {
        requireNumber(merkleTreeDepth, "merkleTreeDepth")
    }

    if (noir) {
        requireObject(noir, "noir")
    }

    if (backend) {
        requireObject(backend, "backend")
    }

    // Message and scope can be strings, numbers or buffers (i.e. Uint8Array).
    // They will be converted to bigints anyway.
    message = toBigInt(message)
    scope = toBigInt(scope)

    let merkleProof

    // The second parameter can be either a Merkle proof or a group.
    // If it is a group the Merkle proof will be calculated here.
    if ("siblings" in groupOrMerkleProof) {
        merkleProof = groupOrMerkleProof
    } else {
        const leafIndex = groupOrMerkleProof.indexOf(identity.commitment)
        merkleProof = groupOrMerkleProof.generateMerkleProof(leafIndex)
    }

    const merkleProofLength = merkleProof.siblings.length

    if (merkleTreeDepth !== undefined) {
        if (merkleTreeDepth < MIN_DEPTH || merkleTreeDepth > MAX_DEPTH) {
            throw new TypeError(`The tree depth must be a number between ${MIN_DEPTH} and ${MAX_DEPTH}`)
        }
    } else {
        merkleTreeDepth = merkleProofLength !== 0 ? merkleProofLength : 1
    }

    if (!noir || !backend) {
        const [defaultNoir, defaultBackend] = await getOrchestrators();
        noir = noir ?? defaultNoir;
        backend = backend ?? defaultBackend;
    }

    // The index must be converted to a list of indices, 1 for each tree level.
    // The missing siblings can be set to 0, as they won't be used in the circuit.
    const merkleProofIndices = []
    const merkleProofSiblings = merkleProof.siblings

    for (let i = 0; i < merkleTreeDepth; i += 1) {
        merkleProofIndices.push((merkleProof.index >> i) & 1)

        if (merkleProofSiblings[i] === undefined) {
            merkleProofSiblings[i] = 0n
        }
    }

    const { witness } = await noir.execute(  {
        secret: identity.secretScalar,
        merkleProofLength,
        merkleProofIndices,
        merkleProofSiblings,
        scope: hash(scope),
        message: hash(message)
    } );

    const proof = await backend.generateProof(witness);

    return {
        merkleTreeDepth,
        merkleTreeRoot: merkleProof.root.toString(),
        nullifier: witness[1],
        message: message.toString() as NumericString,
        scope: scope.toString() as NumericString,
        proof: proof
    }
}
