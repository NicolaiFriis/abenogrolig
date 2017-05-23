
var myApp = new Framework7({
    animateNavBackIcon:true,
    swipeBackPage: false
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main',{
    domCache: true
});

var childView = myApp.addView('.view-child',{
    domCache: true
});

$(document).ready(function(){
    //localStorage.setItem("notes", null);
    //localStorage.setItem("phoneNumber", null);

    myApp.showIndicator();
    $.ajax({url: "http://aaor.mijukaland.com/?json=get_posts&post_type=screen",
        method: 'GET',
        dataType: 'jsonp', 
        success: function(result){
            myApp.hideIndicator();
            if (result["status"] == "ok") {
                setPageData(result);

                if (JSON.parse(localStorage.getItem('phoneNumber')) != null){
                    var phoneNumber = JSON.parse(localStorage.getItem('phoneNumber'));
                    getPhoneListGroupNmae(phoneNumber);
                }else{                    
                    showInputDialogue();
                }
            }else{
                myApp.alert("Server connection failed!", "Failed!");
            }
       },
        error: function(xhr, textStatus, errorThrown){
            myApp.hideIndicator();
            myApp.alert("Server connection error!", "Error!");
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
});


var g_analytics = null;
var g_deviceType = '';
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady()
{
  document.addEventListener("resume", function() {}, false);
    
  document.addEventListener("pause", function() {}, false); 
  
  window.plugins.OneSignal
    .startInit("206a5f60-441b-476c-84bb-a7d2bad7f9ca")
	.inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
    .endInit();
	
    g_analytics = navigator.analytics;
    g_analytics.setTrackingId('UA-74952919-1');
    g_analytics.setDispatchInterval(1);

    if (device.platform == 'Android') {
        g_deviceType = 'Android';
        g_analytics.enableAdvertisingIdCollection(enableAdSuccess, enableAdError);
    }
    
	//alert();
}

$$('.btn-home-page').on('click', function(){
    gotoPage('home')
});
$$('.btn-video-page').on('click', function(){
    getItems('video');
    gotoPage('video')
});
$$('.btn-meditation-page').on('click', function(){
    getItems('meditation');
    gotoPage('meditation')
});
$$('.btn-note-page').on('click', function(){    
    createNotes();
    gotoPage('note')
});
$$('.btn-profile-page').on('click', function(){
    gotoPage('profile')
});
$$('.site-link').on('click', function(){
    window.open('http://xn--benogrolig-05a.dk/for-kursister/', '_system', 'location=no');    
})

function gotoPage(pageName)
{
    userAreaScrollToTop();
    closeFooterMenu();
    childView.router.load({pageName: pageName});
    setTimeout(function(){
        $('#video-block').empty();
        $('#meditation-block').empty();
    }, 100);
}

$$('#btn-add-note').on('click', function(){
    addNote();
});