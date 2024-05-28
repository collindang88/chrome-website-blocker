import React, { useEffect, useState } from "react";

const Popup = () => {
  const [blacklist, setBlacklist] = useState([]);
  const [targetedBlacklist, setTargetedBlacklist] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [targetedInputValue, setTargetedInputValue] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(
      ["blockedList", "targetedBlockedList"],
      (result) => {
        setBlacklist(result.blockedList || []);
        setTargetedBlacklist(result.targetedBlockedList || []);
      }
    );
  }, []);

  const addToList = (type) => {
    const newEntry = type === "normal" ? inputValue : targetedInputValue;
    if (!newEntry) return;

    const updateList = (list, setList, key) => {
      const newList = [...list, newEntry];
      setList(newList);
      chrome.storage.sync.set({ [key]: newList });
    };

    if (type === "normal") {
      updateList(blacklist, setBlacklist, "blockedList");
      setInputValue("");
    } else {
      updateList(
        targetedBlacklist,
        setTargetedBlacklist,
        "targetedBlockedList"
      );
      setTargetedInputValue("");
    }
  };

  const removeFromList = (type, item) => {
    const updateList = (list, setList, key) => {
      const newList = list.filter((entry) => entry !== item);
      setList(newList);
      chrome.storage.sync.set({ [key]: newList });
    };

    if (type === "normal") {
      updateList(blacklist, setBlacklist, "blockedList");
    } else {
      updateList(
        targetedBlacklist,
        setTargetedBlacklist,
        "targetedBlockedList"
      );
    }
  };

  const handleKeyDown = (e, type) => {
    if (e.key === "Enter") {
      addToList(type);
    }
  };

  return (
    <div className="p-4 w-96 mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Chrome Website Blocker
      </h1>

      <section className="mb-4">
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold flex-grow">Blacklist:</h2>
          <button
            onClick={() => addToList("normal")}
            className="bg-green-500 text-white px-2 py-1 rounded flex items-center ml-2"
          >
            Add (+)
          </button>
          <span
            className="ml-1 cursor-default w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center"
            data-toggle="tooltip"
            title="Blacklist whole sites here! (ex. facebook.com, instagram.com)"
          >
            ℹ️
          </span>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "normal")}
            className="border p-2 flex-grow"
          />
        </div>
        <ul className="mb-4">
          {blacklist.map((item, index) => (
            <li key={index} className="flex items-center mb-2">
              <span className="flex-grow">{item}</span>
              <button
                onClick={() => removeFromList("normal", item)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <hr className="my-4" />

      <section className="mb-4">
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold flex-grow">
            Targeted Blacklist:
          </h2>
          <button
            onClick={() => addToList("targeted")}
            className="bg-green-500 text-white px-2 py-1 rounded flex items-center ml-2"
          >
            Add (+)
          </button>
          <span
            className="ml-1 cursor-default w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center"
            data-toggle="tooltip"
            title="Blacklist specific URLs here! (ex. https://www.youtube.com/user/ESPN)"
          >
            ℹ️
          </span>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={targetedInputValue}
            onChange={(e) => setTargetedInputValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "targeted")}
            className="border p-2 flex-grow"
          />
        </div>
        <ul>
          {targetedBlacklist.map((item, index) => (
            <li key={index} className="flex items-center mb-2">
              <span className="flex-grow">{item}</span>
              <button
                onClick={() => removeFromList("targeted", item)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <a
        href="https://collin-dang.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline mt-4 block"
      >
        Visit my personal website!
      </a>
    </div>
  );
};

export default Popup;
