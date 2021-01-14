/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

config.js starts the PrivacyFlash Pro interface; reads and analyzes the project files
 - Displays logo (on first load in session)
 - Displays disclaimer (on first load in browser)
 - Directory path dialog
 - Loading screen
*/

import { startWizard } from "./wizard.js";

export async function startGUI() {
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();

  let result = await showBootLogo()

  if (result) {
    $('#boot').fadeIn('slow', function() {
    setTimeout(function() {
      $('#boot').fadeOut('slow', function() {
        disclaimer()
      })}, 1500);
    })
  } else {
    disclaimer()
  }
}

async function disclaimer() {
  let result = await readDisclaimer()
  if (!result) {
    $("#disclaimer").fadeIn("slow", function () {
      $("#disclaimer-btn").click(function () {
        updateDisclaimer()
        inputPath();
      });
    });
  } else {
    inputPath();
  }
}

function inputPath() {
  $("#disclaimer").fadeOut("slow", function () {
      
      $("#disclaimer").remove();
      $("#directoryPicker").fadeIn("slow", function () {

        $("#path").click(async function () {
          const dir = await showFolderDialog()
          if (dir != null && dir.length !== 0) {
            $("#path").val(dir);
            $("#path").removeClass("invalid text-danger").addClass("focus");
            $(".validation").addClass("d-none");
          }
         })

        $("#generate").click(async function () {
          let val = $("#path").val();
          const result = await validate(val)

            if (result) {
              spinner(val + "/");
            } else {
              $("#path").addClass("invalid text-danger").removeClass("focus");
              $(".validation").removeClass("d-none");
            }

        });
      });
    });
}

function spinner(input) {
  $("#directoryPicker").fadeOut("slow", function () {
    $("#directoryPicker").remove();
    $("#spinner").fadeIn("slow", async function () {
      const result = await main(input)
      let practices = result[0];
      let sdks = result[1];
      let sdkPractices = result[2];
      $("#spinner").fadeOut("slow", function () {
        startWizard(practices, sdks, sdkPractices);
      });
    });
  });
}
