#pragma strict

import System.Collections.Generic;
import MbjApiHelper;

var MbjApi : MbjApiHelper;


//// FOR TEST PURPOSES ///////////////////////////////
													//
	// Test toggles									//
	var testAuthenticateUser	: boolean;			//
	var testDeleteBean	 		: boolean;			//
	var testGetApps 			: boolean;			//
	var testGetAward 			: boolean;			//
	var testGetBeans 			: boolean;			//
	var testGetCategories		: boolean;			//
	var testGetSponsorLocation	: boolean;			//
	var testGetSponsors 		: boolean;			//
	var testRedeemBean 			: boolean;			//
	var testRegisterUser		: boolean;			//
	var testGetWinners 			: boolean;			//
	var testSendPassword		: boolean;			//
	var testValidateUser		: boolean;			//
													//
	// Test data (to be entered from Inspector)		//												
	var username				: String;			//
	var password				: String;			//
	var beankey					: String;			//
	var resultLimit				: int;				//
	var email					: String;			//
	var zipcode					: String;			//
	var registrationCategories	: List.<String>;	//
	var sortby					: String;			//
	var sponsorkey				: String;			//
													//
//////////////////////////////////////////////////////

	    


	

function Awake() {
	
	MbjApi = GetComponent(MbjApiHelper);

}

function Start () {
	
}

function Update () {

	MbjTester();

}




//
// Dummy callback for testing
//
function TestCallback(result, payload) {
	Debug.Log("Calling back! " + result);
}

//
// Checkbox-based test for each API method
//
function MbjTester() {

	// Set default callback for testing
	var callback : Function = TestCallback;
	
	
	if (testAuthenticateUser){
		testAuthenticateUser = false;
		MbjApi.authenticate_user(username, password, callback);
	}
	else if (testDeleteBean){
		testDeleteBean = false;
		MbjApi.delete_bean(username, password, beankey, callback);
	}
	else if (testGetApps){
		testGetApps = false;
		MbjApi.get_apps(username, password, resultLimit, callback);
	}
	else if (testGetAward){
		testGetAward = false;
		MbjApi.get_award(username, password, MbjApi.mbjAppID, callback);
	}
	else if (testGetBeans){
		testGetBeans = false;
		MbjApi.get_beans(username, password, resultLimit, sortby, callback);
	}
	else if (testGetCategories){
		testGetCategories = false;
		MbjApi.get_categories(username, password, callback);
	}
	else if (testGetSponsorLocation){
		testGetSponsorLocation = false;
		MbjApi.get_locations_for_sponsor(username, password, sponsorkey, callback);
	}
	else if (testGetSponsors){
		testGetSponsors = false;
		MbjApi.get_sponsors(username, password, resultLimit, callback);
	}
	else if (testRedeemBean){
		testRedeemBean = false;
		MbjApi.reedem_bean(username, password, beankey, callback);
	}
	else if (testRegisterUser){
		testRegisterUser = false;
		var categoryString = MbjApi.BuildListString(registrationCategories);
		MbjApi.register_user(username, password, email, zipcode, categoryString, callback);
	}
	else if (testGetWinners){
		testGetWinners = false;
		MbjApi.get_winners(resultLimit, callback);
	}
	else if (testSendPassword){
		testSendPassword = false;
		MbjApi.send_password(username, callback);
	}
	else if (testValidateUser){
		testValidateUser = false;
		MbjApi.validate_user(username, callback);
	}

}
