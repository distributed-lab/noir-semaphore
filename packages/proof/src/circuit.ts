import { compile, createFileManager, type CompiledCircuit } from "@noir-lang/noir_wasm";
import main from "@noir-semaphore/circuits/src/main.nr?raw";
import nargoToml from "@noir-semaphore/circuits/Nargo.toml?raw";

import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

import { Noir } from "@noir-lang/noir_js";
import { UltraHonkBackend, UltraPlonkBackend } from "@aztec/bb.js";

await Promise.all([
  initACVM(fetch(acvm)),
  initNoirC(fetch(noirc)),
]);

/**
 * Compiles the circuit from the raw Noir sources.
 */
export async function compileCircuit(): Promise<CompiledCircuit> {
  const fm = createFileManager("/");
  fm.writeFile("./src/main.nr", main);
  fm.writeFile("./Nargo.toml", nargoToml);

  return compile(fm);
}

/**
 * Creates and returns a Noir instance and an Ultra backend.
 * @param program Optional precompiled circuit to avoid recompiling.
 * @param usePlonk If true, use UltraPlonkBackend instead of UltraHonkBackend.
 */
export async function getOrchestrators(
  program?: CompiledCircuit,
  usePlonk = false
): Promise<[Noir, UltraPlonkBackend | UltraHonkBackend]> {
  // Compile if not provided
  if (!program) {
    program = await compileCircuit();
  }

  // Create a Noir interface around the compiled circuit
  const noir = new Noir(program);

  // Choose which backend to instantiate
  const backend = usePlonk
    ? new UltraPlonkBackend(program.bytecode)
    : new UltraHonkBackend(program.bytecode);

  return [noir, backend];
}
