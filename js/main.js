$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();

    $('#backgroundColor').on('change', function () {
        $('#containerMainMenu').css('background-color',this.value);
    });

    $('#player1Color').on('change', function () {
        $('.examplePlayerOne').css('background-color',this.value);
    });

    $('#player2Color').on('change', function () {
        $('.examplePlayerTwo').css('background-color',this.value);
    });

    $('#playMode1').on('click', function () {
        $('#difficultyFieldset').css('display','none');
    });

    $('#playMode2').on('click', function () {
        $('#difficultyFieldset').css('display','block');
    });
});