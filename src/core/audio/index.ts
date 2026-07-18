// Spike 3: public entry point for the AudioGateway module.
//
// Re-exports the interfaces and factory. A singleton instance is provided for
// app-wide use; tests and per-mode wiring can call createAudioGateway() with
// their own options.

export { createAudioGateway } from './gateway';
export type { AudioGatewayOptions } from './gateway';
export { createGoogleBackend } from './googleBackend';
export type { GoogleBackendOptions } from './googleBackend';
export { createKanyaBackend } from './kanyaBackend';
export type { KanyaBackendOptions } from './kanyaBackend';
export { createStaticBackend } from './staticBackend';
export type { StaticBackendOptions } from './staticBackend';
export { isValidEngine } from './types';
export type { AudioBackend, AudioEngine, AudioGateway } from './types';
