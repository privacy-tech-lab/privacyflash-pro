/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

utilities.js contains helper functions
*/


// Technical permission names
export const permissions = ["LOCATION", "CAMERA", "CONTACTS", "MICROPHONE",
  "PHOTOS", "CALENDAR", "HEALTH", "MUSIC", "BLUETOOTH", "MOTION", "REMINDERS",
  "SPEECH", "HOMEKIT", "TRACKING"]
 
/**
* @desc get proper name of permission from technical name
* @params (permission : string) - 
* @return string - proper name of permission 
*/
export function decodePermission(permission){
  const names = {"LOCATION": "Location Services", "CAMERA": "Camera",
    "CONTACTS": "Contacts", "MICROPHONE": "Microphone", "PHOTOS": "Photos",
    "CALENDAR": "Calendars", "HEALTH": "Health", "MUSIC": "Media & Apple Music",
    "BLUETOOTH": "Bluetooth", "MOTION": "Motion & Fitness",
    "REMINDERS": "Reminders", "SPEECH": "Speech Recognition",
    "HOMEKIT": "HomeKit", "TRACKING": "Tracking"}
  if (permission in names) {
    return names[permission]
  } else {
    return permission
  }
}

/**
* @desc smooth scrolls to element with id if not in view
* @params id - id attribute
* @return void
*/
export function scrollIntoViewIfNeeded(id) {
    let node = document.getElementById(id)
    if (node != null) {
      scrollIntoView(node, {
        behavior: 'smooth',
        scrollMode: 'if-needed',
      })
    }
}

/**
* @desc update all "app name" fields in wizard and policy
* @params n/a
* @return void
*/
export function updateAppName(){
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
}

/**
* @desc adds permission buttons to wizard
* @params (id : string, party : string) where "id" is the html tag where the
*         permission buttons should be injected and "party" specifies whether
*         its first party "fp" or third party "tp"
* @return void
*/
export function injectPermissionButtons(id, party) {
  let html = ""
  $.each(permissions, function(index, value) {
    html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-secondary-alt `+party+`"
        id="` + value + party + `btn">
        <img
        style="display: none;"
        src="img/checkmark-circle.svg"
        height="18px"
        width="18px"
        id="`+ value + party +`img"/>
        ` + decodePermission(value) + `
      </button>
    `
  })
  $('#' + id).html(html)
}

export function scrollHorizontalEnd(element) {
  let width = document.getElementById(element).scrollWidth
  $('#'+element).animate( { scrollLeft: '+=' + width }, 500);
}

// Smooth scroll to links
export function smoothScroll(){
  document.getElementById('main').querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (!anchor.classList.contains('badge') && anchor.href.slice(-1) != "#") {
      $(anchor).off()
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
    }
  });
};

export function autoSizeTextArea(){
  function autosize(){
    var el = this;
    setTimeout(function(){
      el.style.cssText = 'height:auto; padding:0';
      // for box-sizing other than "content-box" use:
      // el.style.cssText = '-moz-box-sizing:content-box';
      el.style.cssText = 'height:' + el.scrollHeight + 'px';
    },0);
  }
  document.getElementById('main').querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('keydown', autosize);   
  });
};

// Initialize core functionalities
export function utilities() {
  smoothScroll()
  autoSizeTextArea()
}