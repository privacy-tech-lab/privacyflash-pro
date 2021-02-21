/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

mod7.js adds and controls functionality of wizard and policy 
  (Section 7 of the wizard and policy)
*/

import { sdkPractices, practices, sdks } from '../wizard.js'
import { decodePermission, updateAppName, smoothScroll, scrollHorizontalEnd } from '../utilities.js'

var fpInfo = {}
var tpInfo = {}
var count = 0

function setDefaults(){
  $('#mod-7w-r0-yes, #mod-7w-r1-yes, #mod-7w-r2-yes, #mod-7w-r0-no, #mod-7w-r1-no, #mod-7w-r2-no')
  .click(function(){
    if (!$("input:radio[name='mod-7w-r0']").is(":checked") || 
      !$("input:radio[name='mod-7w-r1']").is(":checked") ||
      !$("input:radio[name='mod-7w-r2']").is(":checked")
    ) {
      updatePolicy()
      $('#mod-7w-collapse').collapse('hide')
    } else if ($('#mod-7w-r2-yes').prop("checked") && 
    ($('#mod-7w-r1-yes').prop("checked") || $('#mod-7w-r0-yes').prop("checked"))) {
      $('#mod-7w-coppa-info').html('COPPA is applicable to your app.')
      $('#mod-7w-more, #mod-7w-coppa-info').fadeIn()
      updatePolicy()
    } else {
      $('#mod-7w-coppa-info').fadeIn()
      $('#mod-7w-coppa-info').html('COPPA is not applicable to your app.')
      $('#mod-7w-more').fadeOut()
      updatePolicy()
      $('#mod-7w-collapse').collapse('hide')
    }
  })
  $('#mod-7w-more').click(function(){
    $('#mod-7w-collapse').collapse('show')
  })
  $.each(sdkPractices, function(key, value){
    if (key != "FACEBOOK" && key != "GOOGLE" && key != "PURCHASES") {
      tpInfo[count] = {
        "NAME": decodePermission(key),
        "SDKS": JSON.parse(JSON.stringify(value)),
        "DEFAULT": true
      }
      count ++
    }
  })
  $.each(practices, function(key, value){
    if (key != "FACEBOOK" && key != "GOOGLE" && key != "PURCHASES") {
      fpInfo[count] = {
        "NAME": decodePermission(key),
        "PURPOSE" : JSON.parse(JSON.stringify(practices[key]['evidence']['usageDescription'])),
        "USED": JSON.parse(JSON.stringify(practices[key]['used'])),
        "DEFAULT": true
      }
      count ++
    }
  })
  $('#mod-7w-r3-yes').click(function (){
    $('.mod-7w-input-0').fadeIn()
    updatePolicy()
  })
  $('#mod-7w-r3-no').click(function (){
    $('.mod-7w-input-0').fadeOut()
    updatePolicy()
  })
  $('#mod-7w-input-0').on('input', function(){
    updatePolicy()
  })
  $('#mod-7w-input-1').on('input', function(){
    updatePolicy()
  })

  inflateFPInfoBtns()
  $('#mod-7w-collapse-add-fp').click(function(){
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
      data-target="#mod-7w-collapse-fp"
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
          id="mod-7w-input-add-fp">
        <div class="mt-2"><small>Purpose</small></div>
        <input 
          class="font-weight-bold"
          type="text" 
          placeholder="Enter purpose" 
          id="mod-7w-input-purpose-fp">
        <a 
          href="#" 
          class="badge badge-dark badge-pill align-self-start mt-3"
          id="mod-7w-add-fp">
          Add
        </a>
      </div>
    </div>    
  </div>
    `
    $('.fpInfo').removeClass('focus')
    $('#mod-7w-collapse-fp').html(html)
    $('#mod-7w-add-fp').off()
    $('#mod-7w-add-fp').click(function(){
      if ($('#mod-7w-input-add-fp').val() != "" && $('#mod-7w-input-purpose-fp').val() != "") {
        $('#mod-7w-input-add-fp').attr('placeholder', 'Enter category')
        $('#mod-7w-input-purpose-fp').attr('placeholder', 'Enter purpose')
        fpInfo[count] = {
          "NAME": $('#mod-7w-input-add-fp').val(),
          "PURPOSE" : $('#mod-7w-input-purpose-fp').val(),
          "USED": true,
          "DEFAULT": false
        }
        count ++
        inflateFPInfoBtns()
        $('#mod-7w-input-purpose-fp, #mod-7w-input-add-fp').val("")
        scrollHorizontalEnd('mod-7w-fp')
        updatePolicy()
      } else {
        $('#mod-7w-input-add-fp').attr('placeholder', 'This field is required.')
        $('#mod-7w-input-purpose-fp').attr('placeholder', 'This field is required.')
      }
    })
    $('#mod-7w-collapse-fp').collapse('show')
  })

  inflateTPInfoBtns()
  $('#mod-7w-collapse-tpInfo-add').click(function(){
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
      data-target="#mod-7w-collapse-tpInfo"
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
          id="mod-7w-input-add-tpInfo">
        <a 
          href="#" 
          class="badge badge-dark badge-pill align-self-start mt-3"
          id="mod-7w-add-tpInfo">
          Add
        </a>
      </div>
    </div>    
  </div>
    `
    $('.tpInfo').removeClass('focus')
    $('#mod-7w-collapse-tpInfo').html(html)
    $('#mod-7w-add-tpInfo').off()
    $('#mod-7w-add-tpInfo').click(function(){
      if ($('#mod-7w-input-add-tpInfo').val() != "") {
        $('#mod-7w-input-add-tpInfo').attr('placeholder', 'Enter category' )
        tpInfo[count] = {
          "NAME": $('#mod-7w-input-add-tpInfo').val(),
          "SDKS": {},
          "DEFAULT": false
        }
        count ++
        inflateTPInfoBtns()
        $('#mod-7w-input-add-tpInfo').val("")
        scrollHorizontalEnd('mod-7w-tpInfo')
      } else {
        $('#mod-7w-input-add-tpInfo').attr('placeholder', 'This field is required.' )
      }
    })
    $('#mod-7w-collapse-tpInfo').collapse('show')
  })
}

function inflateTPInfoBtns(){
  let html = ""
  $.each(tpInfo, function(key, value) {
    let usage = false
    $.each(tpInfo[key]["SDKS"], function(sdkTechName, value){
      if (sdks[sdkTechName]["USED"] && 
        tpInfo[key]["SDKS"][sdkTechName]["USED"]) {
        usage = true
        return false
      }
    })
    if (usage) {
      html +=`
      <button
        type="button" 
        class="btn btn-sm btn-outline-info-alt text-nowrap font-weight-bold tpInfo"
        id="` + key + `tpInfo-btn">
        <img
        class="mr-2"
        src="img/checkmark-square-2.svg"
        height="18px"
        width="18px"
        id="`+ key +`tpInfo-img"/>`+tpInfo[key]["NAME"]+`
      </button>
    `
    } else {
      html +=`
      <button
        type="button" 
        class="btn btn-sm btn-outline-secondary-alt text-nowrap tpInfo"
        id="` + key + `tpInfo-btn">
        <img
        class="mr-2"
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"
        id="`+ key +`tpInfo-img"/>`+tpInfo[key]["NAME"]+`
      </button>
    `
    }
  })
  $('#mod-7w-tpInfo').html(html + '&nbsp;&nbsp;')
  $('.tpInfo').off()
  $('.tpInfo').each(function(){
    let id = $(this).attr('id')
    let key = id.slice(0, -10)
    $(this).click(function(){
      $('.tpInfo').removeClass('focus')
      $(this).addClass('focus')
      inflateCollapse(key)
      $('#mod-7w-collapse-tpInfo').collapse('show')
    })
  })
}

function inflateCollapse(key){
  let visibility = ''
  if (tpInfo[key]["DEFAULT"]) {
    visibility = 'd-none'
  }
  let html = `
  <div class="card card-body">
    <div class="d-flex flex-row">
      <div>
        <h3 style="margin: 0%;">`+tpInfo[key]["NAME"]+`</h3>
      </div>
      <a 
      href="#" 
      class="badge badge-danger badge-pill align-self-end ml-2 `+visibility+`"
      id="mod-7w-delete-tpInfo">
      Delete
      </a>
      <button 
      type="button" 
      class="btn close pl-2 ml-auto"
      data-toggle="collapse"
      id="mod-7w-collapse-close-tpInfo"
      data-target="#mod-7w-collapse-tpInfo"
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
      class="d-flex flex-row flex-nowrap overflow-auto pb-2 align-items-center"
      id="mod-7w-sdks-0">
      <!-- Third parties injected here -->
      </div>
      <div class="d-flex flex-column" id="mod-7w-sdks-0-info"></div>
    </div>    
  </div>
  `
  $('#mod-7w-collapse-tpInfo').html(html)
  smoothScroll()
  $('#mod-7w-collapse-close-tpInfo').off().click(function(){
    $('.tpInfo').removeClass('focus')
  })
  $('#mod-7w-delete-tpInfo').off().click(function(){
    delete tpInfo[key]
    inflateTPInfoBtns()
    $('.tpInfo').removeClass('focus')
    $('#mod-7w-collapse-tpInfo').collapse('hide')
    updatePolicy()
  })
  injectSDKS(key)
}

function injectSDKS(category) {
  let html = ""
  $.each(sdks, function(key, value) {
    if (!(key in tpInfo[category]['SDKS'])) {
      tpInfo[category]['SDKS'][key] =
        {"USED": false, "PURPOSE": sdks[key]["PURPOSE"]}
    }
    if (sdks[key]["USED"] 
    && tpInfo[category]["SDKS"][key]["USED"]) {
      html += `
        <button
          type="button" 
          class="btn btn-sm btn-outline-tp text-nowrap mod7w font-weight-bold"
          id="` + key + `mod7w">
          <img
          src="img/checkmark-square-2-alt.svg"
          height="18px"
          width="18px"
          id="`+ key +`mod7w"/>
          <span>`+sdks[key]["NAME"]+`</span>
        </button>
      `
    } else if (sdks[key]["USED"] != null) {
      html += `
        <button
          type="button" 
          class="btn btn-sm btn-outline-secondary-alt text-nowrap mod7w"
          id="` + key + `mod7w">
          <img
          src="img/minus-square-outline.svg"
          height="18px"
          width="18px"
          id="`+ key +`mod7w"/>
          <span>`+sdks[key]["NAME"]+`</span>
        </button>
      `
    }
  })
  if (html == "") {
    html = `
    <button
      id="mod-7w-scroll"
      type="button"
      class="btn btn-sm text-nowrap btn-outline-secondary-alt disabled">
      No Third Parties Detected
    </button>
  `
  }
  $('#mod-7w-sdks-0').html(html + '&nbsp;&nbsp')
  $('#mod-7w-scroll').click(function(){
    document.getElementById('section-2').scrollIntoView({behavior: 'smooth'})
  })
  $('.mod7w').off()
  $('.mod7w').each(function(){
    $(this).click(function(){
      $('.mod7w').removeClass('focus')
      $(this).addClass('focus')
      let name = $(this).text().trim()
      let key = $(this).attr('id').slice(0, -5)
      let text = "Add"
      if (tpInfo[category]['SDKS'][key]["USED"]) {
        text = "Remove"
      }

      let html = `
      <div class="card card-body shadow-sm">
        <div class="d-flex flex-row mb-2">
        <h3 class="m-0">`+name+`</h3>
        <a 
          href="#" 
          class="badge badge-dark badge-pill ml-2 align-self-center"
          id="mod-7w-usage-0">
          `+text+`
        </a>
        </div>
        <div><small>Purpose</small></div>
        <input 
          type="text" 
          id="mod-7w-input-purpose-0"
          value="`+tpInfo[category]['SDKS'][key]["PURPOSE"]+`"
          placeholder="We use this personal information to...">
      </div>
      `
      $('#mod-7w-sdks-0-info').html(html)
      $('#mod-7w-usage-0').off()
      $('#mod-7w-usage-0').click(function(){
        if (tpInfo[category]['SDKS'][key]["USED"]) {
          $(this).text("Add")
        } else {
          $(this).text("Remove")
        }
        tpInfo[category]['SDKS'][key]["USED"] = 
          !tpInfo[category]['SDKS'][key]["USED"]
        inflateTPInfoBtns()
        $('#'+category+'tpInfo-btn').addClass('focus')
        injectSDKS(category)
        $('#' + key + 'mod7w').addClass('focus')
        updatePolicy()
      })
      $('#mod-7w-input-purpose-0').off()
      $('#mod-7w-input-purpose-0').on('input', function(){
        tpInfo[category]['SDKS'][key]["PURPOSE"] = $(this).val()
        updatePolicy()
      })
    })
  })
}

function inflateFPInfoBtns(){
  let html = ""
  $.each(fpInfo, function(key, value) {
    if (fpInfo[key]["USED"]) {
      html +=`
      <button
        type="button" 
        class="btn btn-sm btn-outline-info-alt text-nowrap font-weight-bold fpInfo"
        id="` + key + `fpInfo-btn">
        <img
        class="mr-2"
        src="img/checkmark-square-2.svg"
        height="18px"
        width="18px"
        id="`+ key +`fpInfo-img"/>`+fpInfo[key]["NAME"]+`
      </button>
    `
    } else {
      html +=`
      <button
        type="button" 
        class="btn btn-sm btn-outline-secondary-alt text-nowrap fpInfo"
        id="` + key + `fpInfo-btn">
        <img
        class="mr-2"
        src="img/minus-square-outline.svg"
        height="18px"
        width="18px"
        id="`+ key +`fpInfo-img"/>`+fpInfo[key]["NAME"]+`
      </button>
    `
    }
  })
  $('#mod-7w-fp').html(html + '&nbsp;&nbsp;')
  $('.fpInfo').off()
  $('.fpInfo').each(function(){
    let id = $(this).attr('id')
    let key = id.slice(0, -10)
    $(this).click(function(){
      $('.fpInfo').removeClass('focus')
      $(this).addClass('focus')

      let text = "Add"
      if (!fpInfo[key]["DEFAULT"]){
        text = "Delete"
      } else if (fpInfo[key]["USED"]) {
        text = 'Remove'
      }
          let html = `
          <div class="card card-body">
            <div class="d-flex flex-row align-items-center">
              <div>
                <h3 style="margin: 0%;">`+fpInfo[key]["NAME"]+`</h3>
              </div>
              <a 
              href="#" 
              class="badge badge-dark badge-pill ml-2"
              id="mod-7w-edit-fp">
              `+ text +`
              </a>
              <button 
              type="button" 
              class="btn close pl-2 ml-auto"
              data-toggle="collapse"
              id="mod-7w-close-fpInfo"
              data-target="#mod-7w-collapse-fp"
              >
              <div class="close-char">
                  <span aria-hidden="true">&times;</span>
              </div>
            </button>
            </div>
            <div class="d-flex flex-column mt-1">
              <div><small>Purpose</small></div>
              <input 
                type="text" 
                id="mod-7w-input-purpose-fp"
                value="`+fpInfo[key]["PURPOSE"]+`"
                placeholder="This personal information is used to...">
            </div>    
          </div>
          `
          $('#mod-7w-collapse-fp').html(html)
          if (!fpInfo[key]["DEFAULT"]){
            $('#mod-7w-edit-fp')
              .removeClass('badge-dark')
              .addClass('badge-danger')
              $('#mod-7w-edit-fp').off().click(function(){
                delete fpInfo[key]
                $('#mod-7w-collapse-fp').collapse('hide')
                inflateFPInfoBtns()
                updatePolicy()
              })
          } else {
          $('#mod-7w-edit-fp').off().click(function(){
            if (fpInfo[key]["USED"]) {
              $(this).text("Add")
            } else {
              $(this).text("Remove")
            }
            fpInfo[key]["USED"] = !fpInfo[key]["USED"]
            inflateFPInfoBtns()
            $('#' + key + 'fpInfo-btn').addClass('focus')
            updatePolicy()
          })
        }
          
          $('#mod-7w-close-fpInfo').off()
          $('#mod-7w-close-fpInfo').click(function(){
            $('.fpInfo').removeClass('focus')
          })

          $('#mod-7w-input-purpose-fp').off()
          $('#mod-7w-input-purpose-fp').on('input', function(){
            fpInfo[key]["PURPOSE"] = $(this).val()
            updatePolicy()
          })

      $('#mod-7w-collapse-fp').collapse('show')
    })
  })
}

function updatePolicy(){
  let html =""
  if($('#mod-7w-r2-yes').prop("checked") && 
  ($('#mod-7w-r1-yes').prop("checked") || $('#mod-7w-r0-yes').prop("checked"))) 
  {
    let firstPartyInfo =""
    let thirdPartyInfo= ""

    $.each(tpInfo, function(key, value){
      let tempHtml = ""
      $.each(tpInfo[key]["SDKS"], function(sdkTechName, value){
        if (sdks[sdkTechName]["USED"] &&
        tpInfo[key]["SDKS"][sdkTechName]["USED"]) {
        let purpose = tpInfo[key]["SDKS"][sdkTechName]["PURPOSE"]
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
        thirdPartyInfo +=`
        <li>
          <strong>`+ tpInfo[key]["NAME"] +`</strong>
          <ul>`+ tempHtml +`</ul
        </li><br>`
      }
    })

    $.each(fpInfo, function(key, value){
      if (fpInfo[key]["USED"]) {
        let purpose = fpInfo[key]["PURPOSE"] 
        if (purpose == "" ) {
          purpose = "Usage Description Not Supplied"
        }
        firstPartyInfo +=`
        <li>
          <strong>`+ fpInfo[key]["NAME"] +`</strong>
          <div>`+ purpose +`</div>
        </li><br>`
      }
    })

    let t0 = 'do not'
    let t1 = ""
    if ($('#mod-7w-r3-yes').prop('checked')) {
      t0 = 'do'
      t1 = $('#mod-7w-input-0').val()
    }

    if (firstPartyInfo != "" && thirdPartyInfo != "") {
      html = `
      <div id="children-categories">
        <p>
          <span class="app-name"></span> can be used by children. We collect and maintain the personal information from children and use it for the following purposes:
        </p>
        <ul>`+ firstPartyInfo.slice(0, -4) +`</ul>
      </div>

      <div id="children-disclosure">
        <p>
          We `+t0+` enable a child to make personal information publicly available. `+ t1 +`
        </p>
      </div>

      <div id="children-third-parties">
        <p>
          The following third party services integrated in <span class="app-name"></span> also collect and maintain personal information from children:
        </p>
      </div>

      <ul>`+ thirdPartyInfo.slice(0, -4) +`</ul>

      <p>
          If you are a parent, you can review or request deletion of the personal information of your child. You can also refuse to permit further collection or use of your child’s personal information. If you would like to make use of these rights or if you have questions on our privacy policy and use of children’s information, please contact us at the contact information <a href='#contact_us'>below</a>.
      </p>
      `
    } else if (firstPartyInfo != "") {
      html = `
      <div id="children-categories">
        <p>
          <span class="app-name"></span> can be used by children. We collect and maintain the personal information from children and use it for the following purposes:
        </p>
        <ul>`+ firstPartyInfo.slice(0, -4) +`</ul>
      </div>
      
      <div id="children-third-parties"></div>

      <div id="children-disclosure">
        <p>
          We `+t0+` enable a child to make personal information publicly available. `+t1+`
        </p>
      </div>

      <p>
      If you are a parent, you can review or request deletion of the personal information of your child. You can also refuse to permit further collection or use of your child’s personal information. If you would like to make use of these rights or if you have questions on our privacy policy and use of children’s information, please contact us at the contact information <a href='#contact_us'>below</a>.
      </p>
      `
    } else if (thirdPartyInfo != "") {
      html = `

      <div id="children-categories"></div>

      <div id="children-third-parties">

      <div id="children-disclosure">
        <p>
          We `+t0+` enable a child to make personal information publicly available. `+ t1 +`
        </p>
      </div>

        <p>
          The following third party services integrated in <span class="app-name"></span> collect and maintain personal information from children:
        </p>
      </div>

      <ul>`+ thirdPartyInfo.slice(0, -4) +`</ul>

      <p>
        If you are a parent, you can review or request deletion of the personal information of your child. You can also refuse to permit further collection or use of your child’s personal information. If you would like to make use of these rights or if you have questions on our privacy policy and use of children’s information, please contact us at the contact information <a href='#contact_us'>below</a>.
      </p>
      `
    } else {
      html = `
      <div id="children-categories"></div>
      <div id="children-disclosure"></div>
      <div id="children-third-parties">
        <p>
          Neither the app nor any third party is collecting or sharing children's information.
        </p>
      </div>
      `
      
    }
  } else {
    html = `
    Users of <span class="app-name"></span> must be at least 13 years old. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child, we will take all reasonable steps to delete it as soon as possible. If you become aware that a child has provided personal information to us, please contact us at the contact information <a href='#contact_us'>below</a>.
    `
  }
  $('#mod-7p-content').html(html)
  smoothScroll()
  updateAppName()

}

export function syncMod7(){
  $('#mod-7w-collapse-tpInfo').collapse('hide')
  inflateTPInfoBtns()
  updatePolicy()
}

export function mod7() {
  setDefaults()
  updatePolicy()
}