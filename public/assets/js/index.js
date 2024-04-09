$(document).ready(function() {
    $("#categorySelect").change(function(e) {
        e.preventDefault();
        var categoryId = $(this).val();

        $.ajax({
            type: "GET",
            url: "/playlist/getPlaylistExists?categoryId=" + categoryId,
            success: function(response) {
                $("#playlistExists").empty();
                response.forEach(function(playlist) {
                    var listItem = $("<li>").text(playlist).addClass("list-group-item");
                    $("#playlistExists").append(listItem);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });

        $.ajax({
            type: "GET",
            url: "/playlist/getAllSongOfCategory?categoryId=" + categoryId,
            success: function(response) {
                $("#songTable tbody").empty();
                response.forEach(function(song) {
                    var row = $("<tr>");
                    var checkbox = $("<input>").attr("type", "checkbox").addClass("songCheckbox").data("song-id", song.id);
                    row.append($("<td>").append(checkbox));
                    row.append($("<td>").text(song.id));
                    row.append($("<td>").text(song.title));
                    $("#songTable tbody").append(row);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });

    $(document).on('change', '.songCheckbox', function() {
        var checkedSongs = [];
        $('.songCheckbox:checked').each(function() {
            checkedSongs.push($(this).data('song-id'));
        });
        $('#songIds').val(checkedSongs.join(','));
    });

    $("#formPlaylist").submit(function(event) {
        event.preventDefault();
        var form = $(this);
        $.ajax({
            url: "/playlist/upload",
            type: "POST",
            data: form.serialize(),
            success: function(response) {
                form.find("input[type=text], textarea").val("");
                $("#description").val("Playlist ~ By SoulSound")
                $('#result').html('<div class="alert alert-success" role="alert">Success</div>');
                $('.songCheckbox:checked').prop('checked', false);
                // Refresh playlist list after successful upload
                $("#categorySelect").trigger("change");
            },
            error: function(xhr, status, error) {
                $('#result').html('<div class="alert alert-danger" role="alert">Try Again with other data</div>');
            }
        });
    });

    $('#idAll').change(function() {
        var isChecked = $(this).prop('checked');
        $('#songTable tbody input[type=checkbox]').prop('checked', isChecked);
    });

});
