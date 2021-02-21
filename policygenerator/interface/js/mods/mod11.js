/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod11.js adds and controls functionality of wizard and policy
  (Section 11 of the wizard and policy)
*/


/**
* @desc "adds text input listener to input field"
* @params n/a
* @return void
*/
function updateWizard() {
  $('#mod-11w-input').on('input', function(){
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
  let text = $('#mod-11w-input').val()
  if (text != "") {
    $('#mod-11p-content').html(`<p>` + text +`</p>`)
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
  <p>This website conforms to the <a href="https://www.w3.org/TR/WCAG21/" target="_blank">Web Content Accessibility Guidelines (WCAG) 2.1</a>. However, if you are having difficulties obtaining information from it, please contact us at the contact information <a href='#contact_us'>below</a>. We will try to make the information available to you in another format and answer any question that you may have.</p>
  `
  $('#mod-11p-content').html(html)
}

/**
* @desc "code will execute when the wizard launches"
* @params n/a
* @return void
*/
export function mod11() {
  setContent()
  updateWizard()
}
