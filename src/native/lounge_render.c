/**
 * ==============================================================================
 * AEGENTIX SOVEREIGN OS · CAPTAIN'S CANNABIS SMOKING LOUNGE
 * C-Language Immersive Video & Particle Physics Renderer Engine (C99 / WASM)
 * File: lounge_render.c
 * ==============================================================================
 * Compilation:
 *   Native Desktop (Raylib / OpenGL):
 *     gcc -O3 lounge_render.c -lraylib -lGL -lm -o lounge_render
 *
 *   WebAssembly for Browser execution:
 *     emcc lounge_render.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS="['_lounge_init','_lounge_update_physics']" -o lounge_render.wasm
 * ==============================================================================
 */

#include "lounge_render.h"
#include <math.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

static float randf(float min, float max) {
    return min + (float)rand() / ((float)RAND_MAX / (max - min));
}

void lounge_init(LoungeRenderState* state, uint32_t width, uint32_t height) {
    if (!state) return;
    memset(state, 0, sizeof(LoungeRenderState));

    state->width = width > 0 ? width : 1280;
    state->height = height > 0 ? height : 720;
    state->frame_tick = 0;
    state->visr_mode = VISR_STANDARD;
    state->smoke_density = DENSITY_STANDARD;
    state->lighting_preset = LIGHT_420_NEON;
    state->parallax_x = 0.0f;
    state->parallax_y = 0.0f;
    state->cfm_downward_flow = DEFAULT_CFM_DOWNWARD;
    state->odor_removal_pct = 99.98f;
    state->reverse_vent_active = true;
    state->soil_loop_active = true;

    // Initialize stars
    for (int i = 0; i < MAX_STARS; i++) {
        state->stars[i].x = randf(0.0f, (float)state->width);
        state->stars[i].y = randf(0.0f, (float)state->height);
        state->stars[i].size = randf(0.5f, 2.0f);
        state->stars[i].speed = randf(0.05f, 0.25f);
        state->stars[i].opacity = randf(0.2f, 1.0f);
    }

    // Initialize canisters
    strncpy(state->canisters[0].name, "Sovereign Nebula", 31);
    strncpy(state->canisters[0].batch, "CAN-2026-ALPHA", 23);
    state->canisters[0].potassium_pct = 34.0f;
    state->canisters[0].calcium_pct = 28.0f;
    state->canisters[0].magnesium_pct = 14.0f;
    state->canisters[0].ph_buffer = 1.6f;
    state->canisters[0].sealed = true;

    strncpy(state->canisters[1].name, "Kosher Kush", 31);
    strncpy(state->canisters[1].batch, "CAN-2026-BETA", 23);
    state->canisters[1].potassium_pct = 31.0f;
    state->canisters[1].calcium_pct = 32.0f;
    state->canisters[1].magnesium_pct = 12.0f;
    state->canisters[1].ph_buffer = 1.4f;
    state->canisters[1].sealed = true;

    strncpy(state->canisters[2].name, "Skywalker OG", 31);
    strncpy(state->canisters[2].batch, "CAN-2026-GAMMA", 23);
    state->canisters[2].potassium_pct = 36.0f;
    state->canisters[2].calcium_pct = 26.0f;
    state->canisters[2].magnesium_pct = 16.0f;
    state->canisters[2].ph_buffer = 1.5f;
    state->canisters[2].sealed = true;

    lounge_set_density(state, DENSITY_STANDARD);
}

void lounge_set_density(LoungeRenderState* state, SmokeDensity density) {
    if (!state) return;
    state->smoke_density = density;

    uint32_t target_count = 120;
    if (density == DENSITY_MILD) target_count = 60;
    else if (density == DENSITY_HEAVY) target_count = 200;

    if (target_count > MAX_SMOKE_PARTICLES) target_count = MAX_SMOKE_PARTICLES;
    state->active_particle_count = target_count;

    for (uint32_t i = 0; i < target_count; i++) {
        state->particles[i].angle = randf(0.0f, (float)(M_PI * 2.0));
        state->particles[i].radius = randf(20.0f, 180.0f);
        state->particles[i].speed = randf(0.015f, 0.035f);
        state->particles[i].size = randf(6.0f, 18.0f);
        state->particles[i].opacity = randf(0.1f, 0.5f);
        state->particles[i].hue = randf(195.0f, 225.0f);
        state->particles[i].height_offset = randf(-40.0f, 40.0f);
        state->particles[i].active = true;
    }
}

void lounge_set_visr_mode(LoungeRenderState* state, VisrMode mode) {
    if (!state) return;
    state->visr_mode = mode;
}

void lounge_set_parallax(LoungeRenderState* state, float x, float y) {
    if (!state) return;
    state->parallax_x = x;
    state->parallax_y = y;
}

void lounge_update_physics(LoungeRenderState* state, float delta_time) {
    if (!state) return;
    state->frame_tick++;

    // Downward vortex fluid dynamics
    const float suction_rate = 0.40f * (delta_time > 0 ? delta_time * 60.0f : 1.0f);

    for (uint32_t i = 0; i < state->active_particle_count; i++) {
        SmokeParticle* p = &state->particles[i];
        if (!p->active) continue;

        // Spiral inward toward the center reverse-vent table well
        p->angle += p->speed;
        p->radius -= suction_rate;
        p->height_offset += 0.20f; // Pulling downward into deck level

        // Recirculate back to outer boundary when sucked into the core
        if (p->radius < 6.0f) {
            p->radius = randf(140.0f, 190.0f);
            p->angle = randf(0.0f, (float)(M_PI * 2.0));
            p->height_offset = randf(-60.0f, -20.0f);
            p->opacity = randf(0.15f, 0.45f);
        }
    }
}

const char* lounge_get_telemetry_json(const LoungeRenderState* state) {
    static char buffer[512];
    if (!state) return "{}";

    snprintf(buffer, sizeof(buffer),
        "{\"engine\":\"C99/WASM\",\"tick\":%u,\"particles\":%u,\"cfm\":%.1f,\"odor_removal\":\"%.2f%%\","
        "\"canister_status\":\"SEALED\",\"soil_loop\":\"ACTIVE\",\"visr\":%d}",
        state->frame_tick,
        state->active_particle_count,
        state->cfm_downward_flow,
        state->odor_removal_pct,
        (int)state->visr_mode
    );
    return buffer;
}
