/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod9.js adds and controls functionality of wizard and policy
  (Section 9 of the wizard and policy)
*/


/**
* @desc "adds text input listener to input field"
* @params n/a
* @return void
*/
function updateWizard() {
  $('#mod-9w-input-0').on('input', function(){
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
  let text = $('#mod-9w-input-0').val()
  if (text != "") {
    $('#mod-9p-content').html(`<p>` + text +`</p>`)
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
  <p>We will keep the personal information that we collect as long as it is necessary for the purposes for which we collect it.</p>
  `
  $('#mod-9p-content').html(html)
}

/**
* @desc "code will execute when the wizard launches"
* @params n/a
* @return void
*/
export function mod9() {
  setContent()
  updateWizard()
}
