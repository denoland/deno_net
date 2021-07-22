// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
use derive_more::{From, Into};
use js_sys::Uint8Array;
use wasm_bindgen::prelude::*;

mod digest;

#[wasm_bindgen]
#[derive(Clone, Into, From)]
pub struct DigestContext(digest::Context);

#[wasm_bindgen]
pub fn digest(
  algorithm: String,
  data: js_sys::Uint8Array,
  length: Option<usize>,
) -> Result<Box<[u8]>, JsValue> {
  let mut context = DigestContext::new(&algorithm)?;
  context.update(data)?;
  context.digest_and_drop(length)
}

#[wasm_bindgen]
impl DigestContext {
  /// Creates a new digest context using a supported algorithm name.
  #[wasm_bindgen(constructor)]
  pub fn new(algorithm: &str) -> Result<DigestContext, JsValue> {
    Ok(
      digest::Context::new(algorithm)
        .map_err(|message| JsValue::from(js_sys::TypeError::new(message)))?
        .into(),
    )
  }

  #[wasm_bindgen]
  pub fn update(&mut self, data: js_sys::Uint8Array) -> Result<(), JsValue> {
    // Every method call on `data` has to go through the JavaScript bindings, so
    // try to minimize them. Splitting on the JavaScript side could be more
    // efficient, but this is called from multiple places in JavaScript so it
    // seems simpler to keep it here for now.

    let length = data.byte_length();
    let base_offset = data.byte_offset();
    let buffer = data.buffer();

    let chunk_size: u32 = 65_536;

    if length <= chunk_size {
      let chunk = data.to_vec();
      self.0.update(&chunk);
    } else {
      let mut offset = 0;
      while offset < length {
        let chunk = Uint8Array::new_with_byte_offset_and_length(
          &buffer,
          base_offset + offset,
          chunk_size.min(length - offset),
        )
        .to_vec();
        self.0.update(&chunk);
        offset += chunk_size;
      }
    }

    Ok(())
  }

  #[wasm_bindgen]
  pub fn digest(&self, length: Option<usize>) -> Result<Box<[u8]>, JsValue> {
    self
      .0
      .digest(length)
      .map_err(|message| JsValue::from(js_sys::TypeError::new(message)))
  }

  #[wasm_bindgen(js_name=digestAndReset)]
  pub fn digest_and_reset(
    &mut self,
    length: Option<usize>,
  ) -> Result<Box<[u8]>, JsValue> {
    self
      .0
      .digest_and_reset(length)
      .map_err(|message| JsValue::from(js_sys::TypeError::new(message)))
  }

  #[wasm_bindgen(js_name=digestAndDrop)]
  pub fn digest_and_drop(
    mut self,
    length: Option<usize>,
  ) -> Result<Box<[u8]>, JsValue> {
    self
      .0
      .digest_and_reset(length)
      .map_err(|message| JsValue::from(js_sys::TypeError::new(message)))
  }

  #[wasm_bindgen]
  pub fn reset(&mut self) -> Result<(), JsValue> {
    self.0.reset();

    Ok(())
  }

  #[wasm_bindgen]
  #[allow(clippy::should_implement_trait)]
  pub fn clone(&self) -> DigestContext {
    Clone::clone(self)
  }
}
