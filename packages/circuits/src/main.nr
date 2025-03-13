use eddsa::eddsa_to_pub;
use std::{hash::poseidon::bn254::hash_2, field::bn254::assert_lt};

global MAX_DEPTH: u32 = 32;
global L: Field = 2736030358979909402780800718157159386076813972158567259200215660948447373041;

fn calculate_root<let N: u32>(leaf: Field, indices: Field, paths: [Field; N]) -> Field {
    let index_bits: [u1; N] = indices.to_be_bits();
    let mut current = leaf;

    for i in 0..paths.len() {
        current = if (index_bits[i] == 0) {
            hash_2([current, paths[i]])
        } else {
            hash_2([paths[i], current])
        };
    }

    current
}

fn main(
    secret: Field,
    indices: Field,
    paths: [Field; MAX_DEPTH],
    message: pub Field,
    scope: pub Field,
) -> pub (Field, Field) {
    assert_lt(secret, L);

    let pk = eddsa_to_pub(secret);
    let identity = hash_2([pk.0, pk.1]);
    let root = calculate_root(identity, indices, paths);
    let nullifier = hash_2([scope, secret]);

    let _ = message * message;

    (root, nullifier)
}
