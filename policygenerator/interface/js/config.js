/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

config.js starts the PrivacyFlash Pro interface; reads and analyzes the project files
 - Displays logo (on first load in session)
 - Displays disclaimer (on first load in browser)
 - Directory path dialog
 - Loading screen
*/


import { startWizard } from './wizard.js'
import { scrollIntoViewIfNeeded } from './utilities.js'
var displayHidden = false
var pathPrefix = "."

export function startGUI(){

  $('[data-toggle="tooltip"]').tooltip()
  $('[data-toggle="popover"]').popover()

  if (sessionStorage.getItem("boot") == null) {
    sessionStorage.setItem("boot", "true")
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

function disclaimer(){
  if (localStorage.getItem("disclaimer") == null) {
    $('#disclaimer').fadeIn('slow', function() {
      $('#disclaimer-btn').click(function() {
          localStorage.setItem("disclaimer", "agreed")
          inputPath();
      });
    });
  } else {
    inputPath();
  }
}

function inputPath(){
  $('#disclaimer').fadeOut('slow', function() {
    $('#disclaimer').remove();
    $('#directoryPicker').fadeIn('slow', function (){
      listDir()

      $('#selectPath').click(function(){
        eel.getCWD()(function(dir){
          $('#path').val(dir)
          $('#path').removeClass('invalid text-danger').addClass('focus')
          $('.validation').addClass('d-none')
        })
      })

      $('#enclosingDir').click(function(){
        eel.getCWD()(function(dir){
          let backtrack = dir.substring(0, dir.lastIndexOf("/"))
          if (backtrack == "") {
            backtrack = "/"
          }
          eel.updateCWD(backtrack)(function(value){
            listDir()
          })
        })
      })

      $('#hiddenDir').click(function(){
        if (displayHidden) {
          pathPrefix = "."
        } else {
          pathPrefix = ".."
        }
        displayHidden = !displayHidden
        listDir()
      })

      $('#generate').click(function(){
        let val = $('#path').val()
        eel.validate(val)(function(value){
          if (value) {
            spinner(val + "/")
          } else {
            $('#path').addClass('invalid text-danger').removeClass('focus')
            $('.validation').removeClass('d-none')
          }
        })
      })
    })
  }) 
}

function listDir() {
  eel.getCWD()(function(dir){

    //Change i to int!!!

    eel.getDirs(dir, pathPrefix)(function(dirList){
      let html = ""
      $.each(dirList, function(i, v) {
        html += '<button type="button" class="btn btn-light btn-block text-left" id="'+i+'dir"><img src="img/folder-outline.svg" height="18px" width="18px"/>&nbsp;&nbsp'+ v +'</button>'
      })
      $('#subdirectories').html(html)

      //Add listeners
      $.each(dirList, function(i, v) {
        let temp = dir+"/"+v
        if (dir == "/") {
          temp = "/"+v
        }

        $('#'+i+'dir').data("directory", temp)
        $('#'+i+'dir').off("click")
        $('#'+i+'dir').click(function(){
          let val = $(this).data("directory")
          eel.updateCWD(val)(function(value){
            listDir()
          })
        })
      })
    })

    let html = ""
    let pathList = (dir.split("/"))
    pathList.shift()
    let len = pathList.length - 1
    $.each(pathList, function(i, v){
      if (v != "") {
        if (i != len) {
          html += '<button type="button" class="btn btn-secondary btn-sm wrapper-helper" id="'+i+'path">'+ v +'</button> &nbsp;'
        } else {
          html += '<button type="button" class="btn btn-info btn-sm wrapper-helper" id="'+i+'path">'+ v +'</button> &nbsp;'
        }
      }
    })
    $('#selectedPath').html(html)

    //Add listeners
    let temp = ""
    $.each(pathList, function(i, v) {
      temp += "/" + v
      $('#'+i+'path').data("directory", temp) //Use this for everything!!!!
      $('#'+i+'path').data("directory", temp) //Use this for everything!!!!
      $('#'+i+'path').off("click")
      $('#'+i+'path').click(function(){
        let val = $(this).data("directory")
        eel.updateCWD(val)(function(value){
          listDir()

        })
      })
    })

  })
}

function spinner(input){
  $('#directoryPicker').fadeOut('slow', function() {
    $('#directoryPicker').remove();
    $('#spinner').fadeIn('slow', function(){
      eel.main(input)(function(value){
        let practices = value[0]
        let sdks = value[1]
        let sdkPractices = value[2]
        $('#spinner').fadeOut('slow', function() {
          startWizard(practices, sdks, sdkPractices)
        })
      })
    })
  })
}

eel.expose(analyzingData);
function analyzingData(){
  $('#process').html("Analyzing Data...")
  return
}

eel.expose(preparingPoicy);
function preparingPoicy(){
  $('#process').html("Preparing Privacy Policy...")
  return
}