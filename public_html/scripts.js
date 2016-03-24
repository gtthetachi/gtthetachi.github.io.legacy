
$(function() {
    var pull        = $('#pull');
    menu        = $('.nav-content');
    menuHeight  = menu.height();

    $(pull).on('click', function(e) {
        e.preventDefault();
        menu.slideToggle();
    });
});

$(window).resize(function(){
    var w = $(window).width();
    if(w > 320 && menu.is(':hidden')) {
        menu.removeAttr('style');
    }
});

// instafeed
(function () {
    "use strict";
    //https://www.instagram.com/oauth/authorize/?client_id=a4fe31f78b1c4b968e85bd8ac636b296&redirect_uri=http://www.gtthetachi.org&response_type=token
    var run_instafeed = function () {
        var ig_embed_template = '<a class="ig-embed" ' +
            '   style="background-image:url(\'{{image}}\');" ' +
            '   href="{{link}}">' +
            ' <div class="ig-embed-desc">{{caption}}' +
            '   <div class="link-flair">Show on Instagram &raquo;</div>' +
            ' </div>' +
            '</a>'
            new Instafeed({
                get: 'user',
                userId: '2289423064',
                //TODO: stop using some random chinese dude's api key
                accessToken: '2235594321.1fb234f.58f38c5ed45e47e0aa1d9d5f4f39214e',
                //'3061977639.a4fe31f.91c81053c83b46aa96014a7b4392d872', // alexhirschberg access token
                template: ig_embed_template,
                resolution: 'standard_resolution',
                limit: 9,
                filter: function(image) {
                    if (image.caption && image.caption.text) {
                        var text = image.caption.text;
                        if (text.length > 100) {
                            text = text.slice(0, 100);
                            text = text.slice(0, text.lastIndexOf(" "));
                            text += "&hellip;"
                            image.caption.text = text;
                        }
                    }
                    return true;
                },
                error: function (e) {
                    console.error('Error fetching instagram data:', e)
                        $(instafeed).addClass('error');
                }
            }).run();   
    }

    // In case something funky happens where the Instafeed plugin isn't already
    // loaded, retry over a set amount of time
    var tries = 0;
    var instafunc = function () {
        if (typeof window['Instafeed'] === 'function') {
            run_instafeed();
        } else if (tries < 3) {
            console.log('Failed to load Instafeed, retrying in 300ms');
            setTimeout(instafunc, 300);
            tries++;
        } else {
            console.error('Failed to run Instafeed after ' + tries + ' tries.');
            $(instafeed).addClass('error');
        }
    }
    instafunc();
})()
