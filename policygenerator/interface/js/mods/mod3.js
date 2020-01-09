/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod3.js adds and controls functionality of wizard and policy 
  (Section 3 of the wizard and policy)
*/

import { practices, sdkPractices, sdks } from './../wizard.js'
import { updateAppName, scrollHorizontalEnd, smoothScroll } from './../utilities.js'

var technologies = {}
var count = 0

function setDefaults() {

  technologies[count] = 
    {"FP": {"USED": false, "PURPOSE": ""}, "TP": {}, 
      "NAME": "IDentifier For Advertising (IDFA)"}
  count ++
  technologies[count] = 
  {"FP": {"USED": false, "PURPOSE": ""}, "TP": {}, 
    "NAME": "Cookies"}
  count ++
  technologies[count] = 
    {"FP": {"USED": false, "PURPOSE": ""}, "TP": {}, 
      "NAME": "Device Identifier"}
  count ++

  if (practices["IDFA"]["used"] == true) {
    technologies[0]["FP"]["USED"] = true
  }

  $.each(sdkPractices["IDFA"], function(key, value){
    technologies[0]["TP"][key] = 
      {"USED": true, "PURPOSE": [sdkPractices][key]["PURPOSE"]}
  })

  $('#mod-3w-add').click(function(){
    $('.tt').removeClass('focus')
    let html = `
    <div class="card card-body">
    <div class="d-flex flex-row mb-2 justify-content-between">
      <div>
        <h3 style="margin: 0%;">Add Tracking Technology</h3>
      </div>
      <button 
      type="button" 
      class="btn close pl-2 ml-auto"
      data-toggle="collapse" 
      data-target="#mod-3w-collapse"
      >
      <div class="close-char">
          <span aria-hidden="true">&times;</span>
      </div>
    </button>
    </div>
    <div class="d-flex flex-column mt-1">
      <div class="mt-2"><small>Technology</small></div>
        <input 
          class="font-weight-bold"
          type="text" 
          placeholder="Enter technology (Ex. Cookies)" 
          id="mod-3w-input">
        <a 
          href="#" 
          class="badge badge-dark badge-pill align-self-start mt-3"
          id="mod-3w-addT">
          Add
        </a>
      </div>
    </div>    
  </div>
    `
    $('#mod-3w-collapse').html(html)
    $('#mod-3w-addT').click(function(){
      let text = $('#mod-3w-input').val()
      if (text != "") {
        $('#mod-3w-input').attr('placeholder', 'Enter technology (Ex. Cookies)')
        technologies[count] = {"FP": {"USED": false, "PURPOSE": ""}, "TP": {},
          "NAME": text}
        $('#mod-3w-input').val("")
        count ++
        updateWizard()
        scrollHorizontalEnd('mod-3w-tracking')
      } else {
        $('#mod-3w-input').attr('placeholder', 'This field is required.')
      }
    })
    $('#mod-3w-collapse').collapse('show')
    $('.tt-sdks').removeClass('focus')
  })
  updateWizard()
}

function updateWizard() {

  let html = ""

  $.each(technologies, function(key, value) {
    let usage = false
    if (technologies[key]["FP"]["USED"]) {
      usage = true
    } else {
      $.each(technologies[key]["TP"], function(sdkTechName, value){
        if (sdks[sdkTechName]["USED"] && 
          technologies[key]["TP"][sdkTechName]["USED"]) {
          usage = true
          return false
        }
      })
    }
    if (usage) {
      html +=`
      <button
        type="button" 
        class="btn btn-sm btn-outline-info-alt text-nowrap tt font-weight-bold"
        id="` + key + `tt-btn">
        <img
        class="mr-2"
        src="img/checkmark-square-2.svg"
        height="18px"
        width="18px"
        id="`+ key +`tt-img"/>`+technologies[key]["NAME"]+`
      </button>
    `
    } else {
      html +=`
      <button
        type="button" 
        class="btn btn-sm btn-outline-secondary-alt text-nowrap tt"
        id="` + key + `tt-btn">
        <img
        class="mr-2"
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"
        id="`+ key +`tt-img"/>`+technologies[key]["NAME"]+`
      </button>
    `
    }
  })

  $('#mod-3w-tracking').html(html)
  $('.tt').off()
  $('.tt').each(function(){
    let id = $(this).attr('id')
    let key = id.slice(0, -6)
    $(this).click(function(){
      $('.tt').removeClass('focus')
      $(this).addClass('focus')
      injectCollapse(key)
    })
  })
}

function injectCollapse(key){

  let text = "Add"
  if(technologies[key]["FP"]["USED"]) {
    text = "Remove"
  }

  let remove = ""
  if(key == 0 || key == 1 || key == 2) {
    remove = "d-none"
  }

  let html = `
  <div class="card card-body">
  <div class="d-flex flex-row mb-2">
    <div>
      <h3 class="m-0 text-wrap text-break">` + technologies[key]["NAME"] + `</h3>
    </div>
    <a 
    href="#" 
    class=" ml-2 align-self-center badge badge-danger badge-pill `+remove+`"
    id="mod-3w-delete">
    Delete
    </a>
    <div class="ml-auto pl-2 align-self-center">
      <button 
        type="button" 
        class="btn close ml-auto"
        data-toggle="collapse" 
        data-target="#mod-3w-collapse"
        id="mod-3w-close"
        >
        <div class="close-char">
            <span aria-hidden="true">&times;</span>
        </div>
      </button>
    </div>
  </div>
  <div class="d-flex flex-column mt-2">
    <div class="d-flex flex-row">
      <h3 class="m-0">First Party Usage</h3>
      <div class="ml-2 align-self-center">
      <a 
        href="#" 
        class="badge badge-dark badge-pill"
        id="mod-3w-usage-fp">
        `+text+`
      </a>
      </div>
    </div>
    <div><small>Purpose</small></div>
    <input 
      class="font-weight-bold"
      type="text" 
      id="mod-3w-input-fp"
      value="`+technologies[key]["FP"]["PURPOSE"]+`"
      placeholder="We use this technology to..." 
    id="mod-3w-purpose-fp">
    <h3 class="m-0 mt-4">Third Party Usage</h3>
    <small>You may add new third parties at the beginning of <a href="#section-2">Section 2</a>.</small>
    <div
    style="width: 100%;"
    class="d-flex flex-row flex-nowrap overflow-auto align-items-center"
    id="mod-3w-sdks">
    <!-- Third parties injected here -->
    </div>
    <div class="collapse shadow-sm mt-2" id="mod-3w-sdk-collapse">
    </div>
  </div>
</div>      
  `
  $('#mod-3w-collapse').html(html)
  smoothScroll()
  $('#mod-3w-input-fp').off()
  $('#mod-3w-input-fp').on('input', function(){
    technologies[key]["FP"]["PURPOSE"] = $('#mod-3w-input-fp').val()
    updatePolicy()
  })
  $('#mod-3w-usage-fp').off()
  $('#mod-3w-usage-fp').click(function(){
    if(technologies[key]["FP"]["USED"]) {
      $('#mod-3w-usage-fp').text("Add")
    } else {
      $('#mod-3w-usage-fp').text("Remove")
    }
    technologies[key]["FP"]["USED"] = !technologies[key]["FP"]["USED"]
    updateWizard()
    $('#'+key+'tt-btn').addClass('focus')
    updatePolicy()
  })
  $('#mod-3w-close').off()
  $('#mod-3w-close').click(function(){
    $('.tt').removeClass('focus')
  })
  $('#mod-3w-delete').off()
  $('#mod-3w-delete').click(function(){
    $('#mod-3w-collapse').collapse('hide')
    $('.tt').removeClass('focus')
    delete technologies[key]
    updateWizard()
    updatePolicy()
  })
  inflateSDKS(key)
  $('#mod-3w-collapse').collapse('show')
}

function inflateSDKS(technology) {
  let html = ""
  $.each(sdks, function(sdkTechName, value) {
    if (!(sdkTechName in technologies[technology]["TP"])) {
      technologies[technology]["TP"][sdkTechName] = 
          {"USED": false, "PURPOSE": sdks[sdkTechName]["PURPOSE"]}
    }

    if (sdks[sdkTechName]["USED"] 
    && technologies[technology]["TP"][sdkTechName]["USED"]){
      html += `
      <button
        type="button" 
        class="btn btn-sm btn-outline-tp text-nowrap font-weight-bold tt-sdks"
        id="` + sdkTechName +`ttbtn">
        <img
        src="img/checkmark-square-2-alt.svg"
        height="18px"
        width="18px"
        id="`+ sdkTechName +`ttimg"/>
        ` + sdks[sdkTechName]["NAME"] + `
      </button>
    `
    } else if (sdks[sdkTechName]["USED"] != null) {
      html += `
      <button
        type="button" 
        class="btn btn-sm text-nowrap btn-outline-secondary-alt tt-sdks"
        id="` + sdkTechName +`ttbtn">
        <img
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"
        id="`+ sdkTechName +`ttimg"/>
        ` + sdks[sdkTechName]["NAME"] + `
      </button>
    `
    }
  })
  if (html == "") {
    html += `
    <button
      id="mod-3w-smooth"
      type="button"
      class="btn btn-sm text-nowrap btn-outline-secondary-alt disabled">
      No Third Parties Detected
    </button>
  `
  }
  $('#mod-3w-sdks').html(html + "&nbsp;&nbsp;")
  $('#mod-3w-smooth').click(function(){
    document.getElementById('section-2').scrollIntoView({behavior: 'smooth'})
  })
  $('.tt-sdks').each(function(){
    let id = $(this).attr('id')
    let sdkTechName = id.slice(0, -5)
    $(this).click(function(){
      $('.tt-sdks').removeClass('focus')
      $(this).addClass('focus')
      let text = "Add"
      if (technologies[technology]["TP"][sdkTechName]["USED"]) {
        text = "Remove"
      }
      let html = `
      <div class="card card-body">
      <div class="d-flex flex-row mb-2">
        <div>
          <h3 class="m-0 text-wrap text-break">
          ` + sdks[sdkTechName]["NAME"] + `</h3>
        </div>
        <div class="ml-2 align-self-center">
          <a 
            href="#" 
            class="badge badge-dark badge-pill"
            id="mod-3w-edit-tp">
            ` + text +`
          </a>
        </div>
      </div>
      <div class="d-flex flex-column mt-1">
        <div><small>Purpose</small></div>
        <input 
          class="font-weight-bold"
          type="text" 
          value="`+technologies[technology]["TP"][sdkTechName]["PURPOSE"]+`"
          placeholder="We use this technology to..." 
          id="mod-3w-purpose-tp">
      </div>  
    </div>
      `
      $('#mod-3w-sdk-collapse').html(html)
      $('#mod-3w-purpose-tp').off().on('input', function(){
        technologies[technology]["TP"][sdkTechName]["PURPOSE"] = $(this).val()
        updatePolicy()
      })
      $('#mod-3w-edit-tp').off().click(function(){
        if (technologies[technology]["TP"][sdkTechName]["USED"]) {
          $(this).text("Add")
        } else {
          $(this).text("Remove")
        }
        technologies[technology]["TP"][sdkTechName]["USED"] =
          !technologies[technology]["TP"][sdkTechName]["USED"]
        updateWizard()
        inflateSDKS(technology)
        $('#'+technology+'tt-btn').addClass('focus')
        $('#'+sdkTechName+'ttbtn')
        updatePolicy()
      })
      $('#mod-3w-sdk-collapse').collapse('show')
    })
  })
}

function updatePolicy(){
  let html = ""
  $.each(technologies, function(key, value) {
    let tempHtml = ""
    if (technologies[key]["FP"]["USED"]) {
      let purpose = technologies[key]["FP"]["PURPOSE"]
      if (purpose == "") {
        purpose = "Usage Description Not Supplied"
      }
      tempHtml += `
        <li>
          <strong><span class="app-name"></span> (This App)</strong>
          <div>Purpose: `+ purpose +`</div>
        </li>
    `
    }
    $.each(technologies[key]["TP"], function(sdkTechName, value){
      if (sdks[sdkTechName]["USED"] && 
        technologies[key]["TP"][sdkTechName]["USED"]) {
        let purpose = technologies[key]["TP"][sdkTechName]["PURPOSE"]
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
      html +=`
      <li>
        <strong>`+ technologies[key]["NAME"] +`</strong>
        <ul>`+ tempHtml +`</ul
      </li><br>`
    }
  })

  if (html != "") {
    html =`
    <p> 
      <span class=" app-name"></span> and the third party services it integrates are using tracking technologies as follows:
    </p>
      <ul>`+html.slice(0, -4)+`</ul>
    <p>
      These identifiers do not identify you by name. However, they identify your device and can be used to track you for purposes of personalized advertising. You can <a href="https://support.apple.com/en-us/HT202074#iOS" target="_blank"> opt out</a> from such tracking in the settings on your iOS device.
    </p>
    <p>
      <span class=" app-name"></span> is a mobile app and as such will not be responsive to Do-Not-Track (DNT) signals that you may have set up in your browser.
    </p>
  `
  } else {
    html =`Neither <span class=" app-name"></span> nor any third party services are using tracking technologies.
  `
  }
  $('#mod-3p-content').html(html)
  updateAppName();
}

export function syncMod3(){
  updateWizard()
  $('#mod-3w-collapse').collapse('hide')
  $('.tt').removeClass('focus')
  updatePolicy()
}

export function mod3() {
  setDefaults()
  updatePolicy()
}