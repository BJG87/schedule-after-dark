chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(
    {
      onTime: "17:00", // 5:00 PM
      offTime: "09:00", // 9:00 AM
    },
    () => {
      console.log("Default onTime and offTime set.");
    }
  );
});
