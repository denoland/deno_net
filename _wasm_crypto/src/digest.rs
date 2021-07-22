// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
use std::ops::DerefMut;

use digest::{
  Digest, DynDigest, ExtendableOutput, Reset, Update, VariableOutput,
};

/// Enum wrapper over all supported digest implementations.
#[derive(Clone)]
pub enum Context {
  Blake2b256(Box<blake2::VarBlake2b>),
  Blake2b384(Box<blake2::VarBlake2b>),
  Blake2b(Box<blake2::Blake2b>),
  Blake2s(Box<blake2::Blake2s>),
  Blake3(Box<blake3::Hasher>),
  Keccak224(Box<sha3::Keccak224>),
  Keccak256(Box<sha3::Keccak256>),
  Keccak384(Box<sha3::Keccak384>),
  Keccak512(Box<sha3::Keccak512>),
  Md5(Box<md5::Md5>),
  Ripemd160(Box<ripemd160::Ripemd160>),
  Sha1(Box<sha1::Sha1>),
  Sha224(Box<sha2::Sha224>),
  Sha256(Box<sha2::Sha256>),
  Sha384(Box<sha2::Sha384>),
  Sha512(Box<sha2::Sha512>),
  Sha3_224(Box<sha3::Sha3_224>),
  Sha3_256(Box<sha3::Sha3_256>),
  Sha3_384(Box<sha3::Sha3_384>),
  Sha3_512(Box<sha3::Sha3_512>),
  Shake128(Box<sha3::Shake128>),
  Shake256(Box<sha3::Shake256>),
}

use Context::*;

impl Context {
  pub fn new(algorithm_name: &str) -> Result<Context, &'static str> {
    Ok(match algorithm_name {
      "BLAKE2B-256" => {
        Blake2b256(Box::new(blake2::VarBlake2b::new(256 / 8).unwrap()))
      }
      "BLAKE2B-384" => {
        Blake2b384(Box::new(blake2::VarBlake2b::new(384 / 8).unwrap()))
      }
      "BLAKE2B" => Blake2b(Default::default()),
      "BLAKE2S" => Blake2s(Default::default()),
      "BLAKE3" => Blake3(Default::default()),
      "KECCAK-224" => Keccak224(Default::default()),
      "KECCAK-256" => Keccak256(Default::default()),
      "KECCAK-384" => Keccak384(Default::default()),
      "KECCAK-512" => Keccak512(Default::default()),
      "MD5" => Md5(Default::default()),
      "RIPEMD-160" => Ripemd160(Default::default()),
      "SHA-1" => Sha1(Default::default()),
      "SHA-224" => Sha224(Default::default()),
      "SHA-256" => Sha256(Default::default()),
      "SHA-384" => Sha384(Default::default()),
      "SHA-512" => Sha512(Default::default()),
      "SHA3-224" => Sha3_224(Default::default()),
      "SHA3-256" => Sha3_256(Default::default()),
      "SHA3-384" => Sha3_384(Default::default()),
      "SHA3-512" => Sha3_512(Default::default()),
      "SHAKE128" => Shake128(Default::default()),
      "SHAKE256" => Shake256(Default::default()),
      _ => {
        return Err(&*Box::leak(Box::new(format!(
          "unsupported algorithm: {}",
          algorithm_name
        ))))
      }
    })
  }

  /// Default length of this algorithm's digest output, in bytes.
  pub fn length(&self) -> usize {
    match self {
      Blake2b256(context) => context.output_size(),
      Blake2b384(context) => context.output_size(),
      Blake2b(context) => context.output_size(),
      Blake2s(context) => context.output_size(),
      Blake3(context) => context.output_size(),
      Keccak224(context) => context.output_size(),
      Keccak256(context) => context.output_size(),
      Keccak384(context) => context.output_size(),
      Keccak512(context) => context.output_size(),
      Md5(context) => context.output_size(),
      Ripemd160(context) => context.output_size(),
      Sha1(context) => context.output_size(),
      Sha224(context) => context.output_size(),
      Sha256(context) => context.output_size(),
      Sha384(context) => context.output_size(),
      Sha512(context) => context.output_size(),
      Sha3_224(context) => context.output_size(),
      Sha3_256(context) => context.output_size(),
      Sha3_384(context) => context.output_size(),
      Sha3_512(context) => context.output_size(),
      // Minimum sizes for full security per NIST FIPS 202, Table 4:
      Shake128(_) => 2 * 128 / 8,
      Shake256(_) => 2 * 256 / 8,
    }
  }

  pub fn extendable(&self) -> bool {
    matches!(self, Blake3(_) | Shake128(_) | Shake256(_))
  }

  pub fn algorithm_name(&self) -> &'static str {
    match self {
      Blake2b256(_) => "BLAKE2B-256",
      Blake2b384(_) => "BLAKE2B-384",
      Blake2b(_) => "BLAKE2B",
      Blake2s(_) => "BLAKE2S",
      Blake3(_) => "BLAKE3",
      Keccak224(_) => "KECCAK-224",
      Keccak256(_) => "KECCAK-256",
      Keccak384(_) => "KECCAK-384",
      Keccak512(_) => "KECCAK-512",
      Md5(_) => "MD5",
      Ripemd160(_) => "RIPEMD-160",
      Sha1(_) => "SHA-1",
      Sha224(_) => "SHA-224",
      Sha256(_) => "SHA-256",
      Sha384(_) => "SHA-384",
      Sha512(_) => "SHA-512",
      Sha3_224(_) => "SHA3-224",
      Sha3_256(_) => "SHA3-256",
      Sha3_384(_) => "SHA3-384",
      Sha3_512(_) => "SHA3-512",
      Shake128(_) => "SHAKE128",
      Shake256(_) => "SHAKE256",
    }
  }

  pub fn reset(&mut self) {
    match self {
      Blake2b256(context) => Reset::reset(context.deref_mut()),
      Blake2b384(context) => Reset::reset(context.deref_mut()),
      Blake2b(context) => Reset::reset(context.deref_mut()),
      Blake2s(context) => Reset::reset(context.deref_mut()),
      Blake3(context) => Reset::reset(context.deref_mut()),
      Keccak224(context) => Reset::reset(context.deref_mut()),
      Keccak256(context) => Reset::reset(context.deref_mut()),
      Keccak384(context) => Reset::reset(context.deref_mut()),
      Keccak512(context) => Reset::reset(context.deref_mut()),
      Md5(context) => Reset::reset(context.deref_mut()),
      Ripemd160(context) => Reset::reset(context.deref_mut()),
      Sha224(context) => Reset::reset(context.deref_mut()),
      Sha3_224(context) => Reset::reset(context.deref_mut()),
      Sha3_256(context) => Reset::reset(context.deref_mut()),
      Sha3_384(context) => Reset::reset(context.deref_mut()),
      Sha3_512(context) => Reset::reset(context.deref_mut()),
      Shake128(context) => Reset::reset(context.deref_mut()),
      Shake256(context) => Reset::reset(context.deref_mut()),
      _ => {
        *self = Context::new(self.algorithm_name()).unwrap();
      }
    }
  }

  pub fn update(&mut self, data: &[u8]) {
    match self {
      Blake2b256(context) => context.deref_mut().update(data),
      Blake2b384(context) => context.deref_mut().update(data),
      Blake2b(context) => Digest::update(context.deref_mut(), data),
      Blake2s(context) => Digest::update(context.deref_mut(), data),
      Blake3(context) => Digest::update(context.deref_mut(), data),
      Keccak224(context) => Digest::update(context.deref_mut(), data),
      Keccak256(context) => Digest::update(context.deref_mut(), data),
      Keccak384(context) => Digest::update(context.deref_mut(), data),
      Keccak512(context) => Digest::update(context.deref_mut(), data),
      Md5(context) => Digest::update(context.deref_mut(), data),
      Ripemd160(context) => Digest::update(context.deref_mut(), data),
      Sha1(context) => Digest::update(context.deref_mut(), data),
      Sha224(context) => Digest::update(context.deref_mut(), data),
      Sha256(context) => Digest::update(context.deref_mut(), data),
      Sha384(context) => Digest::update(context.deref_mut(), data),
      Sha512(context) => Digest::update(context.deref_mut(), data),
      Sha3_224(context) => Digest::update(context.deref_mut(), data),
      Sha3_256(context) => Digest::update(context.deref_mut(), data),
      Sha3_384(context) => Digest::update(context.deref_mut(), data),
      Sha3_512(context) => Digest::update(context.deref_mut(), data),
      Shake128(context) => context.deref_mut().update(data),
      Shake256(context) => context.deref_mut().update(data),
    };
  }

  pub fn digest_and_drop(
    self,
    length: Option<usize>,
  ) -> Result<Box<[u8]>, &'static str> {
    if let Some(length) = length {
      if !self.extendable() && length != self.length() {
        return Err(
          "non-default length specified for non-extendable algorithm",
        );
      }
    }

    let length = length.unwrap_or_else(|| self.length());
    Ok(match self {
      Blake2b256(context) => context.finalize_boxed(),
      Blake2b384(context) => context.finalize_boxed(),
      Blake2b(context) => context.finalize(),
      Blake2s(context) => context.finalize(),
      Blake3(context) => context.finalize_boxed(length),
      Keccak224(context) => context.finalize(),
      Keccak256(context) => context.finalize(),
      Keccak384(context) => context.finalize(),
      Keccak512(context) => context.finalize(),
      Md5(context) => context.finalize(),
      Ripemd160(context) => context.finalize(),
      Sha1(context) => context.finalize(),
      Sha224(context) => context.finalize(),
      Sha256(context) => context.finalize(),
      Sha384(context) => context.finalize(),
      Sha512(context) => context.finalize(),
      Sha3_224(context) => context.finalize(),
      Sha3_256(context) => context.finalize(),
      Sha3_384(context) => context.finalize(),
      Sha3_512(context) => context.finalize(),
      Shake128(context) => context.finalize_boxed(length),
      Shake256(context) => context.finalize_boxed(length),
    })
  }

  pub fn digest_and_reset(
    &mut self,
    length: Option<usize>,
  ) -> Result<Box<[u8]>, &'static str> {
    if let Some(length) = length {
      if !self.extendable() && length != self.length() {
        return Err(
          "non-default length specified for non-extendable algorithm",
        );
      }
    }

    let length = length.unwrap_or_else(|| self.length());
    Ok(match self {
      Blake2b256(context) => context.finalize_boxed_reset(),
      Blake2b384(context) => context.finalize_boxed_reset(),
      Blake2b(context) => DynDigest::finalize_reset(context.as_mut()),
      Blake2s(context) => DynDigest::finalize_reset(context.as_mut()),
      Blake3(context) => context.finalize_boxed_reset(length),
      Keccak224(context) => DynDigest::finalize_reset(context.as_mut()),
      Keccak256(context) => DynDigest::finalize_reset(context.as_mut()),
      Keccak384(context) => DynDigest::finalize_reset(context.as_mut()),
      Keccak512(context) => DynDigest::finalize_reset(context.as_mut()),
      Md5(context) => DynDigest::finalize_reset(context.as_mut()),
      Ripemd160(context) => DynDigest::finalize_reset(context.as_mut()),
      Sha1(context) => DynDigest::finalize_reset(context.as_mut()),
      Sha224(context) => DynDigest::finalize_reset(context.as_mut()),
      Sha256(context) => DynDigest::finalize_reset(context.as_mut()),
      Sha384(context) => DynDigest::finalize_reset(context.as_mut()),
      Sha512(context) => DynDigest::finalize_reset(context.as_mut()),
      Sha3_224(context) => DynDigest::finalize_reset(context.as_mut()),
      Sha3_256(context) => DynDigest::finalize_reset(context.as_mut()),
      Sha3_384(context) => DynDigest::finalize_reset(context.as_mut()),
      Sha3_512(context) => DynDigest::finalize_reset(context.as_mut()),
      Shake128(context) => context.finalize_boxed_reset(length),
      Shake256(context) => context.finalize_boxed_reset(length),
    })
  }

  pub fn digest(
    &self,
    length: Option<usize>,
  ) -> Result<Box<[u8]>, &'static str> {
    self.clone().digest_and_drop(length)
  }
}
