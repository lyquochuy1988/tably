function Tably(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.error(`No container found in selector: ${selector}`);
        return;
    }

    this.tabs = Array.from(this.container.querySelectorAll("li a"));

    if (!this.tabs.length) {
        console.error(`No tabs found in container ${this.container}`);
        return;
    }

    this.panels = this.tabs.map(tab => {
        const panel = document.querySelector(tab.getAttribute("href"));        
        if (!panel) {
            console.error(`No panels found in tabs ${tab.getAttribute("href")}`);
        }

        return panel;
    }).filter(Boolean);

    if (this.tabs.length !== this.panels.length) return;

    this._originalHTML = this.container.innerHTML;

    this._init();
}

Tably.prototype._init = function() {   
    this._activeTab(this.tabs[0]);

    this.tabs.forEach(tab => {
        tab.onclick = (event) => this._handleClickTab(event, tab);
    })
}

Tably.prototype._handleClickTab = function(event, tab) {
    event.preventDefault();
    this._activeTab(tab);
}

Tably.prototype._activeTab = function(tab) {
    this.tabs.forEach(tab => {
        tab.closest("li").classList.remove("tably--active");
    });

    tab.closest("li").classList.add("tably--active");

    this.panels.forEach(panel => panel.hidden = true);
    const activePanel = document.querySelector(tab.getAttribute("href"));
    activePanel.hidden = false;
}

Tably.prototype.switch = function(input) {
    let tabToActive = null;
    if (typeof input === 'string') {
        tabToActive = this.tabs.find(tab => tab.getAttribute("href") === input);  

        if (!tabToActive) {
            console.error(`Not found tab from input: ${input}`);
            return;
        }
    } else if (this.tabs.includes(input)) {
        tabToActive = input;
    }

    if (!tabToActive) {
        console.error(`Not found tab from ${input}`);
        return;
    }

    this._activeTab(tabToActive);
}

Tably.prototype.destroy = function() {
    this.container.innerHTML = this._originalHTML;
    this.panels.forEach(panel => panel.hidden = false);

    this.container = null;
    this.tabs = null;
    this.panels = null;
}