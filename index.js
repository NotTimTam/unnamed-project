import Runtime from "./engine/core/Runtime.js";

const save = Runtime.createInitialSaveData();

const runtime = new Runtime(save);
// window.runtime = runtime;

runtime.start();

/**
 * Build the buisness of an economy.
 * Such as "how to make a pencil", every
 * component and everything that leads to that component must be done
 * maybe work is done by hand initially.
 * Start at "the dawn of man"
 */
