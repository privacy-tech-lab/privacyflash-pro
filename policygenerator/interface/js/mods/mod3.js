/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod3.js adds and controls functionality of wizard and policy
  (Section 3 of the wizard and policy)
*/


import { practices } from '../wizard.js'
import { updateAppName} from '../utilities.js'
import { syncMod5 } from './mod5.js'


function updatePolicy(){
  let html1 = '<p>You can sign into <span class="app-name"></span> via Facebook and Google, in which case we will receive personal information from your Facebook and Google accounts. You can review and set which personal information we will receive at the time of the login. Also, Facebook and Google will receive various information from us about you (e.g., that you are a user of <span class="app-name"></span>). The privacy policy of Facebook and Google contains more information on this sharing of personal information. View Facebook\'s policy <a href="https://www.facebook.com/privacy/explanation" target="_blank" >here.</a> View Google\'s policy <a href="https://policies.google.com/privacy?hl=en" target="_blank">here.</a></p>'
  let html2 = '<p>You can sign into <span class="app-name"></span> via Facebook, in which case we will receive personal information from your Facebook account. You can review and set which personal information we will receive at the time of the login. Also, Facebook will receive various information from us about you (e.g., that you are a user of <span class="app-name"></span>). The privacy policy of Facebook contains more information on this sharing of personal information. View Facebook\'s policy <a href="https://www.facebook.com/privacy/explanation" target="_blank" >here.</a></p>'
  let html3 = '<p>You can sign into <span class="app-name"></span> via Google, in which case we will receive personal information from your Google account. You can review and set which personal information we will receive at the time of the login. Also, Google will receive receive various information from us about you (e.g., that you are a user of <span class="app-name"></span>). The privacy policy of Google contains more information on this sharing of personal information. View Google\'s policy <a href="https://policies.google.com/privacy?hl=en" target="_blank">here.</a></p>'
  let html4 = '<p><span class="app-name"></span> does not use any social login functionality. </p>'

  if ($("#mod-3w-r0-yes").prop("checked") && 
    $("#mod-3w-r1-yes").prop("checked")) {
    $('#mod-3p-content').html(html1);
    syncMod5(true)
  } else if ($("#mod-3w-r0-yes").prop("checked")) {
    $('#mod-3p-content').html(html2);
    syncMod5(true)
  } else if ($("#mod-3w-r1-yes").prop("checked")) {
    $('#mod-3p-content').html(html3);
    syncMod5(true)
  } else {
    $('#mod-3p-content').html(html4);
    syncMod5(false)
  }
  updateAppName();
}

function updateWizard(){

  $('#mod-3w-r0-yes').click(function(){
    updatePolicy()
  })
  $('#mod-3w-r0-no').click(function(){
    updatePolicy()
  })
  $('#mod-3w-r1-yes').click(function(){
    updatePolicy()
  })
  $('#mod-3w-r1-no').click(function(){
    updatePolicy()
  })

  if (practices["FACEBOOK"]["used"] == true) {
    $("#mod-3w-r0-yes").prop("checked", true);
  } else {
    $("#mod-3w-r0-no").prop("checked", true);
  }
  if (practices["GOOGLE"]["used"] == true) {
    $("#mod-3w-r1-yes").prop("checked", true);
  } else {
    $("#mod-3w-r1-no").prop("checked", true);
  }

}

export function mod3() {
  updateWizard();
  updatePolicy()
}
