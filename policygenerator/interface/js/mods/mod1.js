/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod1.js adds and controls functionality of first party permissions in the
  wizard and policy (Section 1 of the wizard and policy)
*/

import { practices } from './../wizard.js'
import { updateAppName, permissions, decodePermission} from './../utilities.js'

var userData = {} // Storage for additional practices

/**
* @desc ""
* @params n/a
* @return void
*/
function setDefaults() {
  $('#mod-1w-add').click(function(){
    let html = `
      <div class="d-flex flex-row mb-2 justify-content-between">
        <div>
          <h3 style="margin: 0%;">Add Category</h3>
        </div>
        <button 
        type="button" 
        class="btn close pl-2 ml-auto"
        data-toggle="collapse" 
        data-target="#mod-1w-collapse"
        id="mod-1w-additions-close"
        >
        <div class="close-char">
            <span aria-hidden="true">&times;</span>
        </div>
      </button>
      </div>
      <div class="d-flex flex-column mt-1">
        <div class="mt-2"><small>Category</small></div>
          <input
            class="font-weight-bold" 
            type="text" 
            placeholder="Enter category (Ex. E-mail address)" 
            id="mod-1w-additions-input-name">
        <div class="mt-2"><small>Purpose</small></div>
          <input 
            class="font-weight-bold"
            type="text" 
            placeholder="Enter purpose (Ex. Marketing)" 
            id="mod-1w-additions-input-purpose">
        <div class="d-flex flex-row justify-content-start mt-3">
          <a 
            href="#" 
            class="badge badge-dark badge-pill align-self-center"
            id="mod-1w-additions-add">
            Add
          </a>
        </div>
      </div>    
  `
  $('#mod-1w-evidence').html(html)
  $('#mod-1w-additions-close').off()
  $('#mod-1w-additions-input-name').off()
  $('#mod-1w-additions-input-name').on('input', function(){
  })
  $('#mod-1w-additions-input-purpose').off()
  $('#mod-1w-additions-input-purpose').on('input', function(){
  })
  $('#mod-1w-additions-add').click(function(){
    let purpose = $('#mod-1w-additions-input-purpose').val()
    let category = $('#mod-1w-additions-input-name').val()
    if (purpose == "" || category == "" || (category in practices)) {
      $('#mod-1w-additions-input-purpose, #mod-1w-additions-input-name').attr("placeholder", "This field is required.");
      return
    } else {
      $('#mod-1w-additions-input-purpose').attr("placeholder", "Enter purpose (Ex. Marketing)");
      $('#mod-1w-additions-input-name').attr("placeholder", "Enter category (Ex. E-mail address)");
        userData[category] = {"PURPOSE": purpose, "USED": true }
        inflatePermissionButtons()
        $('#mod-1w-additions-input-purpose').val("").removeClass('focus')
        $('#mod-1w-additions-input-name').val("").removeClass('focus')
        updatePolicyAlt()
    }
  })
    $('.fp').removeClass('focus')
    $('#mod-1w-collapse').collapse('show')
  })
}

/**
* @desc ""
* @params n/a
* @return void
*/
function inflatePermissionButtons () {
  let html = ""
  $.each(permissions, function(index, value) {
    if (practices[value]["used"]) {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-info-alt font-weight-bold fp"
        id="` + value +`fpbtn">
        <img
        src="img/checkmark-square-2.svg"
        height="18px"
        width="18px"
        id="`+ value +`fpimg"/>
        ` + decodePermission(value) + `
      </button>
    `
    } else {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-secondary-alt fp"
        id="` + value +`fpbtn">
        <img
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"
        id="`+ value +`fpimg"/>
        ` + decodePermission(value) + `
      </button>
    `
    }
  })
  $.each(userData, function(category, value) {
    if (userData[category]["USED"]) {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-info-alt font-weight-bold fp"
        id="` + category +`fpbtn">
        <img
        src="img/checkmark-square-2.svg"
        height="18px"
        width="18px"
        id="`+ category +`fpimg"/>
        ` + category + `
      </button>
    `
    }
  })
  $('#mod-1w-permissions').html(html)
  $('.fp').each(function(){
    let id = $(this).attr('id')
    let permission = id.slice(0, -5)
    $(this).click(function(){
      $('.fp').removeClass('focus')
      $(this).addClass('focus')
      if (permission in userData) {
        inflateCollapseAlt(permission)
      } else {
        inflateCollapseMain(permission)
      }
      $('#mod-1w-collapse').collapse('show')
    })
  })
}

/**
* @desc update collapse view with permission data
* @params (p: String) - technical permission name
* @return void
*/
function inflateCollapseMain(p) {
  let count = 1
  let html = ""
  let plistUsages = ""
  let firstPartyUsages = ""
  let additionalUsages = ""
  let description = practices[p]["evidence"]["usageDescription"]

  $.each(practices[p]["evidence"]["plist"], function(index, value) {
    plistUsages += `
      <div class="d-flex flex-column mb-4">
        <div class="d-flex flex-row align-items-center">
          <img 
            src="img/file-outline.svg" 
            height="18px" 
            width="18px" 
            class="ml-n4"/>
          <strong>&nbsp;File</strong>
        </div>
        <div style="word-wrap: break-word;">`+ value.file_name +`</div>       
      </div>
      `
    return false
  })

  if (plistUsages == "") {
    plistUsages = "<div class='ml-n4 mb-4'>No Plist Usage Detected</div>"
  }
  $.each(practices[p]["evidence"]["firstparty"], function(index, value) {

    let rank = ""
    if (value.rank >= 4) {
      rank = `
        <small class='ml-auto mb-1 text-danger font-weight-bold p-1'>
          High Usage ⬤ ⬤ ⬤
        </small>`

    } else if (value.rank == 3) {
      rank = `
        <small class='ml-auto mb-1 text-warning font-weight-bold p-1'>
          Medium Usage ⬤ ⬤
        </small>`
    } else {
      rank = `
        <small class='ml-auto mb-1 text-success font-weight-bold p-1'>
          Low Usage ⬤
        </small>`
    }

    if (count != 0) {
      firstPartyUsages +=`
        <div class="d-flex flex-column">
          <div class="d-flex flex-row align-items-center">
            <img 
              src="img/file-outline.svg" 
              height="18px" 
              width="18px" 
              class="ml-n4"/>
            <strong>&nbsp;File</strong> `+ rank +`
          </div>
          <div style="word-wrap: break-word;">`+ value.file_name +`</div>
        </div>
      `
      count--
    } else {
      additionalUsages +=`
        <div class="d-flex flex-column">
          <div class="d-flex flex-row align-items-center">
            <img 
              src="img/file-outline.svg" 
              height="18px" 
              width="18px" 
              class="ml-n4"/>
            <strong>&nbsp;File</strong> `+ rank +`
          </div>
          <div style="word-wrap: break-word;">`+ value.file_name +`</div>     
        </div><br>`
    }
  })
  if (additionalUsages != "") {
    $("#mod-1w-usages").html(additionalUsages.slice(0, -4))
    additionalUsages = `
      <a 
        href="#" 
        class="badge badge-light badge-pill mt-4" 
        data-toggle="modal" 
        data-target="#mod-1w-modal">
        More Code Usages
      </a>
    `
  }
  if (firstPartyUsages == "") {
    firstPartyUsages = "<span class='ml-n4'>No Code Usage Detected</span>"
  }
  html = `
  <div class="d-flex flex-row mb-2">
    <div>
      <h3 style="margin: 0%;">` + decodePermission(p) + `</h3>
    </div>
    <div class="ml-2 align-self-center">
      <a 
        href="#" 
        class="badge badge-dark badge-pill"
        id="mod-1w-permission">
        Remove
      </a>
    </div>
  <button 
    type="button" 
    class="btn close ml-auto"
    data-toggle="collapse" 
    data-target="#mod-1w-collapse"
    id="mod-1w-close"
    >
    <div class="close-char">
        <span aria-hidden="true">&times;</span>
    </div>
  </button>
  </div>
  <div class="d-flex flex-column mt-1">
    <div><small>Purpose</small></div>
    <input 
      class="font-weight-bold"
      type="text"
      value="`+description+`"
      placeholder="We use this permission to..." 
      id="mod-1w-purpose">
  </div>
  <div class="d-flex flex-column">
    <h3 class="mt-4 mb-2">Plist Usage</h3>
    <div class="ml-4">`+ plistUsages +`</div>
  </div>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row">
      <h3 class="mt-1 mb-2">Code Usage</h3>
      <img class="align-self-center ml-1"
      data-toggle="tooltip"
      data-html="true"
      title="
      <p>ProTip:</p>
      <p>
        The flagged permissions are based on the plist and code usage of your app.
      </p>
      <p>
        <span class='ml-auto mb-1 text-danger font-weight-bold p-1'>
        High Usage ⬤ ⬤ ⬤</span>: Indicates files that contain all of the following - FRAMEWORK, CLASS, AUTHORIZATION METHOD, and ADDITIONAL EVIDENCE.
        <br>
        <span class='ml-auto mb-1 text-warning font-weight-bold p-1'>
        Medium Usage ⬤ ⬤</span>: Indicates files that contain three of the following - FRAMEWORK, CLASS, AUTHORIZATION METHOD, and/or ADDITIONAL EVIDENCE.
        <br>
        <span class='ml-auto mb-1 text-success font-weight-bold p-1'>
        Low Usage ⬤</span>: Indicates files that contain one or two of the following - FRAMEWORK, CLASS, AUTHORIZATION METHOD, and/or ADDITIONAL EVIDENCE.
      </p>
      <p>
        For more details see the privacy_practices.yaml in our PrivacyFlash Pro GitHub repo (linked at the bottom).
      </p>
      "
      src="img/info.svg"
      height="18px"
      width="18px"/>
    </div>
    <div class="ml-4">`+ firstPartyUsages +`</div>
    <div class="d-flex flex-row justify-content-between align-items-center">
      `+ additionalUsages +`
    </div>
  </div>          
  `

  $('#mod-1w-evidence').html(html)
  $('[data-toggle="tooltip"]').tooltip()

  if (!practices[p]["used"]) {
    $('#mod-1w-permission').text("Add")
  }

  $('#mod-1w-close').off()
  $('#mod-1w-close').click(function(){
    $('.fp').removeClass('focus')
  })

  $('#mod-1w-permission').off()
  $('#mod-1w-permission').click(function(){
    if (practices[p]["used"]) {
      practices[p]["used"] = false
      $('#mod-1w-permission').text("Add")
      $('#' + p + 'fpbtn')
        .removeClass('btn-outline-info-alt font-weight-bold')
        .addClass('btn-outline-secondary-alt')
      $('#' + p + 'fpimg').attr("src", "img/minus-square-outline.svg")
    } else {
      practices[p]["used"] = true
      $('#mod-1w-permission').text("Remove")
      $('#'+ p +'fpbtn')
        .addClass('btn-outline-info-alt font-weight-bold')
        .removeClass('btn-outline-secondary-alt')
      $('#' + p + 'fpimg').attr("src", "img/checkmark-square-2.svg")
    }
    updatePolicy()
  })

  $('#mod-1w-purpose').off()
  $('#mod-1w-purpose').on('input', function() {
    practices[p]["evidence"]["usageDescription"] = $('#mod-1w-purpose').val()
    updatePolicy()
  })
}

/**
* @desc ""
* @params ""
* @return void
*/
function inflateCollapseAlt(p){
  let purpose = userData[p]["PURPOSE"]
  let html = `
    <div class="d-flex flex-row mb-2">
      <div>
        <h3 class="m-0 text-wrap text-break">` + p + `</h3>
      </div>
      <div class="ml-2 align-self-center">
        <a 
          href="#" 
          class="badge badge-danger badge-pill"
          id="mod-1w-alt-permission">
          Delete
        </a>
      </div>
      <div class="ml-auto pl-2 align-self-center">
        <button 
          type="button" 
          class="btn close ml-auto"
          data-toggle="collapse" 
          data-target="#mod-1w-collapse"
          id="mod-1w-additions-close"
          >
          <div class="close-char">
              <span aria-hidden="true">&times;</span>
          </div>
        </button>
      </div>
    </div>
    <div class="d-flex flex-column mt-1">
      <div><small>Purpose</small></div>
      <input 
        class="font-weight-bold"
        type="text" 
        value="`+ purpose +`"
        placeholder="We use this permission to..." 
        id="mod-1w-additions-purpose">
    </div>  
  `
  $('#mod-1w-evidence').html(html)

  $('#mod-1w-additions-close').off()
  $('#mod-1w-additions-close').click(function(){
    $('.fp').removeClass('focus')
  })

  $('#mod-1w-alt-permission').off()
  $('#mod-1w-alt-permission').click(function(){
    delete userData[p]
    updatePolicyAlt()
    $('#mod-1w-collapse').collapse('hide')
    inflatePermissionButtons()
  })

  $('#mod-1w-additions-purpose').off()
  $('#mod-1w-additions-purpose').on('input', function(){
    userData[p]["PURPOSE"] = $(this).val()
    updatePolicyAlt()
  })
}

/**
* @desc set policy data from "practices" json
* @params n/a
* @return void
*/
function updatePolicy() {
  let html = ""
  let usage = false
  $.each(permissions, function(index, value) {
    if (practices[value]["used"]){
      usage = true
      let purpose = practices[value]['evidence']['usageDescription']
      if (purpose == "") {
        purpose = "Usage Description Not Supplied"
      }
      html += `
        <li id="focus-`+ value +`fp">
          <strong>`+ decodePermission(value) +`</strong>
          <div>Purpose: `+ purpose +`</div>
        </li>
        <br>`
    }
  })
  if (usage) {
    html = `
      <p>
        If you grant <span class="app-name"></span> permission, we may collect and use personal information from you as follows.
      </p>
      ` + `<ul>` + html.slice(0,-4) + `</ul>` +
      `
      <p>
        Please note that you can decline a permission or revoke it after you granted it in the <a href="https://support.apple.com/guide/iphone/change-app-access-to-private-data-iph251e92810/ios" target="_blank"> iOS settings</a>. If you do so, we will not collect your personal information related to that permission. However, the functionality of <span class="app-name"></span> may be limited as a result.
      </p>
      <p>
        We may receive technical information about your device, for example, its IP address or operating system.
      </p>
      `
    $('#mod-1p-practices').html(html)
  } else {
    $('#mod-1p-practices').html(`
      <p>
        We may receive technical information about your device, for example, its IP address or operating system.
      </p>
    `)
  }
  updateAppName()
}

/**
* @desc 
* @params 
* @return 
*/
function updatePolicyAlt(){
  let html =""
  $.each(userData, function(key, value) {
    if (userData[key]["USED"]){
      let purpose = userData[key]["PURPOSE"]
      if (purpose == "") {
        purpose = "Usage Description Not Supplied"
      }
      html += `
        <li>
          <strong>`+ key +`</strong>
          <div>Purpose: `+ purpose +`</div>
        </li><br>`
    }
  })
  if (html != "") {
    html = `
      <p>
        In addition, we are collecting and using the following personal information from you:
      </p>` + 
      `<ul>` + html.slice(0,-4) + `</ul>`
  }
  $('#mod-1p-practices-alt').html(html)

}

/**
* @desc loads current mod (module)
* @params n/a
* @return void
*/
export function mod1() {
  setDefaults()
  inflatePermissionButtons()
  updatePolicy()
}