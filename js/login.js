$(function () {
    // В кеш будем складывать список сотрудников
    // Ключем будет первые 3 введеные буквы
    var cache = {};

    // Настройка автокомплита
    $('#term').autocomplete({
        minLength: 3,
        source: function (request, response) {
            var termFull = replacer(request.term, true);
            var termShort = termFull.substr(0, 3)
            if (termShort in cache) {
                var cacheValues = cache[termShort];
                var result = cacheValues.filter(function (sotr) {
                    return sotr.label.toLowerCase().indexOf(termFull.toLowerCase()) !== -1;
                });
                response(result);
                return;
            }

            $.post("http://192.168.3.87:3000/autocomplete", { term: termShort })
                .done(function (data) {
                    cache[termShort] = data;
                    var result = data.filter(function (sotr) {
                        return sotr.label.toLowerCase().indexOf(termFull.toLowerCase()) !== -1;
                    });
                    response(result);
                });
        },
        select: function (event, ui) {
            event.target.setAttribute('tab', ui.item.tab);
        }
    })
        .autocomplete('instance')._renderItem = function (ul, item) {
            return $('<li>')
                .append('<a>' + item.label + '<br>' + item.desc + '</a>')
                .appendTo(ul);
        };
});

function replacer(text, engToRus) {
    let rus = "й ц у к е н г ш щ з х ъ ф ы в а п р о л д ж э я ч с м и т ь б ю".split(/ +/g),
        eng = "q w e r t y u i o p [ ] a s d f g h j k l ; ' z x c v b n m , .".split(/ +/g)
        ;
    let x;
    for (x = 0; x < rus.length; x++) {
        text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
        text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());
    }
    return text;
}

function login() {
    var tab = $('#term').attr('tab');
    var pass = $('#pass').val();

    $.ajax({
        url: 'http://192.168.3.87:3000/login',
        type: 'POST',
        data: { tab: tab, pass: pass },
        beforeSend: function () {
            $('.loader').attr('hidden', false);
            $('input[type=submit]').attr('disabled', true);
        },
        complete: function () {
            $('.loader').attr('hidden', true);
            $('input[type=submit]').attr('disabled', false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#pass').val('');
            webix.alert({
                type: "alert-error",
                text: jqXHR.responseText
            });
        },
        success: function (data) {
            // require('electron').shell.openExternal(`http://192.168.3.87:3000${data.redirect}`)            
            window.location.href = `http://192.168.3.87:3000${data.redirect}`
        }
    });
}