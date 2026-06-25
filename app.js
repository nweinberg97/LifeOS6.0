/**
 * LifeOS Core Architecture Operations Module
 * Engine Framework: Local-first schema bindings, universal state controllers
 */

// Global App State
let state = {
    cards: [
        {
            id: 'card_sample_1',
            type: 'task',
            title: 'Refine Forth Strategy Deck',
            description: 'Align the physical coworking space metrics with digital Human Potential Infrastructure frameworks.',
            tool: 'taskly',
            container: 'taskly-todo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'card_sample_2',
            type: 'note',
            title: 'Kitsilano QR Campaign Structure',
            description: 'Plan hyper-local content release cycles using Substack endpoints and local physical anchors.',
            tool: 'brainly',
            container: 'brainly-notes',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    boardlyTabs: ["Health", "Relationships", "Work", "Chores", "Admin"],
    boardlyActiveTab: "Health",
    timelyMode: "scheduling", // scheduling | planning
    timelySubTab: "daily",    // scheduling: daily, weekly, monthly, reminders | planning: projects, goals
    brainlyLinks: ["https://github.com"],
    brainlyFolders: [
        { title: "Reflections", emoji: "💭" },
        { title: "Research Pipeline", emoji: "🔬" }
    ],
    brainlyActiveFolder: null, // Track folder selection for item filtering
    voiceActive: false
};

// Global Crunch Synth Audio Context Engine for Haptic Trash Feedback
const crunchAudioContext = new (window.AudioContext || window.webkitAudioContext)();
function playCrunchSound() {
    try {
        const osc = crunchAudioContext.createOscillator();
        const gain = crunchAudioContext.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, crunchAudioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, crunchAudioContext.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, crunchAudioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, crunchAudioContext.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(crunchAudioContext.destination);
        osc.start();
        osc.stop(crunchAudioContext.currentTime + 0.15);
    } catch (e) {
        console.log("Audio node stream blocked before user gesture interaction.");
    }
}

// State Preservation Layer
function saveState() {
    localStorage.setItem('lifeos_state', JSON.stringify(state));
    lifecycle.renderAll();
}

function loadState() {
    const data = localStorage.getItem('lifeos_state');
    if (data) {
        try {
            state = JSON.parse(data);
        } catch (e) {
            console.error("State deserialization failure, falling back to defaults", e);
        }
    }
}

// Lifecycle Controller Modules
const lifecycle = {
    init() {
        loadState();
        this.bindEvents();
        this.initClock();
        this.setupGlobalDragAndDrop();
        this.renderAll();
        this.routeView("view-home");
    },

    bindEvents() {
        // Dropdown Navigation Core Controls
        document.getElementById('hamburgerBtn').addEventListener('click', () => {
            document.getElementById('dropdownMenu').classList.toggle('open');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-right')) {
                document.getElementById('dropdownMenu').classList.remove('open');
            }
        });

        document.getElementById('btnDownload').addEventListener('click', () => this.exportData());
        document.getElementById('btnClear').addEventListener('click', () => this.clearStorage());

        // Universal Board Switch Trigger
        document.getElementById('universalBtn').addEventListener('click', () => {
            document.getElementById('universalBoard').classList.toggle('open');
        });
        document.getElementById('closeUbBtn').addEventListener('click', () => {
            document.getElementById('universalBoard').classList.remove('open');
        });

        // Navigator View Control Loops
        document.getElementById('navToggleTrigger').addEventListener('click', () => {
            document.getElementById('sideNavigator').classList.toggle('open');
        });
        
        document.querySelectorAll('.pill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.target.closest('.pill-btn');
                const targetView = targetBtn.getAttribute('data-target');
                this.routeView(targetView);
                document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
                targetBtn.classList.add('active');
            });
        });

        // Boardly Tab Creation Operations
        document.getElementById('addBoardlyTabBtn').addEventListener('click', () => {
            const name = prompt("Enter new board category name (Max 10 categories):");
            if (name && name.trim() !== "" && state.boardlyTabs.length < 10) {
                state.boardlyTabs.push(name.trim());
                state.boardlyActiveTab = name.trim();
                saveState();
            }
        });

        // Timely Core Layout Mode Switches
        document.getElementById('timelyModeSched').addEventListener('click', () => this.setTimelyMode('scheduling'));
        document.getElementById('timelyModePlan').addEventListener('click', () => this.setTimelyMode('planning'));
        
        // Timely Sub-Tabs Routing Engine
        document.querySelectorAll('#view-timely .sub-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const parent = e.target.closest('#timelySchedulingContent, #timelyPlanningContent');
                parent.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                state.timelySubTab = e.target.getAttribute('data-sub');
                saveState();
            });
        });

        // Brainly Components Controllers
        document.getElementById('brainlyNewNoteBtn').addEventListener('click', () => this.promptCreateCard('brainly', 'brainly-notes', 'note'));
        document.getElementById('brainlyNewFolderBtn').addEventListener('click', () => {
            const name = prompt("Enter folder title descriptor:");
            if (name && name.trim() !== "") {
                state.brainlyFolders.push({ title: name.trim(), emoji: "📁" });
                saveState();
            }
        });

        document.getElementById('linkInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.value.trim() !== "") {
                let url = e.target.value.trim();
                if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
                state.brainlyLinks.push(url);
                e.target.value = "";
                saveState();
            }
        });

        document.getElementById('brainlySearch').addEventListener('input', (e) => this.filterBrainly(e.target.value));

        // Intelligence Assistant Panel Toggle
        document.getElementById('assistantTrigger').addEventListener('click', () => {
            document.getElementById('assistantPanel').classList.toggle('open');
        });

        // Assistant Executive Interfaces (Submit & Voice Controls)
        document.getElementById('assistantSubmit').addEventListener('click', () => this.processAssistantInput());
        document.getElementById('assistantInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') this.processAssistantInput(); });
        
        document.getElementById('assistantVoiceBtn').addEventListener('click', () => this.toggleVoiceStream());

        // Modal Action Windows Elements
        document.getElementById('modalCloseBtn').addEventListener('click', () => {
            document.getElementById('cardModal').classList.remove('open');
        });
        document.getElementById('modalSaveBtn').addEventListener('click', () => this.saveModalCard());
    },

    initClock() {
        const updateClock = () => {
            const now = new Date();
            document.getElementById('clock').textContent = now.toTimeString().split(' ')[0];
        };
        setInterval(updateClock, 1000);
        updateClock();
    },

    routeView(viewId) {
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
        
        if (viewId === 'view-home') {
            document.body.classList.add('home-active');
        } else {
            document.body.classList.remove('home-active');
        }
    },

    // Card factory constructor mapping Universal Card Schema
    promptCreateCard(tool, initialContainer, forceType = 'task') {
        const title = prompt(`Enter ${forceType} title text:`);
        if (!title || title.trim() === "") return;
        
        const newCard = {
            id: 'card_' + Date.now() + Math.random().toString(36).substr(2, 4),
            type: forceType,
            title: title.trim(),
            description: '',
            tool: tool,
            container: initialContainer || this.getDefaultContainerForTool(tool),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        state.cards.push(newCard);
        saveState();
    },

    getDefaultContainerForTool(tool) {
        if (tool === 'taskly') return 'taskly-todo';
        if (tool === 'boardly') return `boardly-${state.boardlyActiveTab}`;
        if (tool === 'timely') return state.timelyMode === 'scheduling' ? `timely-scheduling-${state.timelySubTab}` : `timely-planning-${state.timelySubTab}`;
        if (tool === 'brainly') return 'brainly-notes';
        return 'universal-board';
    },

    // High performance UI assembly rendering pipeline
    renderAll() {
        this.renderHome();
        this.renderTaskly();
        this.renderBoardly();
        this.renderTimely();
        this.renderBrainly();
        this.renderUniversalBoard();
    },

    createCardDOM(card) {
        const div = document.createElement('div');
        div.className = 'lifeos-card';
        div.setAttribute('draggable', 'true');
        div.setAttribute('data-id', card.id);
        
        let typeIcon = "📄";
        if (card.type === 'goal') typeIcon = "🎯";
        if (card.type === 'task') typeIcon = "✅";
        if (card.type === 'note') typeIcon = "📝";

        div.innerHTML = `
            <div class="card-title">${typeIcon} ${card.title}</div>
            <div class="card-desc">${card.description || 'No detailed data entries compiled.'}</div>
            <div class="card-meta">
                <span>${card.tool.toUpperCase()}</span>
                <span>${new Date(card.updatedAt).toLocaleDateString()}</span>
            </div>
        `;

        div.addEventListener('dragstart', (e) => {
            div.classList.add('dragging');
            e.dataTransfer.setData('text/plain', card.id);
            e.dataTransfer.effectAllowed = 'move';
        });

        div.addEventListener('dragend', () => {
            div.classList.remove('dragging');
        });

        div.addEventListener('dblclick', () => this.openCardModal(card.id));

        return div;
    },

    renderUniversalBoard() {
        const zone = document.getElementById('ubDropzone');
        if (!zone) return;
        zone.innerHTML = '';
        state.cards.filter(c => c.container === 'universal-board').forEach(c => {
            zone.appendChild(this.createCardDOM(c));
        });
    },

    renderHome() {
        const nextUp = document.getElementById('homeNextUp');
        const recent = document.getElementById('homeRecentActivity');
        if (!nextUp || !recent) return;
        nextUp.innerHTML = '';
        recent.innerHTML = '';

        const activeTasks = state.cards.filter(c => c.container && !c.container.includes('completed') && c.container !== 'universal-board').slice(0, 4);
        activeTasks.forEach(c => nextUp.appendChild(this.createCardDOM(c)));

        const dynamicRecent = [...state.cards].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 4);
        dynamicRecent.forEach(c => recent.appendChild(this.createCardDOM(c)));
    },

    renderTaskly() {
        const columns = ['todo', 'inprogress', 'review', 'completed', 'backlog'];
        columns.forEach(col => {
            const containerNode = document.querySelector(`[data-container="taskly-${col}"]`);
            if (containerNode) {
                containerNode.innerHTML = '';
                state.cards.filter(c => c.container === `taskly-${col}`).forEach(c => {
                    containerNode.appendChild(this.createCardDOM(c));
                });
            }
        });
    },

    renderBoardly() {
        const bar = document.getElementById('boardlyTabsBar');
        if (!bar) return;
        bar.innerHTML = '';
        
        state.boardlyTabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = `boardly-tab ${state.boardlyActiveTab === tab ? 'active' : ''}`;
            btn.innerHTML = `<span class="tab-dot" style="background:#111111"></span> ${tab}`;
            btn.addEventListener('click', () => {
                state.boardlyActiveTab = tab;
                saveState();
            });
            bar.appendChild(btn);
        });

        const grid = document.getElementById('boardlyGrid');
        if (!grid) return;
        grid.setAttribute('data-container', `boardly-${state.boardlyActiveTab}`);
        grid.innerHTML = '';
        state.cards.filter(c => c.container === `boardly-${state.boardlyActiveTab}`).forEach(c => {
            grid.appendChild(this.createCardDOM(c));
        });
    },

    renderTimely() {
        const isSched = state.timelyMode === 'scheduling';
        const activeContainerId = isSched ? 'timelySchedZone' : 'timelyPlanZone';
        const container = document.getElementById(activeContainerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        const targetContainerKey = `timely-${state.timelyMode}-${state.timelySubTab}`;
        container.setAttribute('data-container', targetContainerKey);

        const headingInfo = document.createElement('div');
        headingInfo.style.cssText = "font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin-bottom: 14px; font-weight: 600;";
        headingInfo.innerHTML = `Tool Pipeline Matrix ➔ ${state.timelyMode} / ${state.timelySubTab}`;
        container.appendChild(headingInfo);

        const filtered = state.cards.filter(c => c.container === targetContainerKey);
        if (filtered.length === 0) {
            const emptyHint = document.createElement('p');
            emptyHint.style.cssText = "font-size: 12px; color: #aaa; font-style: italic;";
            emptyHint.textContent = "No matrix parameters mapped to this window. Drag elements here to bind.";
            container.appendChild(emptyHint);
        } else {
            filtered.forEach(c => container.appendChild(this.createCardDOM(c)));
        }
    },

    renderBrainly() {
        const linksList = document.getElementById('linksList');
        if (linksList) {
            linksList.innerHTML = '';
            state.brainlyLinks.forEach((link, idx) => {
                const li = document.createElement('li');
                li.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 4px 0;";
                li.innerHTML = `
                    <span style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 85%;">
                        🔗 <a href="${link}" target="_blank" style="color:inherit; text-decoration:none; border-bottom: 1px dotted #888;">${link}</a>
                    </span>
                    <span class="delete-link-trigger" style="cursor:pointer; opacity: 0.5; font-size:10px;" onclick="lifecycle.deleteLink(${idx})">×</span>
                `;
                linksList.appendChild(li);
            });
        }

        const fList = document.getElementById('foldersList');
        if (fList) {
            fList.innerHTML = '';
            
            // All Notes Filter Trigger
            const allDiv = document.createElement('div');
            allDiv.className = `folder-item ${state.brainlyActiveFolder === null ? 'active' : ''}`;
            if (state.brainlyActiveFolder === null) allDiv.style.fontWeight = '600';
            allDiv.innerHTML = `<span>📂</span> <span>Show All Notes</span>`;
            allDiv.addEventListener('click', () => {
                state.brainlyActiveFolder = null;
                saveState();
            });
            fList.appendChild(allDiv);

            state.brainlyFolders.forEach(f => {
                const div = document.createElement('div');
                div.className = `folder-item ${state.brainlyActiveFolder === f.title ? 'active' : ''}`;
                if (state.brainlyActiveFolder === f.title) div.style.fontWeight = '600';
                div.innerHTML = `<span>${f.emoji}</span> <span>${f.title}</span>`;
                div.addEventListener('click', () => {
                    state.brainlyActiveFolder = f.title;
                    saveState();
                });
                fList.appendChild(div);
            });
        }

        const mainZone = document.getElementById('brainlyMainZone');
        if (mainZone) {
            mainZone.innerHTML = '';
            let brainlyCards = state.cards.filter(c => c.container === 'brainly-notes');
            
            if (state.brainlyActiveFolder !== null) {
                brainlyCards = brainlyCards.filter(c => c.description && c.description.includes(`[Folder: ${state.brainlyActiveFolder}]`));
            }

            brainlyCards.forEach(c => mainZone.appendChild(this.createCardDOM(c)));
        }
    },

    deleteLink(idx) {
        state.brainlyLinks.splice(idx, 1);
        saveState();
    },

    filterBrainly(query) {
        const lowercaseQuery = query.toLowerCase();
        document.querySelectorAll('#brainlyMainZone .lifeos-card').forEach(cardDom => {
            const id = cardDom.getAttribute('data-id');
            const card = state.cards.find(c => c.id === id);
            if (card && (card.title.toLowerCase().includes(lowercaseQuery) || card.description.toLowerCase().includes(lowercaseQuery))) {
                cardDom.style.display = 'block';
            } else {
                cardDom.style.display = 'none';
            }
        });
    },

    setTimelyMode(mode) {
        state.timelyMode = mode;
        if (mode === 'scheduling') {
            document.getElementById('timelyModeSched').classList.add('active');
            document.getElementById('timelyModePlan').classList.remove('active');
            document.getElementById('timelySchedulingContent').classList.remove('hidden');
            document.getElementById('timelyPlanningContent').classList.add('hidden');
            state.timelySubTab = 'daily';
            
            // Sync UI internal class styling states
            document.querySelectorAll('#timelySchedulingContent .sub-tab').forEach(t => t.classList.remove('active'));
            const defaultTab = document.querySelector('#timelySchedulingContent [data-sub="daily"]');
            if (defaultTab) defaultTab.classList.add('active');
        } else {
            document.getElementById('timelyModeSched').classList.remove('remove');
            document.getElementById('timelyModeSched').classList.remove('active');
            document.getElementById('timelyModePlan').classList.add('active');
            document.getElementById('timelySchedulingContent').classList.add('hidden');
            document.getElementById('timelyPlanningContent').classList.remove('hidden');
            state.timelySubTab = 'projects';

            document.querySelectorAll('#timelyPlanningContent .sub-tab').forEach(t => t.classList.remove('active'));
            const defaultTab = document.querySelector('#timelyPlanningContent [data-sub="projects"]');
            if (defaultTab) defaultTab.classList.add('active');
        }
        saveState();
    },

    // HTML5 Global Drag & Drop Delegation Implementation Engine (Bulletproof Card Routing)
    setupGlobalDragAndDrop() {
        document.addEventListener('dragover', (e) => {
            const dropzone = e.target.closest('.dropzone');
            const trashBin = e.target.closest('#globalTrashBin');
            if (dropzone || trashBin) {
                e.preventDefault();
            }
        });

        document.addEventListener('dragenter', (e) => {
            const trashBin = e.target.closest('#globalTrashBin');
            if (trashBin) trashBin.classList.add('hovered');
        });

        document.addEventListener('dragleave', (e) => {
            const trashBin = e.target.closest('#globalTrashBin');
            if (trashBin && !e.relatedTarget?.closest('#globalTrashBin')) {
                trashBin.classList.remove('hovered');
            }
        });

        document.addEventListener('drop', (e) => {
            const dropzone = e.target.closest('.dropzone');
            const trashBin = e.target.closest('#globalTrashBin');
            const cardId = e.dataTransfer.getData('text/plain');
            
            if (!cardId) return;
            const card = state.cards.find(c => c.id === cardId);
            if (!card) return;

            if (trashBin) {
                e.preventDefault();
                trashBin.classList.remove('hovered');
                state.cards = state.cards.filter(c => c.id !== cardId);
                playCrunchSound();
                saveState();
                return;
            }

            if (dropzone) {
                e.preventDefault();
                let targetContainer = dropzone.getAttribute('data-container');
                
                // Dynamic tab route mappings conversion adaptations
                if (targetContainer === 'boardly-active-tab') targetContainer = `boardly-${state.boardlyActiveTab}`;
                if (targetContainer === 'timely-sched' || targetContainer === 'timely-plan') {
                    targetContainer = `timely-${state.timelyMode}-${state.timelySubTab}`;
                }

                card.container = targetContainer;
                // Auto track root tool contextual mappings
                card.tool = targetContainer.split('-')[0];
                card.updatedAt = new Date().toISOString();
                saveState();
            }
        });
    },

    // Item Parameter Editor Controllers
    openCardModal(cardId) {
        const card = state.cards.find(c => c.id === cardId);
        if (!card) return;
        document.getElementById('modalCardTitle').value = card.title;
        document.getElementById('modalCardDesc').value = card.description || '';
        document.getElementById('modalCardId').value = card.id;
        document.getElementById('cardModal').classList.add('open');
    },

    saveModalCard() {
        const id = document.getElementById('modalCardId').value;
        const card = state.cards.find(c => c.id === id);
        if (card) {
            card.title = document.getElementById('modalCardTitle').value.trim();
            card.description = document.getElementById('modalCardDesc').value;
            card.updatedAt = new Date().toISOString();
            
            // Auto folder categorizer mapping adapter for notes view if explicitly filtered
            if (card.tool === 'brainly' && state.brainlyActiveFolder && !card.description.includes('[Folder:')) {
                card.description += `\n\n[Folder: ${state.brainlyActiveFolder}]`;
            }
            
            saveState();
        }
        document.getElementById('cardModal').classList.remove('open');
    },

    // Refined Custom Voice Streaming System Function Note Simulation
    toggleVoiceStream() {
        const btn = document.getElementById('assistantVoiceBtn');
        const body = document.getElementById('assistantOutput');
        
        state.voiceActive = !state.voiceActive;
        
        if (state.voiceActive) {
            btn.style.backgroundColor = "rgba(255, 59, 48, 0.15)";
            btn.style.color = "#ff3b30";
            body.innerHTML += `<div class="system-msg" id="voice-listening-prompt">🎙️ Voice channel pipeline listening active... Speak your system command.</div>`;
        } else {
            btn.style.backgroundColor = "";
            btn.style.color = "";
            const promptNode = document.getElementById('voice-listening-prompt');
            if (promptNode) promptNode.remove();
            
            // Auto complete simulated audio text transfer chunk payload
            document.getElementById('assistantInput').value = "Create task Sync with Vancouver builders network";
            body.innerHTML += `<div class="system-msg">Voice codec feed processed cleanly. Hit Send to route pipeline.</div>`;
        }
        body.scrollTop = body.scrollHeight;
    },

    // AI Dynamic Workspace Pipeline Executive Simulator
    processAssistantInput() {
        const inputNode = document.getElementById('assistantInput');
        const text = inputNode.value.trim();
        if (!text) return;

        const body = document.getElementById('assistantOutput');
        body.innerHTML += `<div class="user-msg">➔ ${text}</div>`;
        
        const lower = text.toLowerCase();
        
        // Command Routing Automation Engine Match
        if (lower.startsWith('create task ') || lower.startsWith('create card ')) {
            const extractedTitle = text.replace(/^(create task |create card )/i, '');
            const newCard = {
                id: 'card_' + Date.now(),
                type: 'task',
                title: extractedTitle || 'AI Automated Process Task',
                description: 'Generated instantly via context routing intelligence engine pipeline parsing.',
                tool: 'taskly',
                container: 'taskly-todo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            state.cards.push(newCard);
            body.innerHTML += `<p class="system-msg">✅ Pipeline action intercepted: Created Taskly card titled "${extractedTitle}" inside To Do index stack.</p>`;
        } else if (lower === 'clear') {
            body.innerHTML = `<p class="system-msg">Terminal console display cache buffers flushed cleanly.</p>`;
        } else {
            body.innerHTML += `<p class="system-msg">Processing via Local Context Routing Vectors: Analysis complete. Strategy metrics updated perfectly inside your workspace state arrays.</p>`;
        }
        
        inputNode.value = '';
        body.scrollTop = body.scrollHeight;
    },

    // Data Export Structure Infrastructure Utilities
    exportData() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `lifeos_production_state_${Date.now()}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
    },

    clearStorage() {
        if (confirm("CRITICAL OVERWRITE EXCLUSION WARNING: Are you certain you want to erase your entire physical client database? All layout parameters will restore to zero values.")) {
            localStorage.removeItem('lifeos_state');
            window.location.reload();
        }
    }
};

// Fire unified execution sequences on complete DOM lifecycle loading termination
document.addEventListener('DOMContentLoaded', () => lifecycle.init());
