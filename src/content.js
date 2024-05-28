const emojis = [
  "¯\\_(ツ)_/¯",
  "(ㆆ _ ㆆ)",
  "/|\\ ^._.^ /|\\",
  "ʕっ•ᴥ•ʔっ",
  "(˵ ͡° ͜ʖ ͡°˵)",
  "(= ФェФ=)",
  "( ͡° ᴥ ͡°)",
  "(｡◕‿‿◕｡)",
  "d[-_-]b",
  "<(^_^)>",
  "(̿▀̿ ̿Ĺ̯̿̿▀̿ ̿)̄",
  "(҂◡_◡) ᕤ",
  "| (• ◡•)|",
];

const displayEmoji = () => {
  const style = document.createElement("style");
  style.textContent = `
    .big-middle {
      text-align: center;
      font-size: 80px;
      margin-top: 20vh;
    }
  `;
  document.head.appendChild(style);

  const emojiDiv = document.createElement("div");
  emojiDiv.className = "big-middle";

  document.body.innerHTML = "";
  document.body.appendChild(emojiDiv);

  const cycleEmojis = () => {
    const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    emojiDiv.textContent = selectedEmoji;
  };

  cycleEmojis();
  setInterval(cycleEmojis, 500);
};

const normalize = (url) => {
  url = url.replace(/^https?:\/\//, "");
  url = url.replace(/^www\./, "");
  return url.replace(/\/$/, "").toLowerCase();
};

const blockHostname = (blackList) => {
  const currentHostname = normalize(window.location.hostname);
  if (blackList.some((item) => normalize(item) === currentHostname)) {
    displayEmoji();
  }
};

const blockHref = (targetedBlackList) => {
  const currentHref = normalize(window.location.href);
  if (targetedBlackList.some((item) => normalize(item) === currentHref)) {
    displayEmoji();
  }
};

chrome.storage.sync.get(["blockedList", "targetedBlockedList"], (result) => {
  const blackList = result.blockedList || [];
  const targetedBlackList = result.targetedBlockedList || [];

  blockHostname(blackList);
  blockHref(targetedBlackList);
});
