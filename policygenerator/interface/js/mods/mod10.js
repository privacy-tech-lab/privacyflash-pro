/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod10.js adds and controls functionality of wizard and policy
  (Section 10 of the wizard and policy)
*/


import { updateAppName } from '../utilities.js'

/**
* @desc "adds text input listener to input field"
* @params n/a
* @return void
*/
function updateWizard() {
  $('#mod-10w-input').on('input', function(){
    updatePolicy()

    let inputText = $(this).val()
    if (inputText != "") {
      $(this).addClass('focus')
    } else {
      $(this).removeClass('focus')
    }
  })
}

/**
* @desc "updates policy based on text input"
* @params n/a
* @return void
*/
function updatePolicy() {
  let text = $('#mod-10w-input').val()
  if (text != "") {
    $('#mod-10p-content').html(`<p>` + text +`</p>`)
  } else {
    setContent()
  }
  updateAppName()

}

/**
* @desc "sets the default content in the policy"
* @params n/a
* @return void
*/
function setContent() {
  let html = `
  <p>When we make material changes to this privacy policy, for example, due to app updates or changes in the law, we will post the updated policy here. The policy will always apply in the version at the time of your use of <span class="app-name"></span> even if you downloaded <span class="app-name"></span> at a time when a previous policy version was applicable.</p>
  `
  $('#mod-10p-content').html(html)
}

/**
* @desc "code will execute when the wizard launches"
* @params n/a
* @return void
*/
export function mod10() {
    setContent()
    updateAppName()
    updateWizard()
}
