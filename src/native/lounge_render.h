/**
 * ==============================================================================
 * AEGENTIX SOVEREIGN OS · CAPTAIN'S CANNABIS SMOKING LOUNGE
 * C-Language Immersive Video & Particle Physics Renderer Engine (C99 / WASM)
 * File: lounge_render.h
 * ==============================================================================
 * Designed for:
 *   1. WebAssembly (WASM) via Emscripten (emcc) for direct WebGL2 canvas execution
 *   2. Native Windows/Linux execution via Raylib / OpenGL / SDL2
 *   3. Bungie Blam! Engine / Halo CE Web Native C/C++ FPV Hook
 * ==============================================================================
 */

#ifndef LOUNGE_RENDER_H
#define LOUNGE_RENDER_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

#define MAX_SMOKE_PARTICLES 512
#define MAX_STARS 256
#define MAX_CANISTERS 3
#define DEFAULT_CFM_DOWNWARD 480.0f

typedef enum {
    VISR_STANDARD = 0,
    VISR_TACTICAL_NV = 1,
    VISR_MEMPOOL_THERMAL = 2
} VisrMode;

typedef enum {
    DENSITY_MILD = 0,
    DENSITY_STANDARD = 1,
    DENSITY_HEAVY = 2
} SmokeDensity;

typedef enum {
    LIGHT_420_NEON = 0,
    LIGHT_EARTH_ORBIT = 1,
    LIGHT_EMERALD_GROW = 2,
    LIGHT_TACTICAL_DIM = 3
} LightingPreset;

typedef struct {
    float x;
    float y;
    float z;
} Vec3;

typedef struct {
    float r;
    float g;
    float b;
    float a;
} ColorRGBA;

typedef struct {
    float angle;
    float radius;
    float speed;
    float size;
    float opacity;
    float hue;
    float height_offset;
    bool active;
} SmokeParticle;

typedef struct {
    float x;
    float y;
    float size;
    float speed;
    float opacity;
} BackgroundStar;

typedef struct {
    char name[32];
    char batch[24];
    float potassium_pct;
    float calcium_pct;
    float magnesium_pct;
    float ph_buffer;
    bool sealed;
} AshCanister;

typedef struct {
    uint32_t frame_tick;
    uint32_t width;
    uint32_t height;
    VisrMode visr_mode;
    SmokeDensity smoke_density;
    LightingPreset lighting_preset;
    float parallax_x;
    float parallax_y;
    float cfm_downward_flow;
    float odor_removal_pct;
    bool reverse_vent_active;
    bool soil_loop_active;
    
    SmokeParticle particles[MAX_SMOKE_PARTICLES];
    uint32_t active_particle_count;
    
    BackgroundStar stars[MAX_STARS];
    AshCanister canisters[MAX_CANISTERS];
} LoungeRenderState;

/* Core Lifecycle Functions */
void lounge_init(LoungeRenderState* state, uint32_t width, uint32_t height);
void lounge_update_physics(LoungeRenderState* state, float delta_time);
void lounge_set_density(LoungeRenderState* state, SmokeDensity density);
void lounge_set_visr_mode(LoungeRenderState* state, VisrMode mode);
void lounge_set_parallax(LoungeRenderState* state, float x, float y);

/* Render Step (Emits pixel buffer or WebGL commands) */
void lounge_render_frame_rgba(const LoungeRenderState* state, uint32_t* pixel_buffer);
const char* lounge_get_telemetry_json(const LoungeRenderState* state);

#ifdef __cplusplus
}
#endif

#endif /* LOUNGE_RENDER_H */
