/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod12.js adds and controls functionality of wizard and policy
  (Section 12 of the wizard and policy)
*/


/**
* @desc "adds text input listener to input field"
* @params n/a
* @return void
*/
function updateWizard1() {
  $('#mod-12w-input-name').on('input', function(){
    updatePolicy1()

    let inputText = $(this).val()
    if (inputText != "") {
      $(this).addClass('focus')
    } else {
      $(this).removeClass('focus')
    }
  })
}

/**
* @desc "adds text input listener to input field"
* @params n/a
* @return void
*/
function updateWizard2() {
  $('#mod-12w-input-email').on('input', function(){
    updatePolicy2()

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
function updatePolicy1() {
  let text = $('#mod-12w-input-name').val()
  if (text != "") {
    $('#mod-12p-name').html(`<p>` + text +`</p>`)
  } else {
    setContent1()
  }

}

/**
* @desc "updates policy based on text input"
* @params n/a
* @return void
*/
function updatePolicy2() {
  let text = $('#mod-12w-input-email').val()
  if (text != "") {
    $('#mod-12p-email').html(`<p>` + text +`</p>`)
  } else {
    setContent2()
  }

}

/**
* @desc "sets the default content in the policy"
* @params n/a
* @return void
*/
function setContent1() {
  let html = `
  <p>Name</p>
  `
  $('#mod-12p-name').html(html)
}

/**
* @desc "sets the default content in the policy"
* @params n/a
* @return void
*/
function setContent2() {
  let html = `
  <p>Email address</p>
  `
  $('#mod-12p-email').html(html)
}

/**
* @desc "code will execute when the wizard launches"
* @params n/a
* @return void
*/
export function mod12() {
  setContent1()
  setContent2()
  updateWizard1()
  updateWizard2()
}
