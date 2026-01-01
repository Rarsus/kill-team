ai = {import:ai-text-plugin}
commentsPlugin = {import:comments-plugin}
fullscreenButton = {import:fullscreen-button-plugin}
  
// storyPrompt 
//   instruction
//     [firstInstruction]  ^[storyLogEl.value.trim() === ""]
//     [storyContinuationInstruction] ^[storyLogEl.value.trim() !== ""]
//   startWith
//     You, the player, are ^[storyLogEl.value.trim() === ""]
//     [""]^[storyLogEl.value.trim() !== ""]
//   stopSequences
//     Which action do you choose?
//   onStart(obj) =>
//     window.storyLogBeforeStarting = storyLogEl.value; // we save this in case we need to try again due to an error, or whatever (see onFinish)
//     loadingEl.innerHTML = obj.loadingIndicatorHtml;
//     outputEl.innerHTML = "";
//     backBtn.disabled = true;
//     regenerateBtn.disabled = true;
//   onChunk(data) =>
//     storyLogEl.value += data.textChunk;
//     storyLogEl.scrollTop = storyLogEl.scrollHeight; // scroll to the bottom of the story log as the chunks come in
//     outputEl.innerHTML += data.textChunk;
//   onFinish(data) =>
//     storyLogEl.value = storyLogEl.value.replaceAll("\n---\n", "\n"); // in case it includes the triple-hyphens that I'm using to enclose the "response template" in the prompt
//     storyLogEl.value = storyLogEl.value.replace(/\n[0-9]\. /g, "\n- "); // in case the AI uses numbered items instead of hyphens
//     localStorage.storyLog = storyLogEl.value;
//     renderCurrentSituation();
//     if(data.stopReason === "error") {
//       backBtn.click();
//     }
//     backBtn.disabled = false;
//     regenerateBtn.disabled = false;
//     startOverBtn.style.display = "";

executeAction(action, opts) =>
  if(!opts) opts = {};
  if(opts.isCustom) {
    storyLogEl.value += `\n\nPLAYER ACTION (custom): ${action}\n\n`; 
  } else {
    storyLogEl.value += `\n\nPLAYER ACTION: ${action}\n\n`; 
  }
  generate();

async generate() =>
  window.storyLogTextBeforeLastSituationGenerated = storyLogEl.value;
  
  function finishStuff() {
    // backBtn.disabled = false;
    // regenerateBtn.disabled = false;
    startOverBtn.style.display = "";
    loadingEl.innerHTML = "";
    stopNoticeEl.style.visibility = "hidden";
  }
  
  let pendingObj, actionsPendingObj;
  
  let stop = false;
  window.currentGenerateController = {
    stop: function() {
      stop = true;
      finishStuff();
      if(pendingObj) pendingObj.stop();
      if(actionsPendingObj) actionsPendingObj.stop();
    },
  };
  
  // disable the regen and undo buttons for a moment to prevent double clicks and make the UI more clear
  backBtn.disabled = true;
  regenerateBtn.disabled = true;
  setTimeout(() => {
    stopNoticeEl.style.visibility = "visible";
    backBtn.disabled = false;
    regenerateBtn.disabled = false;
  }, 3000);
  
  // first we generation the continuation based on the chosen action:
  let stopDueToNewlines = false;
  pendingObj = ai({
    instruction: storyLogEl.value.trim() === "" ? firstInstruction : storyContinuationInstruction,
    startWith: storyLogEl.value.trim() === "" ? "You, the player, are" : "",
    onChunk: (data) => {
      if(stopDueToNewlines) return;
      if([...data.fullTextSoFar.matchAll(/\n+/g)].length >= 3) {
        pendingObj.stop();
        stopDueToNewlines = true;
      }
      let textChunk = data.textChunk;
      if(stopDueToNewlines) textChunk.split("\n")[0];
      storyLogEl.value += data.textChunk;
      storyLogEl.scrollTop = storyLogEl.scrollHeight; // scroll to the bottom of the story log as the chunks come in
      outputEl.innerHTML += data.textChunk;
    },
    // stopSequences: ["\n3.", "---"],  
  });
  
  setTimeout(() => {
    loadingEl.innerHTML = pendingObj.loadingIndicatorHtml; 
  }, 10);
  outputEl.innerHTML = "";
  
  let data = await pendingObj.onFinishPromise;
  if(stop) {
    return;
  }
  
  storyLogEl.value = storyLogEl.value.replaceAll("\n---", ""); // in case it includes the triple-hyphens that I'm using to enclose the "response template" in the prompt
  storyLogEl.value = storyLogEl.value.replace(/$1\. /g, "").replace(/\n[0-9]\. /g, "\n");
  localStorage.storyLog = storyLogEl.value;
  
  // if(data.stopReason === "error") {
  //   backBtn.click();
  //   return;
  // }
  
  // now we generate 3 possible actions they could take:
  outputEl.innerHTML += "\n\n";
  actionsPendingObj = ai({ 
    instruction: actionOptionsInstruction,
    startWith: "Here are 3 possible actions that you could take next:\nOption 1: You could choose to",
    onChunk: (data) => {
      storyLogEl.value += data.textChunk;
      storyLogEl.scrollTop = storyLogEl.scrollHeight; // scroll to the bottom of the story log as the chunks come in
      outputEl.innerHTML += data.textChunk;
    },
    stopSequences: ["Which action do you choose?", "Which option do you choose?"],
  });
  
  let actionsData = await actionsPendingObj.onFinishPromise;
  if(stop) {
    return;
  }
  
  // sometimes the AI puts this on its own line before the third option:
  storyLogEl.value = storyLogEl.value.replace(/\nAlternatively, you could choose to:\n/, "\n");
  storyLogEl.value = storyLogEl.value.replace(/\nOr, you could:\n/, "\n");
  
  // sometimes the AI forgets to add Option 3: at the start of the 3rd option:
  storyLogEl.value = storyLogEl.value.replace(/(Option 2:[^\n]+)\nAlternatively, you could /, "$1\nOption 3: Alternatively, you could ");
  
  storyLogEl.value = storyLogEl.value.replace("Here are 3 possible actions that you could take next:", "");
  storyLogEl.value = storyLogEl.value.replace(/Option ([0-9]): (You could|Or, you could|Alternatively, you could)/g, "Option $1: You");
  localStorage.storyLog = storyLogEl.value;
  renderCurrentSituation();
  
  finishStuff();
  
  
  
  
  
  
handleRegenButtonClick() =>
  if(window.currentGenerateController) {
    window.currentGenerateController.stop();
    stopNoticeEl.style.visibility = "hidden";
  }
  if(window.storyLogTextBeforeLastSituationGenerated) {
    storyLogEl.value = window.storyLogTextBeforeLastSituationGenerated;
  } else {
    // remove all the lines after the last/latest action:
    let lines = storyLogEl.value.split("\n");
    while(1) {
      if(lines.length === 0) break;
      let lastLine = lines.pop();
      if(lastLine.startsWith("PLAYER ACTION")) {
        lines.push(lastLine); // put it back
        break;
      }
    }
    storyLogEl.value = lines.join("\n")+"\n\n";
  }
  generate();

renderCurrentSituation(opts) => 
  if(!opts) opts = {};
  if(storyLogEl.value.trim() === "") {
    outputEl.innerHTML = "";
    startCtn.style.display = "";
    topButtonsCtn.style.display = "none";
    return;
  }
  topButtonsCtn.style.display = "";
  
  loadingEl.innerHTML = "";
  if(storyLogEl.value.trim().endsWith("PLAYER ACTION:")) {
    storyLogEl.value = storyLogEl.value.trim().replace(/PLAYER ACTION:$/m, "").trim();
  }
  
  let currentSituationText = storyLogEl.value.split(/(PLAYER ACTION.+)/).filter(t => !t.startsWith("PLAYER ACTION:")).pop();
  
  // add button to the action bullet points:
  outputEl.innerHTML = currentSituationText.replace(/\n+/g, "\n").replace(/\nOption [0-9]: ?(.+)/g, (match, p1) => `<div class="action-item" style="margin-top:0.5rem; display:flex;"><span style="margin-right:0.25rem; background:var(--box-color); padding:0.25rem; border-radius:3px; flex-grow:1;">${p1.trim()}</span><button style="min-width:max-content; max-width:max-content;" data-action="${p1.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")}" onclick="executeAction(this.dataset.action);">do this</button></div>`).trim();
  
  // hacky, but it'll do for now:
  let storyParagraph = outputEl.childNodes[0].textContent;
  storyParagraph =  storyParagraph.replace(/"(.*?)"/g, (match, p1) => `<i style="opacity:0.6;">"${p1}"</i>`)
  outputEl.childNodes[0].remove();
  let storyParagraphDiv = document.createElement("div");
  storyParagraphDiv.style.position = "relative";
  storyParagraphDiv.innerHTML = storyParagraph;
  storyParagraphDiv.id = "storyParagraphDiv";
  outputEl.prepend(storyParagraphDiv);
  let editButton = document.createElement("button");
  editButton.onclick = function() {
    storyParagraphEdit();
  };
  editButton.style.cssText = "font-size: 80%; margin-left: 0.25rem;";
  editButton.innerHTML = "edit";
  storyParagraphDiv.append(editButton);
  
  // add custom action item:
  let customActionDiv = document.createElement("div"); 
  customActionDiv.innerHTML = `<div class="action-item" style="margin-top:0.5rem; display:flex;"><span style="margin-right:0.25rem; background:var(--box-color); padding:0.25rem; border-radius:3px; flex-grow:1;"><input onkeydown="if(event.which === 13) { event.preventDefault(); customActionDoItBtn.click(); }" style="width:100%;" id="customActionInputEl" placeholder="Type a custom action..." value="${opts.customActionPrefill || ""}"></span><button id="customActionDoItBtn" style="min-width:max-content; max-width:max-content;" onclick="executeAction(customActionInputEl.value, {isCustom:true});">do this</button></div>`;
  
  let lastActionItemEl = [...outputEl.querySelectorAll(".action-item")].pop();
  if(lastActionItemEl) lastActionItemEl.after(customActionDiv);
  else outputEl.append(customActionDiv); // just in case the AI didn't generate any actions for whatever reason

  storyLogBtn.style.display = ''; // show the 'full story logs' button



async storyParagraphEdit() =>
  let editResolver;

  // storyParagraphDiv.style.paddingBottom = "1.5rem"; // to make room for the continue button under the textarea
  storyParagraphDiv.style.minHeight = "7rem";

  let textareaWrapper = document.createElement("div");
  textareaWrapper.style.cssText = "position:absolute; top:0; bottom:0; left:0; right:0;";

  let textarea = document.createElement("textarea");
  textarea.style.cssText = "width:100%; height:100%; outline:none;";
  
  let parts1 = storyLogEl.value.split("PLAYER ACTION:").pop().split("\n\n");
  let originalText = "";
  if(parts1.length === 1) originalText = parts1[0]; // `parts1.length === 1` will be true if this is the intro paragraph
  else originalText = parts1.slice(1).join("\n\n").split("\nOption 1:")[0];
  
  textarea.value = originalText;

  textareaWrapper.append(textarea);
  storyParagraphDiv.append(textareaWrapper);

  textarea.focus();

  textarea.onchange = async function() {
    await new Promise(r => setTimeout(r, 300)); // no idea why but without this massive delay the continueBtn handler doesn't get a change to fire if it was what causes this onchange event to fire (due to the textarea losing focus). small delay (e.g. 10ms) doesn't work
    editResolver(textarea.value);
  };
  function clickAnywhereHandler(e) {
    console.log(e);
    if(e.target !== textarea) editResolver(textarea.value);
  }
  window.addEventListener("mousedown", clickAnywhereHandler); // mousedown rather than click else click-and-drag to highlight that ends outside of the textarea will trigger it
  let newText = await new Promise(resolve => {
    editResolver = resolve;
  });
  window.removeEventListener("mousedown", clickAnywhereHandler);

  textareaWrapper.remove();

  storyLogEl.value = storyLogEl.value.replace(originalText, newText);
  
  renderCurrentSituation();


handleBackButtonClick() =>
  if(window.currentGenerateController) {
    window.currentGenerateController.stop();
    stopNoticeEl.style.visibility = "hidden";
  }
  let parts = storyLogEl.value.split("PLAYER ACTION");
  storyLogEl.value = parts.slice(0, -1).join("PLAYER ACTION").trim();
  let lastPart = parts[parts.length-1];
  let customActionPrefill = null;
  if(lastPart.trim().startsWith("(custom):")) {
    customActionPrefill = lastPart.split("\n")[0].replace("(custom):", "").trim();
  }
  regenerateBtn.disabled = true;
  localStorage.storyLog = storyLogEl.value;
  renderCurrentSituation({customActionPrefill});


replaceLast(str, search, replacement) =>
  let pos = str.lastIndexOf(search);
  if (pos === -1) return str;
  return str.slice(0, pos) + replacement + str.slice(pos + search.length);

getFormattedStoryLogs() =>
  let text = storyLogEl.value.trim(); 
  // this removes all the historical 'options' from the story, since the AI doesn't need to see the non-chosen options
  text = text.split("\n").filter(l => !/^Option [0-9]:.+/.test(l)).join("\n");
  text = text.replace(/\n\nPLAYER ACTION: ?/g, "\n\n");
  // if the most recent action was a custom action, then we use all caps for it to draw attention to it and show that it's not meant to be "high quality writing"
  let lines = text.trim().split("\n");
  if(lines.at(-1).startsWith("PLAYER ACTION (custom):")) {
    lines[lines.length-1] = lines[lines.length-1].replace(/PLAYER ACTION \(custom\): ?/g, "PLAYER ACTION: "); // NOTE: if you change the wording here, you need to also change the ternary conditionals in `storyContinuationInstruction`
    text = lines.join("\n");
  }
  // and for all other custom actions we just add "> " added to the start so we don't draw too much attention to them
  text = text.replace(/\n\nPLAYER ACTION \(custom\): ?/g, "\n\n> ");
  text = text.replace(/Which (action|option) (do|will) you choose\?/g, "");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
  
  
  
firstInstruction
  Your task as the game master is to write the opening paragraph of a text adventure story based on the following description/idea:
  [adventureDescriptionEl.value.trim() || `A fun, interesting, creative, and engaging adventure.`]
  [""]
  This is the opening paragraph - the spark that should elicit fascination within the player's imagination. It should be interesting, authentic, descriptive, natural, engaging, and creative.
  $output = [this.joinItems("\n")]
  
  
storyContinuationInstruction
  [this.latestLogs = getFormattedStoryLogs(), ""]Your task as the game master is to write the next paragraph in the following story, based on the most recent events[this.latestLogs.includes("PLAYER ACTION:") ? ` and the "PLAYER ACTION"` : ""]. You must write ONE paragraph only. The paragraph you write should just give the consequences of the player's last action. Write in a clean, crisp, and engaging dungeon master / storytelling style.
  [""]
  # Story So Far:
  [this.latestLogs]
  [""]
  ---
  That's the story so far. Write the next paragraph of this captivating story. This is a never-ending adventure story - do not try to "wrap up" the story. You must pay attention to the most recent [this.latestLogs.includes("PLAYER ACTION:") ? `"PLAYER ACTION"` : "action that the player took"], shown above.
  The player provided these writing instructions: [writingInstructionsEl.value.trim() || "Be creative."]
  Remember, you must write exactly ONE paragraph in your response. Write in a clean, crisp, and engaging style.
  $output = [this.joinItems("\n")]
  
  
actionOptionsInstruction
  Your task as the game master is to write 3 options for what the player might like to do next in the following story. Give 3 interesting, engaging, and creative choices, that you think the player would *love* (based on what you notice about their past actions) and then end your response with "Which action do you choose?"
  This story is based on the following initial prompt:
  [""]
  # Initial Story Prompt:
  [adventureDescriptionEl.value || `A fun, interesting, creative, and engaging adventure.`]
  \n
  # Story So Far:
  [getFormattedStoryLogs()]
  [""]
  ---
  [""]
  That's the story so far. Pay attention to the most recent events (at the end), since you need to come up with 3 possible actions that the player could take next. Try to write actions that you think the player would *love*, based on their previous actions.
  Avoid unnecessary repetition of previous story elements.
  The player provided these writing instructions: [writingInstructionsEl.value.trim() || "Be creative!"]
  The actions choices must be interesting and short. Your goal is to try to guess at actions that the player might like to take based on their past actions. Try to cater to the player's evident play-style and desires.
  Your response MUST follow the following template:\n
  ---
  Here are 3 possible actions that you could take next:
  Option 1: You could \[...\]
  Option 2: Or, you could \[...\]
  Option 3: Alternatively, you could \[...\]
  Which action do you choose?
  ---\n
  You MUST write your response using the above template. Just give ideas for *actions* that could be taken - not consequences. Remember to add the question "Which action do you choose?" after the 3 possible actions.
  $output = [this.joinItems("\n")]

$meta
  title = AI Text Adventure - free, no-signup, no limits - AI Dungeon Alternative
  description = An AI roleplay text adventure game, where you can create your own online AI game/scenario, explore the world, make choices in a choose-your-own-adventure style, kind of like an alternative to AI Dungeon - an AI story game. Completely free, no sign-up, no restrictions on daily usage/credits.
  
bannedUserIds
  6d406d216527af6ab87a
  