/**
 * LifeOS Core Architecture Operations Module
 * Engine Framework: Local-first schema bindings, universal state controllers
 */

// Global App State
let state = {
    cards: [],
    boardlyTabs: ["Health", "Relationships", "Work", "Chores", "Admin"],
    boardlyActiveTab: "Health",
    timelyMode: "scheduling", // scheduling | planning
    timelySubTab: "daily",
    brainlyLinks: [],
    brainlyFolders: [
        { title: "Reflections", color: "#111111", emoji: "💭" },
        { title: "Research Pipeline", color: "#111111", emoji: "🔬" }
    ],
    assistantMode: "chat"
};

// Global Crunch Synth Audio Context Engine
const crunchAudioContext = new (window.AudioContext || window.webkitAudioContext)();
function playCrunchSound() {
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
        this.setupDragAndDrop();
        this.renderAll();
        this.routeView("view-home");
    },

    bindEvents() {
        // Dropdown Core Controls
        document.getElementById('hamburgerBtn').addEventListener('click', () => {
            document.getElementById('dropdownMenu').classList.toggle('open');
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

        // Navigator Controls Execution Loops
        document.getElementById('navToggleTrigger').addEventListener('click', () => {
            document.getElementById('sideNavigator').classList.toggle('open');
        });
        document.querySelectorAll('.pill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetView = e.target.getAttribute('data-target');
                this.routeView(targetView);
                document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Boardly Specific Operations Bindings
        document.getElementById('addBoardlyTabBtn').addEventListener('click', () => {
            const name = prompt("Enter category name (Max 10 categories):");
            if (name && state.boardlyTabs.length < 10) {
                state.boardlyTabs.push(name);
                state.boardlyActiveTab = name;
                saveState();
            }
        });

        // Timely Toggles Bindings
        document.getElementById('timelyModeSched').addEventListener('click', () => this.setTimelyMode('scheduling'));
        document.getElementById('timelyModePlan').addEventListener('click', () => this.setTimelyMode('planning'));
        
        document.querySelectorAll('#view-timely .sub-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const parent = e.target.closest('#timelySchedulingContent, #timelyPlanningContent');
                parent.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                state.timelySubTab = e.target.getAttribute('data-sub');
                saveState();
            });
        });

        // Brainly Component Adders
        document.getElementById('brainlyNewNoteBtn').addEventListener('click', () => this.promptCreateCard('brainly', 'notes'));
        document.getElementById('brainlyNewFolderBtn').addEventListener('click', () => {
            const name = prompt("Folder Designation:");
            if (name) {
                state.brainlyFolders.push({ title: name, color: "#111111", emoji: "📁" });
                saveState();
            }
        });
        document.getElementById('linkInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.value.trim() !== "") {
                state.brainlyLinks.push(e.target.value.trim());
                e.target.value = "";
                saveState();
            }
        });
        document.getElementById('brainlySearch').addEventListener('input', (e) => this.filterBrainly(e.target.value));

        // Assistant Operational Modules
        document.getElementById('assistantTrigger').addEventListener('click', () => {
            document.getElementById('assistantPanel').classList.toggle('open');
        });
        document.querySelectorAll('.mode-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                state.assistantMode = e.target.id.replace('mode', '').toLowerCase();
            });
        });
        document.getElementById('assistantSubmit').addEventListener('click', () => this.processAssistantInput());
        document.getElementById('assistantInput').addEventListener('keydown', (e) => { if(e.key === 'Enter') this.processAssistantInput(); });

        // Modal Form Actions Elements
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
        
        // Background transformation execution handler rule
        if (viewId === 'view-home') {
            document.body.classList.add('home-active');
        } else {
            document.body.classList.remove('home-active');
        }
    },

    // Card factory constructor mapping Universal Card Schema
    promptCreateCard(tool, initialContainer, forceType = 'task') {
        const title = prompt(`Enter ${forceType} title:`);
        if (!title) return;
        
        const newCard = {
            id: 'card_' + Date.now(),
            type: forceType,
            title: title,
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
        if (tool === 'timely') return state.timelyMode === 'scheduling' ? 'timely-sched' : 'timely-plan';
        if (tool === 'brainly') return 'brainly-notes';
        return 'universal-board';
    },

    // High performance UI assembly core pipeline
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
        
        // Context Icons matching system profiles rules
        let typeIcon = "📄";
        if (card.type === 'goal') typeIcon = "🎯";
        if (card.type === 'task') typeIcon = "✅";
        if (card.type === 'note') typeIcon = "📝";

        div.innerHTML = `
            <div class="card-title">${typeIcon} ${card.title}</div>
            <div class="card-desc">${card.description || 'No detailed layout elements added.'}</div>
            <div class="card-meta">
                <span>${card.tool.toUpperCase()}</span>
                <span>${new Date(card.updatedAt).toLocaleDateString()}</span>
            </div>
        `;

        div.addEventListener('dragstart', (e) => {
            div.classList.add('dragging');
            e.dataTransfer.setData('text/plain', card.id);
        });

        div.addEventListener('dragend', () => {
            div.classList.remove('dragging');
        });

        div.addEventListener('dblclick', () => this.openCardModal(card.id));

        return div;
    },

    renderUniversalBoard() {
        const zone = document.getElementById('ubDropzone');
        zone.innerHTML = '';
        state.cards.filter(c => c.container === 'universal-board').forEach(c => {
            zone.appendChild(this.createCardDOM(c));
        });
    },

    renderHome() {
        const nextUp = document.getElementById('homeNextUp');
        const recent = document.getElementById('homeRecentActivity');
        nextUp.innerHTML = '';
        recent.innerHTML = '';

        // Prioritized listing rule
        const activeTasks = state.cards.filter(c => c.container && !c.container.includes('completed')).slice(0, 4);
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
        // Tab generation pipeline matching limit constraint criteria
        const bar = document.getElementById('boardlyTabsBar');
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
        grid.setAttribute('data-container', `boardly-${state.boardlyActiveTab}`);
        grid.innerHTML = '';
        state.cards.filter(c => c.container === `boardly-${state.boardlyActiveTab}`).forEach(c => {
            grid.appendChild(this.createCardDOM(c));
        });
    },

    renderTimely() {
        const container = state.timelyMode === 'scheduling' ? document.getElementById('timelySchedZone') : document.getElementById('timelyPlanZone');
        container.innerHTML = `<p style="font-size:13px; color:#666; margin-bottom:12px;">Mode Area Pipeline: <strong>${state.timelyMode.toUpperCase()} (${state.timelySubTab.toUpperCase()})</strong></p>`;
        
        state.cards.filter(c => c.container === `timely-${state.timelyMode}-${state.timelySubTab}`).forEach(c => {
            container.appendChild(this.createCardDOM(c));
        });
    },

    renderBrainly() {
        const linksList = document.getElementById('linksList');
        linksList.innerHTML = '';
        state.brainlyLinks.forEach(link => {
            const li = document.createElement('li');
            li.innerHTML = `🔗 <a href="${link}" target="_blank" style="color:inherit; text-decoration:none;">${link}</a>`;
            linksList.appendChild(li);
        });

        const fList = document.getElementById('foldersList');
        fList.innerHTML = '';
        state.brainlyFolders.forEach(f => {
            const div = document.createElement('div');
            div.className = 'folder-item';
            div.innerHTML = `<span>${f.emoji}</span> <span>${f.title}</span>`;
            fList.appendChild(div);
        });

        const mainZone = document.getElementById('brainlyMainZone');
        mainZone.innerHTML = '';
        state.cards.filter(c => c.container === 'brainly-notes').forEach(c => {
            mainZone.appendChild(this.createCardDOM(c));
        });
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
        } else {
            document.getElementById('timelyModeSched').classList.remove('active');
            document.getElementById('timelyModePlan').classList.add('active');
            document.getElementById('timelySchedulingContent').classList.add('hidden');
            document.getElementById('timelyPlanningContent').classList.remove('hidden');
            state.timelySubTab = 'projects';
        }
        saveState();
    },

    // HTML5 Native Drag & Drop Implementation Engines
    setupDragAndDrop() {
        document.addEventListener('dragover', (e) => {
            if (e.target.closest('.dropzone') || e.target.closest('#globalTrashBin')) {
                e.preventDefault();
            }
        });

        document.querySelectorAll('.dropzone').forEach(zone => {
            zone.addEventListener('dragenter', (e) => { e.preventDefault(); });
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                const cardId = e.dataTransfer.getData('text/plain');
                let targetContainer = zone.getAttribute('data-container');
                
                // Dynamic mapping adapter rules
                if (targetContainer === 'boardly-active-tab') targetContainer = `boardly-${state.boardlyActiveTab}`;
                if (targetContainer === 'timely-sched' || targetContainer === 'timely-plan') targetContainer = `timely-${state.timelyMode}-${state.timelySubTab}`;

                const card = state.cards.find(c => c.id === cardId);
                if (card) {
                    card.container = targetContainer;
                    // Assign root tool tracking mappings automatically
                    card.tool = targetContainer.split('-')[0];
                    card.updatedAt = new Date().toISOString();
                    saveState();
                }
            });
        });

        // Global Trash Drop target zone
        const bin = document.getElementById('globalTrashBin');
        bin.addEventListener('dragover', (e) => { bin.classList.add('hovered'); });
        bin.addEventListener('dragleave', () => { bin.classList.remove('hovered'); });
        bin.addEventListener('drop', (e) => {
            e.preventDefault();
            bin.classList.remove('hovered');
            const cardId = e.dataTransfer.getData('text/plain');
            state.cards = state.cards.filter(c => c.id !== cardId);
            playCrunchSound();
            saveState();
        });
    },

    // Item Parameter Editor Controllers
    openCardModal(cardId) {
        const card = state.cards.find(c => c.id === cardId);
        if (!card) return;
        document.getElementById('modalCardTitle').value = card.title;
        document.getElementById('modalCardDesc').value = card.description;
        document.getElementById('modalCardId').value = card.id;
        document.getElementById('cardModal').classList.add('open');
    },

    saveModalCard() {
        const id = document.getElementById('modalCardId').value;
        const card = state.cards.find(c => c.id === id);
        if (card) {
            card.title = document.getElementById('modalCardTitle').value;
            card.description = document.getElementById('modalCardDesc').value;
            card.updatedAt = new Date().toISOString();
            saveState();
        }
        document.getElementById('cardModal').classList.remove('open');
    },

    // AI Workspace Simulator
    processAssistantInput() {
        const inputNode = document.getElementById('assistantInput');
        const text = inputNode.value.trim();
        if (!text) return;

        const body = document.getElementById('assistantOutput');
        body.innerHTML += `<div class="user-msg">➔ ${text}</div>`;
        
        // Action Match Engines
        const lower = text.toLowerCase();
        if (lower.includes('create task') || lower.includes('create card')) {
            this.promptCreateCard('taskly', 'taskly-todo', 'task');
            body.innerHTML += `<p class="system-msg">Local execution layer hijacked: Dialog triggered.</p>`;
        } else if (lower.includes('clear')) {
            body.innerHTML = `<p class="system-msg">Terminal console buffers flushed.</p>`;
        } else {
            body.innerHTML += `<p class="system-msg">Processing via Mode [${state.assistantMode.toUpperCase()}]: Analysis complete. Action parsed into local state framework vectors cleanly.</p>`;
        }
        
        inputNode.value = '';
        body.scrollTop = body.scrollHeight;
    },

    // Administrative System Utilities
    exportData() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `lifeos_export_${Date.now()}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
    },

    clearStorage() {
        if (confirm("Are you entirely sure you wish to wipe the physical local layout structures? All updates will vanish.")) {
            localStorage.removeItem('lifeos_state');
            window.location.reload();
        }
    }
};

// Fire execution sequence on content loading termination
document.addEventListener('DOMContentLoaded', () => lifecycle.init());
