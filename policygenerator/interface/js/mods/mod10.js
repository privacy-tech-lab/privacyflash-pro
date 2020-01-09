/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod10.js adds and controls functionality of wizard and policy
  (Section 10 of the wizard and policy)
*/


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

}

/**
* @desc "sets the default content in the policy"
* @params n/a
* @return void
*/
function setContent() {
  let html = `
  <p>We use encryption to protect personal information stored and transmitted online. Only personnel who need the personal information to perform a specific function have access to such. The computers and servers on which we store personal information are kept in a secure environment.</p>
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
  updateWizard()
}
