var URL_SERVER = "https://c50580.sgvps.net/~anettet4/";

var URL_GET_USER = URL_SERVER+"?json=get_posts&post_type=userlist&count=500";

var URL_VIDEO_GROUP = URL_SERVER+"?json=get_videogroup_index&count=500";
var URL_MEDITATION_GROUP = URL_SERVER+"?json=get_meditationgroup_index&count=500";

//Cookie
var URL_GENERATE_AUTH_COOKIE = URL_SERVER + "api/user/generate_auth_cookie/?";

//User Register Nonce
var URL_REGISTER_NONCE = URL_SERVER+"api/get_nonce/?controller=user&method=register";

//User Register
var URL_USER_REGISTER = URL_SERVER+"api/user/register/?nonce=";

//User Login
var URL_USER_LOGIN = URL_SERVER+"api/user/generate_auth_cookie/?";

//CUD Nonce
var URL_CREATENONCE = URL_SERVER+"api/get_nonce/?controller=posts&method=create_post&cookie=";
var URL_UPDATENONCE = URL_SERVER+"api/get_nonce/?controller=posts&method=update_post&cookie=";
var URL_DELETENONCE = URL_SERVER+"api/get_nonce/?controller=posts&method=delete_post&cookie=";

//Avatar
var URL_AVATAR = URL_SERVER+"api/user/get_avatar/?type=full&user_id=";

//CRUD App page URLs
var URL_GET_SCREEN_DATA = URL_SERVER+"?json=get_posts&post_type=screen";
var URL_CREATE_APP_PAGES = URL_SERVER+"api/posts/create_post/?type=screen&status=publish&nonce=";
var URL_UPDATE_APP_PAGES = URL_SERVER+"api/posts/update_post/?post_type=screen&nonce=";

//Get URLs
var URL_GET_VIDEO = URL_SERVER+"?json=get_posts&post_type=video&count=500";
var URL_CREATE_VIDEO = URL_SERVER+"api/posts/create_post/?type=video&status=publish&nonce=";
var URL_UPDATE_VIDEO = URL_SERVER+"api/posts/update_post/?post_type=video&nonce=";


var URL_GET_MEDITATION = URL_SERVER+"?json=get_posts&post_type=meditation&count=500";
var URL_CREATE_MEDITATION = URL_SERVER+"api/posts/create_post/?type=meditation&status=publish&nonce=";
var URL_UPDATE_MEDITATION = URL_SERVER+"api/posts/update_post/?post_type=meditation&nonce=";

//global variables
var g_currentUser = {};

var g_cookie = "";
var g_createNonce = "";
var g_updateNonce = "";
var g_deleteNonce = "";

var g_nabTitle = {};

var g_dialogueTitle = 'Indtast venligst dit telefonnummer.';
var g_dialogueDescription = 'Hvad er dit telefonnummer?';



function setPageData(result)
{
    g_nabTitle = {};
    for (var i = 0; i < result['count']; i++){
        var post = result['posts'][i];

        if (post['custom_fields']['screenname'] == 'dialogue') {
            g_dialogueTitle = post['title'];
            g_dialogueDescription = post['content'];
        }else{
            g_nabTitle[post['custom_fields']['screenname']] = post['title'];
            $$('#lbl-'+post['custom_fields']['screenname']+'-welcome').html(post['content']);
            $$('#user-nab-title').text(g_nabTitle['front']);

            if (post['title'] != 'front') setButtonLabel(post['custom_fields']['screenname'], post['title']);
        }
    }
    $$('#user-nab-title').text(g_nabTitle['front']);
}

function setButtonLabel(pageName, buttonName)
{
    var buttons = $$(".lbl-"+pageName);
    for (var i = buttons.length - 1; i >= 0; i--) {
        var button = buttons[i];
        button.firstChild.nodeValue = buttonName;
    }
}
// function setProfilePage()
// {
//     $$('#lbl-name').text(g_currentUser['email']);
//     $$('#lbl-address').text(g_currentUser['address']);

//     $$('#txt-name').val(g_currentUser['name']);
//     $$('#txt-email').val(g_currentUser['email']);
//     $$('#txt-phone').val(g_currentUser['phonenumber']);
//     $$('#txt-address').val(g_currentUser['address']);
// }

function showInputDialogue()
{
    myApp.prompt(g_dialogueDescription, g_dialogueTitle,
        function (value) {
            localStorage.setItem('phoneNumber', JSON.stringify(value));
            getPhoneListGroupNmae(value);
			  var phone_number = JSON.parse(localStorage.getItem('phoneNumber'));
			  window.plugins.OneSignal.getIds(function(ids) {
			  //console.log('getIds: ' + JSON.stringify(ids));
			  //alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);
			  $.ajax({url: "https://c50580.sgvps.net/~anettet4/cron/set_player.php",
					method: 'POST',
					data: {'player_id': ids.userId,'phoneNumber': phone_number,},
					dataType: 'json',
					success: function(result){},
					error: function(xhr, textStatus, errorThrown){}
				});
			  });

        },function (value) {
            g_currentUser = null;
            mainView.router.load({pageName: 'main'});
        }
    );
}
function getPhoneListGroupNmae(phoneNumber)
{
    myApp.showIndicator();
    $.ajax({url: URL_GET_USER,
        method: 'GET',
        dataType: 'jsonp',
        success: function(result){
            myApp.hideIndicator();
            if (result["status"] == "ok")
            {
                g_currentUser = null;

                for (var i = 0; i < result['count']; i++)
                {
                    var post = result['posts'][i];
                    if(typeof post['custom_fields']['phone_number'] !== 'undefined' && post['custom_fields']['phone_number'] && post['custom_fields']['phone_number'].constructor === Array)
                    {
                        var phoneNumber = post['custom_fields']['phone_number'][0];
                        var phonelistgroup = post['taxonomy_phonelistgroup'];

                        if (phoneNumber == post['custom_fields']['phone_number'][0])
                        {
                            var address = "";
                            var email = "";
                            if(typeof post['custom_fields']['address'] !== 'undefined' && post['custom_fields']['address'] && post['custom_fields']['address'].constructor === Array){
                                address = post['custom_fields']['address'][0];
                            }
                            if(typeof post['custom_fields']['email'] !== 'undefined' && post['custom_fields']['email'] && post['custom_fields']['email'].constructor === Array){
                                email = post['custom_fields']['email'][0];
                            }
                            g_currentUser = {
                                'id'                : post['id'],
                                'name'              : post['title'],
                                'address'           : address,
                                'email'             : email,
                                'phonenumber'       : phoneNumber,
                                'phonelistgroup'    : phonelistgroup,
                            };
                            //setProfilePage();
                        }

                    }
                }
                mainView.router.load({pageName: 'main'});
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
}

function trackGa(action)
{
    if (g_currentUser == null) return;
    for (var i = g_currentUser['phonelistgroup'].length - 1; i >= 0; i--) {
        var gName = g_currentUser['phonelistgroup'][i]['title'];

        // window.analytics.trackEvent(gName, 'Visit '+action+' page.');
        // window.analytics.trackTiming(gName, 1000);
        // window.analytics.trackView(action+' page');


        if (g_analytics != null) {
            g_analytics.customDimension(1, gName);
            g_analytics.sendAppView(action+' page', trackSuccess, trackError);
            g_analytics.sendEvent(gName, 'Visit '+action+' page.');
        }




        //window.analytics.trackEvent('Category', 'Action', 'Label', Value);
        //window.analytics.trackTiming('Category', IntervalInMilliseconds, 'Variable', 'Label');
        //window.analytics.setUserId('my-user-id');
        //window.analytics.debugMode();
        //window.analytics.addCustomDimension('Key', 'Value', success, error);
    }
}
function enableAdSuccess()
{
    //myApp.alert('ad enable success');
}
function enableAdError(r)
{
    //myApp.alert(r, 'ad enable error');
}
function trackSuccess()
{
    //myApp.alert('track success');
}
function trackError(r)
{
    //myApp.alert(r, 'track error');
}

function getItems(type)
{
    var tmpURL = '';
    if (type == 'video')
        tmpURL = URL_VIDEO_GROUP;
    else
        tmpURL = URL_MEDITATION_GROUP;
    myApp.showIndicator();
    $.ajax({url: tmpURL,
        method: 'GET',
        dataType: 'jsonp',
        success: function(result){
            if (result["status"] == "ok") {
                if (result["count"] == 0) {
                    myApp.hideIndicator();
                    childView.router.load({pageName: type});
                    return;
                }
                var arrGname = [];
                for (var i = 0; i < result['count']; i++){
                    var group = result['groups'][i];
                    arrGname.push(group['title']);
                }
                getGroupItems(arrGname, type);
            }else{
                myApp.hideIndicator();
                myApp.alert("Server connection failed!", "Failed!");
            }
       },
        error: function(xhr, textStatus, errorThrown){
            myApp.hideIndicator();
            myApp.alert("Server login error!", "Error!");
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
function getGroupItems(gNames, type)
{
    var tmpURL = '';
    if (type == 'video') {
        tmpURL = URL_GET_VIDEO;
    }else{
        tmpURL = URL_GET_MEDITATION;
    }
    $.ajax({url: tmpURL,
        method: 'GET',
        dataType: 'jsonp',
        success: function(result){
            myApp.hideIndicator();
            if (result["status"] == "ok") {
                if (result["count"] == 0) {
                    childView.router.load({pageName: type});
                    return;
                }
                var items = [];
                var arrGname = [];
                for (var i = 0; i < result['count']; i++){
                    var post = result['posts'][i];
                    var item = {
                        'id'        : post['id'],
                        'title'     : post['title'],
                        'content'   : post['content'],
                        'url'       : post['custom_fields']['url'][0],
                        'show'      : post['custom_fields']['show'][0],
                        'gnames'    : post['taxonomy_'+type+'group'],
                    };
                    items.push(item);
                }
                childView.router.load({pageName: type});
                createGroupItems(items, gNames, type);
            }else{
                myApp.alert("Server connection failed!", "Failed!");
            }
       },
        error: function(xhr, textStatus, errorThrown){
            myApp.hideIndicator();
            myApp.alert("Server login error!", "Error!");
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}



//global functions
function getAuthenticatedURL(url)
{
	return url+"&cookie="+g_cookie;
}
function validateEmail(email)
{
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function getGroupID(strGroupname)
{
    return strGroupname.replace(/ /g, '');
}
function userAreaScrollToTop()
{
    $('#user-scroll-page').animate({
        scrollTop:0
    }, 0, 'easeInOutQuad');
}


//gernarate auth cookie nonce
function getGenerateAuthCookieNonce()
{
	var username = $$('#login-username').val();
	var password = $$('#login-password').val();

	var url_cookie = URL_GENERATE_AUTH_COOKIE+"username="+username+"&password="+password;
	myApp.showIndicator();
	$.ajax({url: url_cookie,
        method: 'GET',
        dataType: 'jsonp',
        success: function(result){
       		myApp.hideIndicator();
        	if (result["status"] == "ok") {
        		g_cookie = result["cookie"];
        		getCUDNonces();
        		setAvatar(result["user"]["id"], 'admin');
        		$$('#btn-back').hide();

        		mainView.router.load({pageName: 'admin'});
        	}else{
        		myApp.alert("Failed login as admin!", "Failed!");
        	}
       },
        error: function(xhr, textStatus, errorThrown){
        	myApp.hideIndicator();
            myApp.alert("Server login error!", "Error!");
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
//CRUD nonce
function getCUDNonces()
{
	var tmpURL_CreateNonce = getAuthenticatedURL(URL_CREATENONCE);
	$.ajax({url: tmpURL_CreateNonce,
        method: 'GET',
        dataType: 'jsonp',
        success: function(result){
        	g_createNonce = result["nonce"];
       },
        error: function(xhr, textStatus, errorThrown){
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

	var tmpURL_UpdateNonce = getAuthenticatedURL(URL_UPDATENONCE);
	$.ajax({url: tmpURL_UpdateNonce,
        method: 'GET',
        dataType: 'jsonp',
        success: function(result){
        	g_updateNonce = result["nonce"];
        },
        error: function(xhr, textStatus, errorThrown){
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

	var tmpURL_DeleteNonce = getAuthenticatedURL(URL_DELETENONCE);
	$.ajax({url: tmpURL_DeleteNonce,
        method: 'GET',
        dataType: 'jsonp',
        success: function(result){
        	g_deleteNonce = result["nonce"];
        },
        error: function(xhr, textStatus, errorThrown){
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
//avatar
function setAvatar(id, permission)
{
	var tmpURL = URL_AVATAR+id;
	$.ajax({url: tmpURL,
        method: 'GET',
        dataType: 'jsonp',
        success: function(result){
       		myApp.hideIndicator();
        	if (result["status"] == "ok") {
        		var url = result["avatar"];
                if (permission == 'admin') {
                    var imgAvatar = document.getElementById('img-admin-avatar');
                    imgAvatar.setAttribute('src', "http:"+url);
                }else if (permission == 'user'){
                    var imgAvatar = document.getElementById('img-page-user-avatar');
                    imgAvatar.setAttribute('src', "http:"+url);
                    //var imgAvatar = document.getElementById('img-logo-user-avatar');
                    //imgAvatar.setAttribute('src', "http:"+url);
                }

        	}else{
        		//myApp.alert("Failed login as admin!", "Failed!");
        	}
       },
        error: function(xhr, textStatus, errorThrown){
        	myApp.hideIndicator();
            myApp.alert("Server login error!", "Error!");
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
// function uploadUserAvatar()
// {
//     var date = new Date();

//     var imgURI = $$('#img-page-user-avatar').attr("src");

//     var options = new FileUploadOptions();
//     options.fileKey = 'file';
//     options.fileName = 'user-' + date.getTime() + '.jpg';
//     options.mimeType = 'image/jpeg';

//     var ft = new FileTransfer();
//     ft.upload(
//         imgURI,
//         encodeURI(URL_SERVER+'upload-avatars.php'),
//         function (response) {
//             myApp.alert('avatar upload success');
//         },
//         function (response) {
//             myApp.alert('avatar upload failed');
//         }
//     );
// }
