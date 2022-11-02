import { navbar } from "../nav.js";

navbar();
$(function() {
    $( "#dialog-upload-photo" ).dialog({
      autoOpen: false
    });

    $( ".card-upload-button" ).click(function() {
      $( "#dialog-upload-photo" ).dialog( "open" );
    });
  });
