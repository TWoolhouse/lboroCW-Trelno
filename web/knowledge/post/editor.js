export * from "./base.js";

/**
 * @param {Element} domA
 * @param {Element} domB
 */
export function switchHidden(domA, domB) {
  domA.classList.add("hidden");
  domB.classList.remove("hidden");
}

export function switcher(domA, domB) {
  return {
    forward: () => {
      switchHidden(domA, domB);
    },
    backward: () => {
      switchHidden(domB, domA);
    },
  };
}
