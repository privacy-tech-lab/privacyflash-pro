/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod5.js adds and controls functionality of wizard and policy 
  (Section 5 of the wizard and policy)
*/


import { practices } from '../wizard.js'
import { updateAppName} from '../utilities.js'

function updatePolicy(){
  let html1 = '<p><span class=" app-name"></span> offers in-app purchases. However, any in-app purchase is processed by Apple via the App Store and your App Store account. In particular, we will not store your credit card or other payment information on our servers.</p>'
  let html2 = '<p><span class="app-name"></span> does not process any in-app purchase information.</p>'
  if ($("#mod-4w-r0-yes").prop("checked")) {
    $('#mod-4p-content').html(html1);
  } else {
    $('#mod-4p-content').html(html2);
  }
  updateAppName();
}

function updateWizard(){

  $('#mod-4w-r0-yes').click(function(){
    updatePolicy()
  })
  $('#mod-4w-r0-no').click(function(){
    updatePolicy()
  })

  //Set default
  if (practices["PURCHASES"]["used"] == true) {
    $("#mod-4w-r0-yes").prop("checked", true);
  } else {
    $("#mod-4w-r0-no").prop("checked", true);
  }

}

export function mod4() {
  updateWizard();
  updatePolicy()
}