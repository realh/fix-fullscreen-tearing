const { main } = imports.ui;
const { Gio, Gtk, Meta, St } = imports.gi;
const { extensionUtils } = imports.misc;

let icon, button, fixed;
let fixed_gicon, unfixed_gicon;

function enable_fix() {
  Meta.disable_unredirect_for_display(global.display);
  icon.set_gicon(fixed_gicon);
  fixed = true;
}

function disable_fix() {
  Meta.enable_unredirect_for_display(global.display);
  icon.set_gicon(unfixed_gicon);
  fixed = false;
}

function load_icon(name) {
  const current_extension = extensionUtils.getCurrentExtension();
  const f = Gio.File.new_for_path(
    `${current_extension.path}/icons/${name}.svg`);
  return Gio.FileIcon.new(f);
}

function init() {
    fixed_gicon = load_icon("fixed-fullscreen-tearing-symbolic");
    unfixed_gicon = load_icon("unfixed-fullscreen-tearing-symbolic");
}

function enable() {
  icon = new St.Icon({ style_class: "system-status-icon" });

  button = new St.Bin({
    style_class: "panel-button",
    reactive: true,
    can_focus: true,
    track_hover: true
  });

  button.set_child(icon);

  button.connect(
    "button-press-event",
    function() {
      if (fixed) {
        disable_fix();
      } else {
        enable_fix();
      }
    }
  );

  main.panel._rightBox.insert_child_at_index(button, 0);
  enable_fix();
}

function disable() {
  main.panel._rightBox.remove_child(button);
  disable_fix();
  button = null;
}
