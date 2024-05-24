// ==UserScript==
// @name        Add BuildBaron button to Evergreen failure tab
// @namespace   Violentmonkey Scripts
// @match       https://spruce.mongodb.com/task/*
// @grant       none
// @version     1.0
// @author      -
// @description 5/23/2024, 9:37:28 AM
// ==/UserScript==

const noteDivSelector = "#noteInput";
const failureTabId = "tab-8";

const BFGUrlRegex =
    'https://buildbaron.corp.mongodb.com/ui/#/(bfg|patch_failure)/.*'
function runWhenReady(readySelector, callback) {
  var numAttempts = 0;
  var tryNow = function() {
    var elem = document.querySelector(readySelector);
    if (elem) {
      callback(elem);
    } else {
      numAttempts++;
      if (numAttempts >= 34) {
        console.warn('Giving up after 34 attempts. Could not find: ' +
                     readySelector);
      } else {
        setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
      }
    }
  };
  tryNow();
}

function getBFGUrl() {
  let noteDiv = document.querySelector(noteDivSelector);
  let match = noteDiv.value.match(BFGUrlRegex)[0];

  if (!match)
    return null;
  return noteDiv.value.match(BFGUrlRegex)[0];
}

function ButtonClickAction(zEvent) {
  url = getBFGUrl();
  if (!url) {
    console.error("XOXO | couldn't find BFG url");
    return;
  }
  window.open(url, '_blank').focus();
}

function addButtons() {
  if (document.getElementById("totoButton")) {
    return;
  }

  let buttonDiv = document.createElement('div');
  buttonDiv.setAttribute('class', 'leafygreen-ui-cssveg css-gt9crw efcqne00')

  buttonDiv.innerHTML = `
  <button id="totoButton" type="button" class="lg-ui-button-0000 leafygreen-ui-h1g1ry" aria-disabled="false">
    <div class="leafygreen-ui-v038xi"></div>
    <div class="leafygreen-ui-1tpstb3">BB</div>
  </button>
  `;
  document.querySelector(noteDivSelector).parentNode.appendChild(buttonDiv);

  //--- Activate the newly added button.
  document.getElementById("totoButton")
      .addEventListener("click", ButtonClickAction, false);
}

function runWhenNoteDivReady() { runWhenReady(noteDivSelector, addButtons); }

function addListeners() {
  document.getElementById(failureTabId)
      .addEventListener("click", runWhenNoteDivReady, false);
}

function main() {
  console.log("XOXO | Started custom script");
  addListeners();
  runWhenNoteDivReady();
}

runWhenReady(`#${failureTabId}`, main);
