/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod_header.js adds and controls functionality of the header of the wizard 
  and policy
  - "Let's Get Started" Section
  - Back button
  - Export policy to html
*/


import { scrollIntoViewIfNeeded, smoothScroll } from './../utilities.js'

/**
* @desc back button - removes wizard and policy from view and reloads
*       interface to directory picker dialog
* @params n/a
* @return void
*/
function btnBack() {
  $('#mod-0w-back').click(function(){
    $('.footer').removeClass('slide4').addClass('slide3')
    setTimeout(function() {
      $('#policy').addClass('slide2').removeClass('slide')}, 150);
    setTimeout(function() {
      $('#wizard').fadeOut('slow', function(){
        location.reload()
      })}, 300);
  })
}

/**
* @desc get today's date and update policy
* @params n/a
* @return void
*/
function updateDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  $('#mod-0p-date').text(today);
}

/**
* @desc on text input update all "app name" fields in wizard and policy
* @params n/a
* @return void
*/
function updateAppName(){
  $('#mod-0w-app').on('input', function(){
    let value = $('#mod-0w-app').val()
    if (value == "") {
        $('.app-name').each(function() {
          $(this).css('opacity', .25)
          $(this).text("<App Name>")
          $('#mod-0w-app').removeClass('focus')
        })
    } else {
      $('.app-name').each(function() {
        $(this).css('opacity', 1)
        $(this).text(value)
        $('#mod-0w-app').addClass('focus')
      })
    }
  })
  $('.app-name').each(function() {
    $(this).css('opacity', .25)
    $(this).text("<App Name>")
  })
}

/**
* @desc on text input update previous versions url;
*       if no text in input, do not display in policy
* @params n/a
* @return void
*/
function updateVersionURL () {
  $('#mod-0w-url').on('input', function() {
    let value = $('#mod-0w-url').val()
    if (value == "") {
      $('#mod-0p-url').html('')
      $('#mod-0w-url').removeClass('focus')
    } else {
      $('#mod-0p-url').html(`
        Previous <a id="mod-0p-link" target="_blank">versions</a>
      `)
      $('#mod-0p-link').attr("href", value)
      $('#mod-0w-url').addClass('focus')
    }
    scrollIntoViewIfNeeded('mod-0p-url')
  })
}

/**
* @desc downloads innerhtml from elId
* @params (filename, elId, mimeType) - ...
* @return void
*/
function downloadInnerHtml() {
  let html = configurePolicy()
  html = '<html lang="en-US">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"></meta>\n' +
      '<title>Privacy Policy for the <span class="app-name"></span> Mobile app </title>\n' +
      html +
      '<small>This privacy policy was generated with <a href="https://github.com/privacy-tech-lab/privacyflash-pro" target="_blank">PrivacyFlash Pro</a></small>'+
      '\n</html>'
  return html
}

function configurePolicy() {
  let count = 1
  let linksDefault = $('#links').html()
  let mod5pDefault = $('#sec-title-5P').html()
  let mod6pDefault = $('#sec-title-6P').html()
  let exclude5p = ""
  let exclude6p = ""

  if ($('#sec-title-5P').hasClass('exclude')) {
    $('#sec-title-5P').remove()
    $('#mod-5p-link').remove()
    exclude5p = "class='exclude'"
  }
  if ($('#sec-title-6P').hasClass('exclude')) {
    $('#sec-title-6P').remove()
    $('#mod-6p-link').remove()
    exclude6p = "class='exclude'"
  }
  $('.num').each(function(){
    $(this).html(count)
    count ++
  })
  let html = document.getElementById('policy').innerHTML
  $('#links').html(linksDefault)
  if (exclude5p != "") {
    $('<div '+ exclude5p +' id="sec-title-5P">' + mod5pDefault + '</div>').
    insertAfter('#sec-title-4P')
  }
  if (exclude6p != "") {
    $('<div '+ exclude6p +' id="sec-title-6P">' + mod6pDefault + '</div>').
    insertAfter('#sec-title-5P')
  }
  count = 1
  $('.num').each(function(){
    $(this).html(count)
    count ++
  })
  return html
}

/**
* @desc button to export privacy policy; brings in exported page
* @params n/a
* @return void
*/
function btnExportPolicy() {
  $('#mod-0w-export').off('click')
  $('#mod-0w-export').click(async function() {
    let appName = $('#mod-0w-app').val()
    let filename = 'Privacy Policy.html';
    if (appName.length !== 0) filename = appName +' Privacy Policy.html';
    let data = downloadInnerHtml();
    let result = await saveFileDialog(filename, data)
    if (!result) return
    $('#laws').fadeOut('fast')
  setTimeout(function() {
    $('#policy').addClass('slide2').removeClass('slide')}, 150);
  setTimeout(function() {
    $('#wizard').fadeOut('slow', async function(){
      $('#exported').fadeIn('slow',)
      })}, 300);
  })
  $('#back-to-wizard').click(function(){
    $('#exported').fadeOut('slow', function() {
      setTimeout(function() {
        $('#policy').removeClass('slide2').addClass('slide')}, 50);
      setTimeout(function() {
        $('#wizard').fadeIn('slow')}, 300);
    })
  })
}

function btnLaws() {
  $( "#laws" ).load( "../laws.html" , function (){
    (document.getElementById('laws')).querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: $(anchor.getAttribute('href')).offset().top
      }, 'slow');
    });
    });
    $('#btn-back-laws').click(function(){
      $('#laws').fadeOut('slow', function(){
        setTimeout(function() {
          $('#policy').removeClass('slide2').addClass('slide')}, 50);
        setTimeout(function() {
          $('#wizard').fadeIn('slow')}, 300);
        $('body').css('overflow', 'hidden')
        })
  
    })
  })
  $('#mod-0w-laws').click(function(){
    $('#exported').fadeOut('fast')
    setTimeout(function() {
      $('#policy').addClass('slide2').removeClass('slide')}, 150);
    setTimeout(function() {
      $('#wizard').fadeOut('slow', function(){
        $('#laws').fadeIn('slow',)
        $('body').css('overflow', 'auto')
        })}, 300);

  })
}

/**
* @desc loads current mod (module)
* @params n/a
* @return void
*/
export function modHeader() {
  updateDate()
  updateAppName()
  updateVersionURL()
  btnBack()
  btnExportPolicy()
  $('#mod-0w-title').click(function() {
    scrollIntoViewIfNeeded('mod-0p')
  })
  btnLaws()
}