(function() {
  var $ = require('jquery');
  var gui = require('nw.gui');

  // Get the current window
  var win = gui.Window.get();

  win.on('new-win-policy', function(frame, url, policy) {
    policy.ignore();
    gui.Shell.openExternal(url);
    //policy.forceNewWindow();
  });

  // FIXME: very hacky way to forcefully update font-family
  win.on('document-end', function() {
    var i = frames[0];
    var d = i.document;

    i.onload = function() {
        console.log('loaded');
        $(d.head).contents().append("<style>body {font-family: helvetica, arial,'lucida grande', 'Hiragino Kaku Gothic ProN', '游ゴシック', YuGothic, Meiryo, sans-serif !important;} .panelFlyout {right: 0 !important;}</style>");

        var topbar = d.getElementById("pagelet_bluebar");
        if (topbar && topbar.style) {
          topbar.style.display = "none";
        }
        var sidebar = d.getElementById("pagelet_sidebar");
        if (sidebar && sidebar.style) {
          sidebar.style.display = "none";
        }
        var dock = d.getElementById("pagelet_dock");
        if (dock && dock.style) {
          dock.style.display = "none";
        }
        var ad = d.getElementById("rightCol");
        if (ad && ad.style) {
          ad.style.display = "none";
        }

        // observe message notification count on the blue bar
        var permission = Notification.permission;
        var messageBadgeCountTag = d.querySelector('#mercurymessagesCountValue');
        if (messageBadgeCountTag) {
          var badgeCountObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              var addedNodes = mutation.addedNodes;
              if (addedNodes && addedNodes.length ===1) {
                var count = parseInt(addedNodes[0].data);
                if (count) {
                  win.setBadgeLabel(count);
                  if (permission === "granted") {
                    var n = new Notification(d.title);
                  }
                } else {
                  win.setBadgeLabel("");
                }
              }
            });
          });
          badgeCountObserver.observe(messageBadgeCountTag, { childList: true });
        }

        // ready to show
        var root = document.getElementById("main");
        root.setAttribute("class", "visible");
    }
  });

  // Need to set the menu using shortcuts on osx
  // https://github.com/nwjs/nw.js/wiki/Menu#menucreatemacbuiltinappname
  var nativeMenuBar = new gui.Menu({type: "menubar"});
  if (nativeMenuBar && nativeMenuBar.createMacBuiltin) {
    nativeMenuBar.createMacBuiltin(gui.App.manifest.name);
    win.menu = nativeMenuBar;
  }
}).apply(this);
