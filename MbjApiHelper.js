#pragma strict

/*
*																														
*            LOVINGLY CRAFTED BY:																						
*                                       @@@@                        @@@@                   								
*                                      @@@@                        @@@@                   								
*                                     @@@@                        @@@@                    								
*                                    @@@@                        @@@@                    								
*       @@@@@@@@@@@@  @@@@    @@@@  @@@@@@@@@@@@  @@@@@@@@@@@@  @@@@  @@@@@@@@@@@@  @@@@   @@@@ 						
*      @@@@          @@@@    @@@@  @@@@    @@@@  @@@@    @@@@  @@@@  @@@@    @@@@    @@@@@@@  							
*     @@@@    @@@@  @@@@    @@@@  @@@@    @@@@  @@@@    @@@@  @@@@  @@@@    @@@@      @@@@  							
*            @@@@  @@@@    @@@@  @@@@    @@@@  @@@@    @@@@  @@@@  @@@@            @@@@@@@@   							
*   @@@@@@@@@@@@  @@@@@@@@@@@@  @@@@@@@@@@@@  @@@@@@@@@@@@  @@@@  @@@@@@@@@@@@   @@@@   @@@@  							
*                                            @@@@  																		
*                                           @@@@   S  T  R  A  T  E  G  I  C           									
*                                          @@@@   C  O  M  M  U  N  I  C  A  T  I  O  N           						
*                                         @@      																		                                               																		
*                                                   																	
*                                            http://subplex.com															
*		
*
*
*
*	Name: 			MbjApiHelper.js
*	Version:		v0.9
*	Date:			March 11, 2015
*	Description: 	A helper plugin to facilitate communication between Unity-based projects and the MyBeanJar API
*	URL: 			TBD
*	Author: 		Christopher Charles (cccharle@subplex.com)
*
*	Changelog: 		v0.9 	--------------------------------------------------------------------------------------
*					Initial documented release. This plugin is intended to serve as a bridge between
*					projects built in Unity and the MyBeanJar API. Unity's lack of support for JSON objects
*					out of the box as well as its draconian webplayer security restrictions can make
*					API use a real nightmare. This plugin simplifies the process by including methods
*					for parsing MyBeanJar JSON as well as bespoke classes for MyBeanJar objects.
*					
*					This helper plugin is intended to closely resemble other MyBeanJar API helpers 
*					(specifically, the HTML5/JS helper). In this way, if you are familiar with the methods
*					and response format of that helper, you should find this one very familiar.
*
*					The SimpleJSON plugin is used to simplify the process of parsing JSON objects returned 
*					from the server. A custom stringifier is used to prepare data for requests.
*
*					Most requests are strightforward in that single value parameters are supplied with each
*					API call. However, the registration process (register_user) requires an array of
*					categories to be passed. I have included a helper function (BuildListString) that takes
*					a generic list of string values and converts it into the stringified array expected by
*					the server. A special condition in the stingifier prevents this array string from being
*					double stringified.
*					
*/


import SimpleJSON;
import System.Collections.Generic;
import System.Security.Cryptography;

private var callback 	: Function;
private var result 		: String;
private var paramstring : String;
private var method;
private var params;


//// MyBeanJar API-specific vars /////////////////////////////////////////////
																		//////
	// Originally from MBJRequest.js									//////
	private var API_URL = "https://api.mybeanjar.com/json/services";	//////
	private var INTERNAL_SERVER_ERROR = "Internal Server Error";		//////
	private var STATUS_SUCCESS = "Status success";						//////
	private var STATUS_FAIL  = "Status fail";							//////
																		//////
	private var resource = "v2services";								//////
																		//////
	// MyBeanJar App ID													//////
	// visit http://www.mybeanjar.com to request a new app ID			//////
	public var mbjAppID = "6512bd43d9caa6e02c990b0a82652dca";			//////
																		//////
//////////////////////////////////////////////////////////////////////////////





//////////////////////////////////////////////////////////////////////////////
																		//////
	// MyBeanJar API class declarations									//////
																		//////
//////////////////////////////////////////////////////////////////////////////

// Winner object
public class MbjWinner {
	
	var appkey 				: String;
	var appname 			: String;
	var sponsorlogourl 		: String;
	var username 			: String;
   
	function MbjWinner(appkey:String, appname:String, sponsorlogourl:String, username:String){
		this.appkey = appkey;
		this.appname = appname;
		this.sponsorlogourl = sponsorlogourl;
		this.username = username;
	}
}



// App object
public class MbjApp {
	
	var appkey 				: String;
	var appstoreurl 		: String;
	var description 		: String;
	var iconurl 			: String;
	var name 				: String;
	var publisher 			: String;
	var publisherkey 		: String;
	var publisherurl 		: String;
   
	function MbjApp(appkey:String, appstoreurl:String, description:String, iconurl:String, name:String, publisher:String, publisherkey:String, publisherurl:String){
		this.appkey = appkey;
		this.appstoreurl = appstoreurl;
		this.description = description;
		this.iconurl = iconurl;
		this.name = name;
		this.publisher = publisher;
		this.publisherkey = publisherkey;
		this.publisherurl = publisherurl;
	}
}



// Sponsor object
public class MbjSponsor {
	
	var id 					: String;	// Listed in MBJ documentation but does not appear to be operational at this time.
	var sponsorkey 			: String;
	var name 				: String;
	var siteurl 			: String;
	var logourl 			: String;
	var category 			: String;	// Listed in MBJ documentation but does not appear to be operational at this time.
	var offer 				: String;	// Listed in MBJ documentation but does not appear to be operational at this time.
	var geocodekey 			: String;
   
	function MbjSponsor(id:String, sponsorkey:String, name:String, siteurl:String, logourl:String, category:String, offer:String, geocodekey:String){
		this.id = id;
		this.sponsorkey = sponsorkey;
		this.name = name;
		this.siteurl = siteurl;
		this.logourl = logourl;
		this.category = category;
		this.offer = offer;
		this.geocodekey = geocodekey;
	}
}



// Bean object
public class MbjBean {
	
	var beankey 				: String;
	var expirationdate 			: String;
	var game 					: String;
	var geocodekey 				: String;
	var longdescription 		: String;
	var redeembarcodeurl 		: String;
	var redemptionurl 			: String;
	var redemptionvalidation	: String;
	var shortdescription 		: String;
	var sponsorkey 				: String;
	var sponsorlogourl 			: String;
	var sponsorname 			: String;
	var sponsorurl 				: String;
	var wondate 				: String;
	var days 					: String;
   
	function MbjBean(beankey:String, expirationdate:String, game:String, geocodekey:String, longdescription:String, redeembarcodeurl:String, redemptionurl:String, redemptionvalidation:String, shortdescription:String, sponsorkey:String, sponsorlogourl:String, sponsorname:String, sponsorurl:String, wondate:String, days:String){
		this.beankey = beankey;
		this.expirationdate = expirationdate;
		this.game = game;
		this.geocodekey = geocodekey;
		this.longdescription = longdescription;
		this.redeembarcodeurl = redeembarcodeurl;
		this.redemptionurl = redemptionurl;
		this.redemptionvalidation = redemptionvalidation;
		this.shortdescription = shortdescription;
		this.sponsorkey = sponsorkey;
		this.sponsorlogourl = sponsorlogourl;
		this.sponsorname = sponsorname;
		this.sponsorurl = sponsorurl;
		this.wondate = wondate;
		this.days = days; //get_expiration_days(expirationdate);							// NEEDS TO BE FIXED
	}
	
	// Used to determine number of days until Bean expiry
	function get_expiration_days(date:String) {
//	    var expirationdate = new Date(date);												// NEEDS TO BE FIXED
//	    var now = new Date();
//	    var timeDiff = Mathf.Abs(expirationdate.getTime() - now.getTime());
//
//	    return Mathf.Floor(timeDiff / (60 * 60 * 24 * 1000));
	}
}



// Category object
public class MbjCategory {
	
	var categorykey 		: String;
	var name	 			: String;
   
	function MbjCategory(categorykey:String, name:String){
		this.categorykey = categorykey;
		this.name = name;
	}
}



// Award object
public class MbjAward {
	
	var awarded 			: String;
	var beankey	 			: String;
	var imageurl	 		: String;
	var message	 			: String;
   
	function MbjAward(awarded:String, beankey:String, imageurl:String, message:String){
		this.awarded = awarded;
		this.beankey = beankey;
		this.imageurl = imageurl;
		this.message = message;
	}
}



	    
	    	    	    
//////////////////////////////////////////////////////////////////////////////
																		//////
	// MyBeanJar API request											//////
																		//////
//////////////////////////////////////////////////////////////////////////////

function request_to_api(callback:Function, resource:String, method:String, params:Hashtable, url:String) {
	
	// Prepare params for JSONification
    paramstring = SxStringify(params);
    Debug.Log("paramstring: " + paramstring);
	    
	// Create JSON string from params
	var jString = '{"resource": "' + resource + '", "method": "' + method + '", "params": ' + paramstring + '}';
	 
	// Set request encoding and headers
	var encoding = new System.Text.UTF8Encoding();
	var postHeader = new Hashtable();
	   
	postHeader.Add("Content-Type", "text/json");
//	postHeader.Add("Content-Length", jString.Length);
	 
	// Create XHR
	var request = WWW(url, encoding.GetBytes(jString), postHeader);
	 
	// Wait for results
	yield request;
	   
	// If error is present, print to the console
	if (request.error != null)
	{
	    Debug.Log("request error: " + request.error);
	}
	else
	{
	    Debug.Log("request success");
	    Debug.Log("returned data: " + request.text);
	    
	    var data = request.text;
	    
	    // Identify content and parse using appropriate method
	    if (method === "winners"){
            parse_winners_and_callback(data, callback);
        } else if (method === "apps") {
            parse_apps_and_callback(data, callback);
        } else if (method === "sponsors"){
            parse_sponsors_and_callback(data, callback);
        } else if(method === "sponsorlocations"){
            parse_sponsor_locations_and_callback(data, callback);
        } else if (method === "beans"){
            parse_beans_and_callback(data, callback);
        } else if (method === "categories"){
            parse_categories_and_callback(data, callback);
        } else if (method === "awardcoupon"){
            parse_award_and_callback(data, callback);
        } else if (method === "registerUser"){
            parse_register_and_callback(data, callback);
        } else if (method === "sendpassword"){
            parse_sendpassword_and_callback(data, callback);
        } else if (method === "deletebean"){
           parse_deletebean_and_callback(data, callback);
        } else if (method === "redeembean"){
           parse_redeembean_and_callback(data, callback);
        } else if (method === "authenticateUser"){
            parse_authenticateuser_and_callback(data, callback);
        } else if (method === "validateuser"){
            parse_validateuser_and_callback(data, callback);
        }
	}
}



function authenticate_user(username,password,callback:Function) {
    
    var params = new Hashtable();
    params.Add("username", username);
    params.Add("password", HashMd5(password));

    return request_to_api(callback, "v2services", "authenticateUser", params, API_URL);
}
	
	
	
function delete_bean(username, password, beankey, callback) {
   
    var params = new Hashtable();
    params.Add("username", username);
    params.Add("password", HashMd5(password));
    params.Add("beankey", beankey);

    return request_to_api(callback, "v2services", "deletebean", params, API_URL);
}



function get_apps(username, password, limit_value, callback) {

	var params = new Hashtable();
    params.Add("username", username);
    params.Add("password", HashMd5(password));
    params.Add("limit", limit_value);

    return request_to_api(callback, "v2services", "apps", params, API_URL);
}



function get_award(username, password, appkey, callback) {

    var params = new Hashtable();
    params.Add("username", username);
    params.Add("password", HashMd5(password));
    params.Add("appkey", appkey);

    return request_to_api(callback, "v2services", "awardcoupon", params, API_URL);
}



function get_beans(username, password, limit_value, sort_by, callback) {

    var params = new Hashtable();
    params.Add("username", username);
    params.Add("password", HashMd5(password));
    params.Add("limit", limit_value);
    params.Add("sortby", sort_by);

    return request_to_api(callback, "v2services", "beans", params, API_URL);
}



function get_categories(username, password, callback) {

    var params = new Hashtable();
    params.Add("username", username);
    params.Add("password", HashMd5(password));

    return request_to_api(callback, "v2services", "categories", params, API_URL);
}



function get_locations_for_sponsor(username, password, sponsorkey, callback){
    
    var params = new Hashtable();
    params.Add("username", username);
    params.Add("password", HashMd5(password));
    params.Add("sponsorkey", sponsorkey);
     
    return request_to_api(callback, "v2services", "sponsorlocations", params, API_URL); 
}



function get_sponsors(username, password, limit_value, callback) {

	var params = new Hashtable();
    params.Add("username", username);
    params.Add("password", HashMd5(password));
    params.Add("limit", limit_value);

    return request_to_api(callback, "v2services", "sponsors", params, API_URL);
}



function get_winners(limit_value, callback) {
    
    var params = new Hashtable();
    params.Add("limit", limit_value);

    return request_to_api(callback, resource, "winners", params, API_URL);
}



function reedem_bean(username, password, beankey, callback) {
    
    var params = new Hashtable();
    params.Add("username", username);
    params.Add("password", HashMd5(password));
    params.Add("beankey", beankey);
    
    return request_to_api(callback, "v2services", "redeembean", params, API_URL);
}



function register_user(username, password, email, zipcode, categories, callback) {

    var params = new Hashtable();
    params.Add("username", username);
    params.Add("password", HashMd5(password));
    params.Add("email", email);
    params.Add("zipcode", zipcode);
    params.Add("categories", categories);

    return request_to_api(callback, "v2services", "registerUser", params, API_URL);
}



function send_password(username, callback) {

    var params = new Hashtable();
    params.Add("username", username);

    return request_to_api(callback, "v2services", "sendpassword", params, API_URL);
}



function validate_user(username,callback){
    
    var params = new Hashtable();
    params.Add("username", username);

    return request_to_api(callback, "v2services", "validateuser", params, API_URL);
}



//////////////////////////////////////////////////////////////////////////////
																		//////
	// MyBeanJar API response parsers									//////
																		//////
//////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////
									//
	// WINNERS						//
									//
//////////////////////////////////////

public var winners : List.<MbjWinner>;
var numberOfWinners : int;
var mbjJSON : JSONNode;

function parse_winners(winners, mbjJSON:JSONNode) {
    for (var i = 0; i < numberOfWinners; i++) {
        Debug.Log("Parsing winner " + i);
        push_to_winners(winners, i, mbjJSON);
    }
    return winners;
}

function push_to_winners(winners:List.<MbjWinner>, i:int, mbjJSON:JSONNode) {
		
	// Prepare data returned from API
	var appkey = mbjJSON["response"]["winners"][i]["appkey"];
    var appname = mbjJSON["response"]["winners"][i]["appname"];
    var sponsorlogourl = mbjJSON["response"]["winners"][i]["sponsorlogourl"];
    var username = mbjJSON["response"]["winners"][i]["username"];
   
   	// Create new winner object with appropriate properties
   	var winner = new MbjWinner(appkey, appname, sponsorlogourl, username);
   
    // Add newly created winner object to list of winners
    winners.Add(winner);
    
}

function parse_winners_and_callback(data:String, callback:Function) {
    
    var result : String;
    
    // If internal server error present, report as such
    if(data.Contains(INTERNAL_SERVER_ERROR)){									
        result = INTERNAL_SERVER_ERROR;
        callback(result,winners);
        return;
    }

    // Prep list of response objects and parse data returned from API
    winners = new List.<MbjWinner>();											
    var mbjJSON = JSON.Parse(data);												
    var status = mbjJSON["status"].AsInt;										
    
    
    // If request was successful, send data off for parsing...
    if (status == 1) {    
        numberOfWinners = mbjJSON["response"]["winners"].Count;
        parse_winners(winners, mbjJSON);
        result = STATUS_SUCCESS;
        callback(result, winners);										
    } 
    
    // ...otherwise, report failure
    else {
        result = STATUS_FAIL;
        callback(result, winners);
    }
}



//////////////////////////////////////
									//
	// APPS							//
									//
//////////////////////////////////////

public var apps : List.<MbjApp>;
var numberOfApps : int;

function parse_apps(apps, mbjJSON:JSONNode) {
    for (var i = 0; i < numberOfApps; i++) {
        Debug.Log("Parsing app " + i);
        push_to_apps(apps, i, mbjJSON);
    }
    return apps;
}

function push_to_apps(apps:List.<MbjApp>, i:int, mbjJSON:JSONNode) {
		
	// Prepare data returned from API
	var appkey = mbjJSON["response"]["apps"][i]["appkey"];
    var appstoreurl = mbjJSON["response"]["apps"][i]["appstoreurl"];
    var description = mbjJSON["response"]["apps"][i]["description"];
    var iconurl = mbjJSON["response"]["apps"][i]["iconurl"];
    var name = mbjJSON["response"]["apps"][i]["name"];
    var publisher = mbjJSON["response"]["apps"][i]["publisher"];
    var publisherkey = mbjJSON["response"]["apps"][i]["publisherkey"];
    var publisherurl = mbjJSON["response"]["apps"][i]["publisherurl"];
   
   	// Create new winner object with appropriate properties
   	var app = new MbjApp(appkey, appstoreurl, description, iconurl, name, publisher, publisherkey, publisherurl);
   
    // Add newly created winner object to list of winners
    apps.Add(app);
    
}

function parse_apps_and_callback(data:String, callback:Function) {
    
    
    // If internal server error present, report as such
    if(data.Contains(INTERNAL_SERVER_ERROR)){									
        result = INTERNAL_SERVER_ERROR;
        callback(result,winners);
        return;
    }

    // Prep list of response objects and parse data returned from API
    apps = new List.<MbjApp>();											
    var mbjJSON = JSON.Parse(data);												
    var status = mbjJSON["status"].AsInt;										
    var result : String;
    
    
    // If request was successful, send data off for parsing...
    if (status == 1) {    
        numberOfApps = mbjJSON["response"]["apps"].Count;
        parse_apps(apps, mbjJSON);
        result = STATUS_SUCCESS;
        callback(result, apps);										
    } 
    
    // ...otherwise, report failure
    else {
        result = STATUS_FAIL;
        callback(result, apps);
    }
}



//////////////////////////////////////
									//
	// SPONSORS						//
									//
//////////////////////////////////////

public var sponsors : List.<MbjSponsor>;
var numberOfSponsors : int;

function parse_sponsors(sponsors, mbjJSON:JSONNode) {
    for (var i = 0; i < numberOfSponsors; i++) {
        Debug.Log("Parsing app " + i);
        push_to_sponsors(sponsors, i, mbjJSON);
    }
    return sponsors;
}

function push_to_sponsors(sponsors:List.<MbjSponsor>, i:int, mbjJSON:JSONNode) {
		
	// Prepare data returned from API
    var id = mbjJSON["response"]["sponsors"][i]["id"];
	var sponsorkey = mbjJSON["response"]["sponsors"][i]["sponsorkey"];
	var name = mbjJSON["response"]["sponsors"][i]["name"];
	var siteurl = mbjJSON["response"]["sponsors"][i]["siteurl"];
	var logourl = mbjJSON["response"]["sponsors"][i]["logourl"];
	var category = mbjJSON["response"]["sponsors"][i]["category"];
	var offer = mbjJSON["response"]["sponsors"][i]["offer"];
	var geocodekey = mbjJSON["response"]["sponsors"][i]["geocodekey"];
   
   	// Create new winner object with appropriate properties
   	var sponsor = new MbjSponsor(id, sponsorkey, name, siteurl, logourl, category, offer, geocodekey);
   
    // Add newly created winner object to list of winners
    sponsors.Add(sponsor);
    
}

function parse_sponsors_and_callback(data:String, callback:Function) {
    
    
    // If internal server error present, report as such
    if(data.Contains(INTERNAL_SERVER_ERROR)){															// THIS NEEDS TO BE MADE CONSISTENT						
        result = INTERNAL_SERVER_ERROR;
        callback(result,sponsors);
        return;
    }

    // Prep list of response objects and parse data returned from API
    sponsors = new List.<MbjSponsor>();											
    var mbjJSON = JSON.Parse(data);												
    var status = mbjJSON["status"].AsInt;										
    var result : String;
    
    
    // If request was successful, send data off for parsing...
    if (status == 1) {    
        numberOfSponsors = mbjJSON["response"]["sponsors"].Count;
        parse_sponsors(sponsors, mbjJSON);
        result = STATUS_SUCCESS;
        callback(result, sponsors);										
    } 
    
    // ...otherwise, report failure
    else {
        result = STATUS_FAIL;
        callback(result, sponsors);
    }
}





//////////////////////////////////////
									//
	// SPONSOR LOCATIONS			//
									//
//////////////////////////////////////

// Developer's note: This aspect of the API still seems to be under development. The server only returns an empty array for location data.
function parse_sponsor_locations_and_callback(data:String, callback:Function) {
     
    // If internal server error present, report as such
    if(data.Contains(INTERNAL_SERVER_ERROR)){									
        result = INTERNAL_SERVER_ERROR;
        callback(result,sponsors);
        return;
    }

    // Prep list of response objects and parse data returned from API										
    var mbjJSON = JSON.Parse(data);												
    var status = mbjJSON["status"].AsInt;										
    var message = data;
    
    
    // If request was successful, send data off for parsing...
    if (status == 1) {    
        result = STATUS_SUCCESS;
        callback(result, message);										
    } 
    
    // ...otherwise, report failure
    else {
        result = STATUS_FAIL;
        callback(result, message);
    }
}



//////////////////////////////////////
									//
	// BEANS						//
									//
//////////////////////////////////////

public var beans : List.<MbjBean>;
var numberOfBeans : int;

function parse_beans(beans, mbjJSON:JSONNode) {
    for (var i = 0; i < numberOfBeans; i++) {
        Debug.Log("Parsing app " + i);
        push_to_beans(beans, i, mbjJSON);
    }
    return beans;
}

function push_to_beans(beans:List.<MbjBean>, i:int, mbjJSON:JSONNode) {
		
	// Prepare data returned from API
    var beankey = mbjJSON["response"]["beans"][i]["beankey"];
	var expirationdate = mbjJSON["response"]["beans"][i]["expirationdate"];
	var game = mbjJSON["response"]["beans"][i]["game"];
	var geocodekey = mbjJSON["response"]["beans"][i]["geocodekey"];
	var longdescription = mbjJSON["response"]["beans"][i]["longdescription"];
	var redeembarcodeurl = mbjJSON["response"]["beans"][i]["redeembarcodeurl"];
	var redemptionurl = mbjJSON["response"]["beans"][i]["redemptionurl"];
	var redemptionvalidation = mbjJSON["response"]["beans"][i]["redemptionvalidation"];
	var shortdescription = mbjJSON["response"]["beans"][i]["shortdescription"];
	var sponsorkey = mbjJSON["response"]["beans"][i]["sponsorkey"];
	var sponsorlogourl = mbjJSON["response"]["beans"][i]["sponsorlogourl"];
	var sponsorname = mbjJSON["response"]["beans"][i]["sponsorname"];
	var sponsorurl = mbjJSON["response"]["beans"][i]["sponsorurl"];
	var wondate = mbjJSON["response"]["beans"][i]["wondate"];
	var days = mbjJSON["response"]["beans"][i]["days"];													// NEEDS TO BE FIXED TO AUTO CALC
   
   	// Create new winner object with appropriate properties
   	var bean = new MbjBean(beankey, expirationdate, game, geocodekey, longdescription, redeembarcodeurl, redemptionurl, redemptionvalidation, shortdescription, sponsorkey, sponsorlogourl, sponsorname, sponsorurl, wondate, days);
   
    // Add newly created winner object to list of winners
    beans.Add(bean);
    
}

function parse_beans_and_callback(data:String, callback:Function) {
    
    
    // If internal server error present, report as such
    if(data.Contains(INTERNAL_SERVER_ERROR)){									
        result = INTERNAL_SERVER_ERROR;
        callback(result,beans);
        return;
    }

    // Prep list of response objects and parse data returned from API
    beans = new List.<MbjBean>();											
    var mbjJSON = JSON.Parse(data);												
    var status = mbjJSON["status"].AsInt;										
    var result : String;
    
    
    // If request was successful, send data off for parsing...
    if (status == 1) {    
        numberOfBeans = mbjJSON["response"]["beans"].Count;
        parse_beans(beans, mbjJSON);
        result = STATUS_SUCCESS;
        callback(result, beans);										
    } 
    
    // ...otherwise, report failure
    else {
        result = STATUS_FAIL;
        callback(result, beans);
    }
}



//////////////////////////////////////
									//
	// CATEGORIES					//
									//
//////////////////////////////////////

public var categories : List.<MbjCategory>;
var numberOfCategories : int;

function parse_categories(categories, mbjJSON:JSONNode) {
    for (var i = 0; i < numberOfCategories; i++) {
        Debug.Log("Parsing app " + i);
        push_to_categories(categories, i, mbjJSON);
    }
    return categories;
}

function push_to_categories(categories:List.<MbjCategory>, i:int, mbjJSON:JSONNode) {
		
	// Prepare data returned from API
    var categorykey = mbjJSON["response"]["categories"][i]["categorykey"];
	var name = mbjJSON["response"]["categories"][i]["name"];
   
   	// Create new category object with appropriate properties
   	var category = new MbjCategory(categorykey, name);
   
    // Add newly created category object to list of categories
    categories.Add(category);
    
}

function parse_categories_and_callback(data:String, callback:Function) {
    
    
    // If internal server error present, report as such
    if(data.Contains(INTERNAL_SERVER_ERROR)){									
        result = INTERNAL_SERVER_ERROR;
        callback(result,categories);
        return;
    }

    // Prep list of response objects and parse data returned from API
    categories = new List.<MbjCategory>();											
    var mbjJSON = JSON.Parse(data);												
    var status = mbjJSON["status"].AsInt;										
    var result : String;
    
    
    // If request was successful, send data off for parsing...
    if (status == 1) {    
        numberOfCategories = mbjJSON["response"]["categories"].Count;
        parse_categories(categories, mbjJSON);
        result = STATUS_SUCCESS;
        callback(result, categories);										
    } 
    
    // ...otherwise, report failure
    else {
        result = STATUS_FAIL;
        callback(result, categories);
    }
}



//////////////////////////////////////
									//
	// AWARDS						//
									//
//////////////////////////////////////

public var award : List.<MbjAward>;

function parse_award(award:List.<MbjAward>, mbjJSON:JSONNode) {
		
	// Prepare data returned from API
    var awarded = mbjJSON["response"]["awarded"];
	var beankey = mbjJSON["response"]["beankey"];
	var imageurl = mbjJSON["response"]["imageurl"];
	var message = mbjJSON["response"]["message"];
   
   	// Create new category object with appropriate properties
   	var awardObj = new MbjAward(awarded, beankey, imageurl, message);
   
    // Add newly created category object to list of awards
    award.Add(awardObj);
    
}

function parse_award_and_callback(data:String, callback:Function) {
    
    
    // If internal server error present, report as such
    if(data.Contains(INTERNAL_SERVER_ERROR)){									
        result = INTERNAL_SERVER_ERROR;
        callback(result,award);
        return;
    }

    // Prep list of response objects and parse data returned from API
    award = new List.<MbjAward>();											
    var mbjJSON = JSON.Parse(data);												
    var status = mbjJSON["status"].AsInt;										
    var result : String;
    
    
    // If request was successful, send data off for parsing...
    if (status == 1) {    
        parse_award(award, mbjJSON);
        result = STATUS_SUCCESS;
        callback(result, award);										
    } 
    
    // ...otherwise, report failure
    else {
        result = STATUS_FAIL;															// IS THIS DESIRED BEHAVIOR?
        callback(result, award);
    }
}



//////////////////////////////////////
									//
	// REGISTER USER				//
									//
//////////////////////////////////////

function parse_register_and_callback(data:String, callback:Function) {
    
    var message : String;
    var result : String;
    
    // If internal server error present, report as such
    if(data.Contains(INTERNAL_SERVER_ERROR)){									
        result = INTERNAL_SERVER_ERROR;
        callback(result,message);
        return;
    }

    // Prep list of response objects and parse data returned from API										
    var mbjJSON = JSON.Parse(data);												
    var status = mbjJSON["status"].AsInt;										
    message = mbjJSON["response"]["message"];
    
    
    // If request was successful, report message
    if (status == 1) {    
        result = STATUS_SUCCESS;
        callback(result, message);										
    } 
    
    // ...otherwise, report failure message
    else {
        result = STATUS_FAIL;
        callback(result, message);
    }
}



//////////////////////////////////////
									//
	// RETRIEVE PASSWORD 			//
									//
//////////////////////////////////////

function parse_sendpassword_and_callback(data:String, callback:Function) {
    
    var message : String;
    var result : String;
    
    // If internal server error present, report as such
    if(data.Contains(INTERNAL_SERVER_ERROR)){									
        result = INTERNAL_SERVER_ERROR;
        callback(result,message);
        return;
    }
    
    if(data == null || data == 'undefinied' || data == "" || data == "null"){
    	result = STATUS_FAIL;
        callback(result, message);
        return;
    }
										
    var mbjJSON = JSON.Parse(data);												
    var status = mbjJSON["status"].AsInt;										
    message = mbjJSON["response"]["message"];
    
    
    // If request was successful, report message
    if (status == 1) {    
        result = STATUS_SUCCESS;
        callback(result, message);										
    } 
    
    // ...otherwise, report failure message
    else {
        result = STATUS_FAIL;
        callback(result, message);
    }
}



//////////////////////////////////////
									//
	// DELETE BEAN					//
									//
//////////////////////////////////////

function parse_deletebean_and_callback(data:String, callback:Function) {
    
    var message : String;
    var result : String;
    
    // If internal server error present, report as such
    if(data.Contains(INTERNAL_SERVER_ERROR)){									
        result = INTERNAL_SERVER_ERROR;
        callback(result,message);
        return;
    }
										
    var mbjJSON = JSON.Parse(data);												
    var status = mbjJSON["status"].AsInt;										
    message = mbjJSON["response"]["message"];
    
    
    // If request was successful, report message
    if (status == 1) {    
        result = STATUS_SUCCESS;
        callback(result, message);										
    } 
    
    // ...otherwise, report failure message
    else {
        result = STATUS_FAIL;
        callback(result, message);
    }
}



//////////////////////////////////////
									//
	// REDEEM BEAN					//
									//
//////////////////////////////////////

function parse_redeembean_and_callback(data:String, callback:Function) {
    
    var message : String;
    var result : String;
    
    // If internal server error present, report as such
    if(data.Contains(INTERNAL_SERVER_ERROR)){									
        result = INTERNAL_SERVER_ERROR;
        callback(result,message);
        return;
    }
										
    var mbjJSON = JSON.Parse(data);												
    var status = mbjJSON["status"].AsInt;										
    message = mbjJSON["response"]["message"];
    
    
    // If request was successful, report message
    if (status == 1) {    
        result = STATUS_SUCCESS;
        callback(result, message);										
    } 
    
    // ...otherwise, report failure message
    else {
        result = STATUS_FAIL;
        callback(result, message);
    }
}



//////////////////////////////////////
									//
	// AUTHENTICATE USER			//
									//
//////////////////////////////////////

function parse_authenticateuser_and_callback(data:String, callback:Function) {
    
    var message : String;
    var result : String;
    
    // If internal server error present, report as such
    if(data.Contains(INTERNAL_SERVER_ERROR)){									
        result = INTERNAL_SERVER_ERROR;
        callback(result,message);
        return;
    }
										
    var mbjJSON = JSON.Parse(data);												
    var status = mbjJSON["status"].AsInt;										
    message = mbjJSON["response"]["message"];
    
    
    // If request was successful, report message
    if (status == 1) {    
        result = STATUS_SUCCESS;
        callback(result, message);										
    } 
    
    // ...otherwise, report failure message
    else {
        result = STATUS_FAIL;
        callback(result, message);
    }
}



//////////////////////////////////////
									//
	// VALIDATE USER				//
									//
//////////////////////////////////////

function parse_validateuser_and_callback(data:String, callback:Function) {
    
    var message : String;
    var result : String;
    
    // If internal server error present, report as such
    if(data.Contains(INTERNAL_SERVER_ERROR)){									
        result = INTERNAL_SERVER_ERROR;
        callback(result,message);
        return;
    }
										
    var mbjJSON = JSON.Parse(data);												
    var status = mbjJSON["status"].AsInt;										
	message = mbjJSON["response"]["message"];
    
    
    // If request was successful, report message
    if (status == 1) {    
        result = STATUS_SUCCESS;
        callback(result, message);										
    } 
    
    // ...otherwise, report failure message
    else {
        result = STATUS_FAIL;
        callback(result, message);
    }
}




//////////////////////////////////////////////////////////////////////////////
																		//////
	// Additional helper functions										//////
																		//////
//////////////////////////////////////////////////////////////////////////////

static function HashMd5(prestring:String){															// BORROWED!! ¯\_(ツ)_/¯ 
	var encoding = System.Text.UTF8Encoding();
	var bytes = encoding.GetBytes(prestring);
 
	// encrypt bytes
	var md5 = System.Security.Cryptography.MD5CryptoServiceProvider();
	var hashBytes:byte[] = md5.ComputeHash(bytes);
 
	// Convert the encrypted bytes back to a string (base 16)
	var hashedString = "";
 
	for (var i = 0; i < hashBytes.Length; i++)
	{
		hashedString += System.Convert.ToString(hashBytes[i], 16).PadLeft(2, "0"[0]);
	}
 
	return hashedString.PadLeft(32, "0"[0]);
}



// Convert parameters to JSON strings
function SxStringify(params:Hashtable) {
	
	var i = 0;
	paramstring = '{';

	// Iterate over keys and add it and its value to the paramstring
	for (var key in params.Keys){
			
		var formattedValue;
		
		// If value is a string, encapsulate in quotation marks for JSONification...
		if (params[key].GetType() == System.String) {
			
			var valueString:String = params[key];
			
			// If value isn't a stringified array...
			if (!valueString.StartsWith("[")){	
			
				// ...Add in quotation marks...
				formattedValue = '"' + valueString + '"';
			
			}
			
			// ...otherwise, you know, don't.
			else {
			
				formattedValue = params[key];
			
			}
		
		}
		
		// ...otherwise, you know, don't.
		else {
		
			formattedValue = params[key];
		
		}
		
		// Stringify current key/value pair
		paramstring += '"' + key + '"';			// Add key
		paramstring += ': ';					// Add separator
		paramstring += formattedValue; 			// Add value
		
		// If there are more key/values after the current one, add a comma
		if (i < params.Count - 1) {
			paramstring += ', ';
		}
		
		// If current key/value is last, add closing bracket
		else {
			paramstring += '}';
		}
		i++;
	}

	return paramstring;
}
	
	
	
// Convert list of categories to a JSON stringified array
function BuildListString(categoryList:List.<String>) {

	var i = 0;
	var categoryString = '[';
	for (category in categoryList) {
		categoryString += '"' + category + '"';
		i++;
		if (i < categoryList.Count) {
			categoryString += ', ';
		}
	}
	categoryString += ']';

	return categoryString;
}




