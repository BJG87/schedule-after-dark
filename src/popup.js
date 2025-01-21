document.addEventListener("DOMContentLoaded", function () {
  const manualOverrideButton = document.getElementById("manual-override");
  const onTimeInput = document.getElementById("on-time");
  const offTimeInput = document.getElementById("off-time");
  const statusIndicator = document.getElementById("status-indicator");
  let manualOverride = false;

  // Load saved settings from Chrome storage
  chrome.storage.sync.get(
    ["onTime", "offTime", "manualOverride"],
    function (data) {
      if (data.onTime) onTimeInput.value = data.onTime;
      if (data.offTime) offTimeInput.value = data.offTime;
      if (data.manualOverride !== undefined)
        manualOverride = data.manualOverride;
      updateStatusIndicator(data.onTime, data.offTime);
      updateButton();
    }
  );

  function updateStatusIndicator(onTimeValue, offTimeValue) {
    const isSendingBlocked = manualOverride
      ? false
      : checkCurrentTime(onTimeValue, offTimeValue);
    statusIndicator.textContent = isSendingBlocked
      ? "SENDING BLOCKED"
      : "SENDING ALLOWED";
    statusIndicator.className = isSendingBlocked
      ? "sending-blocked"
      : "sending-allowed";
  }

  function checkCurrentTime(onTimeValue, offTimeValue) {
    if (manualOverride) {
      return false;
    }

    const currentTime = new Date();
    const onTime = new Date();
    const offTime = new Date();

    const [onHours, onMinutes] = onTimeValue.split(":");
    const [offHours, offMinutes] = offTimeValue.split(":");

    onTime.setHours(onHours, onMinutes, 0);
    offTime.setHours(offHours, offMinutes, 0);

    if (onTime <= offTime) {
      // On time and off time are on the same day
      return onTime <= currentTime && currentTime <= offTime;
    } else {
      // On time is after off time, spanning midnight
      return currentTime >= onTime || currentTime <= offTime;
    }
  }

  function updateButton() {
    manualOverrideButton.textContent = manualOverride
      ? "Return to Schedule"
      : "Manual Override";
  }

  manualOverrideButton.addEventListener("click", function () {
    manualOverride = !manualOverride;
    chrome.storage.sync.set({ manualOverride: manualOverride });
    updateStatusIndicator(onTimeInput.value, offTimeInput.value);
    updateButton();
  });

  onTimeInput.addEventListener("change", function () {
    chrome.storage.sync.set({ onTime: onTimeInput.value });
    updateStatusIndicator(onTimeInput.value, offTimeInput.value);
  });

  offTimeInput.addEventListener("change", function () {
    chrome.storage.sync.set({ offTime: offTimeInput.value });
    updateStatusIndicator(onTimeInput.value, offTimeInput.value);
  });

  updateStatusIndicator(onTimeInput.value, offTimeInput.value);
  updateButton();
});
