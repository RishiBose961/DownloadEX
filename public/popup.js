const toggle = document.getElementById("toggle");

// Load saved state
chrome.storage.sync.get(["enabled"], (res) => {
  toggle.checked = res.enabled ?? true;
});

// Save state on change
toggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});