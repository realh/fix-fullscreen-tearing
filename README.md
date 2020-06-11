# Gnome Shell Fullscreen Tearing Fixer Extension

GNOME Shell has a nice feature called "unredirection", which sometimes disables
compositing for fullscreen windows. I think this is a heuristic to reduce
latency in video games, but it makes a lot of non-video game applications (such
as HTML5 video in Firefox) have vsync issues. This isn't really GNOME Shell's
fault, since applications shouldn't rely on the compositor to implement vsync
for them, but as a user who loves watching memes in fullscreen I don't really
care.

Since I keep forgetting the command to turn this feature on and off, this
extension adds an icon to the main panel to do so.
