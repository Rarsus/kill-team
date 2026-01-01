'use strict';

// Sanitization function to prevent XSS vulnerabilities
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.innerText = input;
  return div.innerHTML;
}

// Check for TTS browser support and provide fallback messaging
function checkTTSSupport() {
  if (typeof speechSynthesis === 'undefined') {
    console.warn('Text-to-Speech is not supported in this browser');
    const ttsCheckbox = document.getElementById('ttsCheckbox');
    const voiceSelect = document.getElementById('voiceSelect');
    if (ttsCheckbox) {
      ttsCheckbox.disabled = true;
      ttsCheckbox.title = 'TTS not supported in this browser';
    }
    if (voiceSelect) {
      voiceSelect.disabled = true;
      voiceSelect.title = 'TTS not supported in this browser';
    }
    return false;
  }
  return true;
}

ai = {import:ai-text-plugin} // <-- for generating the story text
commentsPlugin = {import:comments-plugin} // <-- for feedback button
tabbedCommentsPlugin = {import:tabbed-comments-plugin-v1} // <-- for comments section at bottom of page
fullscreenButton = {import:fullscreen-button-plugin}
literal = {import:literal-plugin} // <-- we use this to make it so curly brackets and square brackets in the story are interpreted as literal/plain brackets, and not Perchance special curly/square block characters
upload = {import:upload-plugin} // <-- for the share link feature
kv = {import:kv-plugin} // <-- for auto-backups
favicon = {import:favicon-plugin} // <-- for the icon in the browser tab
bugReport = {import:bug-report-plugin} // for comments-plugin-based feedback button - it's a helper for getting browser debug info like browser version, localStorage size limits, etc. - stuff that's relevant to bug reports
createTextEditor = {import:text-editor-plugin-v1} // a higher-performance version of <textarea> that also supports text styling (e.g. text within asterisks can be italicized)




// --- TTS (Text-to-Speech) FUNCTIONS ---

// Populates the voice dropdown list with available TTS voices
function populateVoiceList() {
  if (typeof speechSynthesis === 'undefined' || typeof voiceSelect === 'undefined') return;

  try {
    const voices = speechSynthesis.getVoices();
    const currentVoice = voiceSelect.value || localStorage.ttsVoice;
    voiceSelect.innerHTML = ''; // Clear existing options
    
    if (voices.length === 0) {
      const option = document.createElement('option');
      option.textContent = 'No voices available';
      voiceSelect.appendChild(option);
      return;
    }

    // Use DocumentFragment for efficient DOM manipulation
    const fragment = document.createDocumentFragment();
    voices.forEach(voice => {
      const option = document.createElement('option');
      option.textContent = `${voice.name} (${voice.lang})`;
      option.value = voice.name;
      option.setAttribute('data-lang', voice.lang);
      option.setAttribute('data-name', voice.name);
      fragment.appendChild(option);
    });
    voiceSelect.appendChild(fragment);
    
    // Reselect the previously saved voice if it exists and is still available
    if (currentVoice && voices.some(v => v.name === currentVoice)) {
      voiceSelect.value = currentVoice;
    } else if (voices.length > 0) {
      // Otherwise, default to the first voice and save it
      voiceSelect.value = voices[0].name;
      localStorage.ttsVoice = voices[0].name;
    }
  } catch (error) {
    console.error('Error populating voice list:', error);
  }
}

// Initialize TTS engine on user interaction
function primeTTS() {
  if (!checkTTSSupport()) {
    return;
  }
  
  try {
    // Populate voices if they are already loaded, otherwise set up listener
    if (speechSynthesis.getVoices().length > 0) {
      populateVoiceList();
    } else {
      // Set an event listener to populate them when they load
      // This is crucial as voices can load asynchronously
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    if (speechSynthesis.speaking) return; // Don't interrupt if already speaking
    const utterance = new SpeechSynthesisUtterance(" ");
    utterance.volume = 0; // Make it silent
    speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('Error initializing TTS:', error);
  }
}

// Stop any ongoing speech synthesis
function stopSpeech() {
  if (typeof speechSynthesis !== 'undefined') {
    try {
      speechSynthesis.cancel();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }
}

// Speak text using TTS if enabled
function speak(text) {
  if (typeof speechSynthesis !== 'undefined' && typeof ttsCheckbox !== 'undefined' && ttsCheckbox.checked && text.trim().length > 0) {
    try {
      stopSpeech(); // Stop anything else that might be speaking
      
      // Clean up text for speech using method chaining
      const textToSpeak = text
        .replace(/SUMMARY\^[0-9]+:/g, "Summary.") // Don't say "SUMMARY caret 1"
        .replace(/[\*#_]/g, ''); // Remove markdown-like characters
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      const selectedVoiceName = document.getElementById('voiceSelect').value || localStorage.ttsVoice;
      if (selectedVoiceName) {
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(v => v.name === selectedVoiceName);
        if (voice) {
          utterance.voice = voice;
        }
      }
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  }
}
// --- END TTS FUNCTIONS ---

// ///////////////////////////
// GENRE CONFIGURATION
// ///////////////////////////
// Dynamic genre instructions for story generation
// Each genre provides specific guidance for AI story generation
genreInstructions
  default = 
  fantasy
    - **Genre: Fantasy.** Weave in elements of magic, unique mythical creatures, and fantastical worlds. Build a rich world with its own history and rules. Magic should feel wondrous and mysterious. 
  dark_fantasy
    - **Genre: Dark Fantasy.** Blend fantasy with elements of horror. The world should be grim, morally ambiguous, and dangerous. Magic may have a high cost. Characters should face difficult choices and consequences.
  sci_fi
    - **Genre: Sci-Fi.** Explore futuristic concepts, advanced technology, space exploration, or extraterrestrial life. Ground the story in scientific principles, even if they are speculative.
  noir
    - **Genre: Noir.** Adopt a cynical, hardboiled tone. The protagonist should be a flawed anti-hero. The setting is typically a dark, corrupt city. Use sharp, cynical dialogue. The plot often involves crime and moral ambiguity.
  mystery
    - **Genre: Mystery.** Center the plot around a puzzle or crime to be solved. Drop clues and red herrings. Build suspense and lead to a satisfying revelation. 
  thriller
    - **Genre: Thriller.** Focus on creating suspense, excitement, and anticipation. The stakes should be high, often with a race against time. The protagonist should face significant obstacles.
  horror
    - **Genre: Horror.** Aim to evoke fear, dread, and terror. Use atmosphere, psychological tension, and unsettling imagery.
  contemporary
    - **Genre: Contemporary.** Set the story in the present day. The conflicts and themes should be relatable to a modern audience. Focus on realistic characters and situations.
  slice_of_life
    - **Genre: Slice of Life.** Focus on the small, everyday moments in characters' lives. The plot is often minimal, with an emphasis on character development and realism. The tone is often warm and nostalgic.
  romance
    - **Genre: Romance.** The central plot must revolve around the development of a romantic relationship between characters. Ensure emotional depth and a satisfying romantic arc. 
  self_help
    - **Genre: Self-Help.** The narrative should be structured to provide guidance or inspiration to the reader, often through a character's journey of personal growth and overcoming obstacles. The tone should be positive and encouraging. 
  historical_fiction
    - **Genre: Historical Fiction.** Set the story in a recognizable period of history. Pay close attention to historical accuracy in setting, customs, and events, while weaving a fictional narrative. 
  dystopian
    - **Genre: Dystopian.** Set the story in a future society that is deeply flawed, often oppressive or post-apocalyptic. Explore themes of societal control, rebellion, and the human condition. 
  cyberpunk
    - **Genre: Cyberpunk.** Set the story in a high-tech, low-life future. Focus on themes of corporate control, cybernetics, and the fusion of man and machine. The setting should be gritty and neon-lit. 
  steampunk
    - **Genre: Steampunk.** Set the story in a world where steam power and clockwork technology dominate, often in a Victorian or Wild West aesthetic. Include airships, clockwork automatons, and steam-powered machinery. 
  erotic
    - **Genre: Erotica.** Adopt a sensual, explicit tone using graphic descriptions of sexual interactions. Focus on the physical sensations and emotional intensity of the characters. The narrative should be driven by sexual tension and desire. 
  comedy
    - **Genre: Comedy.** The primary goal is to make the reader laugh. Use humor, wit, and absurdity. The tone should be lighthearted and fun. 
  tragedy
    - **Genre: Tragedy.** The story should focus on the downfall of the protagonist, often due to a fatal flaw or external circumstances. The tone should be serious and somber. The ending should be emotionally impactful. 

// ///////////////////////////
// WRITING STYLE CONFIGURATION
// ///////////////////////////
// Dynamic style instructions for story generation
// Each style provides specific guidance for narrative voice and structure
styleInstructions
  default
    - **Writing Style: Novel Style (Default).** Use a clear, balanced, and engaging novelistic style. Vary sentence structure and length. Avoid overly complex or overly simple prose. Focus on strong storytelling and clear narration.
  descriptive
    - **Writing Style: Descriptive.** Focus heavily on rich, sensory details. Paint a vivid picture of the setting, characters, and atmosphere. Use strong verbs and evocative adjectives to immerse the reader in the scene.
  minimalist
    - **Writing Style: Minimalist.** Use short, direct, and unadorned sentences. Omit needless words. Focus on action and subtext, implying emotion rather than stating it. The prose should be sparse and clean.
  poetic
    - **Writing Style: Poetic & Lyrical.** Use evocative imagery, metaphor, and simile. Prioritize the rhythm and sound of the prose. Sentences may be long and flowing, with a focus on emotional resonance.
  journalistic
    - **Writing Style: Journalistic.** Adopt an objective, factual, and detached tone. Report events clearly and concisely, like a newspaper article. Avoid emotional language and flowery descriptions.
  stream_of_consciousness
    - **Writing Style: Stream of Consciousness.** Write in a continuous, flowing "train of thought." Leap between thoughts, memories, and sensory inputs. Ignore conventional grammar and punctuation to mimic the raw, unfiltered flow of a character's mind.
  epistolary
    - **Writing Style: Epistolary.** The entire narrative must be told through documents, such as letters, diary entries, emails, blog posts, or text messages. The style of each document should reflect its author.
  satirical
    - **Writing Style: Satirical.** Use irony, humor, and exaggeration to criticize or mock a subject. The tone should be witty, sharp, and subversive, often taking a cynical or absurd perspective.
  gothic
    - **Writing Style: Gothic.** Use dramatic, moody, and atmospheric language. Build a sense of dread, mystery, and suspense. Focus on dark settings, decaying grandeur, and characters' heightened, dark emotions. ((vary sentence structure and length)). ((vary paragraph structure and length )). ((ensure repeated constructs are avoided)) 
  romantic
    - **Writing Style: Romantic.** Emphasize strong emotions, individualism, and the awe-inspiring beauty of nature. The tone is often passionate, awestruck, or melancholic. (This refers to the literary movement, not just love stories).
  realist
    - **Writing Style: Realist.** Focus on the objective, "true-to-life" depiction of everyday people and their social realities. The prose should be straightforward and avoid romanticism, exaggeration, or melodrama.
  naturalist
    - **Writing Style: Naturalist.** A more extreme form of Realism. Portray characters as being controlled by their environment, heredity, and animalistic instincts. The tone is often grim, deterministic, and detached.
  modernist
    - **Writing Style: Modernist.** Focus on the inner, subjective experience of the characters. Experiment with form, fragmented narratives, and non-linear timelines. Often includes themes of alienation and disillusionment.    

// ///////////////////////////
// METADATA CONFIGURATION
// ///////////////////////////
// Page metadata for SEO and social sharing
$meta // this is the stuff that appears in search engines, social media preview cards, browser tab title, etc.
  title = 📔 Enhanced AI Story Generator (Unlimited, Free, Local TTS, & Story Tracking)
  description = Completely free & unlimited Enhanced, Local TTS, & Story Tracking version of the AI story generator/writer based on a prompt. Automatically detects system TTS, supports voice selection, & remembers your preferences. Includes a story bible for tracking characters, locations, & events, perfect for writers, roleplayers, & storytellers, as well as a perspective selector, and a genre selector. Includes a "what happens next" box to guide the AI's next paragraph. Also includes a "start with" box to give the AI a starting point for the story. Includes a "one paragraph at a time" mode for more control over the story's pacing. Includes a "regenerate last paragraph" button to re-generate the last paragraph if you don't like it. Includes a "delete last paragraph" button to remove the last paragraph if you don't like it. Includes a "share link" button to share your story with others. Includes a "clear story" button to start over. Includes a. No sign-up or login. Generate LONG stories, paragraph-by-paragraph, optionally guiding the AI on what happens next. Fast generation & there are no daily usage restrictions - unlimited & 100% free storytelling AI, no account needed. You can prompt the AI to create horror stories (including creepy/creepypasta & analogue horror stories), funny stories, fantasy, mystery, anime, & basically anything else. Can do short stories or long-form stories - you could even try using this AI to write a novel!

// ///////////////////////////
// STORY GENERATION PROMPT
// ///////////////////////////
// Main prompt configuration for AI story generation
storyWritingPrompt
  instruction
    <instructions>
    Your task is to write the [window.storySoFarEl.value.trim().length > 0 ? "next" : "first"] part of a story using a natural and engaging writing style. Don't wrap it up! Don't rush! [window.storySoFarEl.value.trim().length > 0 ? "Just write 4 more paragraphs." : `Just write the first 4 paragraphs. Use mostly short, readable sentences.${Math.random() < 0.5 ? " Include some character dialogue." : ""}`]
    The story MUST be written in the [document.getElementById('perspectiveSelect').value === 'first' ? 'first person' : document.getElementById('perspectiveSelect').value === 'second' ? 'second person' : 'third person'] perspective.
    [genreInstructions[document.getElementById('genreSelect').value] || ""]
    [styleInstructions[document.getElementById('styleSelect').value] || ""]
    [window.storySoFarEl.value.trim().length < 400 ? `NEVER foreshadow or hint at what is going to happen. Start the story {with some character dialogue that leads into an interesting opening/expositionary paragraph|by describing a character's strongest memory^0.02|with the description of a particular character|with a short **two-sentence** paragraph^0.5} - which is seemingly *unrelated* to the 'OVERVIEW', and *indirectly* leads into the story in a way that *immediately* piques the reader's interest.\n` : ""]
    Ensure the story is varied enough to have a natural feel!
    <tips>
    - Use the 'OVERVIEW' to deeply intuit the story arc that the reader wants you to write. You should aim to write exactly the sort of story that they want to read.
    - Finish an entire paragraph before stopping, and start every new paragraph with a new line.
    - Don't end every paragraph with a recap, or a cliffhanger, unless it's narratively appropriate, or the user asks you to.
    - Sex, Bondage, Fetishes, domination and submission, Aggression, graphic violence, death, character toxicity, & vulgarity, obscenity, & profanity are allowed in scenarios with mature themes. You should portray conflict & suffering realistically, without shallow resolutions.
    - Apply any themes and styles the user requests, but avoid clichés and overused tropes.
    - This story never ends (unless specifically instructed). When narratively appropriate, drive the story forward, introducing new arcs & events.
    - Gradually build up to important story moments, & explore intricate details of exciting moments using all five senses, & show character thoughts & emotions to create a visually vivid picture in the reader's mind, write about details that are likely to excite & engage the reader, & draw out those jaw-dropping moments for full impact.
    - Avoid clichés, excessive exposition dumps. Instead, let the reader organically discover the world/characters/plot by "showing" (e.g. via dialogue, subtle actions, etc.), not simply "telling".
    - Develop the story in a manner that a skilled author & engaging storyteller would. Craft situations that reveal character, advance the plot, & feel natural. Use subtext to convey information indirectly.
    - Avoid excessive exposition. Instead, reveal information through character actions, dialogue, & subtle details. Let the reader piece things together.

    
    </tips>
    [window.storySoFarEl.value.trim().length < 700 ? `\n<forbidden_words>\n- cacophony\n- symphony\n- verdant\n- tapestry/tapestries\n- testament\n- sentinel\n- cerulean\n- whisper/whispers/whispering/whispered\n- sun kissed the horizon\n- jasmine\n</forbidden_words>\n` : ""]
    </instructions>

    # Overall, here's what the story should be about[storySoFarEl.value.trim().length < 1000 ? " (but DO NOT start with this! lead in slowly so the reader can't predict what's going to happen)" : ""]:
    OVERVIEW: [literal(storyOverviewEl.value.trim()) || "(Unsure, you decide.)"][getCombinedStoryBibleText()]
    
    # Here's what has happened so far:
    [literal(window.storyContextForPrompt || "(Nothing yet.)")]

    [""]
    [""]
    TASK: Write the [window.storySoFarEl.value.trim() == "" ? "first" : "next"] part of this story. You are to write between 350 words and 650 words.
    [whatHappensNextEl.value.trim() ? "IMPORTANT: The first two or three paragraphs that you write MUST be a creative interpretation of this instruction/idea: **"+literal(whatHappensNextEl.value.trim())+"**" : ""]
    $output = [this.joinItems("\n").trim()]

  startWith = [literal(window.startWithForPrompt)]

  stopSequences = [oneParagraphAtATimeCheckbox.checked ? ["\n\n"] : []]

  onStart(data) => 
    window.gotFirstChunk = false;
    window.withheldTrailingNewlines = "";
    window.storySoFarEl.scrollTop = 99999999;
    generateBtn.disabled = true;
    regenLastBtn.disabled = true;
    deleteLastBtn.disabled = true;
    generateBtn.textContent = "⌛ loading...";
    stopBtn.style.display = "block";
  onChunk(data) =>      
    if(data.isFromStartWith) {
      // we don't put the startWith text into the textarea because it's already there
    } else {
      let chunkText = data.textChunk;
      
      if(!window.gotFirstChunk) {
        storyGenerationAreaEl.hidden = false;
        storyBeginBtn.hidden = true;
        storyBeginOptionsCtn.hidden = true;
        
        const storyText = window.storySoFarEl.value;
        let prefix = '';
        if (storyText.trim().length > 0) {
          if (storyText.endsWith('\n\n')) {
            // It's already separated, do nothing.
          } else if (storyText.endsWith('\n')) {
            prefix = '\n'; // Just need one more newline.
          } else {
            prefix = '\n\n'; // Need a full paragraph break.
          }
        }
        chunkText = prefix + chunkText.trimStart();
      }
      window.gotFirstChunk = true;
      
      chunkText = window.withheldTrailingNewlines + chunkText;
      window.withheldTrailingNewlines = "";
      
      const trailingNewlines = chunkText.match(/\n+$/)?.[0]
      if(trailingNewlines) {
        window.withheldTrailingNewlines += trailingNewlines;
        chunkText = chunkText.replace(/\n+$/, "");
      }
      
      if(chunkText.length > 0) {
        window.storySoFarEl.appendText(chunkText);
      }
      
      if(window.storySoFarEl.value.length < 800) {
        let t = window.storySoFarEl.value;
        if(t.includes("the cacophony")) t = t.replace(/the cacophony/, "the sound");
        if(t.includes("was thick with")) t = t.replace(/was thick with/, "had");
        if(t.includes("symphony of")) t = t.replace(/symphony of/, "pattern of");
        if(t.includes("tapestry of")) t = t.replace(/tapestry of/, "pattern of");
        if(/\b(shade of emerald)\b/.test(t)) t = t.replace(/\b(shade of emerald)\b/, "shade of green");
        if(window.storySoFarEl.value !== t) window.storySoFarEl.value = t;
      }
    }
    if(window.storySoFarEl.scrollTop > (window.storySoFarEl.scrollHeight - window.storySoFarEl.offsetHeight)-65) {
      window.storySoFarEl.scrollTop = 99999999;
    }
  onFinish(data) => {
    if(/^\*?\*?paragraph 1\*?\*?:\s+?/i.test(window.storySoFarEl.value)) {
      window.storySoFarEl.value = window.storySoFarEl.value.replace(/^\*?\*?paragraph 1\*?\*?:\s+?/i, "");
    }
    generateBtn.disabled = false;
    regenLastBtn.disabled = false;
    deleteLastBtn.disabled = false;
    generateBtn.textContent = "▶️ next paragraph";
    stopBtn.style.display = "none";
    antiAntiLayoutJank(() => window.storySoFarEl.value = window.storySoFarEl.value.trimEnd());
    localStorage.storySoFar = window.storySoFarEl.value;
    updateButtonsDisplay();

    let newText;
    if (window.storyTextBeforeLastGeneration) {
      // Subsequent generations: speak only the newly added text
      newText = window.storySoFarEl.value.substring(window.storyTextBeforeLastGeneration.length);
    } else {
      // First generation: speak the entire generated text
      newText = window.storySoFarEl.value;
    }
    speak(newText.trim());
  }


getParagraphEndRegex() => return /[.。．！!？?ー":*»’”—–。]$/;

// ///////////////////////////
//  BIBLE GENERATION FUNCTIONS
// ///////////////////////////

// Build the combined story bible text for context
getCombinedStoryBibleText() => {
  if (localStorage.trackingEnabled !== 'true') return "";

  const playerInfo = document.getElementById('playerInfoEl').value.trim();
  const charactersInfo = document.getElementById('charactersInfoEl').value.trim();
  const locationsInfo = document.getElementById('locationsInfoEl').value.trim();
  const eventsInfo = document.getElementById('eventsInfoEl').value.trim();
  const loreInfo = document.getElementById('loreInfoEl').value.trim();
  const mysteriesInfo = document.getElementById('mysteriesInfoEl').value.trim();
  // Scratchpad is intentionally omitted as it's for author's notes only.

  if (!playerInfo && !charactersInfo && !locationsInfo && !eventsInfo && !loreInfo && !mysteriesInfo) return "";
  
  const bibleContent = 
    "## Player Info & Inventory:\n" + (literal(playerInfo) || "(Not specified.)") + "\n\n" +
    "## Other Characters:\n" + (literal(charactersInfo) || "(Not specified.)") + "\n\n" +
    "## Locations:\n" + (literal(locationsInfo) || "(Not specified.)") + "\n\n" +
    "## Events & Plot:\n" + (literal(eventsInfo) || "(Not specified.)") + "\n\n" +
    "## Lore & Factions:\n" + (literal(loreInfo) || "(Not specified.)") + "\n\n" +
    "## Mysteries & Plot Threads:\n" + (literal(mysteriesInfo) || "(Not specified.)");

  return "\n\n<tracked_info>\n# STORY BIBLE\n" + bibleContent.trim() + "\n</tracked_info>";
}

// This is the prompt for updating any bible section
bibleAutoUpdatePrompt
  You are an intelligent assistant that updates a Story Bible based on new story events. Your task is to be precise and preserve existing information unless it's explicitly contradicted.
  
  You will be given the 'EXISTING CONTENT' for a specific section of the Story Bible ("[window.generatingBibleSectionName]"), the 'NEW STORY EVENTS' that have occurred since the last update, and a general 'STORY OVERVIEW'.
  
  ---
  RULES:
  1.  Carefully read the 'NEW STORY EVENTS'.
  2.  Compare these events with the 'EXISTING CONTENT' for the "[window.generatingBibleSectionName]" section.
  3.  **Update the 'EXISTING CONTENT' ONLY with new or changed information found in the 'NEW STORY EVENTS'.**
  4.  **DO NOT REMOVE** information from the 'EXISTING CONTENT' just because it wasn't mentioned in the 'NEW STORY EVENTS'. Preserve manually added details unless the new events directly contradict them.
  5.  If there are no relevant changes based on the new events, return the 'EXISTING CONTENT' exactly as it was.
  6.  Maintain the original formatting of the section.
  7.  Your response MUST ONLY be the complete, updated raw text for the section. Do not include titles, markdown, or any other commentary.
  8.  Be brief, do not overshare details, break down the details with a semicolon. 
  10. When defining relationships, only mention the character they have an important relationship with, and the status of their relationship, but don't decribe, or go into detail about the other character.
  11. Refer the the player as "Main Character" and if the story has multiple main characters (if the 'OVERVIEW' says so), refer to them as "Main Characters" and structure them seperately in 'Player Info & Inventory'.
  13. Don't add the 'Player & Inventory' Main Character to the 'Other Characters' section, and vice versa.
  14. Don't add a Mystery or Plot Thread into the 'LORE & FACTIONS' section, and don't add a faction or organization into the 'MYSTERIES & PLOT THREADS' section.
  14. Avoid "reaching" for facts, only add information that is explicitly stated.
  16. Format each section like below, each section MUST be structured like this according to the section type, checking if "[window.generatingBibleSectionName]" = the title of the section. Do not display the title in the text area:
  
  - Title: 'Player Info & Inventory' 
  -   NAME:
  -   AGE: 
  -   DESCRIPTION:
  -   INVENTORY LIST: (if applicable, only show the items that are important to the story,)
  -    (item 1:)
  -    (item 2:)
  -   RELATIONSHPS:(eg. NAME: (relationship status) NAME: (relationship status))
  -   (FULL STOP HERE! DON'T ADD OTHER SECTIONS! Don't display this line in the text area!)
  - Title: 'Other Characters': (**IMPORTANT**Do not add the Main Characters here! DO NOT add general unnamed characters, only important characters. General Characters (Guards, soldiers, cultists, etc.) should be added to the 'LORE & FACTIONS' section under 'FACTIONS/ORGANIZATIONS' (eg. The City Guard, The Royal Army, etc.))
  -   NAME: (Do not add unnamed characters, only important characters.)
  -   AGE: (Do not guess the age, only if it's explicitly stated, or a ballpark is given, eg. "in their 30s", "elderly", etc.)
  -   DESCRIPTION: 
  -   RELATIONSHIPS:
  -   (FULL STOP HERE! DON'T ADD OTHER SECTIONS! Don't display this line in the text area!)

  - Title: 'Locations':
  -   NAME:
  -   TYPE: 
  -   DESCRIPTION: 
  -   NOTABLE FEATURES: 
  -   (FULL STOP HERE! DON'T ADD OTHER SECTIONS! Don't display this line in the text area!)

  - Title: 'Events & Plot':
  -   Event Name:
  -   DESCRIPTION: 
  -   CHARACTERS INVOLVED: 
  -   OUTCOME:
  -   (FULL STOP HERE! DON'T ADD OTHER SECTIONS! Don't display this line in the text area!)

  - Title: 'Lore & Factions':
  -   FACTIONS/ORGANIZATIONS:
  -     (FACTION NAME:
  -       (TYPE: (eg. government, criminal, religious, etc.))
  -       (DESCRIPTION:)
  -       (KEY MEMBERS:)
  -       (GOALS/PURPOSE:))
  -  LORE/CONCEPTS:
  -   (LORE/CONCEPT NAME:)
  -   (DESCRIPTION:)
  -   (ELEMENTS:)
  -   (PURPOSE:))
  -   (FULL STOP HERE! DON'T ADD OTHER SECTIONS! Don't display this line in the text area!)

  - Title: 'Mysteries & Plot Threads':
  -   (Title of mystery/plot thread: (eg. The Missing Heirloom, Finding killers, etc.))
  -   DESCRIPTION:
  -   CLUES:
  -   STATUS: (e.g., Unresolved, In Progress, Revealed)
  -   (FULL STOP HERE! DON'T ADD OTHER SECTIONS! Don't display this line in the text area!)

  
  ---
  CONTEXT:
  
  # STORY OVERVIEW (for general context):
  [literal(document.getElementById('storyOverviewEl').value.trim() || "(Not specified.)")]
  
  # EXISTING CONTENT for "[window.generatingBibleSectionName]":
  [literal(window.existingSectionContentForPrompt || "(This section is currently empty.)")]
  
  # NEW STORY EVENTS (occurred since last update):
  [literal(window.newEventsForPrompt)]
  
  ---
  TASK:
  Now, write the complete and updated text for the "[window.generatingBibleSectionName]" section based on all the rules above.
  $output = [this.joinItems("\n").trim()]


updateLastParagraphButtonsDisplayIfNeeded() => {
  const updateButtonsGenerateCount = Number(localStorage.generateCount);
  if(updateButtonsGenerateCount > 2) {
    rateLastMessageCtn.style.display = "inline-block";
    deleteLastBtn.textContent = "🗑️";
    deleteLastBtn.style.minWidth = "3rem";
    regenLastBtn.textContent = "🔁";
    regenLastBtn.style.minWidth = "3rem";
  }
}

updateButtonsDisplay() => {
  if(window.storySoFarEl.value.trim() === "") {
    bottomButtonsCtn.style.display = "none";
  } else {
    bottomButtonsCtn.style.display = "flex";
    generateBtn.textContent = "▶️ next paragraph";
  }
}

deleteLastParagraph() => {
  window.storyTextBeforeLastParagraphDelete = window.storySoFarEl.value;
  if(window.storyTextBeforeLastGeneration) window.storyTextBeforeLastGeneration_beforeParagraphDelete = window.storyTextBeforeLastGeneration;
  window.storyTextBeforeLastGeneration = null;
  antiAntiLayoutJank(() => { window.storySoFarEl.value=window.storySoFarEl.value.trim().split('\n\n').slice(0, -1).join('\n\n'); window.storySoFarEl.scrollTop=window.storySoFarEl.scrollHeight; });
  localStorage.storySoFar = window.storySoFarEl.value;
  undoDeleteLastParagraphCtn.style.display = "";
  clearTimeout(window.undoDeleteButtonHideTimeout);
  window.undoDeleteButtonHideTimeout = setTimeout(() => {
    undoDeleteLastParagraphCtn.style.display = "none";
  }, 1000*4);
}

undoDeleteLastParagraph() => {
  if(window.storyTextBeforeLastParagraphDelete) {
    antiAntiLayoutJank(() => window.storySoFarEl.value = window.storyTextBeforeLastParagraphDelete);
    if(window.storyTextBeforeLastGeneration_beforeParagraphDelete) window.storyTextBeforeLastGeneration = window.storyTextBeforeLastGeneration_beforeParagraphDelete;
    window.storyTextBeforeLastGeneration_beforeParagraphDelete = null;
    localStorage.storySoFar = window.storySoFarEl.value;
    undoDeleteLastParagraphCtn.style.display = "none";
  } else {
    console.error("??? should not have been able to click delete button.");
  }
}

antiAntiLayoutJank(fn) => {
  const prevPageScrollTop = document.scrollingElement.scrollTop;
  fn();
  document.scrollingElement.scrollTop = prevPageScrollTop;
}

generateWhatHappensNextIdeas() => {
  whatHappensNextSuggestionsCtn.style.display = "";
  generateWhatHappensNextIdeasBtn.disabled = true;

  let textSoFar = "";
  const pendingObj = ai({
    instruction: whatHappensNextInstruction.evaluateItem,
    startWith: `Here are 3 different ideas for what could happen next in this story:\n1.`,
    onChunk: (data) => {
      textSoFar += data.textChunk;
      if(!data.isFromStartWith) {
        whatHappensNextSuggestionsCtn.innerHTML = textSoFar.replace(/\n+/g, "\n\n");
      }
    },
    onFinish: () => {
      const existingInstruction = (window.whatHappensNextSuggestionsRegenInstructions || "").trim().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

      let html = textSoFar.trim().split("\n").filter(l => /^[0-9]+\./.test(l.trim())).map(l => l.replace(/^[0-9]+\./g, "").trim()).map(ideaText => {
        const ideaTextEscaped = sanitizeInput(ideaText);
        // Extra escaping for attribute value to prevent attribute injection
        const ideaAttrEscaped = ideaText.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        return `<div style="border:1px solid gray; margin:0.25rem; display:flex; padding:0.25rem; border-radius:3px;">
          <div style="">${ideaTextEscaped}</div>
          <button data-idea="${ideaAttrEscaped}" onclick="whatHappensNextEl.value=this.dataset.idea; whatHappensNextSuggestionsCtn.style.display='none';">use</button>
        </div>`;
      }).join("");

      html = `<div style="max-height: min(90vh, 600px); overflow: auto ">${html}</div>`;
      html += `<div style="display:flex; margin:0.25rem;"><input value="${existingInstruction}" oninput="window.whatHappensNextSuggestionsRegenInstructions=this.value" placeholder="(Optional) Idea regen instructions." style="flex-grow: 1;"><button style="margin-left: 0.25rem;" onclick="generateWhatHappensNextIdeas()">🔁 regen</button></div>`;

      whatHappensNextSuggestionsCtn.innerHTML = html;
      generateWhatHappensNextIdeasBtn.disabled = false;
    },
  });
  whatHappensNextSuggestionsCtn.innerHTML = pendingObj.loadingIndicatorHtml;
}

whatHappensNextInstruction
  Please write 3 *short* one-sentence, creative ideas for what could happen next in this story.
  [""]
  [literal(getMessagesWithSummaryReplacements(window.storySoFarEl.value).map(m => m.replace(/SUMMARY\^[0-9]+:/, "Summary (previous events):")).join("\n\n").trim())]
  [""]
  Again, please write 3 one-sentence ideas. They should be unique, creative, high-level ideas for what could happen next. Just give a few words for each idea.
  Your ideas should be comparable to that of a world–renowned, award-winning author. Original, subtle, realistic, engaging, authentic, grounded, nuanced.
  Each idea must be a SINGLE, *short* sentence.
  [window.whatHappensNextSuggestionsRegenInstructions?.trim() ? `IMPORTANT: Your ideas **MUST** be based on this instruction: ${window.whatHappensNextSuggestionsRegenInstructions}` : ""]
  Follow this template:
  [""]
  1. <a short, **ONE-SENTENCE** spark for an idea about what could happen next>
  2. <a *DIFFERENT* idea for what could happen next>
  3. <another SHORT alternative idea for what could happen next>
  $output = [this.joinItems("\n")]

resetRatingButtons() => {
  rateLastMessageBadBtn.disabled = true;
  rateLastMessageGoodBtn.disabled = true;
  rateLastMessageBadBtn.style.opacity = 1;
  rateLastMessageGoodBtn.style.opacity = 1;
}

enableRatingButtons() => {
  rateLastMessageBadBtn.disabled = false;
  rateLastMessageGoodBtn.disabled = false;
}

loadChatDataIntoInputAreas(data) => {
  if(data) {
    document.getElementById('storyOverviewEl').value = data.storyOverview || "";
    window.storySoFarEl.value = data.storySoFar || "";
    document.getElementById('whatHappensNextEl').value = data.whatHappensNext || "";
    if(data.oneParagraphAtATime) document.getElementById('oneParagraphAtATimeCheckbox').checked = data.oneParagraphAtATime;
    if(data.perspective) document.getElementById('perspectiveSelect').value = data.perspective;
    if(data.genre) document.getElementById('genreSelect').value = data.genre;
    if(data.style) document.getElementById('styleSelect').value = data.style;
    if(data.ttsEnabled === 'true') document.getElementById('ttsCheckbox').checked = true;
    
    if(data.trackingEnabled === 'true') {
      enableDetailedTracking();
      document.getElementById('playerInfoEl').value = data.playerInfo || "";
      document.getElementById('charactersInfoEl').value = data.charactersInfo || "";
      document.getElementById('locationsInfoEl').value = data.locationsInfo || "";
      document.getElementById('eventsInfoEl').value = data.eventsInfo || "";
      document.getElementById('loreInfoEl').value = data.loreInfo || "";
      document.getElementById('mysteriesInfoEl').value = data.mysteriesInfo || "";
      document.getElementById('scratchpadEl').value = data.scratchpad || "";
    }
    
  } else {
    if(localStorage.storyOverview) document.getElementById('storyOverviewEl').value = localStorage.storyOverview;
    if(localStorage.storySoFar) window.storySoFarEl.value = localStorage.storySoFar;
    if(localStorage.whatHappensNext) document.getElementById('whatHappensNextEl').value = localStorage.whatHappensNext;
    if(localStorage.oneParagraphAtATime) document.getElementById('oneParagraphAtATimeCheckbox').checked = localStorage.oneParagraphAtATime;
    if(localStorage.perspective) document.getElementById('perspectiveSelect').value = localStorage.perspective;
    if(localStorage.genre) document.getElementById('genreSelect').value = localStorage.genre;
    if(localStorage.style) document.getElementById('styleSelect').value = localStorage.style;
    if(localStorage.ttsEnabled === 'true') document.getElementById('ttsCheckbox').checked = true;

    if(localStorage.trackingEnabled === 'true') {
      enableDetailedTracking();
      document.getElementById('playerInfoEl').value = localStorage.playerInfo || "";
      document.getElementById('charactersInfoEl').value = localStorage.charactersInfo || "";
      document.getElementById('locationsInfoEl').value = localStorage.locationsInfo || "";
      document.getElementById('eventsInfoEl').value = localStorage.eventsInfo || "";
      document.getElementById('loreInfoEl').value = localStorage.loreInfo || "";
      document.getElementById('mysteriesInfoEl').value = localStorage.mysteriesInfo || "";
      document.getElementById('scratchpadEl').value = localStorage.scratchpad || "";
    }
  }

  if(window.storySoFarEl.value.trim() || Number(localStorage.generateCount||0) > 1) {
    document.getElementById('storyBeginBtn').hidden = true;
    document.getElementById('storyGenerationAreaEl').hidden = false;
    document.getElementById('storyBeginOptionsCtn').hidden = true;
  }

  {
    const t = performance.now();
    window.storySoFarEl.scrollTop = window.storySoFarEl.scrollHeight;
    window.storySoFarElInitialRenderTime = performance.now()-t;
    console.log("storySoFarElInitialRenderTime:", window.storySoFarElInitialRenderTime);
  }

  updateButtonsDisplay();
  checkOverlyLongFixedTokens();
}

loadDataIntoLocalStorage(data) => {
  localStorage.storyOverview = data.storyOverview;
  localStorage.storySoFar = data.storySoFar;
  localStorage.whatHappensNext = data.whatHappensNext;
  localStorage.oneParagraphAtATime = data.oneParagraphAtATime;
  localStorage.perspective = data.perspective;
  localStorage.genre = data.genre;
  localStorage.style = data.style;
  localStorage.ttsEnabled = data.ttsEnabled;
  
  localStorage.trackingEnabled = data.trackingEnabled;
  localStorage.playerInfo = data.playerInfo;
  localStorage.charactersInfo = data.charactersInfo;
  localStorage.locationsInfo = data.locationsInfo;
  localStorage.eventsInfo = data.eventsInfo;
  localStorage.loreInfo = data.loreInfo;
  localStorage.mysteriesInfo = data.mysteriesInfo;
  localStorage.scratchpad = data.scratchpad;


summaryPromptInstruction
  Your task is to generate some text for a story/narration and then a 'SUMMARY' of that text, and then do that a few more times. Below is the story overview, and a summary of earlier events. You must write the text, and then a summary of that text that you wrote, and then some more text, and a summary of that new text, and so on. Each summary should be a single paragraph of text which summarizes the important details from the preceding text to roughly half its original size.
  Use this format/template for your response:
  ```
  >>> FULL TEXT of \[A\]: (story/narration text)
  >>> SUMMARY of \[A\]: (a one-paragraph summary of the full \[A\] text)
  ---
  >>> FULL TEXT of \[B\]: (story/narration text)
  >>> SUMMARY of \[B\]: (a one-paragraph summary of the full \[B\] text)
  ---
  >>> FULL TEXT of \[C\]: (story/narration text)
  >>> SUMMARY of \[C\]: (a one-paragraph summary of the full \[C\] text)
  ```
  [""]
  # Story Overview:
  [literal(document.getElementById('storyOverviewEl').value.trim().replace(/\n+/g, "\n") || "(Not specified.)")]
  [""]
  # Summary of Previous Events:
  [literal(window.summaryMessagesForInstruction.join("\n"))]
  [""]
  ---
  [""]
  Again, your task is to write some text labelled with a letter, and then a summary of that text, and then some new text, and then a summary of that new text, and so on. Each summary should be a single paragraph of text which summarizes the new text to roughly half its original length. Don't add flowery prose to summaries. Summary text should contain only the most important information, and should use well-phrased sentences with natural structure and correct grammar.
  NOTE: Don't append any other commentary/notes in your summaries (e.g. no word counts or commentary after completing the task). Just do the task and then end your response.
  IMPORTANT: Avoid repetition in summaries! If there are erroneously repeated elements in the full text, then remove or ignore them when writing your well-phrased summary.
  TIP: In order to ensure the summary is half the length of the full text, you should consider what's actually happening in the story at a "higher level", rather than simply re-stating all the individual facts in a terse form. The summary should be a higher-level explanation of the full text.
  $output = [this.joinItems("\n")]
  