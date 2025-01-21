const targetClasses = ["T-I", "J-J5-Ji", "aoO", "v7", "T-I-atl", "L3"]; // Replace with the classes you want to listen for
const targetTooltip = "Send(⌘Enter)"; // Replace with the tooltip text you want to listen for

function checkCurrentTime(onTimeValue, offTimeValue, manualOverride) {
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

function updateNodes(onTime, offTime, manualOverride) {
  const nodes = document.querySelectorAll(
    targetClasses.map((cls) => `.${cls}`).join("")
  );
  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (checkCurrentTime(onTime, offTime, manualOverride)) {
        if (!node.getAttribute("data-disabled")) {
          console.log(node.classList, node.getAttribute("aria-label"));
          console.log(
            `Detected element with classes: ${targetClasses.join(", ")}`,
            node
          );
          console.log(node.style);
          // Add styles to strikethrough text and disable pointer events
          node.style.textDecoration = "line-through";
          node.style.pointerEvents = "none";
          node.setAttribute("data-disabled", "true");
        }
      } else {
        if (node.getAttribute("data-disabled")) {
          // Reverse changes
          node.style.textDecoration = "";
          node.style.pointerEvents = "";
          node.removeAttribute("data-disabled");
        }
      }
    }
  });
}

function initialize() {
  let onTime, offTime, manualOverride;

  function updateSettings() {
    chrome.storage.sync.get(
      ["onTime", "offTime", "manualOverride"],
      function (data) {
        onTime = data.onTime || "17:00"; // Default to 5:00 PM
        offTime = data.offTime || "09:00"; // Default to 9:00 AM
        manualOverride = data.manualOverride;
        updateNodes(onTime, offTime, manualOverride);
      }
    );
  }

  updateSettings();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      updateNodes(onTime, offTime, manualOverride);
    });
  });

  console.log("Content script loaded");
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Periodically check the current time and update nodes
  setInterval(updateSettings, 60000); // Check every minute

  chrome.storage.onChanged.addListener((changes, namespace) => {
    updateSettings();
  });
}

initialize();
