const TRANSLATIONS = {
    ['en']: {
        'l.open_settings': 'Open Settings',
        'l.close': 'Close',
        'l.open_devtools': 'Open DevTools',
        'l.reload_client': 'Reload Client',
        'l.open_plugins': 'Open Plugins folder',
    }
}

// Create loader UI.
async function createLoaderMenu(root) {
    // Import nano-jsx from CDN.
    const { Component, jsx, render } = await import('//esm.run/nano-jsx')

    // Get translation.
    const lang = document.body.dataset['lang']
    /** @type {TRANSLATIONS['en']} */
    const _t = TRANSLATIONS[lang] || TRANSLATIONS['en']

    // Get League Loader version.
    const version = window['__llver']

    // Main component.
    class LoaderMenu extends Component {
        visible = false
        frame = null
        opener = null
        didMount() {
            this.opener = document.querySelector('div[action=settings]')
            this.opener.addEventListener('click', e => {
                if (!this.visible) {
                    e.stopImmediatePropagation()
                    this.show(true)
                }
            })
        }
        show(on) {
            this.visible = on
            this.update()
            if (this.visible) {
                this.frame.shadowRoot.querySelector('lol-uikit-close-button')
                    ?.addEventListener('click', () => this.show(false))
            }
        }
        showDefaultSettings() {
            this.opener.click()
            this.show(false)
        }
        render() {
            // Tagged template literal with JSX flavor.
            // On VSCode, just install 'Comment tagged templates' extension to get highlighting.
            return jsx/*html*/`
                <div class="modal" style="position: absolute; inset: 0px; z-index: 8500" hidden=${!this.visible || undefined}>
                    <lol-uikit-full-page-backdrop class="backdrop" style="display: flex; align-items: center; justify-content: center; position: absolute; inset: 0px" />
                    <div class="dialog-confirm" style="display: flex; align-items: center; justify-content: center; position: absolute; inset: 0px">
                        <lol-uikit-dialog-frame ref=${el => (this.frame = el)} class="dialog-frame" orientation="bottom" close-button="false">
                            <div class="dialog-content">
                                <lol-uikit-content-block class="app-controls-exit-dialog" type="dialog-medium" style="position: relative; overflow: hidden">
                                    <div style="position: absolute; top: 60px">
                                        <video
                                            src="//plugins/ElainaV2/assets/Icon/LL-Settings.webm"
                                            style="object-fit: cover; object-position: center center; height: 100%; width: 100%; transform-origin: center center; transform: scale(2.5)">
                                        </video>
                                    </div>
                                    <div style="position: relative">
                                        <div style="margin-bottom: 24px">
                                            <h4 style="padding: 6px 0">Elaina-V2</h4>
                                            <p>v${version}</p>
                                        </div>
                                        <hr class="heading-spacer" />
                                        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px">
                                            <lol-uikit-flat-button-secondary style="display:inline-block; width: 180px" onClick=${() => window.openDevTools()}>
                                                ${_t['l.open_devtools']} (Ctrl Shift I)
                                            </lol-uikit-flat-button-secondary>
                                            <lol-uikit-flat-button-secondary style="display:inline-block; width: 180px" onClick=${() => window.location.reload()}>
                                                ${_t['l.reload_client']} (Ctrl Shift R)
                                            </lol-uikit-flat-button-secondary>
                                            <lol-uikit-flat-button-secondary style="display:inline-block; width: 180px" onClick=${() => window.openPluginsFolder()}>
                                                ${_t['l.open_plugins']}
                                            </lol-uikit-flat-button-secondary>
                                        </div>
                                        <hr class="heading-spacer" />
                                        <p style="padding: 20px 0" class="lol-settings-code-of-conduct-link lol-settings-window-size-text">
                                            <a href="https://github.com/Elaina69/Elaina-V2/releases" target="_blank">Theme releases</a>
                                        </p>
                                    </div>
                                </lol-uikit-content-block>
                            </div>
                            <lol-uikit-flat-button-group type="dialog-frame">
                                <lol-uikit-flat-button tabindex="1" class="button-accept" onClick=${() => this.showDefaultSettings()}>${_t['l.open_settings']}</lol-uikit-flat-button>
                                <lol-uikit-flat-button tabindex="2" class="button-decline" onClick=${() => this.show(false)}>${_t['l.close']}</lol-uikit-flat-button>
                            </lol-uikit-flat-button-group>
                        </lol-uikit-dialog-frame>
                    </div>
                </div>
            `
        }
    }

    // Render component to root.
    render(jsx`<${LoaderMenu} />`, root)
}

// Setup on window loaded.
window.addEventListener('load', async () => {
    // Wait for manager layer.
    const manager = () => document.getElementById('lol-uikit-layer-manager-wrapper')
    while (!manager()) await new Promise(r => setTimeout(r, 200))
    // Create UI and append it to manager.
    const root = document.createElement('div')
    await createLoaderMenu(root)
    manager().prepend(root)
})