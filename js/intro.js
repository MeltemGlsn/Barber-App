// Plays the intro animation once per session.
// Loaded without `defer` so the class is set before first paint (no flash of content).
// Kept as an external file to comply with the Content Security Policy (no inline scripts).
try {
  if (!sessionStorage.getItem("introSeen")) {
    document.documentElement.classList.add("play-intro");
  }
} catch (e) {}
