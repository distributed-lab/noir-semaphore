import { compile, createFileManager } from "@noir-lang/noir_wasm"

import main from "@noir-semaphore/src/main.nr?raw";
import nargoToml from "@noir-semaphore/Nargo.toml?raw";

export async function getCircuit() {
    const fm = createFileManager("/");
   
    fm.writeFile("./src/main.nr", main);
    fm.writeFile("./Nargo.toml", nargoToml);

    return await compile(fm);
}

import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

import { Noir } from '@noir-lang/noir_js';
import { UltraHonkBackend } from '@aztec/bb.js';

export async function getOrchestrators() {
    const { program } = await getCircuit();
    const noir = new Noir(program);
    const backend = new UltraHonkBackend(program.bytecode);
  
    return [noir, backend] as [Noir, UltraHonkBackend];
}

import { CompiledCircuit, InputMap } from '@noir-lang/types';

export async function fullProve(noir: Noir, backend: UltraHonkBackend, inputs: InputMap){
    const [noir, backend] = orchestrators;
    const { witness } = await noir.execute( inputs );
    const proof = await backend.generateProof(witness);

    return [witness, proof] as [any, any];
}
