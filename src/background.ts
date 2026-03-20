chrome.runtime.onMessage.addListener((msg: { type: string; url: string; filename: string }) => {
  if (msg.type === "DOWNLOAD") {
    chrome.downloads.download({
      url: msg.url,
      filename: msg.filename,
      saveAs: false
    });
  }
});