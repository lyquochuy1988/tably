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

    this.panels = this.tabs.map(tab => {
        const panel = document.querySelector(tab.getAttribute("href"));        
        if (!panel) {
            console.error(`No panels found in tabs ${tab.getAttribute("href")}`);
        }

        return panel;
    }).filter(Boolean);

    if (this.tabs.length !== this.panels.length) return;

    this.opt = Object.assign({
        remember: false,
    }, options);

    this.paramKey = selector.replace(/[^a-zA-Z0-9]/g, '');;

    this._originalHTML = this.container.innerHTML;

    this._init();
}

Tably.prototype._init = function() {   
    const params = new URLSearchParams(location.search);
    const tabSelector = params.get(this.paramKey);

    const tabToActivate = (this.opt.remember && tabSelector && this.tabs.find(tab => tab.getAttribute("href").replace(/[^a-zA-Z0-9]/g, '') === tabSelector)) || this.tabs[0];
    this._activateTab(tabToActivate)

    this.tabs.forEach(tab => {
        tab.onclick = (event) => this._handleClickTab(event, tab);
    })
}

Tably.prototype._handleClickTab = function(event, tab) {
    event.preventDefault();
    this._activateTab(tab);
}

Tably.prototype._activateTab = function(tab) {
    this.tabs.forEach(tab => {
        tab.closest("li").classList.remove("tably--active");
    });

    tab.closest("li").classList.add("tably--active");

    this.panels.forEach(panel => panel.hidden = true);
    const activePanel = document.querySelector(tab.getAttribute("href"));
    activePanel.hidden = false;

    if (this.opt.remember) {
        const params = new URLSearchParams(location.search);
        const paramValue = tab.getAttribute("href").replace(/[^a-zA-Z0-9]/g, '');

        params.set(this.paramKey, paramValue);

        history.replaceState(null, null, `?${params}`);
    }
}

Tably.prototype.switch = function(input) {
    let tabToActivate = null;
    if (typeof input === 'string') {
        tabToActivate = this.tabs.find(tab => tab.getAttribute("href") === input);  

        if (!tabToActivate) {
            console.error(`Not found tab from input: ${input}`);
            return;
        }
    } else if (this.tabs.includes(input)) {
        tabToActivate = input;
    }

    if (!tabToActivate) {
        console.error(`Not found tab from ${input}`);
        return;
    }

    this._activateTab(tabToActivate);
}

Tably.prototype.destroy = function() {
    this.container.innerHTML = this._originalHTML;
    this.panels.forEach(panel => panel.hidden = false);

    this.container = null;
    this.tabs = null;
    this.panels = null;
}