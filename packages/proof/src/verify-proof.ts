import { requireDefined, requireObject } from "@zk-kit/utils/error-handlers";
import { SemaphoreProof } from "./types";
import { getOrchestrators } from "./circuit";
import { UltraPlonkBackend, UltraHonkBackend } from "@aztec/bb.js";

/**
 * Verifies whether a Semaphore proof is valid.
 * 
 * @param proof The Semaphore proof.
 * @param backend The compiled UltraPlonk or UltraHonk backend. 
 *                If not supplied, UltraHonk is used by default.
 * @returns True if the proof is valid, false otherwise.
 */
export default async function verifyProof(
  proof: SemaphoreProof,
  backend?: UltraHonkBackend | UltraPlonkBackend
): Promise<boolean> {
  requireDefined(proof, "proof");
  requireObject(proof, "proof");

  if (backend) {
    requireObject(backend, "backend");
  } else {
    // If no backend provided, pull it from getOrchestrators
    const [, defaultBackend] = await getOrchestrators();
    backend = defaultBackend;
  }

  return backend.verifyProof(proof);
}
