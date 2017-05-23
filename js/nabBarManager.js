
myApp.onPageReinit('home', function(page){
    trackGa('Front');
    $$('#user-nab-title').text(g_nabTitle['front']);
});
myApp.onPageReinit('video', function(page){
    trackGa('Video');
    $$('#user-nab-title').text(g_nabTitle['video']);
});
myApp.onPageReinit('meditation', function(page){
    trackGa('Meditation');
    $$('#user-nab-title').text(g_nabTitle['meditation']);
});
myApp.onPageReinit('note', function(page){
    trackGa('Note');
    $$('#user-nab-title').text(g_nabTitle['note']);
});
myApp.onPageReinit('profile', function(page){
    trackGa('Profile');
    $$('#user-nab-title').text('Profile');
});

myApp.onPageInit('home', function(page){
    trackGa('Front');
    $$('#user-nab-title').text(g_nabTitle['front']);
});
myApp.onPageInit('video', function(page){
    trackGa('Video');
    $$('#user-nab-title').text(g_nabTitle['video']);
});
myApp.onPageInit('meditation', function(page){
    trackGa('Meditation');
    $$('#user-nab-title').text(g_nabTitle['meditation']);
});
myApp.onPageInit('note', function(page){
    trackGa('Note');
    $$('#user-nab-title').text(g_nabTitle['note']);
});
myApp.onPageInit('profile', function(page){
    trackGa('Profile');
    $$('#user-nab-title').text('Profile');
});


