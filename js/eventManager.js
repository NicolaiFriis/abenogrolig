$$('#note-block').on('click', '.delete-note', function(){
	if (JSON.parse(localStorage.getItem('notes') == null)) return;
	var notes = JSON.parse(localStorage.getItem('notes'));
	notes.splice($$(this).attr('id'), 1);
	localStorage.setItem('notes', JSON.stringify(notes));
	createNotes();
});
$$('#meditation-block').on('click', '.btn-audio', function(){
    var btnID = $$(this).attr('id');
    var arrAttr = btnID.split('-');
    var audioID = arrAttr[1]+'-'+arrAttr[2];

    if ( $$(this).hasClass('fa-play') )
    {
        $$(this).removeClass('fa-play');
        $$(this).addClass('fa-pause');
        var audio = document.getElementById(audioID);
        audio.play();
    }else if ( $$(this).hasClass('fa-pause') ) {
        $$(this).removeClass('fa-pause');
        $$(this).addClass('fa-play');
        var audio = document.getElementById(audioID);
        audio.pause();
    }
});

function closeFooterMenu(){
    $('.footer-menu-close').fadeOut(350);
    $('.fm-1').delay(125).fadeOut(250); 
    $('.fm-2').delay(100).fadeOut(250); 
    $('.fm-3').delay(75).fadeOut(250); 
    $('.fm-4').delay(50).fadeOut(250); 
    $('.fm-5').delay(25).fadeOut(250); 
    $('.fm-6').delay(0).fadeOut(250); 
    $('.top-menu').removeClass('top-menu-active');        
    $('.menu-background').delay(250).fadeOut(350);
}

$$('#img-page-user-avatar').on('click', function(){
    navigator.camera.getPicture(
        function (imgURI) {
            $$('#img-page-user-avatar').attr("src", imgURI);
        },
        function (value) {
            myApp.alert(value, 'Failed.');
        },
        {
            quality: 100,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            targetWidth: 1024,
            targetHeight: 1024,
        }
    );
});







