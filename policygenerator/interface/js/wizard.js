/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

wizard.js loads the results from the app analysis and starts the main interface
  - The wizard is divided into 13 Sections (mods or modules) where each Section
    of the wizard controls and updates its corresponding policy Section
*/


import { modHeader } from './mods/mod_header.js'
import { mod1 } from './mods/mod1.js'
import { mod2 } from './mods/mod2.js'
import { mod3 } from './mods/mod3.js'
import { mod4 } from './mods/mod4.js'
import { mod5 } from './mods/mod5.js'
import { mod6 } from './mods/mod6.js'
import { mod7 } from './mods/mod7.js'
import { mod8 } from './mods/mod8.js'
import { mod9 } from './mods/mod9.js'
import { mod10 } from './mods/mod10.js'
import { mod11 } from './mods/mod11.js'
import { mod12 } from './mods/mod12.js'
import { modFooter } from './mods/mod_footer.js'
import { utilities } from './utilities.js'


// Global values to be loaded with analyzed results as json object
export var practices, sdks, sdkPractices

/**
* @desc sets values of global variables; loads each module; brings in
*       policy and wizard
* @params (p : string, l: string:, s:string) - results from code analysis where
*         p is practices and t is thirdPartyAnalysis
* @return void
*/
export function startWizard(p, l, s){
  practices = JSON.parse(p)
  sdks = JSON.parse(l)
  sdkPractices = JSON.parse(s)
  modHeader()
  mod1()
  mod2()
  mod3()
  mod4()
  mod5()
  mod6()
  mod7()
  mod8()
  mod9()
  mod10()
  mod11()
  mod12()
  modFooter()
  utilities()
  $('#main,html,body').css('overflow', 'hidden');
  $('#main').css('display', 'inline')
  setTimeout(function() {
    $('#policy').addClass('slide shadow')}, 50);
  setTimeout(function() {
    $('#wizard').fadeIn('slow')
    $('.footer').addClass('slide4')
  }, 300);
};