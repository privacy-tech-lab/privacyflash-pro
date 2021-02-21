/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod2.js adds and controls functionality of third party permissions in the
  wizard and policy (Section 2 of the wizard and policy)
*/


import { sdkPractices, sdks, practices } from './../wizard.js'
import { scrollHorizontalEnd, decodePermission, updateAppName, permissions, smoothScroll
  } from './../utilities.js'
import { syncMod5Alt } from './mod5.js'
import { syncMod7 } from './mod7.js'

var additionalPermissions = {} // Storage for additional practices

/**
* @desc ""
* @params n/a
* @return void
*/
function setDefaults() {
  $('#mod-2w-add').off()
  $('#mod-2w-add').click(function(){
    $('.tp').removeClass('focus')
    $('.tp0').removeClass('focus')
    $('#mod-2w-collapse').collapse('hide')
      let html = `
      <div class="d-flex flex-row mb-2 justify-content-between">
        <div>
          <h3 style="margin: 0%;"> Add Third Party</h3>
        </div>
        <button 
          type="button" 
          class="btn close ml-auto"
          data-toggle="collapse" 
          data-target="#mod-2w-collapse-sdks"
          >
          <div class="close-char">
              <span aria-hidden="true">&times;</span>
          </div>
      </button>
      </div>
      <div class="d-flex flex-column mt-1">
        <div class="mt-2"><small>Third Party</small></div>
        <input 
          class="font-weight-bold"
          type="text" 
          placeholder="Enter third party (Ex. AdMob)" 
          id="mod-2w-collapse-sdks-input">
        <a 
          href="#" 
          class="badge badge-dark badge-pill mt-3 align-self-start"
          id="mod-2w-collapse-sdks-add">
          Add
        </a>
      </div>     
    `
    $('#mod-2w-collapse-sdks-data').html(html)
    $('#mod-2w-collapse-sdks-add').off().click(function(){
      if ($('#mod-2w-collapse-sdks-input').val() != "") {
        $('#mod-2w-collapse-sdks-input').attr('placeholder', 'Enter third party (Ex. AdMob)')
        let len = Object.keys(sdks).length
        sdks[len] = {}
        sdks[len]["NAME"] = $('#mod-2w-collapse-sdks-input').val()
        sdks[len]["EVIDENCE"] = null
        sdks[len]["USED"] = true
        sdks[len]["PURPOSE"] = ""
        inflateThirdPartyButtons()
        $('#mod-2w-collapse-sdks-input').val("")
        scrollHorizontalEnd('mod-2w-sdks')
        updatePolicy()
        syncMod5Alt()
        syncMod7()
      } else {
        $('#mod-2w-collapse-sdks-input').attr('placeholder', 'This field is required.')
      }
    })    
    $('#mod-2w-collapse-sdks').collapse('show')
  })
}

/**
* @desc ""
* @params n/a
* @return void
*/
function inflateThirdPartyButtons() {
  let html = ""
  $.each(sdks, function(key, value) {
    if (sdks[key]["USED"]) {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-tp text-nowrap font-weight-bold tp"
        id="` + key +`tpbtn">
        <img
        src="img/checkmark-square-2-alt.svg"
        height="18px"
        width="18px"
        id="`+ key +`tpimg"/>
        ` + sdks[key]["NAME"] + `
      </button>
    `
    } else if (sdks[key]["USED"] != null) {
      html += `
      <button
        type="button" 
        class="btn btn-sm text-nowrap btn-outline-secondary-alt tp"
        id="` + key +`tpbtn">
        <img
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"
        id="`+ key +`tpimg"/>
        ` + sdks[key]["NAME"] + `
      </button>
    `
    }
  })
  if (html == "") {
    html += `
    <button
      id="mod-2w-smooth"
      type="button"
      class="btn btn-sm text-nowrap btn-outline-secondary-alt disabled">
      No Third Parties Detected
    </button>
  `
  }
  $('#mod-2w-sdks').html(html + '&nbsp;&nbsp;')
  $('#mod-2w-smooth').click(function(){
    document.getElementById('section-2').scrollIntoView({behavior: 'smooth'})
  })
  $('.tp').each(function(){
    let id = $(this).attr('id')
    let sdkTechName = id.slice(0, -5)
    $(this).click(function(){
      $('.tp').removeClass('focus')
      $('.tp0').removeClass('focus')
      $('#mod-2w-collapse').collapse('hide')
      $(this).addClass('focus')
      if (sdks[sdkTechName]["EVIDENCE"] != null) {
        inflateSDKCollapseMain(sdkTechName)
      } else {
        inflateSDKCollapseAlt(sdkTechName)
      }
      $('#mod-2w-collapse-sdks').collapse('show')
    })
  })
}

/**
* @desc ""
* @params n/a
* @return void
*/
function inflateSDKCollapseMain(sdkTechName) {
  let text = "Add"
  if (sdks[sdkTechName]["USED"]) {
    text = "Remove"
  }
  let html = `
    <div class="d-flex flex-row mb-2">
      <div>
        <h3 class="m-0">` + sdks[sdkTechName]["NAME"] + `</h3>
      </div>
      <div class="ml-2 align-self-center">
        <a 
          href="#" 
          class="badge badge-dark badge-pill"
          id="mod-2w-collpase-sdks-edit">
          `+text+`
        </a>
      </div>
      <button 
        type="button" 
        class="btn close ml-auto pl-2"
        data-toggle="collapse" 
        data-target="#mod-2w-collapse-sdks"
        id="mod-2w-close"
        >
        <div class="close-char">
          <span aria-hidden="true">&times;</span>
        </div>
    </button>
    </div>
    <div class="d-flex flex-column mt-2">
      <h3 class="m-0 mb-2">Code Usage</h3>
      <div class="d-flex flex-column ml-4 mb-4">
        <div class="d-flex flex-row align-items-center">
        <img 
        src="img/folder-outline.svg" 
        height="18px" 
        width="18px" 
        class="ml-n4"/>
        <strong>&nbsp;Directory</strong>
        </div>
      <div style="word-wrap: break-word;">`+ sdks[sdkTechName]["EVIDENCE"] +`</div>       
    </div>
      <div class="mod-2w">
      <div class="d-flex flex-row justify-content-between mb-2">
        <h3 class="m-0">Permissions</h3>
        <a
          href="#"
          class="ml-2 badge badge-info badge-pill align-self-center"
          id="mod-2w-additions-add">
          + Add Category
        </a>
      </div>
      </div>
      <div class="mod-2w">
      <div
        style="width: 100%;"
        class="d-flex flex-row flex-nowrap overflow-auto align-items-center"
        id="mod-2w-sdk-permissions">
      </div>
      </div>
      <div class="collapse shadow-sm mt-2 mod-2w" id="mod-2w-collapse-sdk-p"></div>
    </div>     
  ` 
  $('#mod-2w-collapse-sdks-data').html(html)
  if (!sdks[sdkTechName]["USED"]) {
    $('.mod-2w').hide()
  }
  inflateSDKPermissions(sdkTechName)
  $('#'+ 'mod-2w-close').off().click(function (){
    $('.tp').removeClass('focus')
  })
  $('#'+ 'mod-2w-collpase-sdks-edit').off().click(function (){
    sdks[sdkTechName]["USED"] = !sdks[sdkTechName]["USED"]
      if (sdks[sdkTechName]["USED"]) {
        $('#' + sdkTechName + 'tpbtn')
          .removeClass('btn-outline-secondary-alt')
          .addClass('font-weight-bold')
          .addClass('btn-outline-tp')
      $('#' + sdkTechName + 'tpimg')
        .attr('src', 'img/checkmark-square-2-alt.svg')
      $(this).text("Remove")
      $('.mod-2w').show()
    } else {
      $('#' + sdkTechName + 'tpbtn')
        .addClass('btn-outline-secondary-alt')
        .removeClass('font-weight-bold')
        .removeClass('btn-outline-tp')
      $('#' + sdkTechName + 'tpimg')
        .attr('src', 'img/minus-square-outline.svg')
      $(this).text("Add")
      $('.mod-2w').hide()
    }
    updatePolicy()
    inflatePermissionButtons()
  })
}

/**
* @desc ""
* @params n/a
* @return void
*/
function inflateSDKCollapseAlt(sdkTechName) {
  let html = `
    <div class="d-flex flex-row mb-2">
      <div>
        <h3 class="m-0">` + sdks[sdkTechName]["NAME"] + `</h3>
      </div>
      <div class="ml-2 align-self-center">
        <a 
          href="#" 
          class="badge badge-danger badge-pill"
          id="mod-2w-collpase-sdks-edit">
          Delete
        </a>
      </div>
      <button 
        type="button" 
        class="btn close ml-auto pl-2"
        data-toggle="collapse" 
        data-target="#mod-2w-collapse-sdks"
        id="mod-2w-close"
        >
        <div class="close-char">
          <span aria-hidden="true">&times;</span>
        </div>
    </button>
    </div>
    <div class="d-flex flex-column mt-2">
      <div class="d-flex flex-row justify-content-between mb-2">
        <h3 class="m-0">Permissions</h3>
        <a
          href="#"
          class="ml-2 badge badge-info badge-pill align-self-center"
          id="mod-2w-additions-add">
          + Add Category
        </a>
      </div>
      <div
        style="width: 100%;"
        class="d-flex flex-row flex-nowrap overflow-auto align-items-center"
        id="mod-2w-sdk-permissions">
      </div>
      <div class="collapse shadow-sm mt-2" id="mod-2w-collapse-sdk-p"></div>
    </div>     
  ` 
  $('#mod-2w-collapse-sdks-data').html(html)
  inflateSDKPermissions(sdkTechName)
  $('#'+ 'mod-2w-close').off().click(function (){
    $('.tp').removeClass('focus')
  })
  $('#'+ 'mod-2w-collpase-sdks-edit').off().click(function (){
    sdks[sdkTechName]["USED"] = null
    $('#mod-2w-collapse-sdks').collapse('hide')
    inflateThirdPartyButtons()
    inflatePermissionButtons()
    updatePolicy()
    syncMod5Alt()
    syncMod7()
  })
}

/**
* @desc ""
* @params n/a
* @return void
*/
function inflateSDKPermissions(sdkTechName) {
  let html = ""
  $.each(permissions, function(index, category) {
    if (sdkTechName in sdkPractices[category] &&
         sdkPractices[category][sdkTechName]["USED"]) {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-info-alt text-nowrap font-weight-bold tp1"
        id="` + category +`tp1btn">
        <img
        src="img/checkmark-square-2.svg"
        height="18px"
        width="18px"
        id="`+ category +`tp1img"/>
        ` + decodePermission(category) + `
      </button>
    `
    } else {
      html += `
      <button
        type="button" 
        class="btn btn-sm text-nowrap btn-outline-secondary-alt tp1"
        id="` + category +`tp1btn">
        <img
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"
        id="`+ category +`tp1img"/>
        ` + decodePermission(category) + `
      </button>
    `
    }
  })
  $.each(additionalPermissions, function(category, v) {
    if (sdkTechName in additionalPermissions[category]['SDKS'] &&
        additionalPermissions[category]['SDKS'][sdkTechName]["USED"]) {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-info-alt text-nowrap font-weight-bold tp1"
        id="` + category +`tp1btn">
        <img
        src="img/checkmark-square-2.svg"
        height="18px"
        width="18px"
        id="`+ category +`tp1img"/>
        ` + additionalPermissions[category]["NAME"] + `
      </button>
    `
    } else {
      html += `
      <button
        type="button" 
        class="btn btn-sm text-nowrap btn-outline-secondary-alt tp1"
        id="` + category +`tp1btn">
        <img
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"
        id="`+ category +`tp1img"/>
        ` + additionalPermissions[category]["NAME"] + `
      </button>
    `
    }
  })
  $('#mod-2w-sdk-permissions').html(html + '&nbsp;&nbsp;')

  $('.tp1').each(function(){
    let id = $(this).attr('id')
    let category = id.slice(0, -6)
    $(this).off()
    $(this).click(function(){
      $('.tp1').removeClass('focus')
      $(this).addClass('focus')

      if (permissions.includes(category)) {
        if (!(sdkTechName in sdkPractices[category])) {
          sdkPractices[category][sdkTechName] = 
          {"USED" : false, "PURPOSE": sdks[sdkTechName]["PURPOSE"]}
        }
        let text = "Add"
        if (sdkPractices[category][sdkTechName]["USED"]) {
            text = "Remove"
        }
        let plistUsages = ""
        if (!jQuery.isEmptyObject(practices[category]["evidence"]["plist"])) {
          let temp = ""
          $.each(practices[category]["evidence"]["plist"], function(index, value) {
            temp += `
              <div class="d-flex flex-column>
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
          plistUsages = `
            <h3 class="pt-4">Plist Usage</h3>
            <div class="ml-4">`+ temp +`</div>`
        }
        if (plistUsages == "") {
          plistUsages = `
          <h3 class="pt-4">Plist Usage</h3>
          <small class=''>No Plist Usage Detected</small>`
        }
        let html = `
        <div class="card card-body">
          <div class="d-flex flex-row mb-2">
            <div>
              <h3 class="m-0 text-wrap text-break">
              ` + decodePermission(category) + `</h3>
            </div>
            <div class="ml-2 align-self-center">
              <a 
                href="#" 
                class="badge badge-dark badge-pill"
                id="mod-2w-sdk-permission-edit">
                ` + text +`
              </a>
            </div>
          </div>
          <div class="d-flex flex-column mt-1">
            <div><small>Purpose</small></div>
            <input 
              class="font-weight-bold"
              type="text" 
              value="`+sdkPractices[category][sdkTechName]["PURPOSE"]+`"
              placeholder="We use this permission to..." 
              id="mod-2w-purpose">
              `
              + plistUsages +
              `
          </div>  
        </div>
        `
        $('#mod-2w-collapse-sdk-p').html(html).collapse('show')
        $('#mod-2w-sdk-permission-edit').off().click(function(){
          sdkPractices[category][sdkTechName]["USED"] = 
            !sdkPractices[category][sdkTechName]["USED"]
          if (sdkPractices[category][sdkTechName]["USED"]) {
              $('#' + category + 'tp1btn')
                .removeClass('btn-outline-secondary-alt')
                .addClass('font-weight-bold')
                .addClass('btn-outline-info-alt')
              $('#' + category + 'tp1img')
                .attr('src', 'img/checkmark-square-2.svg')
              $(this).text("Remove")
          } else {
            $('#' + category + 'tp1btn')
            .addClass('btn-outline-secondary-alt')
            .removeClass('font-weight-bold')
            .removeClass('btn-outline-info-alt')
            $('#' + category + 'tp1img')
              .attr('src', 'img/minus-square-outline.svg')
            $(this).text("Add")
          }
          inflatePermissionButtons()
          updatePolicy()
        })

      $('#mod-2w-purpose').off().on('input', function(){
        sdkPractices[category][sdkTechName]["PURPOSE"] = $(this).val()
        updatePolicy()
      })
  } else {
    if (!(sdkTechName in additionalPermissions[category]["SDKS"])) {
      additionalPermissions[category]["SDKS"][sdkTechName] = 
      {"USED" : false, "PURPOSE": sdks[sdkTechName]["PURPOSE"]}
    }
    let text = "Add"
    if (additionalPermissions[category]["SDKS"][sdkTechName]["USED"]) {
        text = "Remove"
    }
    let html = `
    <div class="card card-body">
      <div class="d-flex flex-row mb-2">
        <div>
          <h3 class="m-0 text-wrap text-break">
          ` + additionalPermissions[category]['NAME'] + `</h3>
        </div>
        <div class="ml-2 align-self-center">
          <a 
            href="#" 
            class="badge badge-dark badge-pill"
            id="mod-2w-sdk-permission-edit">
            ` + text +`
          </a>
        </div>
      </div>
      <div class="d-flex flex-column mt-1">
        <div><small>Purpose</small></div>
        <input 
          class="font-weight-bold"
          type="text" 
          value="`
          +additionalPermissions[category]["SDKS"][sdkTechName]["PURPOSE"]+`"
          placeholder="We use this permission to..." 
          id="mod-2w-purpose">
      </div>  
    </div>
    `
    $('#mod-2w-collapse-sdk-p').html(html).collapse('show')
    $('#mod-2w-sdk-permission-edit').off().click(function(){
      additionalPermissions[category]['SDKS'][sdkTechName]["USED"] = 
        !additionalPermissions[category]['SDKS'][sdkTechName]["USED"]
      if (additionalPermissions[category]['SDKS'][sdkTechName]["USED"]) {
          $('#' + category + 'tp1btn')
            .removeClass('btn-outline-secondary-alt')
            .addClass('font-weight-bold')
            .addClass('btn-outline-info-alt')
          $('#' + category + 'tp1img')
            .attr('src', 'img/checkmark-square-2.svg')
          $(this).text("Remove")
      } else {
        $('#' + category + 'tp1btn')
        .addClass('btn-outline-secondary-alt')
        .removeClass('font-weight-bold')
        .removeClass('btn-outline-info-alt')
        $('#' + category + 'tp1img')
          .attr('src', 'img/minus-square-outline.svg')
        $(this).text("Add")
      }
      inflatePermissionButtons()
      updatePolicy()
    })
    $('#mod-2w-purpose').off().on('input', function(){
      additionalPermissions[category]['SDKS'][sdkTechName]["PURPOSE"] = $(this).val()
      updatePolicy()
    })
  }
    })
  })

  $('#mod-2w-additions-add').off().click(function(){
    $('.tp1').removeClass('focus')
      let html = `
      <div class="card card-body">
        <div class="d-flex flex-row mb-2 justify-content-between">
          <div>
            <h3 style="margin: 0%;">Add Category</h3>
          </div>
        </div>
        <div class="d-flex flex-column mt-1">
          <div class="mt-2"><small>Category</small></div>
            <input
              class="font-weight-bold" 
              type="text" 
              placeholder="Enter category (Ex. E-mail address)" 
              id="mod-2w-additions-input-name">
          <div class="mt-2"><small>Purpose</small></div>
          <input
            class="font-weight-bold" 
            type="text"
            value="`+sdks[sdkTechName]["PURPOSE"]+`"
            placeholder="Enter purpose (Ex. Marketing)" 
            id="mod-2w-additions-purpose">
          <div class="d-flex flex-row justify-content-start mt-3">
            <a 
              href="#" 
              class="badge badge-dark badge-pill align-self-center"
              id="mod-2w-additions-add-1">
              Add
            </a>
          </div>
        </div>    
      </div>
    `
    $('#mod-2w-collapse-sdk-p').html(html)
    $('#mod-2w-additions-add-1').off().click(function(){
      if ($('#mod-2w-additions-input-name').val() in additionalPermissions || 
        $('#mod-2w-additions-input-name').val() == "" || $('#mod-2w-additions-purpose').val() == "") {
          $('#mod-2w-additions-input-name').attr('placeholder', 'This field is required.')
          $('#mod-2w-additions-purpose').attr('placeholder', 'This field is required.')
        return
      } else {
        $('#mod-2w-additions-input-name').attr('placeholder', 'Enter category (Ex. E-mail address)')
        $('#mod-2w-additions-purpose').attr('placeholder', 'Enter purpose (Ex. Marketing)')
        let permissionTechName = Object.keys(additionalPermissions).length
        additionalPermissions[permissionTechName] =
          {"NAME": $('#mod-2w-additions-input-name').val(), "SDKS": {} }
        additionalPermissions[permissionTechName]["SDKS"][sdkTechName] = 
          {'USED': true, 'PURPOSE': $('#mod-2w-additions-purpose').val()}
        inflatePermissionButtons()
        inflateSDKPermissions(sdkTechName)
        $('#mod-2w-additions-purpose').val("")
        $('#mod-2w-additions-input-name').val("")
        scrollHorizontalEnd('mod-2w-sdk-permissions')
        updatePolicy()
      }
    })
    $('#mod-2w-collapse-sdk-p').collapse('show')
  })
}

/**
* @desc ""
* @params n/a
* @return void
*/
function inflatePermissionButtons(){
  let html = ""
  $.each(permissions, function(index, permission) {

    let value = false
    $.each(sdkPractices[permission], function (sdk, v) {
      if (sdkPractices[permission][sdk]["USED"] && sdks[sdk]["USED"]) {
        value = true
        return false
      }
    })

    if (value) {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-info-alt font-weight-bold tp0"
        id="` + permission +`tp0btn">
        <img
        src="img/checkmark-square-2.svg"
        height="18px"
        width="18px"
        id="`+ permission +`tp0img"/>
        ` + decodePermission(permission) + `
      </button>
    `
    } else {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-secondary-alt tp0"
        id="` + permission +`tp0btn">
        <img
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"
        id="`+ permission +`tp0img"/>
        ` + decodePermission(permission) + `
      </button>
    `
    }
  })

  $.each(additionalPermissions, function(permission, v) {
    let value = false
    $.each(additionalPermissions[permission]["SDKS"], function (sdk, v) {
      if (additionalPermissions[permission]['SDKS'][sdk]["USED"] && sdks[sdk]["USED"]) {
        value = true
        return false
      }
    })
    if (value) {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-info-alt font-weight-bold tp0"
        id="` + permission +`tp0btn">
        <img
        src="img/checkmark-square-2.svg"
        height="18px"
        width="18px"
        id="`+ permission +`tp0img"/>
        ` + additionalPermissions[permission]["NAME"]  + `
      </button>
    `
    } else {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-secondary-alt tp0"
        id="` + permission +`tp0btn">
        <img
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"
        id="`+ permission +`tp0img"/>
        ` + additionalPermissions[permission]["NAME"]  + `
      </button>
    `
    }
  })
  $('#mod-2w-permissions').html(html)

  $('.tp0').each(function(){
    let id = $(this).attr('id')
    let permission = id.slice(0, -6)
    $(this).click(function(){
      $('.tp0').removeClass('focus')
      $('.tp').removeClass('focus')
      $('#mod-2w-collapse-sdks').collapse('hide')
      $(this).addClass('focus')
      if (permission in additionalPermissions) {
        inflateCollapseAlt(permission)
      } else {
        inflateCollapseMain(permission)
      }
      $('#mod-2w-collapse').collapse('show')
    })
  })
}

/**
* @desc ""
* @params n/a
* @return void
*/
function inflateCollapseMain(permission) {
  let plistUsages = ""
  if (!jQuery.isEmptyObject(practices[permission]["evidence"]["plist"])) {
    let temp = ""
    $.each(practices[permission]["evidence"]["plist"], function(index, value) {
      temp += `
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
    plistUsages = `
      <h3 class="">Plist Usage</h3>
      <div class="ml-4">`+ temp +`</div>`
  }
  if (plistUsages == "") {
    plistUsages = `
    <h3 class="">Plist Usage</h3>
    <small class='mb-4'>No Plist Usage Detected</small>`
  }
  let html = `
  <div class="d-flex flex-row mb-2">
    <div>
      <h3 class="m-0">` + decodePermission(permission) + `</h3>
    </div>
    <button 
      type="button" 
      class="btn close ml-auto pl-2"
      data-toggle="collapse" 
      data-target="#mod-2w-collapse"
      id="mod-2w-close-1"
      >
      <div class="close-char">
        <span aria-hidden="true">&times;</span>
      </div>
  </button>
  </div>
  <div class="d-flex flex-column mt-2">
    `+ plistUsages +`
    <h3 class="m-0 mb-1">Third Party Usage</h3>
    <small>Add, edit, and delete third parties at the beginning of <a href="#section-2">this Section</a>.</small>
    <div
      style="width: 100%;"
      class="d-flex flex-row flex-nowrap overflow-auto align-items-center"
      id="mod-2w-sdk-usage">
    </div>
  </div> 
  `
  $('#mod-2w-collapse-data').html(html)
  smoothScroll()
  html = ""
  $.each(sdkPractices[permission], function(key, value) {
    if (sdks[key]["USED"] && sdkPractices[permission][key]["USED"]) {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-tp text-nowrap font-weight-bold tp3"
        id="` + key +`tp3btn">
        <img
        src="img/checkmark-square-2-alt.svg"
        height="18px"
        width="18px"
        id="`+ key +`tp3img"/>
        ` + sdks[key]["NAME"] + `
      </button>
    `
    }
  })
  if (html == "") {
    html += `
    <button
      id="mod-2w-smooth-1"
      type="button"
      class="btn btn-sm text-nowrap btn-outline-secondary-alt disabled">
      No Third Parties Detected
    </button>
  `
  }
  $('#mod-2w-sdk-usage').html(html)
  $('#mod-2w-smooth-1').click(function(){
    document.getElementById('section-2').scrollIntoView({behavior: 'smooth'})
  })
  $('.tp3').each(function(){
    let sdkTechName = $(this).attr('id').slice(0, -6)
    $(this).off()
    $(this).click(function(){
      $('#mod-2w-collapse').collapse('hide')
      $('.tp0').removeClass('focus')
      document.getElementById(sdkTechName + "tpbtn").scrollIntoView({
        behavior: 'smooth', block: "nearest", inline: "nearest"
      });
      $('#'+ sdkTechName + "tpbtn").addClass('focus')
      if (sdks[sdkTechName]["EVIDENCE"] == null) {
        inflateSDKCollapseAlt(sdkTechName)
      } else {
        inflateSDKCollapseMain(sdkTechName)
      }
      $('#mod-2w-collapse-sdks').collapse('show')
    })
  })
  $('#mod-2w-close-1').off().click(function(){
    $('.tp0').removeClass('focus')
  })
}

/**
* @desc ""
* @params n/a
* @return void
*/
function inflateCollapseAlt(permission) {
  let html = `
  <div class="d-flex flex-row mb-2">
    <div>
      <h3 class="m-0">` + additionalPermissions[permission]["NAME"] + `</h3>
    </div>
    <div class="ml-2 align-self-center">
    <a 
      href="#" 
      class="badge badge-danger badge-pill"
      id="mod-2w-collpase-sdks-edit-1">
      Delete
    </a>
    </div>
    <button 
      type="button" 
      class="btn close ml-auto pl-2"
      data-toggle="collapse" 
      data-target="#mod-2w-collapse"
      id="mod-2w-close-1"
      >
      <div class="close-char">
        <span aria-hidden="true">&times;</span>
      </div>
  </button>
  </div>
  <div class="d-flex flex-column mt-2">
    <h3 class="m-0 mb-1">Third Party Usage</h3>
    <small>Add, edit, and delete third parties at the beginning of <a href="#section-2">this Section</a>.</small>
    <div
      style="width: 100%;"
      class="d-flex flex-row flex-nowrap overflow-auto align-items-center"
      id="mod-2w-sdk-usage">
    </div>
  </div> 
  `
  $('#mod-2w-collapse-data').html(html)
  smoothScroll()
  $('#mod-2w-collpase-sdks-edit-1').off().click(function(){
    delete additionalPermissions[permission]
    $('#mod-2w-collapse').collapse('hide')
    inflatePermissionButtons()
    updatePolicy()
  })
  html = ""
  $.each(additionalPermissions[permission]["SDKS"], function(key, value) {
    if (sdks[key]["USED"] && additionalPermissions[permission]["SDKS"][key]["USED"]) {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-tp text-nowrap font-weight-bold tp3"
        id="` + key +`tp3btn">
        <img
        src="img/checkmark-square-2-alt.svg"
        height="18px"
        width="18px"
        id="`+ key +`tp3img"/>
        ` + sdks[key]["NAME"] + `
      </button>
    `
    }
  })
  if (html == "") {
    html += `
    <button
      type="button"
      id="mod-2w-smooth-2"
      class="btn btn-sm text-nowrap btn-outline-secondary-alt disabled">
      No Third Parties Detected
    </button>
  `
  }
  $('#mod-2w-sdk-usage').html(html)
  $('#mod-2w-smooth').click(function(){
    document.getElementById('section-2').scrollIntoView({behavior: 'smooth'})
  })
  $('.tp3').each(function(){
    let sdkTechName = $(this).attr('id').slice(0, -6)
    $(this).off()
    $(this).click(function(){
      $('#mod-2w-collapse').collapse('hide')
      $('.tp0').removeClass('focus')
      document.getElementById(sdkTechName + "tpbtn").scrollIntoView({
        behavior: 'smooth', block: "nearest", inline: "nearest"
      });
      $('#'+ sdkTechName + "tpbtn").addClass('focus')
      if (sdks[sdkTechName]["EVIDENCE"] == null) {
        inflateSDKCollapseAlt(sdkTechName)
      } else {
        inflateSDKCollapseMain(sdkTechName)
      }
      $('#mod-2w-collapse-sdks').collapse('show')
    })
  })
  $('#mod-2w-close-1').off().click(function(){
    $('.tp0').removeClass('focus')
  })

}

function updatePolicy(){
  let temp = new Set()
  let html0 = ""
  let html1 = ""
  let html2 = ""
  let htmlAlt = ""
  $.each(sdkPractices, function(permission, val0){
    let tempHtml = ""
    $.each(val0, function(sdk, val1) {
      if (sdkPractices[permission][sdk]["USED"] && sdks[sdk]["USED"]) {
        let purpose = sdkPractices[permission][sdk]['PURPOSE']
        if (purpose == "") {
          purpose = "Usage Description Not Supplied"
        }
        tempHtml += `
          <li>
            <strong>`+ sdks[sdk]["NAME"] +`</strong>
            <div>Purpose: `+ purpose +`</div>
          </li>
        `
        temp.add(sdk)
      }
    })
    if (tempHtml != "") {
      html0 += `
      <li>
        <strong>`+ decodePermission(permission) +`</strong>
        <ul>`+ tempHtml +`</ul
      </li>
      <br>`
    } 
  })
  $.each(additionalPermissions, function(permission, val0){
    let tempHtml = ""
    $.each(val0["SDKS"], function(sdk, val1) {
      if (additionalPermissions[permission]["SDKS"][sdk]["USED"] && sdks[sdk]["USED"]) {
        let purpose = additionalPermissions[permission]["SDKS"][sdk]['PURPOSE']
        if (purpose == "") {
          purpose = "Usage Description Not Supplied"
        }
        tempHtml += `
          <li>
            <strong>`+ sdks[sdk]["NAME"] +`</strong>
            <div>Purpose: `+ purpose +`</div>
          </li>
        `
        temp.add(sdk)
      }
    })
    if (tempHtml != "") {
      htmlAlt += `
      <li>
        <strong>`+ additionalPermissions[permission]["NAME"] +`</strong>
        <ul>`+ tempHtml +`</ul
      </li>
      <br>`
    } 
  })
  $.each(sdks, function(key, value){
    if (sdks[key]["USED"] && !(temp.has(key))) {
      html1 += `
        <li>
          <strong>`+ sdks[key]["NAME"] +`</strong>
        </li>
      `
    }
  })
  if (html0 != "") {
    html0 = `
      <p>
      <span class="app-name"></span> integrates various third party services. If you grant <span class="app-name"></span> permission, we may share your personal information as follows:
      </p>
      ` + `<ul>` + html0.slice(0, -4) + `</ul>
    `
  }
  if (html1 != "") {
    html1 = `
    <p>
    <span class="app-name"></span> integrates the following third party services that are not requesting any permission:
    </p>
    ` + `<ul>` + html1 + `</ul>
  
    `
  }
  if (html1 != "" || html0 != "") {
    html2 = `
    <p>
      All third party services may receive technical information about your device, for example, its IP address or operating system version. Also, they may keep your personal information over time and across different apps and websites.
    </p>
    `
  }
  if (html0 == "" && html1 == "" && html2 =="") {
    $('#mod-2p-practices').html(`
    <p>We do not share any personal information.</p>
    `)
  } else {
    $('#mod-2p-practices').html(html0 + html1 + html2)
  }
  if (htmlAlt != "") {
    htmlAlt = `
      <p>In addition, we are sharing the following personal information:</p>
      ` + `<ul>` + htmlAlt.slice(0, -4) + `</ul>
    `
    $('#mod-2p-practices-alt').html(htmlAlt)
  } else {
    $('#mod-2p-practices-alt').html("")
  }
  updateAppName()
}

/**
* @desc loads current mod (module)
* @params n/a
* @return void
*/
export function mod2() {
  inflatePermissionButtons()
  inflateThirdPartyButtons()
  setDefaults()
  updatePolicy()
}