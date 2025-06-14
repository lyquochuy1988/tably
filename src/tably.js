function Tably(selector, options = {}) {
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

    this.panels = this.getPanels();

    if (this.tabs.length !== this.panels.length) return;

    this.opt = Object.assign({
        activeClassName: "tably--active",
        remember: false,
        onChange: null,
    }, options);

    this._cleanRegex = /[^a-zA-Z0-9]/g;
    this.paramKey = selector.replace(this._cleanRegex, '');
    this._originalHTML = this.container.innerHTML;

    this._init();
}

Tably.prototype.getPanels = function() {
    return this.tabs.map(tab => {
        const panel = document.querySelector(tab.getAttribute("href"));        
        if (!panel) {
            console.error(`No panels found in tabs ${tab.getAttribute("href")}`);
        }

        return panel;
    }).filter(Boolean);
}

Tably.prototype._init = function() {   
    const params = new URLSearchParams(location.search);
    const tabSelector = params.get(this.paramKey);

    const tab = (this.opt.remember && tabSelector && this.tabs.find(tab => tab.getAttribute("href").replace(this._cleanRegex, '') === tabSelector)) || this.tabs[0];
    
    this.currentTab = tab;
    
    this._activateTab(tab, false, false);

    this.tabs.forEach(tab => {
        tab.onclick = (event) => this._handleClickTab(event, tab);
    })
}

Tably.prototype._handleClickTab = function(event, tab) {
    event.preventDefault();
    this._tryActivateTab(tab);
}

Tably.prototype._activateTab = function(tab, triggerOnchange = true, updateURL = this.opt.remember) {
    this.tabs.forEach(tab => {
        tab.closest("li").classList.remove(this.opt.activeClassName);
    });

    tab.closest("li").classList.add(this.opt.activeClassName);

    this.panels.forEach(panel => panel.hidden = true);
    const activePanel = document.querySelector(tab.getAttribute("href"));
    activePanel.hidden = false;

    if (updateURL) {
        const params = new URLSearchParams(location.search);
        const paramValue = tab.getAttribute("href").replace(this._cleanRegex, '');

        params.set(this.paramKey, paramValue);

        history.replaceState(null, null, `?${params}`);
    }

    if (triggerOnchange && typeof this.opt.onChange === 'function') {
        this.opt.onChange({
            tab,
            panel: activePanel
        });
    }
}

Tably.prototype._tryActivateTab = function(tab) {
    if (this.currentTab !== tab) {
        this.currentTab = tab;
        this._activateTab(tab);
    }
}

Tably.prototype.switch = function(input) {   
    const tabToActivate = typeof input === 'string' ? this.tabs.find(tab => tab.getAttribute("href") === input) 
                            : this.tabs.includes(input) ? input : null;

    if (!tabToActivate) {
        console.error(`Not found tab from ${input}`);
        return;
    }

    this._tryActivateTab(tabToActivate);
}

Tably.prototype.destroy = function() {
    this.container.innerHTML = this._originalHTML;
    this.panels.forEach(panel => panel.hidden = false);

    this.container = null;
    this.tabs = null;
    this.panels = null;
    this.currentTab = null;
}