const { main } = imports.ui;
const { Gio, Gtk, Meta, St } = imports.gi;
const { extensionUtils } = imports.misc;

let icon, button, fixed;

function enable_fix() {
  Meta.disable_unredirect_for_screen(global.display);
  icon.set_icon_name("fixed-fullscreen-tearing-symbolic");
  fixed = true;
}

function disable_fix() {
  Meta.enable_unredirect_for_screen(global.display);
  icon.set_icon_name("unfixed-fullscreen-tearing-symbolic");
  fixed = false;
}

function init() {
}

function enable() {
  const current_extension = extensionUtils.getCurrentExtension();
  const icon_theme = Gtk.IconTheme.get_default();
  icon_theme.append_search_path(current_extension.path + "/icons");

  icon = new St.Icon({ style_class: "system-status-icon" });

  button = new St.Bin({
    style_class: "panel-button",
    reactive: true,
    can_focus: true,
    x_fill: true,
    y_fill: false,
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
