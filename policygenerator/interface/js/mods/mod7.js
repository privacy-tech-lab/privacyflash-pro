/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod7.js adds and controls functionality of wizard and policy 
  (Section 7 of the wizard and policy)
*/

import { smoothScroll } from './../utilities.js'

function updateWizard(){
  $('#mod-7w-r0-yes').click(function(){
    updatePolicy()
  })
  $('#mod-7w-r0-no').click(function(){
    updatePolicy()
  })
  $('#mod-7w-r1-yes').click(function(){
    updatePolicy()
  })
  $('#mod-7w-r1-no').click(function(){
    updatePolicy()
  })

}

function updatePolicy(){
  let html =""
  if ($('#mod-7w-r0-yes').prop('checked') &&
  $('#mod-7w-r1-yes').prop('checked')
  ) {
    html = `
    <p> 
    If you are in the European Economic Area and if you have any questions or would like to exercise any of your rights, please contact us at the contact information <a href='#contact_us'>below</a>. You have the rights to:
    </p>

    <ul>
      <li>
      Request a copy of your personal information
      </li>
      <li>
      Request corrections of inaccurate personal information, deletions, or additions to your personal information
      </li>
      <li>
      Restrict or object to personal information processing
      </li>
      <li>
      Request a portable copy of your personal information for transferring it to another service
      </li>
      <li>
      Lodge a complaint with a <a href="https://ec.europa.eu/justice/article-29/structure/data-protection-authorities/index_en.htm" target='_blank'>supervisory authority</a>
      </li>
    </ul>
    `
    $('#sec-title-7P').removeClass('exclude')
  } else {
    html = `
    <div class="alert alert-info" role="alert">
      Based on your selection, this Section will be omitted in the exported privacy policy.
    </div>
    `
    $('#sec-title-7P').addClass('exclude')
  }
  $('#mod-7p-content').html(html)
  smoothScroll()
  
}


export function mod7() {
  updateWizard()
}