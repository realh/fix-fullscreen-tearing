import {panel} from 'resource:///org/gnome/shell/ui/main.js';
import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import St from 'gi://St';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class FixFullscreenTearingExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this.fixed_gicon = this.load_icon("fixed-fullscreen-tearing-symbolic");
        this.unfixed_gicon =
            this.load_icon("unfixed-fullscreen-tearing-symbolic");
    }

    load_icon(name) {
        const f = Gio.File.new_for_path(
            `${this.path}/icons/${name}.svg`);
        return Gio.FileIcon.new(f);
    }

    enable_fix() {
        if ("disable_unredirect_for_display" in Meta) {
            // Old way
            Meta.disable_unredirect_for_display(global.display);
        } else {
            // GNOME 48+
            const comp = global.display.get_compositor();
            comp.disable_unredirect();
        }
        this.icon.set_gicon(this.fixed_gicon);
        this.fixed = true;
    }

    disable_fix() {
        if ("disable_unredirect_for_display" in Meta) {
            // Old way
            Meta.enable_unredirect_for_display(global.display);
        } else {
            // GNOME 48+
            const comp = global.display.get_compositor();
            comp.enable_unredirect();
        }
        this.icon.set_gicon(this.unfixed_gicon);
        this.fixed = false;
    }

    enable() {
        this.icon = new St.Icon({ style_class: "system-status-icon" });

        this.button = new St.Bin({
            style_class: "panel-button",
            reactive: true,
            can_focus: true,
            track_hover: true
        });

        this.button.set_child(this.icon);

        this.button.connect(
            "button-press-event",
            () => {
                if (this.fixed) {
                    this.disable_fix();
                } else {
                    this.enable_fix();
                }
            }
        );

        panel._rightBox.insert_child_at_index(this.button, 0);
        this.enable_fix();
    }

    disable() {
        panel._rightBox.remove_child(this.button);
        this.disable_fix();
        this.button = null;
    }
}
