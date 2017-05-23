function createGroupItems(items, arrGroupNames, type)
{
	$('#'+type+'-block').empty();
	for (var i = 0; i < arrGroupNames.length; i++) {
		
		createUserGroup(type, arrGroupNames[i]);

		var groupID = arrGroupNames[i].replace(/ /g, '');

	    for (var j = 0; j < items.length; j++) 
        {
            var itemGnames = items[j]['gnames']
            if (itemGnames.length != 0) {
                for (var k = 0; k < itemGnames.length; k++) {
                    if (itemGnames[k]['title'] == arrGroupNames[i])
                    {
                        createUserItem(type, groupID, items[j]);
                    }
                }
            }
	    }
	}
}

function createUserGroup(type, groupName)
{
	var groupID = getGroupID(groupName);
	var str = '';
    str += '<div class="card">';
    str += '    <div class="card-header">'+groupName+'</div>';
    str += '    <div class="card-content">';

    if (type == 'video') {

        str += '        <div id="user'+type+groupID+'" class="card-content-inner">';

        str += '        </div>';

    }else if (type == 'meditation'){

        str += '        <div class="list-block media-list">';
        str += '            <ul id="user'+type+groupID+'">';

        str += '            </ul>';
        str += '        </div>';

    }

    str += '    </div>';
    str += '</div>';

    $('#'+type+'-block').append(str);
}
function createUserItem(type, groupID, item)
{
	if (item['show'] == "0") return;

	var str = '';
    if (type == 'video') {

        str += '    <h3>'+item['title']+'</h3>';
        str +=      item['content'];
        str += '    <div class="responsive-video full-bottom">';
        str += '        <iframe src="'+item['url']+'"></iframe>';
        str += '    </div> ';

    }else if (type == 'meditation'){

        var iconType = '';
        if (g_deviceType == 'Android') {
            iconType = 'fa-refresh fa-spin';
        }else{
            iconType = 'fa-play';
        }

        str += '    <li class="item-content">';
        str += '        <div class="item-media">';
        str += '            <i id="btn-audio-'+item['id']+'" class="fa '+iconType+' btn-audio fa-2x"></i>';
        str += '            <audio id="audio-'+item['id']+'" preload="auto" class="audios display-none" src="'+item['url']+'" onloadeddata="onAudioLoaded('+item['id']+')" onended="onAudioEnded('+item['id']+')"></audio>';
        str += '        </div>';
        str += '        <div class="item-inner">';
        str += '            <div class="item-title-row">';
        str += '                <div class="item-title white-space-normal">'+item['title']+'</div>';
        str += '            </div>';
        str += '            <div class="item-subtitle white-space-normal line-height20">'+item['content']+'</div>';
        str += '        </div>';
        str += '    </li>';
    }
    
    $$('#user'+type+groupID).append(str);
}

function onAudioLoaded(meditationID)
{
    var btnID = 'btn-audio-'+meditationID;
    if ( $('#'+btnID).hasClass('fa-refresh fa-spin') )
    {
        $('#'+btnID).removeClass('fa-refresh fa-spin');
        $('#'+btnID).addClass('fa-play');
    }
}

function onAudioEnded(meditationID)
{
    var btnID = 'btn-audio-'+meditationID;
    if ( $('#'+btnID).hasClass('fa-pause') )
    {
        $('#'+btnID).removeClass('fa-pause');
        $('#'+btnID).addClass('fa-play');
    }
}

function createNotes()
{
	childView.router.load({pageName: 'note'});

    $('#note-block').empty();

    if (JSON.parse(localStorage.getItem('notes')) == null) return;

    var notes = JSON.parse(localStorage.getItem('notes'));
    for (var i = 0; i < notes.length; i++) {
        var note = notes[i];
        var str = '';
        str += '<div class="card">';
        str += '    <div class="card-header font13">'+note['date']+'</div>';
        str += '    <div class="card-content">';
        str += '        <div class="card-content-inner">'+note['content']+'</div>';
        str += '    </div>';
        str += '    <div class="card-footer">';
        str += '        <a id="'+i+'" class="show-delete-bottom delete-note"><i class="fa fa-trash"></i> Slet</a>';
        str += '    </div>';
        str += '</div>';
        $('#note-block').append(str);
    }
}
function addNote()
{
	if ($$('#txt-note').val() == '')
	{
		myApp.alert('Please input field.', 'Empty field!');
		return;
	}
	var note = {
		'content' 	: $$('#txt-note').val(),
		'date'		: new Date()
	};

	var notes = [];
    if (JSON.parse(localStorage.getItem('notes')) != null)
    	notes = JSON.parse(localStorage.getItem('notes'));

    var str = '';
    str += '<div class="card">';
    str += '    <div class="card-header font13">'+note['date']+'</div>';
    str += '    <div class="card-content">';
    str += '        <div class="card-content-inner">'+note['content']+'</div>';
    str += '    </div>';
    str += '    <div class="card-footer">';
    str += '        <a id="'+notes.length+'" class="show-delete-bottom delete-note"><i class="fa fa-trash"></i> Delete</a>';
    str += '    </div>';
    str += '</div>';
    $('#note-block').append(str);

    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
    $$('#txt-note').val('');
}



