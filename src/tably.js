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

    this._init();
}

Tably.prototype._init = function() {
    const activeTab = this.tabs[0];
    activeTab.closest("li").classList.add("tably--active");

    this.tabs.forEach(tab => {
        tab.onclick = (event) => this._handleClickTab(event, tab);
    })

    this.panels.forEach(panel => panel.hidden = true);
    const activePanel = this.panels[0];
    activePanel.hidden = false;
}

Tably.prototype._handleClickTab = function(event, tab) {
    this.tabs.forEach(tab => {
        tab.closest("li").classList.remove("tably--active");
    });

    tab.closest("li").classList.add("tably--active");

    this.panels.forEach(panel => panel.hidden = true);
    const activePanel = document.querySelector(tab.getAttribute("href"));
    activePanel.hidden = false;
}