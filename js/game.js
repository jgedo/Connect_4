$(document).ready(function() {
    let searchParams = new URLSearchParams(window.location.search);
    var connect4;

    if (searchParams.has('playMode') && searchParams.has('rows') && searchParams.has('cols') && 
    searchParams.has('backgroundColor') && searchParams.has('player1Color') && searchParams.has('player2Color') && searchParams.has('difficulty')) {
        connect4 = new Connect4("#connect4",searchParams.get('rows'), searchParams.get('cols'), searchParams.get('playMode'),
        searchParams.get('backgroundColor'), searchParams.get('player1Color'), searchParams.get('player2Color'),searchParams.get('difficulty'));
    } else {
        connect4 = new Connect4("#connect4",6, 7, 1, "#9d9d9d", "#ff0000", "#ffff00", 2);
    }

    // Modal management
    //$("#myModal").css("display", "block");

    // When the user clicks on <span> (x), close the modal
    $(".close").on("click", function () {
        $("#myModal").css("display", "none");
    });

    $("#btnRematch").on("click", function () {
        connect4.initializeGame();
        $("#myModal").css("display", "none");
    });

    $("#btnMenu").on("click", function () {
        document.location.href="index.html";
    });

    $("#modalBtnRematch").on("click", function () {
        connect4.initializeGame();
        $("#myModal").css("display", "none");
    });

    $("#modalBtnMenu").on("click", function () {
        document.location.href="index.html";
    });

});