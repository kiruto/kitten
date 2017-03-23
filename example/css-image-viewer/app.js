/**
 * Created by yuriel on 3/8/17.
 *
 * kitten native-js example.
 */
(function(imageUrls) {

    // Global kitten root view
    var rootElement = document.getElementById("kitten-content");

    /** Change default kitten config */
    kitten.ivConfig.css.move = 0.7;
    kitten.ivConfig.css.touchMove = 0.4;

    var kittenMgr = new kitten.CSSElementManager("kitten-content");
    function Action(id, icon, iconActive, canActive, action) {
        this.id = id;
        this.icon = icon;
        this.iconActive = iconActive;
        this.canActive = canActive;
        this.action = action;
        this.elements = {};
    }

    // Set an action activate (high-lighting the icon).
    function active(action) {
        action.action();
        for (var k in kittenActions) {
            var cur = kittenActions[k];
            cur.elements.img.setAttribute("src", cur === action? cur.iconActive: cur.icon);
        }
    }

    // Actions on toolbar
    var kittenActions = {
        change: new Action("kitten--action-prev_next", "img/prev_next.png", "img/prev_next_active.png", true, function() {
            kittenMgr.changeMode(kitten.mode.CHANGE);
        }),
        zoom: new Action("kitten--action-zoom", "img/zoom.png", "img/zoom_active.png", true, function() {
            kittenMgr.changeMode(kitten.mode.SCALE);
        }),
        pan: new Action("kitten--action-pan", "img/pan.png", "img/pan_active.png", true, function() {
            kittenMgr.changeMode(kitten.mode.MOVE);
        }),
        wl: new Action("kitten--action-wl", "img/wl.png", "img/wl_active.png", true, function() {
            kittenMgr.changeMode(kitten.mode.BRIGHTNESS_CONTRAST);
        }),
        reset: new Action("kitten--action-reset", "img/reset.png", "img/reset.png", false, function() {
            kittenMgr.reset();
        }),
        prev: new Action("kitten--action-prev", "img/prev_image.png", "img/prev_image_active.png", false, function() {
            kittenMgr.prev();
        }),
        next: new Action("kitten--action-next", "img/next_image.png", "img/next_image_active.png", false, function() {
            kittenMgr.next();
        })
    };

    // Displaying image information
    function newInfoTextSpan(position) {
        var span = document.createElement("span");
        span.setAttribute("class", "kitten--info--" + position + " kitten--info-text");
        rootElement.appendChild(span);
        return span;
    }
    var infoTexts = {
        "top-left": newInfoTextSpan("top-left"),
        "top-right": newInfoTextSpan("top-right"),
        "bottom-left": newInfoTextSpan("bottom-left"),
        "bottom-right": newInfoTextSpan("bottom-right")
    };
    infoTexts["top-left"].innerText = [
        "kitten image viewer example",
        "here are some texts"
    ].join("\n");

    /** Starting to load images. */
    kittenMgr.loadImageUrls(imageUrls);

    /** Image loading callbacks */
    kittenMgr.imageDownloadObservable.subscribe({
        next: function (element) {

        },
        error: function (err) {
            console.log(err);
        },
        complete: function () {
            let d = document.getElementById("kitten-loading");
            if (d.remove) {
                d.remove();
            } else if(d["removeNode"]) {
                d["removeNode"]();
            }
            active(kittenActions.zoom);
        }
    });

    /** Update the info texts when image changes. */
    kittenMgr.toFrameObservable.subscribe({
        next: function(status) {

            /** The top-right side text */
            var list = kittenMgr.getImageUrlList();
            var current = kittenMgr.getCurrentImageUrl();
            infoTexts["top-right"].innerText = [
                "One Shot",
                "Img: " + (list.indexOf(current) + 1) + "/" + list.length
            ].join("\n");

            /** The bottom-right side text */
            var imageStatus = status.parse();
            infoTexts["bottom-right"].innerText = [
                "origin: " + imageStatus.origin,
                "scale: " + imageStatus.scale,
                "brightness: " + imageStatus.brightness,
                "contrast: " + imageStatus.contrast
            ].join("\n")
        },
        error: function(err) {
            console.log(err);
        }
    });

    // Create action bar
    (function(id) {
        var rootEl = document.getElementById(id);
        for (var k in kittenActions) {
            var act = kittenActions[k];
            var child = document.createElement("div");
            child.setAttribute("id", act.id);
            child.setAttribute("class", "kitten--action-button");
            (function(action) {
                child.addEventListener("click", function() {
                    action.canActive? active(action): action.action();
                })
            })(act);
            var aEl = document.createElement("a");
            aEl.setAttribute("href", "javascript:void(0)");
            var iconEl = document.createElement("img");
            iconEl.setAttribute("src", act.icon);
            iconEl.setAttribute("class", "kitten--action-icon");

            aEl.appendChild(iconEl);
            child.appendChild(aEl);
            rootEl.appendChild(child);

            act.elements = {
                a: aEl,
                div: child,
                img: iconEl
            };

            ///<div id="child"><a href="javascript:void(0)"><img src="icon"></a></div>
        }
    })("kitten--action-bar");
})([
    'https://dummyimage.com/600x400/000/fff',
    'https://dummyimage.com/600x400/090/ff0',
    'https://dummyimage.com/600x400/900/f0f',
    'https://dummyimage.com/600x400/009/0ff',
    'https://dummyimage.com/600x400/fff/fff',
    'https://dummyimage.com/600x400/f0f/f00',
    'https://dummyimage.com/600x400/ff0/0ff',
    'https://dummyimage.com/600x400/0ff/f0f',
    'https://dummyimage.com/600x400/00f/ff0',
    'https://dummyimage.com/600x400/f00/000'
]);