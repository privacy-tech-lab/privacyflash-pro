/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod5.js adds and controls functionality of wizard and policy 
  (Section 5 of the wizard and policy)
*/

import { updateAppName, decodePermission, smoothScroll, scrollHorizontalEnd } from '../utilities.js'
import { sdks, sdkPractices } from '../wizard.js'

var sources = {}
var count = 0
var loginInfoCollect = false
var soldInfo = {}
var disInfo = {}

function setDefaults(){
  $('#mod-5w-r0-yes, #mod-5w-r1-yes, #mod-5w-r2-yes, #mod-5w-r3-yes, #mod-5w-r0-no, #mod-5w-r1-no, #mod-5w-r2-no, #mod-5w-r3-no')
    .click(function(){
      if (!$("input:radio[name='mod-5w-r0']").is(":checked") || 
        !$("input:radio[name='mod-5w-r1']").is(":checked") ||
        !$("input:radio[name='mod-5w-r2']").is(":checked") ||
        !$("input:radio[name='mod-5w-r3']").is(":checked")
      ) {
        updatePolicy()
        $('#mod-5w-collapse').collapse('hide')
      } else if ($("#mod-5w-r0-yes").prop("checked") && $("#mod-5w-r1-yes").prop("checked") && $("#mod-5w-r2-yes").prop("checked") && $("#mod-5w-r3-yes").prop("checked")) {
        $('#mod-5w-ccpa-info').html('The CCPA is applicable to your app.')
        $('#mod-5w-more, #mod-5w-ccpa-info').fadeIn()
        updatePolicy()
      } else {
        $('#mod-5w-ccpa-info').fadeIn()
        $('#mod-5w-ccpa-info').html('The CCPA is not applicable to your app.')
        $('#mod-5w-more').fadeOut()
        updatePolicy()
        $('#mod-5w-collapse').collapse('hide')
      }
  })
  $('#mod-5w-more').click(function(){
    $('#mod-5w-collapse').collapse('show')
  })
  $('#mod-5w-add-source').click(function(){
    let html =`
    <div class="d-flex flex-row mb-2 justify-content-between">
      <div>
        <h3 style="margin: 0%;">Add Source</h3>
      </div>
      <button 
      type="button" 
      class="btn close pl-2 ml-auto"
      data-toggle="collapse" 
      data-target="#mod-5w-collapse-1"
      >
      <div class="close-char">
          <span aria-hidden="true">&times;</span>
      </div>
      </button>
    </div>
    <div class="d-flex flex-column mt-1">
      <div class="mt-2"><small>Source</small></div>
        <input
          class="font-weight-bold" 
          type="text" 
          placeholder="Enter source (Ex. Quantcast)" 
          id="mod-5w-input-source-0">
      <div class="mt-2"><small>Category</small></div>
        <input 
          class="font-weight-bold"
          type="text" 
          placeholder="Enter category (Ex. E-mail address)" 
          id="mod-5w-input-source-1">
      <div class="mt-2"><small>Purpose</small></div>
        <input
          class="font-weight-bold"
          type="text" 
          placeholder="Enter purpose (Ex. Marketing)" 
          id="mod-5w-input-source-2">
        <a 
          href="#" 
          class="badge badge-dark badge-pill align-self-start mt-3"
          id="mod-5w-addS">
          Add
        </a>
      </div>
    </div>    
    `
    $('#mod-5w-content-1').html(html)
    $('#mod-5w-addS').click(function(){
      if ($('#mod-5w-input-source-0').val() != "" &&
        $('#mod-5w-input-source-1').val() != "" &&
        $('#mod-5w-input-source-2').val() != "") {
          $('#mod-5w-input-source-0').attr('placeholder', 'Enter source (Ex. Quantcast)')
          $('#mod-5w-input-source-1').attr('placeholder', 'Enter category (Ex. E-mail address)')
          $('#mod-5w-input-source-2').attr('placeholder', 'Enter purpose (Ex. Marketing)')
        
        sources[count] = 
          {"SOURCE": $('#mod-5w-input-source-0').val(),
          "CATEGORY": $('#mod-5w-input-source-1').val(),
          "PURPOSE": $('#mod-5w-input-source-2').val(),
          "USED": true
          }
        count ++
        updateWizard0()

        $('#mod-5w-input-source-2').val("")
        $('#mod-5w-input-source-1').val("")
        $('#mod-5w-input-source-0').val("")
        updatePolicy()
      } else {
        $('#mod-5w-input-source-0').attr('placeholder', 'This field is required')
        $('#mod-5w-input-source-1').attr('placeholder', 'This field is required')
        $('#mod-5w-input-source-2').attr('placeholder', 'This field is required')
      }
    })
    $('#mod-5w-collapse-1').collapse('show')
  })

  $('#mod-5w-input-rights').off().on('input', function(){
    updatePolicy()
  })

  $('#mod-5w-do-not-sell').on('input', function() {
    updatePolicy()
  })

  $.each(sdkPractices, function(key, value){
    if (key != "FACEBOOK" && key != "GOOGLE" && key != "PURCHASES") {
      soldInfo[count] = {
        "NAME": decodePermission(key),
        "SDKS": JSON.parse(JSON.stringify(value)),
        "DEFAULT": true
      }
      count ++
      disInfo[count] = {
        "NAME": decodePermission(key),
        "SDKS": JSON.parse(JSON.stringify(value)),
        "DEFAULT": true
      }
      count ++
    }
  })
  $('#mod-5w-r4-yes').click(function(){
    $('#mod-5w-soldInfo-more').fadeIn()
    updatePolicy()
  })
  $('#mod-5w-r4-no').click(function(){
    $('#mod-5w-soldInfo-more').fadeOut()
    updatePolicy()
  })
  $('#mod-5w-r5-yes').click(function(){
    $('#mod-5w-disInfo-more').fadeIn()
    updatePolicy()
  })
  $('#mod-5w-r5-no').click(function(){
    $('#mod-5w-disInfo-more').fadeOut()
    updatePolicy()
  })
  inflateDisInfoBtns()
  $('#mod-5w-collapse-disInfo-add').click(function(){
    let html =`
    <div class="card card-body">
    <div class="d-flex flex-row justify-content-between">
      <div>
        <h3 style="margin: 0%;">Add Category</h3>
      </div>
      <button 
      type="button" 
      class="btn close pl-2 ml-auto"
      data-toggle="collapse" 
      data-target="#mod-5w-collapse-disInfo"
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
          placeholder="Enter category" 
          id="mod-5w-input-add-disInfo">
        <a 
          href="#" 
          class="badge badge-dark badge-pill align-self-start mt-3"
          id="mod-5w-add-disInfo">
          Add
        </a>
      </div>
    </div>    
  </div>
    `
    $('.disInfo').removeClass('focus')
    $('#mod-5w-collapse-disInfo').html(html)
    $('#mod-5w-add-disInfo').off()
    $('#mod-5w-add-disInfo').click(function(){
      if ($('#mod-5w-input-add-disInfo').val() != "") {
        disInfo[count] = {
          "NAME": $('#mod-5w-input-add-disInfo').val(),
          "SDKS": {},
          "DEFAULT": false
        }
        $('#mod-5w-input-add-disInfo').attr('placeholder', 'Enter category')
        count ++
        inflateDisInfoBtns()
        $('#mod-5w-input-add-disInfo').val("")
        scrollHorizontalEnd('mod-5w-disInfo')
      } else {
        $('#mod-5w-input-add-disInfo').attr('placeholder', 'This field is required')
      }
    })
    $('#mod-5w-collapse-disInfo').collapse('show')
  })

  inflateSoldInfoBtns()
  $('#mod-5w-collapse-soldInfo-add').click(function(){
    let html =`
    <div class="card card-body">
    <div class="d-flex flex-row justify-content-between">
      <div>
        <h3 style="margin: 0%;">Add Category</h3>
      </div>
      <button 
      type="button" 
      class="btn close pl-2 ml-auto"
      data-toggle="collapse" 
      data-target="#mod-5w-collapse-soldInfo"
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
          placeholder="Enter category" 
          id="mod-5w-input-add-soldInfo">
        <a 
          href="#" 
          class="badge badge-dark badge-pill align-self-start mt-3"
          id="mod-5w-add-soldInfo">
          Add
        </a>
      </div>
    </div>    
  </div>
    `
    $('.soldInfo').removeClass('focus')
    $('#mod-5w-collapse-soldInfo').html(html)
    $('#mod-5w-add-soldInfo').off()
    $('#mod-5w-add-soldInfo').click(function(){
      if ($('#mod-5w-input-add-soldInfo').val() != "") {
        $('#mod-5w-input-add-soldInfo').attr('placeholder', 'Enter category')
        soldInfo[count] = {
          "NAME": $('#mod-5w-input-add-soldInfo').val(),
          "SDKS": {},
          "DEFAULT": false
        }
        count ++
        inflateSoldInfoBtns()
        $('#mod-5w-input-add-soldInfo').val("")
        scrollHorizontalEnd('mod-5w-soldInfo')
      } else {
        $('#mod-5w-input-add-soldInfo').attr('placeholder', 'This field is required')
      }
    })
    $('#mod-5w-collapse-soldInfo').collapse('show')
  })
  $('#mod-5w-r6-yes').click(function(){
    $('#mod-5w-f, #mod-5w-input-financial').fadeIn()
    updatePolicy()
  })
  $('#mod-5w-r6-no').click(function(){
    $('#mod-5w-f, #mod-5w-input-financial').fadeOut()
    updatePolicy()
  })
  $('#mod-5w-input-financial').on('input', function(){
    updatePolicy()
  })
  $('#mod-5w-r7-yes').click(function(){
    $('#mod-5w-annual').fadeIn()
    updatePolicy()
  })
  $('#mod-5w-r7-no').click(function(){
    $('#mod-5w-annual').fadeOut()
    updatePolicy()
  })
  $('#mod-5w-input-annual-0').on('input', function(){
    updatePolicy()
  })
  $('#mod-5w-input-annual-1').on('input', function(){
    updatePolicy()
  })
  $('#mod-5w-input-annual-2').on('input', function(){
    updatePolicy()
  })
  $('#mod-5w-input-annual-3').on('input', function(){
    updatePolicy()
  })
  $('#mod-5w-r8-yes').click(function(){
    if (
    $('#mod-5w-r8-yes').prop('checked')
    ) {
      $('#mod-5w-process, #mod-5w-input-process').fadeIn()
    }
    updatePolicy()
  })
  $('#mod-5w-r8-no').click(function(){
    $('#mod-5w-process, #mod-5w-input-process').fadeOut()
    updatePolicy()
  })
  $('#mod-5w-input-process').on('input', function(){
    updatePolicy()
  })
}

function inflateDisInfoBtns(){
  let html = ""
  $.each(disInfo, function(key, value) {
    let usage = false
    $.each(disInfo[key]["SDKS"], function(sdkTechName, value){
      if (sdks[sdkTechName]["USED"] && 
        disInfo[key]["SDKS"][sdkTechName]["USED"]) {
        usage = true
        return false
      }
    })
    if (usage) {
      html +=`
      <button
        type="button" 
        class="btn btn-sm btn-outline-info-alt text-nowrap font-weight-bold disInfo"
        id="` + key + `disInfo-btn">
        <img
        class="mr-2"
        src="img/checkmark-square-2.svg"
        height="18px"
        width="18px"
        id="`+ key +`disInfo-img"/>`+disInfo[key]["NAME"]+`
      </button>
    `
    } else {
      html +=`
      <button
        type="button" 
        class="btn btn-sm btn-outline-secondary-alt text-nowrap disInfo"
        id="` + key + `disInfo-btn">
        <img
        class="mr-2"
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"
        id="`+ key +`disInfo-img"/>`+disInfo[key]["NAME"]+`
      </button>
    `
    }
  })
  $('#mod-5w-disInfo').html(html)
  $('.disInfo').off()
  $('.disInfo').each(function(){
    let id = $(this).attr('id')
    let key = id.slice(0, -11)
    $(this).click(function(){
      $('.disInfo').removeClass('focus')
      $(this).addClass('focus')
      inflateCollapse1(key)
      $('#mod-5w-collapse-disInfo').collapse('show')
    })
  })
}

function inflateSoldInfoBtns(){
  let html = ""
  $.each(soldInfo, function(key, value) {
    let usage = false
    $.each(soldInfo[key]["SDKS"], function(sdkTechName, value){
      if (sdks[sdkTechName]["USED"] && 
        soldInfo[key]["SDKS"][sdkTechName]["USED"]) {
        usage = true
        return false
      }
    })
    if (usage) {
      html +=`
      <button
        type="button" 
        class="btn btn-sm btn-outline-info-alt text-nowrap font-weight-bold soldInfo"
        id="` + key + `soldInfo-btn">
        <img
        class="mr-2"
        src="img/checkmark-square-2.svg"
        height="18px"
        width="18px"
        id="`+ key +`soldInfo-img"/>`+soldInfo[key]["NAME"]+`
      </button>
    `
    } else {
      html +=`
      <button
        type="button" 
        class="btn btn-sm btn-outline-secondary-alt text-nowrap soldInfo"
        id="` + key + `soldInfo-btn">
        <img
        class="mr-2"
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"
        id="`+ key +`soldInfo-img"/>`+soldInfo[key]["NAME"]+`
      </button>
    `
    }
  })
  $('#mod-5w-soldInfo').html(html)
  $('.soldInfo').off()
  $('.soldInfo').each(function(){
    let id = $(this).attr('id')
    let key = id.slice(0, -12)
    $(this).click(function(){
      $('.soldInfo').removeClass('focus')
      $(this).addClass('focus')
      inflateCollapse0(key)
      $('#mod-5w-collapse-soldInfo').collapse('show')
    })
  })
}

function inflateCollapse1(key){
  let visibility = ''
  if (disInfo[key]["DEFAULT"]) {
    visibility = 'd-none'
  }
      let html = `
      <div class="card card-body">
        <div class="d-flex flex-row justify-content-between">
          <div>
            <h3 style="margin: 0%;">`+disInfo[key]["NAME"]+`</h3>
          </div>
          <a 
          href="#" 
          class="badge badge-danger badge-pill align-self-center ml-2 `+visibility+`"
          id="mod-5w-delete-disInfo">
          Delete
          </a>
          <button 
          type="button" 
          class="btn close pl-2 ml-auto"
          data-toggle="collapse"
          id="mod-5w-collapse-close-disInfo"
          data-target="#mod-5w-collapse-disInfo"
          >
          <div class="close-char">
              <span aria-hidden="true">&times;</span>
          </div>
        </button>
        </div>
        <div class="d-flex flex-column mt-1">
          <h3 class="m-0 mt-2">Third Party Usage</h3>
          <small>You may add new third parties at the beginning of <a href="#section-2">Section 2</a>.</small>
          <div
          style="width: 100%;"
          class="d-flex flex-row flex-nowrap overflow-auto mt-1 align-items-center"
          id="mod-5w-sdks-1">
          <!-- Third parties injected here -->
          </div>
          <div class="d-flex flex-column shadow-sm" id="mod-5w-sdks-1-info"></div>
        </div>    
      </div>
      `
      $('#mod-5w-collapse-disInfo').html(html)
      smoothScroll()
      $('#mod-5w-collapse-close-disInfo').off()
      $('#mod-5w-collapse-close-disInfo').click(function(){
        $('.disInfo').removeClass('focus')
      })
      $('#mod-5w-delete-disInfo').off()
      $('#mod-5w-delete-disInfo').click(function(){
        delete disInfo[key]
        inflateDisInfoBtns()
        $('.disInfo').removeClass('focus')
        $('#mod-5w-collapse-disInfo').collapse('hide')
        updatePolicy()
      })
      injectSDKS1(key)
}

function inflateCollapse0(key){
  let visibility = ''
  if (soldInfo[key]["DEFAULT"]) {
    visibility = 'd-none'
  }
      let html = `
      <div class="card card-body">
        <div class="d-flex flex-row justify-content-between">
          <div>
            <h3 style="margin: 0%;">`+soldInfo[key]["NAME"]+`</h3>
          </div>
          <a 
          href="#" 
          class="badge badge-danger badge-pill align-self-center ml-2 `+visibility+`"
          id="mod-5w-delete-soldInfo">
          Delete
          </a>
          <button 
          type="button" 
          class="btn close pl-2 ml-auto"
          data-toggle="collapse"
          id="mod-5w-collapse-close-soldInfo"
          data-target="#mod-5w-collapse-soldInfo"
          >
          <div class="close-char">
              <span aria-hidden="true">&times;</span>
          </div>
        </button>
        </div>
        <div class="d-flex flex-column mt-1">
          <h3 class="m-0 mt-2">Third Party Usage</h3>
          <small>You may add new third parties at the beginning of <a href="#section-2">Section 2</a>.</small>
          <div
          style="width: 100%;"
          class="d-flex flex-row flex-nowrap overflow-auto mt-1 align-items-center"
          id="mod-5w-sdks-0">
          <!-- Third parties injected here -->
          </div>
          <div class="d-flex shadow-sm flex-column" id="mod-5w-sdks-0-info"></div>
        </div>    
      </div>
      `
      $('#mod-5w-collapse-soldInfo').html(html)
      smoothScroll()
      $('#mod-5w-collapse-close-soldInfo').off()
      $('#mod-5w-collapse-close-soldInfo').click(function(){
        $('.soldInfo').removeClass('focus')
      })
      $('#mod-5w-delete-soldInfo').off()
      $('#mod-5w-delete-soldInfo').click(function(){
        delete soldInfo[key]
        inflateSoldInfoBtns()
        $('.soldInfo').removeClass('focus')
        $('#mod-5w-collapse-soldInfo').collapse('hide')
        updatePolicy()
      })
      injectSDKS0(key)
}

function injectSDKS1(category) {
  let html = ""
  $.each(sdks, function(key, value) {

    if (!(key in disInfo[category]['SDKS'])) {
      disInfo[category]['SDKS'][key] = 
      {"USED": false, "PURPOSE": sdks[key]["PURPOSE"]}
    }

    if (sdks[key]["USED"] && disInfo[category]['SDKS'][key]["USED"]){
      html += `
        <button
          type="button" 
          class="btn btn-sm btn-outline-tp font-weight-bold text-nowrap mod5w-1"
          id="` + key + `mod5w-1">
          <img
          src="img/checkmark-square-2-alt.svg"
          height="18px"
          width="18px"/>
          `+sdks[key]["NAME"]+`
        </button>
      `
    } else if (sdks[key]["USED"] != null) {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-secondary-alt text-nowrap mod5w-1"
        id="` + key + `mod5w-1">
        <img
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"/>
        `+sdks[key]["NAME"]+`
      </button>
    `

    }
  })
  if (html == "") {
    html += `
    <button
      type="button"
      id="mod-5w-smooth"
      class="btn btn-sm text-nowrap btn-outline-secondary-alt disabled">
      No Third Parties Detected
    </button>
  `
  }
  $('#mod-5w-sdks-1').html(html + "&nbsp;&nbsp;")
  $('#mod-5w-smooth').click(function(){
    document.getElementById('section-2').scrollIntoView({behavior: 'smooth'})
  })
  $('.mod5w-1').off()
  $('.mod5w-1').each(function(){
    $(this).click(function(){
      $('.mod5w-1').removeClass('focus')
      $(this).addClass('focus')
      let name = $(this).text().trim()
      let key = $(this).attr('id').slice(0, -7)
      if (!(key in disInfo[category]['SDKS'])) {
        disInfo[category]['SDKS'][key] = {"USED": false, "PURPOSE": ""}
      }
      let text = "Add"
      if (disInfo[category]['SDKS'][key]["USED"]) {
        text = "Remove"
      }

      let html = `
      <div class="card card-body mt-2">
        <div class="d-flex flex-row">
        <h3 class="m-0 mb-2">`+name+`</h3>
        <a 
          href="#" 
          class="badge badge-dark badge-pill ml-2 align-self-center"
          id="mod-5w-usage-1">
          `+text+`
        </a>
        </div>
        <div><small>Purpose</small></div>
        <input
          class="font-weight-bold"
          type="text" 
          id="mod-5w-input-purpose-1"
          value="`+disInfo[category]['SDKS'][key]["PURPOSE"]+`"
          placeholder="This personal information is used to...">
      </div>
      `
      $('#mod-5w-sdks-1-info').html(html)
      $('#mod-5w-usage-1').off()
      $('#mod-5w-usage-1').click(function(){
        if (disInfo[category]['SDKS'][key]["USED"]) {
          $(this).text("Add")
        } else {
          $(this).text("Remove")
        }
        disInfo[category]['SDKS'][key]["USED"] = 
          !disInfo[category]['SDKS'][key]["USED"]
        inflateDisInfoBtns()
        $('#'+category+'disInfo-btn').addClass('focus')
        injectSDKS1(category)
        $('#'+key+ "mod5w-1").addClass('focus')
        updatePolicy()
      })
      $('#mod-5w-input-purpose-1').off()
      $('#mod-5w-input-purpose-1').on('input', function(){
        disInfo[category]['SDKS'][key]["PURPOSE"] = $(this).val()
        updatePolicy()
      })
    })
  })
}

function injectSDKS0(category) {
  let html = ""
  $.each(sdks, function(key, value) {
    if (!(key in soldInfo[category]['SDKS'])) {
      soldInfo[category]['SDKS'][key] = 
      {"USED": false, "PURPOSE": sdks[key]["PURPOSE"]}
    }

    if (sdks[key]["USED"] && soldInfo[category]['SDKS'][key]["USED"]){
      html += `
        <button
          type="button" 
          class="btn btn-sm btn-outline-tp text-nowrap mod5w font-weight-bold"
          id="` + key + `mod5w">
          <img
          src="img/checkmark-square-2-alt.svg"
          height="18px"
          width="18px"/>
          <span>`+sdks[key]["NAME"]+`</span>
        </button>
      `
    } else if (sdks[key]["USED"] != null) {
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-secondary-alt text-nowrap mod5w"
        id="` + key + `mod5w">
        <img
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"/>
        `+sdks[key]["NAME"]+`
      </button>
    `     
    }
  })
  if (html == "") {
    html += `
    <button
      id="mod-5w-smooth-1"
      type="button"
      class="btn btn-sm text-nowrap btn-outline-secondary-alt disabled">
      No Third Parties Detected
    </button>
  `
  }
  $('#mod-5w-sdks-0').html(html + "&nbsp;&nbsp;")
  $('#mod-5w-smooth-1').click(function(){
    document.getElementById('section-2').scrollIntoView({behavior: 'smooth'})
  })
  $('.mod5w').off()
  $('.mod5w').each(function(){
    $(this).click(function(){
      $('.mod5w').removeClass('focus')
      $(this).addClass('focus')
      let name = $(this).text().trim()
      let key = $(this).attr('id').slice(0, -5)
      if (!(key in soldInfo[category]['SDKS'])) {
        soldInfo[category]['SDKS'][key] = {"USED": false, "PURPOSE": ""}
      }
      let text = "Add"
      if (soldInfo[category]['SDKS'][key]["USED"]) {
        text = "Remove"
      }

      let html = `
      <div class="card card-body mt-2">
        <div class="d-flex flex-row">
        <h3 class="m-0 mb-2">`+name+`</h3>
        <a 
          href="#" 
          class="badge badge-dark badge-pill ml-2 align-self-center"
          id="mod-5w-usage-0">
          `+text+`
        </a>
        </div>
        <div><small>Purpose</small></div>
        <input 
          type="text" 
          id="mod-5w-input-purpose-0"
          value="`+soldInfo[category]['SDKS'][key]["PURPOSE"]+`"
          placeholder="This personal information is used to...">
      </div>
      `
      $('#mod-5w-sdks-0-info').html(html)
      $('#mod-5w-usage-0').off()
      $('#mod-5w-usage-0').click(function(){
        if (soldInfo[category]['SDKS'][key]["USED"]) {
          $(this).text("Add")
        } else {
          $(this).text("Remove")
        }
        soldInfo[category]['SDKS'][key]["USED"] = 
          !soldInfo[category]['SDKS'][key]["USED"]
        inflateSoldInfoBtns()
        $('#'+category+'soldInfo-btn').addClass('focus')
        injectSDKS0(category)
        $('#'+key+ "mod5w").addClass('focus')
        updatePolicy()
      })
      $('#mod-5w-input-purpose-0').off()
      $('#mod-5w-input-purpose-0').on('input', function(){
        soldInfo[category]['SDKS'][key]["PURPOSE"] = $(this).val()
        updatePolicy()
      })
    })
  })
}

function updateWizard0(){
  let html = ""

  $.each(sources, function(key, value) {
    if (sources[key]["USED"]) {
      html +=`
      <button
        type="button" 
        class="btn btn-sm btn-outline-info-alt text-nowrap 5w-s font-weight-bold"
        id="` + key + `s-btn">
        <img
        class="mr-2"
        src="img/checkmark-square-2.svg"
        height="18px"
        width="18px"
        id="`+ key +`s-img"/>`+sources[key]["SOURCE"]+`
      </button>
    `
    }
  })
  if (html != "") {
    $('#mod-5w-sources').html(html)
  } else {
    $('#mod-5w-sources').html(`
      <button
        type="button"
        disabled='true' 
        class="btn btn-sm text-nowrap btn-outline-secondary-alt">
        No Sources Added
      </button>`)
  }
  $('.5w-s').off()
  $('.5w-s').each(function(){
    let id = $(this).attr('id')
    let key = id.slice(0, -5)
    
    $(this).click(function(){
      $('.5w-s').removeClass('focus')
      $(this).addClass('focus')
      let html = `
      <div class="d-flex flex-row mb-2 justify-content-between">
        <div>
          <h3 style="margin: 0%;">`+sources[key]["SOURCE"]+`</h3>
        </div>
        <a 
        href="#" 
        class="badge badge-danger badge-pill ml-2 align-self-center"
        id="mod-5w-deleteS">
        Delete
        </a>
        <button 
        type="button"
        id="mod-5w-collapse-close" 
        class="btn close pl-2 ml-auto"
        data-toggle="collapse" 
        data-target="#mod-5w-collapse-1"
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
            value="`+sources[key]["CATEGORY"]+`"
            placeholder="Enter category (Ex. E-mail address)" 
            id="mod-5w-input-source-1">
        <div class="mt-2"><small>Purpose</small></div>
          <input
            class="font-weight-bold" 
            type="text"
            value="`+sources[key]["PURPOSE"]+`" 
            placeholder="Enter purpose (Ex. Marketing)" 
            id="mod-5w-input-source-2">
        </div>
      </div>    
      `
      $('#mod-5w-content-1').html(html)
      $('#mod-5w-input-source-1').off()
      $('#mod-5w-input-source-1').on('input', function(){
        sources[key]["CATEGORY"] = $(this).val()
        updatePolicy()
      })
      $('#mod-5w-input-source-2').off()
      $('#mod-5w-input-source-2').on('input', function(){
        sources[key]["PURPOSE"] = $(this).val()
        updatePolicy()
      })
      $('#mod-5w-deleteS').off()
      $('#mod-5w-deleteS').click(function(){
        delete sources[key]
        $('#mod-5w-collapse-1').collapse('hide')
        updateWizard0()
        updatePolicy()
      })
      $('#mod-5w-collapse-close').off()
      $('#mod-5w-collapse-close').click(function(){
        $('.5w-s').removeClass('focus')
      })
      $('#mod-5w-collapse-1').collapse('show')
    })
  })
}

function updatePolicy(){
  if (!$("input:radio[name='mod-5w-r0']").is(":checked") || 
    !$("input:radio[name='mod-5w-r1']").is(":checked") ||
    !$("input:radio[name='mod-5w-r2']").is(":checked") ||
    !$("input:radio[name='mod-5w-r3']").is(":checked")
  ) {
    $('#mod-5p-content').html(`
    <div class="alert alert-info" role="alert">
      Based on your selection, this Section will be omitted in the exported privacy policy.
    </div>        
    `)
    $('#sec-title-5P').addClass('exclude')
  } else if (!$("#mod-5w-r0-yes").prop("checked") || !$("#mod-5w-r1-yes").prop("checked") || !$("#mod-5w-r2-yes").prop("checked") || !$("#mod-5w-r3-yes").prop("checked")) {
    $('#mod-5p-content').html(`
    <div class="alert alert-info" role="alert">
      Based on your selection, this Section will be omitted in the exported privacy policy.
    </div>        
    `)
    $('#sec-title-5P').addClass('exclude')
  } else {
    let html0 = ""
    if (loginInfoCollect) {
      html0 += `
        <li>
          From Facebook and Google if you sign into <span class="app-name"></span> via their services as described in <a href='#social_login'>Section 4</a>.
        </li>
      `
    }
    $.each(sources, function(key, value){
      if (sources[key]["USED"]) {
        html0 += `
        <li>
          From `+ sources[key]["SOURCE"] + ` your `+sources[key]["CATEGORY"]+` for purposes of `+ sources[key]["PURPOSE"]+`
        </li>
      `
      }
    })

    let html2 = $('#mod-5w-input-rights').attr('placeholder')
    if ($('#mod-5w-input-rights').val() != "") {
      html2 = $('#mod-5w-input-rights').val()
    }

    let html3 = ""
    $.each(soldInfo, function(key, value){
      let tempHtml = ""
      $.each(soldInfo[key]["SDKS"], function(sdkTechName, value){
        if (sdks[sdkTechName]["USED"] && 
        soldInfo[key]["SDKS"][sdkTechName]["USED"]) {
        let purpose = soldInfo[key]["SDKS"][sdkTechName]["PURPOSE"]
        if (purpose == "") {
          purpose = "Usage Description Not Supplied"
        }
        tempHtml += `
        <li>
          <strong>`+sdks[sdkTechName]["NAME"]+`</strong>
          <div>
            Purpose: `+ purpose +`
          </div>
        </li>
      `
      }
      })
      if (tempHtml != "") {
        html3 +=`
        <li>
          <strong>`+ soldInfo[key]["NAME"] +`</strong>
          <ul>`+ tempHtml +`</ul
        </li><br>`
      }
    })
    if (html3 != "" && $('#mod-5w-r4-yes').prop('checked')){
      let _html3 = ""
      if ($('#mod-5w-do-not-sell').val() != "") {
        _html3 = "our <a href='"+$('#mod-5w-do-not-sell').val() +"' target='_blank'>web form</a> or"
      }
      html3 = `
      <h3 id="california_sale_and_disclosure">Sale and Disclosure of Personal Information for Business Purposes</h3>

      <p>
        In the preceding 12 months we have sold personal information as follows:
      </p>

      <ul>`+html3.slice(0, -4)+`</ul>

      <p>
        You have the right, at any time, to request that we do not sell any of your personal information. Please submit your request via `+ _html3 +` the contact information <a href='#contact_us'>below</a>. If an agent is making the request for you, please make sure that the agent includes you in the correspondence (e.g., you are cc'ed in your agent's e-mail to us).
      </p>
      
      <p>
        We do not sell the personal information of minors under 16 years of age without affirmative authorization.
      </p>
      `

    } else {
      html3 = `
      <h3 id="california_sale_and_disclosure">Sale and Disclosure of Personal Information</h3>

      <p>
        In the preceding 12 months we have not sold any personal information and we do not sell the personal information of minors under 16 years of age without affirmative authorization.
      </p>
      `
    }
    let html4 = ""
    $.each(disInfo, function(key, value){
      let tempHtml = ""
      $.each(disInfo[key]["SDKS"], function(sdkTechName, value){
        if (sdks[sdkTechName]["USED"] && 
        disInfo[key]["SDKS"][sdkTechName]["USED"]) {
        let purpose = disInfo[key]["SDKS"][sdkTechName]["PURPOSE"]
        if (purpose == "") {
          purpose = "Usage Description Not Supplied"
        }
        tempHtml += `
        <li>
          <strong>`+sdks[sdkTechName]["NAME"]+`</strong>
          <div>
            Purpose: `+ purpose +`
          </div>
        </li>
      `
      }
      })
      if (tempHtml != "") {
        html4 +=`
        <li>
          <strong>`+ disInfo[key]["NAME"] +`</strong>
          <ul>`+ tempHtml +`</ul
        </li><br>`
      }
    })
    if (html4 != "" && $('#mod-5w-r5-yes').prop('checked')){
      html3 += `
      <p>
        In the preceding 12 months we have disclosed personal information for business purposes as follows:
      </p>

      <ul>`+html4.slice(0, -4)+`</ul>
      `
    } else {
      html3 += `
      <p>
        In the preceding 12 months we have not disclosed any personal information for business purposes.
      </p>
      `
    }
    let html5 = "<div id='california_financial_incentive'></div>"
    if($('#mod-5w-r6-yes').prop('checked')) {
      let tempHtml = ""
      if ($('#mod-5w-input-financial').val() == "") {
        tempHtml = '<span style="opacity: .25;">&lt;description of financial incentive&gt;</span>'
      } else {
        tempHtml = $('#mod-5w-input-financial').val()
      }
      html5 = `
        <h3 id="california_financial_incentive">Financial Incentive for the Sale of Personal Information</h3>

        <p>
          We are offering the following financial incentive for the sale of personal information: `+tempHtml+`
        </p>
      `
    }

    let html6 = "<div id='california_statistics'></div>"
    if ($('#mod-5w-r7-yes').prop('checked')) {
      html6 += `
      <h3 id="california_statistics">Request Statistics</h3>

      <p>
      The following statistics are required by California law and give you a summary of how many requests we received from consumers to exercise their privacy rights last calendar year and how we responded to those.
      </p>

      <p>
      Last calendar year's total numbers of requests from consumers to obtain a copy of their personal information (requests to know) that we (1) received, (2) complied with (in whole or in part), and (3) denied: 
      `+$('#mod-5w-input-annual-0').val()+`
      </p>

      <p>
      Last calendar year's total numbers of requests from consumers to delete their personal information (requests to delete) that we (1) received, (2) complied with (in whole or in part), and (3) denied:
      `+$('#mod-5w-input-annual-1').val()+`
      </p>

      <p>
      Last calendar year's total numbers of requests from consumers to opt out from the sale of their personal information (requests to opt out) that we (1) received, (2) complied with (in whole or in part), and (3) denied:
      `+$('#mod-5w-input-annual-2').val()+`
      </p>

      <p>
      Last calendar year's median numbers of days within which we substantively responded to requests from consumers to (1) know, (2) delete, and (3) opt out from the sale of their personal information:
      `+$('#mod-5w-input-annual-3').val()+`
      </p>
      `
    }

    let html7 ="<div id='california_review_changes'></div>"
    if ($('#mod-5w-r8-yes').prop('checked')
    ) {
      let tempHtml = ""
      if ($('#mod-5w-input-process').val() == "") {
        tempHtml = '<span style="opacity: .25;">&lt;description of process&gt;</span>'
      } else {
        tempHtml = $('#mod-5w-input-process').val()
      }
      html7 = `
      <h3 id="california_review_changes">Reviewing and Requesting Changes to your Personal Information</h3>

      <p>
      You can review and request changes to your personal information. `+tempHtml+`
      </p>
      `
    }

    let html = `
      <p>
        If you are a resident of California, you have the privacy rights described in this Section. You will not be discriminated against if you are making use of any of your rights. You can also authorize an agent to exercise rights on your behalf. If you have any questions or would like to exercise any of your rights, please contact us at the contact information <a href='#contact_us'>below</a>.
      </p>

      <h3 id="collection_sources">Sources from which we Collect Personal Information</h3>

      <p>
        We are collecting your personal information from the following sources:
      </p>

      <ul> 
        <li>
          From you directly via the <span class="app-name"></span> app as described in <a href='#personal_information_collection'>Section 1</a>.
        </li>
      `+html0+` 
      </ul>

      `+html3+`

      `+html5+`

      `+html6+`

      `+html7+`

      <h3 id="california_privacy_rights_disclosure">Your Privacy Rights</h3>

      <p>
        You have the right to request that we disclose to you how we process personal information. This policy describes:  
      </p>

      <ul>
        <li>
          Which categories of personal information we <a href="#personal_information_collection">collected and used</a> in the preceding 12 months
        </li>
        <li>
          Which categories of personal information we <a href="#personal_information_sharing">shared with third parties</a> in the preceding 12 months
        </li>
        <li>
          Whether we <a href="#california_sale_and_disclosure">sell or disclose</a> personal information for business purposes
        </li>
      </ul>

      <p>
        You also have the following rights:
      </p>

      <ul>
        <li>
          Right to know: Twice in a 12-month period, request a copy of your personal information that we collected, used, disclosed, and sold, if any
        </li>
        <li>
          Right to delete: Request deletion of your personal information
        </li>
        <li>
          Right to opt out: Opt out from the sale, if any, of your personal information
        </li>
      </ul>
      
      <p>
        You can exercise your privacy rights generally for free. Only in exceptional cases we may charge a reasonable fee as permitted by law to offset our administrative costs for fulfilling your request.
      </p>

      <p>
        `+html2+`
      </p>
    `
    $('#mod-5p-content').html(html)
    updateAppName()
    smoothScroll()
    $('#sec-title-5P').removeClass('exclude')
  }
}

export function syncMod5Alt() {
  $('#mod-5w-collapse-disInfo').collapse('hide')
  $('#mod-5w-collapse-soldInfo').collapse('hide')
  inflateDisInfoBtns()
  inflateSoldInfoBtns()
  updatePolicy()
}

export function syncMod5( login ){
  loginInfoCollect = login
  updatePolicy()
}

export function mod5() {
  setDefaults()
}
