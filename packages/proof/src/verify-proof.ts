import { requireDefined, requireObject } from "@zk-kit/utils/error-handlers"
import { SemaphoreProof } from "./types"
import { getOrchestrators } from "./get-orchestrators"


/**
 * Verifies whether a Semaphore proof is valid. 
 * @param proof The Semaphore proof.
 * @returns True if the proof is valid, false otherwise.
 */
export default async function verifyProof(proof: SemaphoreProof): Promise<boolean> {
    requireDefined(proof, "proof")
    requireObject(proof, "proof")

    const {backend} = await getOrchestrators()

    return await backend.verifyProof(proof);
}
