var debugging = true;
if (typeof console == "undefined") var console = { log: function() {} };
else if (!debugging || typeof console.log == "undefined") console.log = function() {};


jQuery(function () {

  //Add Analytics Data Layer

	//This is where we need to create the object, if it doesn't already exist
  //var adobeNamespace  = 'bcbsncDataLayer';
	//if (!(adobeNamespace in $window)) {
	//		$window[adobeNamespace] = {};
	//}

	window.bcncDataLayer = {
		 page: {
			    name: 'members:public:register',
			    authenticated: false,
			    accessible: true,
			    url: 'https://www.bcbsnc.com/members/public/register/',
			    hash: '',
			    section: 'member'
			  },
			  dataLayerMeta: {
			    version: '1.5',
			    lastUpdated: new Date().getMilliseconds(),
			    pageComplete: true
			}
	};
	// reset getcode counter
 	localStorage.setItem("getcode_counter", 6);

	if($.url.param('passwordLocked'))
	{
		$('#responseForgotBox').html('You have exceeded the number of unsuccessful password attempts. Please use the forgot password process.').show();
	}

	if($.url.param('error') == 'nouserid' || $.url.param('error') == 'fail')
	{
		$('#loginErrorMsg').html('The User ID and Password entered do not match our records. Please try again.').show();
		$('#passwordForgottenForm').hide();
		$('#responseBox').show();
	}
	if($.url.param('code') == 'error.account.disabled')
	{
		$('#loginErrorMsg').html('This account is no longer active. Please contact customer service if you have questions.').show();
		$('#passwordForgottenForm').hide();
		$('#responseBox').show();
	}
	if($.url.param('code') == 'error.login.parameters.missing')
	{
		$('#loginErrorMsg').html('There are problems accessing this account. Please contact customer service if you have questions.').show();
		$('#passwordForgottenForm').hide();
		$('#responseBox').show();
	}
	if($.url.param('error') == 'error.member.noDataFound')
	{
		$('#loginErrorMsg').html('This user account does not have any data associated with it.').show();
		$('#passwordForgottenForm').hide();
		$('#responseBox').show();
	}

	// reset password
	if($.url.param('resetPass')){
			$('#resetPassword').val('');
			$('#passwordForgottenForm').hide();
			$('#newPasswordForm').show();
	}

	// forgot password
	if($.url.param('error') == 'badpassword')
	{
		$('#resetPassword').val('');
		$('#passwordForgottenForm').hide();
		$('#newPasswordForm').show();
	}

	$("#password1").passStrength({ //Password Strength
		shortPass: 		"shortPass",
		badPass:		"badPass",
		goodPass:		"goodPass",
		strongPass:		"strongPass",
		baseStyle:		"testresult",
		userid:			"#userid",
		retypePass:		"#password2",
		messageloc:		1
	});
	$("#resetPassword1").passStrength({ //Password Strength
		shortPass: 		"shortPass",
		badPass:		"badPass",
		goodPass:		"goodPass",
		strongPass:		"strongPass",
		baseStyle:		"testresult2",
		userid:			"#userid",
		retypePass:		"#password2",
		messageloc:		1
	});

	$('#dob-month').focus( function() { $(this).select() });
	$('#dob-day').focus( function() { $(this).select() });
	$('#dob-year').focus( function() { $(this).select() });

	$('#cancel, #loginchoice-cancel, #selectmember-cancel').click(function() {	window.location = 'index.htm';	});
	$('#selectmemberforgot-cancel').click(function() {	window.location = 'forgotusername.htm';	});
	$('#login-existing').click(function() { $('#shopper-login').fadeIn(); $('#new-login, #loginchoice-cancel').hide(); $('#finish-box').fadeIn(); });
	$('#login-new').click(function() { $('#shopper-login, #loginchoice-cancel').hide(); $('#new-login').fadeIn(); $('#finish-box').fadeIn(); });
	$('#securityQuestion').change( function()
		{
			if ($(this).val() == 'own') {
				$('#custom-security').fadeIn();
			}
			else {
				$('#custom-security:visible').fadeOut();
			}
		});
	if($('#mmchat').length > 0)
	{
		$('#mmchat').load('/assets/includes/chat/memberchat.htm');
	}

	/*----------------------------------------------------------------------------------------------------*/
	/* tooltip                                                                                            */
	/*                                                                                                    */
	/* each tooltip is defined with class showtip and the name of the tooltip to display                  */
	/* Note: this will not work if there are more than two classes on the tooltip in the html             */
	/*                                                                                                    */
	/* look for a div with the same class and display it as the  tooltip                                  */
	/* if there is not a tooltip defined give an alert to the  programmer                                 */
   	/*----------------------------------------------------------------------------------------------------*/
	$(".showtip").tooltip({
		items: '.showtip',
		content: function() {
			var	my_class = $(this).attr('class').replace('showtip ','');;
			var my_div = 'div.'+my_class;
			var my_html = ($(my_div).html() == null) ? 'Tooltip is not available' : $(my_div).html();
			return my_html;
		}
	}).attr('tabindex',0);
	//$(".showtip").bgiframe();

	/*-----------------------------------------------------------------*/
	/* All                                                             */
	/* remove the error messages and classes when the input is clicked */
	/* this must be before any other input click methods are declared  */
	/*-----------------------------------------------------------------*/

	/*--------------------------------------------------------------*/
	/* Registration - Page One                                      */
	/*--------------------------------------------------------------*/

	// for mobile -- let analytics know that we are loading step-one
	if ($("#step-one").length > 0) {
		try {
			waGenericPage("step-one");
		} catch (e) {

		}
	}

	/* validation on continue */
	$('#singlemember-continue').click(function(event)
	{
		$('div').removeClass('input-error');
		$('#top-error-block').remove();
		$('#reg').validateRadio(event,' Are you registering yourself or your child');
		$('#subid').validateSubscriberId(event);
		$('input.v-min-len-9:visible').validateMinLength(event,9);
		$('input.v-date-month:visible').validateDateMonth(event);
		$('input.v-date-day:visible').validateDateDay(event);
		$('input.v-date-year:visible').validateDateYear(event);
		$('div.v-dob:visible').validateSubscriberDOB(event,' Registrant\'s date of birth');
		$('input.v-number-length:visible').validateNumberLength(event);
		$('input:not("input.v-optional"):text:visible').filter(function() { return !this.value; }).validateTextbox(event);
		$('input:not("input.v-optional"):text:visible').validateTextboxNoSpaces(event);

		if ($('#top-error-block').length == 0)
		{
			getMemberInfo();
			return false;
		}
		/*else {
			  //Let them know there as a validation error
				var actionInfo = {
					'name_1' : 'step',
			    'meta_1' : 'step-one',
					'name_3' : 'error',
			    'meta_3' : 'There was a problem with the data you submitted. Please correct any errors and resubmit the page.'
			  };
				emitAnalyticEvent(actionInfo);
		}*/
	});
	$('#getcodeCancel').click(function(){
		$('div').removeClass('input-error');
		$('#top-error-block').remove();
		$('#step-getcode').hide();
		$('#step-one, .titleLeft p, .boxmsmms').fadeIn(); 
	})
	$('#getcodeTry').click(function(){
		$('div').removeClass('input-error');
		$('#top-error-block').remove();
		$('#step-getcode').hide();
		$('#step-one, .titleLeft p, .boxmsmms').fadeIn(); 
	})
	var dateOfBirth = '';
	/*validation on alternate id registration get code */
	$('#singlemember-getcode').click(function(event){
		var policyType='';
		var messageType = '';
		var phoneNumber = '';
		var mobileNumber = '';
		var firstName = '';
		var lastName = '';
		var ssn = '';
		var zipCode = '';
		$('div').removeClass('input-error');
		$('#top-error-block').remove();
		$('input.v-MMDDYYYY:visible').validateMMDDYYYY(event);
		if($("input[type=radio][name=phone]:checked" ).val() === "call"){
			$('input.v-phNoFormat:visible').validatePhoneFormat(event);
		}
		 if($("input[type=radio][name=phone]:checked" ).val() === "message") {
			$('input.v-mobileNoFormat:visible').validateMobileFormat(event);
		}
		$('input.v-number-length:visible').validateNumberLength(event);
		$('input:not("input.v-optional"):text:visible').filter(function() { return !this.value; }).validateTextbox(event);
		$('input:not("input.v-optional"):text:visible').validateTextboxNoSpaces(event);
		
		// http://private-6b44b-altregistration.apiary-mock.com/registration/register/validate_member
        // http://wwwps.bcbsnc.com/registration/register/validate_member
		if ($('#top-error-block').length == 0)
		{
		    if(getCodeCounter() <= 0 ){
                 displayServiceError("4013");
                 return;
			}

			 $('#getcode-loading-indicator').show();
			 if($("input[type=radio][name=plantype]:checked" ).val() === "medical") {
			 	policyType = 'MEDICAL';
			 }
			 else if($("input[type=radio][name=plantype]:checked" ).val() === "dental") {
			 	policyType = 'DENTAL';
			 }
			 else if($("input[type=radio][name=plantype]:checked" ).val() === "medicare") {
			 	policyType = 'MEDICARE';
			 }
			 if($("input[type=radio][name=phone]:checked" ).val() === "message") {
			 	messageType = 'TEXT_MESSAGE';
			 }
			 else if($("input[type=radio][name=phone]:checked" ).val() === "call"){
			 	messageType = 'VOICE_CALL';

			 }
			 if($("input[type=radio][name=phone]:checked" ).val() === "message") {
			 	phoneNumber = $('#mobilePhNo').val();
			 	firstName = $('#mobileFName').val();
				lastName = $('#mobileLName').val();
				ssn = $('#mobileSSN').val();
				dateOfBirth = $('#mobileDOB').val();
				zipCode = $('#mobileZipcode').val();
			 }
			 else if($("input[type=radio][name=phone]:checked" ).val() === "call"){
			 	phoneNumber = $('#phonePhNo').val();
			 	firstName = $('#phoneFName').val();
				lastName = $('#phoneLName').val();
				ssn = $('#phoneSSN').val();
				dateOfBirth = $('#phoneDOB').val();
				zipCode = $('#phoneZipcode').val();
			 }

			 var eventInfo =  {type: 'step5b', meta: 'ageRange='+dateOfBirth+',zipCode='+zipCode+''};
			 emitAnalyticEvent(null, eventInfo);
		
             // reset counter
             localStorage.setItem("on_load_counter", 4);
			 var getCodeInfo = {
				  "policyType": policyType,
				  "messageType": messageType,
				  "phoneNumber": phoneNumber,
				  "firstName": firstName,
				  "lastName": lastName,
				  "ssn": ssn,
				  "dateOfBirth": dateOfBirth,
				  "zipCode": zipCode
				};

			 $.ajax({
			 	url:'/registration/register/validate_member',
			 	type:'POST',
			 	// headers: {contentType: 'application/json; charset=UTF-8'},
			 	contentType: 'application/json',
			 	dataType:'json',
			 	data: JSON.stringify(getCodeInfo),
			 	success: searchSuccess,
                error: searchFail,
			 });
		}
	});
	function searchSuccess(resp, status, obj) {
		console.log(resp);
		$('#getcode-loading-indicator').hide();
		if (resp.result === 'SUCCESS') {
			if(resp.transactionId){
				localStorage.setItem('transactionId', resp.transactionId);
			}
			if(resp.externalMemberId) {
				localStorage.setItem('subscriberId', resp.externalMemberId);
			}
			if(resp.firstName){
				localStorage.setItem('fName', resp.firstName);
			}
			if(resp.lastName){
				localStorage.setItem('lName', resp.lastName);
			}
			if(resp.phoneNumber) {
				localStorage.setItem('phoneNumber', resp.phoneNumber);
			}
			localStorage.setItem('dob', dateOfBirth);
			if(resp.address.zip){
				localStorage.setItem('zipcode', resp.address.zip);
			}
			$('.v-insert-error').hide();
			$('#verifyCode').val('');
			$('#step-one, .titleLeft p, .boxmsmms').hide(); $('#step-getcode').fadeIn();
		 //window.location.href='getcode.htm';

		} 
		else if(resp.result === 'IS_REGISTERED') {
			displayServiceError("2001");
		}
		else if (resp.result === 'FAILED' || resp.result === 'NOT_FOUND') {
           // $(".getcodeErrorMsg").css("display","inline-block");
           displayServiceError("4012");
          // localStorage.setItem('transactionId', resp.transactionId);
         //  $('#step-one, .titleLeft p, .boxmsmms').hide(); $('#step-getcode').fadeIn();
		}
	}
	function searchFail(errorObj, status, obj) {
       console.log(errorObj);
       $('#getcode-loading-indicator').hide();
       // $('#step-one, .titleLeft p, .boxmsmms').hide(); $('#step-getcode').fadeIn();
      	// $(".getcodeErrorMsg").css("display","inline-block");
      	displayServiceError("4012");
	}
	// http://private-6b44b-altregistration.apiary-mock.com/registration/register/verify_otp'
	// http://wwwps.bcbsnc.com/registration/register/verify_otp

	/*validation on alternate id registration get code */
	$('#verify-getcode').click(function(event){
		// http://appservices.bcbsnc.com/registration/register/verify_otp
		// http://private-6b44b-altregistration.apiary-mock.com/registration/register/verify_otp
		var eventInfo =  {type: 'step6b', meta: ''};
		emitAnalyticEvent(null, eventInfo);
		$('div').removeClass('input-error');
		$('#top-error-block').remove();
		$('input:not("input.v-optional"):text:visible').filter(function() { return !this.value; }).validateGetcodeTextbox(event);
		$('input:not("input.v-optional"):text:visible').validateGetcodeTextboxNoSpaces(event);
		verifyOtp = {
		  "transactionId": localStorage.getItem('transactionId'),
		  "passcode": $.trim($('#verifyCode').val())
		};
		if ($('#top-error-block').length == 0)
		{ 
			$('#verifycode-loading-indicator').show();
			$.ajax({
			 	url:'/registration/register/verify_otp',
			 	type:'POST',
			 	// headers: {contentType: 'application/json; charset=UTF-8'},
			 	contentType: 'application/json',
			 	dataType:'json',
			 	data: JSON.stringify(verifyOtp),
			 	success: verifyCodeSuccess,
                error: verifyCodeFailure,
			 });
		};
	});
    function verifyCodeSuccess(resp, status, obj) {
    	$('#verifycode-loading-indicator').hide();
    	if (resp.result === 'SUCCESS') {
    		//displayServiceError("4014");
    		$('.v-insert-error').show();
    		$('#display-membername').html(localStorage.getItem('fName')+' '+localStorage.getItem('lName'));
			$('#display-subid').html(localStorage.getItem('subscriberId'));
			$('#display-dob').html(localStorage.getItem('dob'));
			$('#display-zip').html(localStorage.getItem('zipcode'));
			$('#register-memberid').val(localStorage.getItem('subscriberId'));
			$('#register-zipcode').val(localStorage.getItem('zipcode'));
			$('#register-dob').val(localStorage.getItem('dob'));
    		$('#step-one, .titleLeft p, .boxmsmms').hide(); 
    		$('#step-getcode').hide();
    		$('#step-two').fadeIn();
    		$('#user-id-selection').hide();
			$('#login-new').attr('checked','checked');
			$('#login-new').trigger('click');
    	} else if(resp.result === 'FAILED') {
    		
    		if(codeAttemptCounter() <= 0 ){
                 displayServiceError("4013");
    		}
    		else {
    			displayServiceError("4014");
    		}
    		/*$('.v-insert-error').show();
    		$('#display-membername').html(localStorage.getItem('fName')+' '+localStorage.getItem('lName'));
			$('#display-subid').html(localStorage.getItem('subscriberId'));
			$('#display-dob').html(localStorage.getItem('dob'));
			$('#display-zip').html(localStorage.getItem('zipcode'));
    		$('#step-one, .titleLeft p, .boxmsmms').hide(); 
    		$('#step-getcode').hide();
    		$('#step-two').fadeIn();*/
    	}

    } 
    function verifyCodeFailure(errorObj, status, obj) {
    	$('#verifycode-loading-indicator').hide();
    	displayServiceError("5000");
    }
     function getCodeCounter() {
    	if (typeof(Storage) !== "undefined") {
		    var n = localStorage.getItem("getcode_counter");
		    if (n === null) {
		      n = 6;
		    }
		    n--;

		    localStorage.setItem("getcode_counter", n);
		    /*document.getElementById('counter').innerHTML = n;
		    if (n > 3) {
		      alert('3rd time');
		    }*/
		  } else {
		    console.log("Sorry, your browser does not support web storage...");
		  }
		  return n;
    }
    function codeAttemptCounter() {
    	if (typeof(Storage) !== "undefined") {
		    var n = localStorage.getItem('on_load_counter');
		    if (n === null) {
		      n = 4;
		    }
		    n--;

		    localStorage.setItem("on_load_counter", n);
		    /*document.getElementById('counter').innerHTML = n;
		    if (n > 3) {
		      alert('3rd time');
		    }*/
		  } else {
		    console.log("Sorry, your browser does not support web storage...");
		  }
		  return n;
    }
	/* validation on continue */
	$('#selectmember-continue').click(function(event)
	{
		$('div').removeClass('input-error');
		$('#top-error-block').remove();
		$('#multiple-members').validateRadio(event, ' Identify the member who you are registering.');

		if ($('#top-error-block').length == 0)
		{
			chooseMember();
			return false;
		}
	});

	/*--------------------------------------------------------------*/
	/* Registration - Page One Event Triggers                       */
	/*--------------------------------------------------------------*/
	/* subscriber ID validation on blur */
	$('#subid').blur( function(event)
		{
			$('div').removeClass('input-error');
			$('#top-error-block').remove();
			$(this).validateSubscriberId(event)
		});

	/*--------------------------------------------------------------*/
	/* Registration - Page Two                                      */
	/*--------------------------------------------------------------*/
	/* validation on continue */
	$('#finish').click(function(event)
	{
		$('div').removeClass('input-error');
		$('#top-error-block').remove();
		$('#finishmember-loading-indicator').show();
		$('#step-one, .titleLeft p, .boxmsmms').hide(); $('#step-two').fadeIn();

		// for mobile -- let analytics know that we are loading step-two
		try {
			waGenericPage("step-two")
		} catch (e) {

		//Loading Page Two
		var actionInfo = {
			'name_1' : 'step',
			'meta_1' : 'step-two',
		};
		emitAnalyticEvent(actionInfo);

		}

		$('input.v-username:visible').validateUserId(event);
		$('input.v-existing-username:visible').validateExistingUserId(event);
		$('input.v-min-length-6:visible').validateMinLength(event,6);
		$('input.v-min-length-7:visible').validateMinLength(event,7);
		$('input:password:visible').filter(function() { return !this.value; }).validateTextbox(event);
		$('div.v-pw:visible').validatePassword(event);
		$('#securityQuestion:visible').validateDropdown(event);
		$('div.v-email:visible').validateEmail(event);
		$('input:not("input.v-optional"):text:visible').filter(function() { return !this.value; }).validateTextbox(event);
		$('input:not("input.v-optional"):text:visible').validateTextboxNoSpaces(event);
		$('#optInPromotional').validateOptPromoRadio(event);

		if ($('#top-error-block').length == 0)
		{
			if ($('#login-existing:checked').val() == 'LogIn')
			{
				registerExistingUser();
				return false;
			}
			else if ($('#login-new:checked').val() == 'Create')
			{
				registerUser();
				return false;
			}
		}
		$('#finishmember-loading-indicator').hide();
	});

	/*--------------------------------------------------------------*/
	/* Connect Registration - Page One                                      */
	/*--------------------------------------------------------------*/
	/* validation on continue */
	$('#finishConnect').click(function(event)
	{
		$('div').removeClass('input-error');
		$('#top-error-block').remove();
		$('#finishmember-loading-indicator').show();

		// for mobile -- let analytics know that we are loading step-two
		try {
			waGenericPage("connectCNX")
		} catch (e) {

		}

		//Loading Page Two
		var actionInfo = {
			'name_1' : 'step',
			'meta_1' : 'connectCNX',
		};
		emitAnalyticEvent(actionInfo);

		$('input.v-username:visible').validateUserId(event);
		$('input.v-existing-username:visible').validateExistingUserId(event);
		$('input.v-min-length-6:visible').validateMinLength(event,6);
		$('input.v-min-length-7:visible').validateMinLength(event,7);
		$('input:password:visible').filter(function() { return !this.value; }).validateTextbox(event);
		$('div.v-pw:visible').validatePassword(event);
		$('#securityQuestion:visible').validateDropdown(event);
		$('div.v-email:visible').validateEmail(event);
		$('input:not("input.v-optional"):text:visible').filter(function() { return !this.value; }).validateTextbox(event);
		$('input:not("input.v-optional"):text:visible').validateTextboxNoSpaces(event);

		if ($('#top-error-block').length == 0)
		{
			if ($('#login-existing:checked').val() == 'LogIn')
			{
				registerConnectExistingUser();
				$('#finishmember-loading-indicator').hide();
				return false;
			}
			else if ($('#login-new:checked').val() == 'Create')
			{
				registerConnectUser();
				$('#finishmember-loading-indicator').hide();
				return false;
			}
		}
		$('#finishmember-loading-indicator').hide();
	});



	$('#memLoginButton').click( function() { $('#frmMemberLogin').submit(); });


	$('#idCards').dialog({
		bgiframe: true,
		autoOpen: false,
		position: ['center',50],
		modal: true,
		width: 890,
		overlay: { opacity: 0.5, background: "black" },
		close: function(event, ui) {	return false;		}
	});

	$('#showIdCards').click(function(){ $('#idCards').dialog('open'); });

});

function emitAnalyticEvent(actionData, eventData)
{
	/*
		We always want to send over this basica information
		- plan type
		- user type
		- zip code
		Everything else required for registration is
		Personally Identifiable Information
	*/
	var user_type = ($('#usertype_myself').is(':checked') ? "myself" : "child");
	var zip_code = $('#zipcode').val();
  var policy_type;

	if($('#type_medical').is(':checked')){
		policy_type = "medical";
	}	else if($('#type_dental').is(':checked')){
		policy_type = "dental";
	}else if($('#type_medicare').is(':checked')){
		policy_type = "medicare"
	} else if($('#type_state').is(':checked')){
		policy_type = "state"
	}

	var userInfo = {
    'policy_type' : policy_type,
		'user_type' : user_type,
		'zip_code' : zip_code
  };

	// window.bcbsncDataLayer.user = userInfo;

	if(window.bcncDataLayer) {
		//if(actionData)
				//window.bcbsncDataLayer.action = actionData;
		// else 
			if(eventData) {
				window.bcncDataLayer.events = eventData;
		} else
				window.bcncDataLayer.events = {};
	}
}

function getMemberInfo()
{

	$('#singlemember-loading-indicator').show();
	dob = $('#dob-month').val() + '/' + $('#dob-day').val() + '/' + $('#dob-year').val();
    subid = $('#subid').val().toUpperCase();
    memcode = $('#memcode').val();

	if (memcode){
        var memsubInfo = subid + memcode;
    } else {
        var memsubInfo = subid;
    }
	var subscriberInfo = { "subscriberId": memsubInfo, "dateOfBirth": dob, "zipCode": $('#zipcode').val() };
	var eventInfo =  {type: 'step4a', meta: 'ageRange='+dob+',zipCode='+$('#zipcode').val()+''};
	emitAnalyticEvent(null, eventInfo);
	// temp fix - react to changes made to getMemberList
	$('body').data('fpwd',subscriberInfo);
	if(window.location.pathname.search('forgotusername') == -1){
		$.post("/members/services/Register/getMemberList", subscriberInfo, checkMemberInfo, "json");
	} else {
		$.post("/members/services/Register/getForgottenUserId", subscriberInfo, checkUserIDInfo, "json");
	}
}

function checkMemberInfo(data)
{
	$('#singlemember-loading-indicator').hide();
	if (data.error == "2001" && $('#page-forgotusername').length > 0)
	{
		data.error = "null";
	}
	if (data.error != "null")
	{
		displayServiceError(data.error);
	}
	else if (data.Members.length == 1)
	{
		if(data.Members[0].registered == 'false' && $('#page-forgotusername').length > 0)
		{
			displayServiceError("2006");
		}
		else if(data.Members[0].registered == 'true' && $('#page-forgotusername').length == 0)
		{
			displayServiceError("2001");
		}
		else
		{
			executeSingleMemberForward(data);
		}
	}
	else if (data.Members.length > 1)
	{
		$('#multiple-members-data').html('');
		if(data.Members[0].MemberLetters) { thisMemberLetters = data.Members[0].MemberLetters; } else { thisMemberLetters = ''; }
		$('#register-memberletters').val(thisMemberLetters);

		$('#register-subscriberid').val(data.Members[0].SubscriberId);
		$('#register-zipcode').val($('#zipcode').val());
		$('#register-dob').val(dob);
		$('#display-subid').html($('#subid').val().toUpperCase());
		$('#display-dob').html(dob);
		$('#display-zip').html($('#zipcode').val());
		validMemberCount = 0;
		newMemberList = new Object;
		newMemberList.Members = new Array();
		for (i = 0; i < data.Members.length; i++)
		{
			if( 	(data.Members[i].registered == 'true' && $('#page-forgotusername').length > 0) //build a list of members who ARE REGISTERED for the forgot username page
				|| 	(data.Members[i].registered == 'false' && $('#page-forgotusername').length == 0) //build a list of members who ARE NOT REGISTERD for the register page
			  )
			{
				$('#multiple-members-data').append('<input type="radio" name="override-memberid" id="override-memberid-' + i + '" value="' + data.Members[i].MemberId + ';' + data.Members[i].MemberName + ';' + data.Members[i].group + '">' + data.Members[i].MemberName + '<img src="/assets/common/images/spacer.gif" width="12" height="1" alt="" />');
				newMemberList.Members[validMemberCount] = new Object;
				newMemberList.Members[validMemberCount].MemberLetters = data.Members[i].MemberLetters;
				newMemberList.Members[validMemberCount].SubscriberId = data.Members[i].SubscriberId;
				newMemberList.Members[validMemberCount].MemberId = data.Members[i].MemberId;
				newMemberList.Members[validMemberCount].group = data.Members[i].group;
				newMemberList.Members[validMemberCount].MemberName = data.Members[i].MemberName;
				validMemberCount++;  //count this user - 0 is the first user
			}
		}
		if(validMemberCount == 1) //we only found one member so we should forward to the appropriate step 2
		{
			executeSingleMemberForward(newMemberList);
		}
		else if(validMemberCount > 1) //we found multiple valid members so we should show the select a member option
		{
			$('#step-one, .titleLeft p, .boxmsmms').fadeOut(function() { $('#selectmember').fadeIn("slow"); });
		}
		else //we ended up with no members - error 2001 - this should have been caught.
		{
			if($('#page-forgotusername').length > 0)
			{
				displayServiceError("2006");
			}
			else if($('#page-forgotusername').length == 0)
			{
				displayServiceError("2001");
			}
		}
	}
}

function executeSingleMemberForward(data)
{
	$('#display-membername').html(data.Members[0].MemberName);
	$('#display-subid').html($('#subid').val().toUpperCase());
	$('#display-dob').html(dob);
	$('#display-zip').html($('#zipcode').val());

	if($('#page-forgotusername').length > 0)
	{
		dob = $('#dob-month').val() + '/' + $('#dob-day').val() + '/' + $('#dob-year').val();
		if(data.Members[0].MemberLetters) { thisMemberLetters = data.Members[0].MemberLetters; } else { thisMemberLetters = ''; }
		thismember = thisMemberLetters + data.Members[0].SubscriberId + data.Members[0].MemberId;
		var subscriberInfo = { "memberId": thismember, "zipCode": $('#zipcode').val(), "dateOfBirth": dob };
		$.post("/members/services/Register/getForgottenUserId", subscriberInfo, checkUserIDInfo, "json");
	}
	else
	{
		if(data.Members[0].MemberLetters) { thisMemberLetters = data.Members[0].MemberLetters; } else { thisMemberLetters = ''; }
		$('#register-memberid').val(thisMemberLetters + data.Members[0].SubscriberId + data.Members[0].MemberId);
		$('#register-zipcode').val($('#zipcode').val());
		$('#register-dob').val(dob);
		$('#register-membername').val(data.Members[0].MemberName);
		$('#step-one, .titleLeft p, .boxmsmms').fadeOut(function() {
			if(true)// temp fix (data.Members[0].group == "true")
			{
				$('#user-id-selection').hide();
				$('#login-new').attr('checked','checked');
				$('#login-new').trigger('click');
			}
			$('#step-two').fadeIn("slow");

			// for mobile -- let analytics know that we are loading step-two
			try {
				waGenericPage("step-two")
			} catch (e) {

			}

			//Loading Page Two
			var actionInfo = {
				'name_1' : 'step',
				'meta_1' : 'step-two',
			};
			emitAnalyticEvent(actionInfo);
		});
	}
}

function chooseMember()
{
	$('#multiplemember-loading-indicator').show();
	if( $('#page-forgotusername').length > 0 ) //request from forgot username
	{
		dob = $('#dob-month').val() + '/' + $('#dob-day').val() + '/' + $('#dob-year').val();
		memberData = $('input[name=override-memberid]:checked').val().split(";");
		thismember = $('#register-memberletters').val() + $('#register-subscriberid').val().toUppercase() + memberData[0];
		$('#display-membername').html(memberData[1]);
		var subscriberInfo = { "memberId": thismember, "zipCode": $('#zipcode').val(), "dateOfBirth": dob };
		$.post("/members/services/Register/getForgottenUserId", subscriberInfo, checkUserIDInfo, "json");
	}
	else  //request from registration
	{
		memberData = $('input[name=override-memberid]:checked').val().split(";");
		$('#multiplemember-loading-indicator').hide();
		$('#register-memberid').val($('#register-memberletters').val() + $('#register-subscriberid').val() + memberData[0]);
		$('#display-membername').html(memberData[1]);
		$('#selectmember').fadeOut(function() {
			if(true)// temp fix (memberData[2] == "true")//check group status
			{
				$('#user-id-selection').hide();
				$('#login-new').attr('checked','checked');
				$('#login-new').trigger('click');
			}
			$('#step-two').fadeIn("slow");

			// for mobile -- let analytics know that we are loading step-two
			try {
				waGenericPage("step-two")
			} catch (e) {

			}

			//Loading Page Two
			var actionInfo = {
				'name_1' : 'step',
				'meta_1' : 'step-two',
			};
			emitAnalyticEvent(actionInfo);
		});
	}
}

function registerUser()
{
	var eventInfo =  {type: 'step7b', meta: ''};
	emitAnalyticEvent(null, eventInfo);
	if($('#securityQuestion').val() == 'own'){ registerSecurityQuestion = $('#yourOwnSecurityQuestion').val(); }
	else { registerSecurityQuestion = $('#securityQuestion').val(); }

	var mmFlagPref = $("input:radio[name='mmFlag']:checked").val() === 'true'? true: false;

	var registrationInfo = { "memberId": $('#register-memberid').val(), "zipCode": $('#register-zipcode').val(), "phoneNumber": localStorage.getItem("phoneNumber"), "birthDate": $('#register-dob').val(), "userId": $('#userid').val(), "password": $('#password1').val(), "challengeQuestion": registerSecurityQuestion, "challengeAnswer": $('#yourAnswer').val(), "contactPreference": "EMAIL", "email": $('#email1').val(), "solicitationPreference": "true", "mmFlag": mmFlagPref };
	$.post("/members/services/Register/registerMember", registrationInfo, checkRegisterUser, "json");
}

function registerExistingUser()
{
	var mmFlagPref = $("input:radio[name='mmFlag']:checked").val() === 'true'? true: false;

	var registrationInfo = { "memberId": $('#register-memberid').val(), "zipCode": $('#register-zipcode').val(), "birthDate": $('#register-dob').val(), "userId": $('#existing-userid').val(), "password": $('#existing-password').val(), "challengeQuestion": "", "challengeAnswer": "", "contactPreference": "EMAIL", "email": "", "solicitationPreference": "true", "mmFlag": mmFlagPref};
	$.post("/members/services/Register/registerMember", registrationInfo, checkRegisterUser, "json");
}

function checkRegisterUser(data)
{
	if (data.error != "null")
	{
		displayServiceError(data.error);
	}
	else if (data.success != "false")	//SUCCESS
	{
		if ($('#login-existing:checked').val() == 'LogIn')
		{
			$('#WAIUserID').val($('#existing-userid').val());
			$('#WAIPassword').val($('#existing-password').val());
			$('#frmMemberLogin').submit();
		}
		else if ($('#login-new:checked').val() == 'Create')
		{
			$('#WAIUserID').val($('#userid').val());
			$('#WAIPassword').val($('#password1').val());
			$('#frmMemberLogin').submit();
		}
	}
}

function registerConnectUser()
{
	if($('#securityQuestion').val() == 'own'){ connectSecurityQuestion = $('#yourOwnSecurityQuestion').val(); }
	else { connectSecurityQuestion = $('#securityQuestion').val(); }
	var registrationInfo = { "isExistingUser":false, "memberid": $('#connect-memberid').val(), "roleKey": $('#connect-roleKey').val(), "firstName": $('#connect-firstname').val(), "lastName": $('#connect-lastname').val(), "userName": $('#userid').val(), "password1": $('#password1').val(), "password2": $('#password1').val(), "dob": $('#connect-dob').val(), "email": $('#email1').val(), "question": connectSecurityQuestion, "answer": $('#yourAnswer').val(), "phone":"", "contactPreference": "EMAIL", "solicitationPreference": "true", "returnUrl": $('#connect-returnUrl').val()};
	$.post("/members/services/member/saveMember", registrationInfo, checkConnectRegisterUser, "json");
}

function registerConnectExistingUser()
{
	var registrationInfo = { "isExistingUser":true, "memberid": $('#connect-memberid').val(), "roleKey": $('#connect-roleKey').val(), "firstName": $('#connect-firstname').val(), "lastName": $('#connect-lastname').val(), "userName": $('#existing-userid').val(), "password1": $('#existing-password').val(), "password2": $('#existing-password').val(), "dob": $('#connect-dob').val(), "returnUrl": $('#connect-returnUrl').val()};
	$.post("/members/services/member/saveMember", registrationInfo, checkConnectRegisterUser, "json");
}

function checkConnectRegisterUser(data)
{
	if (data.error != "null")
	{
		displayServiceError(data.error);
	}
	else if (data.success != "false")	//SUCCESS
	{
		if ($('#login-existing:checked').val() == 'LogIn')
		{
			$('#WAIUserID').val($('#existing-userid').val());
			$('#WAIPassword').val($('#existing-password').val());
			$('#frmMemberLogin').submit();
		}
		else if ($('#login-new:checked').val() == 'Create')
		{
			$('#WAIUserID').val($('#userid').val());
			$('#WAIPassword').val($('#password1').val());
			$('#frmMemberLogin').submit();
		}
	}
}


function checkUserIDInfo(data)
{
	$('#multiplemember-loading-indicator').hide();

	if (data.error != "null")
	{
		displayServiceError(data.error);
	}
	else if (data.userId != "null")	//SUCCESS
	{
		if ($('input[name=override-memberid]:checked').length != -1)
		{
			$('#selectmember').fadeOut(function() {
				$('#step-two').fadeIn("slow");

				// for mobile -- let analytics know that we are loading step-two
				try {
					waGenericPage("step-two")
				} catch (e) {

				}

				//Loading Page Two
				var actionInfo = {
					'name_1' : 'step',
					'meta_1' : 'step-two',
				};
				emitAnalyticEvent(actionInfo);
			});
		}
		{
			$('#step-one, .titleLeft p, .boxmsmms').fadeOut(function() {
				$('#step-two').fadeIn("slow");

				// for mobile -- let analytics know that we are loading step-two
				try {
					waGenericPage("step-two")
				} catch (e) {

				}

				//Loading Page Two
				var actionInfo = {
					'name_1' : 'step',
					'meta_1' : 'step-two',
				};
				emitAnalyticEvent(actionInfo);
			});
		}

		$('#display-userid').html(data.userId);
		$('#UserID').val(data.userId);

		// temp fix - react to changes made to getMemberList
		$('#display-subid').html($('body').data('fpwd')['subscriberId']);
		$('#display-membername').html(data.userId);
		$('#display-dob').html($('body').data('fpwd')['dateOfBirth']);
		$('#display-zip').html($('body').data('fpwd')['zipCode']);


	}
}
function displayServiceError(thiserror)
{
	if($('#page-forgotusername').length > 0) { customMessage = 'retrieving your User ID'; }
	else  { customMessage = 'completing your registration'; }

	$('#bodyarea').addErrorMessage('found001','');
	$('#top-error-block').html(getServiceError(thiserror));
	// $('#top-error-block').html(getServiceError(thiserror) + '<h6>' + thiserror + '</h6>');

	/* if the error messages are not visible scroll to the display #top-error-block  */
	var error_top = $('#top-error-block').offset().top;
	var window_top = $(window).scrollTop();
	if (error_top < window_top)
	{
		$(window).scrollTop(error_top-10);
	}
}


function getServiceError(thiserror){

	var serviceError;

	function genericError (){
		return serviceError = '<p>Oops! The system found an error. It may be caused by:<br /><ul><li>Incorrect information - Re-type your entry and submit again.</li><li>A system or technical issue occurred - This is temporary, please try again later.</li></ul><p>If you get this error more than once, call Web Support at 1-888-705-7050 or <a href=\"mailto:example@email.com\">email us.</a></p>';
	}

	function dataError (){
		return serviceError = '<p>We\'re sorry. A data error is preventing us from ' + customMessage + '. Please call the Customer Service number on the back of your Member ID Card for assistance.</p>';
	}

	function systemError (){
		return serviceError = '<p>We\'re sorry. A system error is preventing is from ' + customMessage + '. Please try again. If you encounter this error multiple times, please call the Customer Service number on the back of your Member ID Card for assistance.</p>';
	}

	function systemTempError (){
		return serviceError = '<p>We\'re sorry. A system issue is preventing us from ' + customMessage + '.  We are working to resolve this issue.</p>';
	}

	function userIDError (){
		return serviceError = '<p>The User ID you have selected is already in use. Please choose a different User ID.</p>';
	}

	function incorrectPasswordError (){
		return serviceError = '<p>The password you specified is incorrect.</p>';
	}

	function lockedError (){
		return serviceError = '<p>The password you used to apply for your policy online has been locked. Please reset your password using the <a href="/sapps/buyonline/application/DashboardControl_forgotPassword.action">Forgot Password</a> process. </p>';
	}

	function answerMismatchError (){
		return serviceError = '<p>The answer you entered does not match our records. Please try again.</p>';
	}

	function generalLoginError (){
		return serviceError = '<p>Can we help? You seem to be having trouble logging in. Here\'s some tips:<br />- This log in is for User IDs and passwords established while buying a policy online. If you didn\'t buy your policy from the bcbsnc.com Web site, please create a new User ID and Password.<br />- Use the Forgot User ID or Forgot Password links to retreive your data.<br />- Select the other option to create a new User ID and Password for Blue Connect.</p>';
	}

	function alreadyRegisteredError (){
		return serviceError = '<p>You are already registered for Blue Connect. Did you <a href="forgotusername.htm">forget your User ID</a>? Did you <a href="forgotpassword.htm">forget your Password</a>?</p>';
	}

	function notRegisteredError (){
		return serviceError = '<p>This policy has not been registered for Blue Connect. Please <a href="index.htm">register for Blue Connect</a>.</p>';
	}

	function unregisterableError (){
		if(thiserror == '2011')
		{
			return serviceError = '<p>We\'re sorry. You cannot register for Blue Connect with this policy at this time. Check back soon.</p>';
		}
		else if(thiserror == '2012')
		{
			return serviceError = '<p>We\'re sorry. You cannot register for Blue Connect with this policy until 2013. Please try again after the 1st of the year.</p>';
		}
	}

	function multipleCandidatesError (){
		return serviceError = '<p>Multiple candidates for registration found.</p>';
	}

	function fepError (){
		return serviceError = '<p>Welcome Federal employee / Service Benefits Plan member. Your plan has its own site: Visit the FEP members home page.<br /><br />Note that your plan is not eligible to register for Blue Connect.</p>';
	}

	function shpError (){
		return serviceError = '<p>Welcome BCBSNC member.<br />Please visit the website for your plan:<br /><br /><strong>State Health Plan Retirees</strong>: <a href="http://www.shpnc.org/">Visit the State Health Plan home page</a><br /> Note that your plan is not eligible to register for Blue Connect.</p>';
	}

	function medSuppError (){
		return serviceError = '<p>Welcome BCBSNC member.<br />Please visit the website for your plan:<br /><br /><a href="/assets/medsupp-member/public/medicare-supplement/">Blue Medicare home page</a><br /> Note: your plan is not eligible to register for Blue Connect.</p>';
	}

	function  maxAttemptError(){
		return serviceError = 'Please call customer service at 1-888-206-4697 to access your account.';
	}

	function  getcodeError(){
		return serviceError = 'The authorization code you entered does not match the code sent to the phone number you provided, or is expired. You have ' + localStorage.getItem('on_load_counter') + ' remaining attempts to enter your code.';
    }

    function singlemembergetcodeError(){
    	return serviceError = 'We apologize, we cannot verify your identity. You must be enrolled to receive a authorization code. If you just enrolled, it may take up to 48 hours for us to verify your enrollment. Please re-enter your information, call technical support at 1-888-705-7050 or email us.';
    }

	var serviceErrors = {
		'GENERAL': genericError,
		'INVALIDREGISTRATIONINFO': genericError,
		'1008': genericError,
		'2002': genericError,
		'3001': genericError,
		'3002': genericError,
		'3003': genericError,
		'3004': genericError,
		'3006': genericError,
		'3008': genericError,
		'3011': genericError,

		'1001': systemTempError,
		'1002': systemTempError,

		'1003': dataError,
		'1004': dataError,
		'1005': dataError,
		'1006': dataError,

		'1007': systemError,
		'3005': systemError,
		'3007': systemError,
		'default': systemError,

		'2001': alreadyRegisteredError,
		'ALREADYREGISTERED': alreadyRegisteredError,

		'2003': fepError,

		'2004': shpError,
		'2005': shpError,

		'2006': notRegisteredError,
		'NOTREGISTERED': notRegisteredError,

		'2007': lockedError,

		'2008': generalLoginError,

		'2009': incorrectPasswordError,

		'2010': medSuppError,

		'2011': unregisterableError,
		'2012': unregisterableError,

		'3009': multipleCandidatesError,

		'3010': userIDError,
		'USERID': userIDError,

		'4011': answerMismatchError,

		'4012': singlemembergetcodeError,

		'4013': maxAttemptError,

		'4014': getcodeError,

	};

//Analytics report
	/*var actionInfo = {
		'name_1' : 'step',
		'meta_1' :  window.bcbsncDataLayer.action.meta_1,
		'name_2' : 'error',
		'meta_2' : serviceError
	};*/
	// emitAnalyticEvent(actionInfo);

	return serviceErrors[thiserror]();

}

function bindTooltips()
{
	/* bind remove  tooltip functionality  */
	$(".cluetip").tooltip({
		items: '.cluetip',
		content: function()
		{
			var	my_class = $(this).attr('class').replace('cluetip ','');
			var my_div = 'div.'+my_class;
			var my_html = ($(my_div).html() == null) ? 'Tooltip is not available' : $(my_div).html();
			return my_html;
		}
	}).attr('tabindex',0);
	//$(".cluetip").bgiframe();
}

(function($){
$.fn.bgIframe = $.fn.bgiframe = function(s) {
	// This is only for IE6
	if ( (navigator.appName == 'Microsoft Internet Explorer') && /\bMSIE 6/.test(navigator.userAgent) && !window.opera ) {
		s = $.extend({
			top     : 'auto', // auto == .currentStyle.borderTopWidth
			left    : 'auto', // auto == .currentStyle.borderLeftWidth
			width   : 'auto', // auto == offsetWidth
			height  : 'auto', // auto == offsetHeight
			opacity : true,
			src     : 'javascript:false;'
		}, s || {});
		var prop = function(n){return n&&n.constructor==Number?n+'px':n;},
		    html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
		               'style="display:block;position:absolute;z-index:-1;'+
			               (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
					       'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
					       'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
					       'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
					       'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
					'"/>';
		return this.each(function() {
			if ( $('> iframe.bgiframe', this).length == 0 )
				this.insertBefore( document.createElement(html), this.firstChild );
		});
	}
	return this;
};

})(jQuery);

	$(function(){
		$('#testpost').click(function(){
			$.post("/members/services/Register/getForgotPasswordQuestion", user, memberQuestionReturnFunction);
		});
	});

	function memberQuestionReturnFunction(data) {
		return true;
	}

	function initForgotPassword() {
		$('#submitIDs').click(function() {
			retrieveSecurityQuestion();
		});
	}

	function retrieveSecurityQuestion() {
		var user = new Array();
		user["subscriberId"] = $('#subscriberID').val().toUpperCase();
		user["userId"] = $('#userID').val();
		$.post("/members/services/Register/getForgotPasswordQuestion", user, memberQuestionReturnFunction, "json");
	}

	function requestNewPassword() {
		var user = new Array();
		user = { "userId" : document.forms.passwordForgottenForm.userId.value };
		$.post("/members/services/Register/requestNewPassword", user, displayEmailSent, "json");
	}

	function displayEmailSent(dataIn) {
		if(dataIn.error) {
			alert(dataIn.error);
		} else {
			$('#domainName').text(dataIn.email);
			$('#challengeQuestionForm, #responseBox').toggle();
		}
	}

	function memberQuestionReturnFunction(dataIn) {
		if(!dataIn.error) {
			alert(dataIn.error);
		} else {
			$("#challengeQuestion").text(dataIn.challengeQuestion);
			$('#forgotPassword').hide();
			$('#securityQuestion').show();
		}
		return true;
	}

	function checkSecurityQuestion() {
		$('#securityQuestion').hide();
		$('#passwordSent').show();
		$('.loginBox').show();
	}

// Change Password
	function validateChangePasswordInputs(form) {
		var errmsg = "";
		if(document.forms.passwordChangeForm.password.value == "") {
			errmsg += "<span class='leftMargin20'>Current Password</span><br />";
		}
		if(document.forms.passwordChangeForm.newPassword1.value == "") {
			errmsg += "<span class='leftMargin20'>New Password</span><br />";
		}
		if(document.forms.passwordChangeForm.newPassword2.value == "") {
			errmsg += "<span class='leftMargin20'>Re-enter Password</span><br />";
		}
		if(errmsg) {
			// display error
			$('#passwordChangeForm .errorBox ul').html('<li>The following fields are required: <br />' + errmsg + '</li>');
			$('#passwordChangeForm .errorBox').show();
			return false;
		} else {
			return true;
		}
		return false;
	}

// there are three forms on this page:
//		Forgot Password (passwordForgottenForm)
//		Challenge Question (challengeQuestionForm)
//		New Password (newPasswordForm)
//	and a successful password change message

// Forgot Password
	function validateUserInputs(form) {
		var errmsg = "";
		var userid = form.userId.value;
		var subscriberId = form.subscriberId.value.toUpperCase();
		var memberCode = form.memberCode.value;
		if( userid == "") {
			errmsg += "<li><span class='leftMargin20'>Please enter a User ID.</span><br /></li>";
		}
        else if(!validUser(userid)){
        	errmsg += "<li><span class='leftMargin20'>User ID must be at least 7 characters.</span><br /></li>";
		}
		if( subscriberId == "") {
			errmsg += "<li><span class='leftMargin20'>Please enter the Subscriber ID from your Member ID card.</span><br /></li>";
		}
		else if(!validSIDFormat(subscriberId)){
			errmsg += "<li><span class='leftMargin20'>Subscriber ID format incorrect. Please enter the letters and number in your Subscriber ID as it appears on your BCBSNC ID card.</span><br /></li>";
		}
		if( memberCode == "") {
			errmsg += "<li><span class='leftMargin20'>Please enter the Member Code from your Member ID card.</span><br /></li>";
		}
		else if(!validMemberCode(memberCode)){
			errmsg += "<li><span class='leftMargin20'>Member Code format incorrect. Please enter the number next to your name as it appears on your BCBSNC ID card.</span><br /></li>";
		}
		if(errmsg) {
			// display error
			$('#passwordForgottenForm .errorBox ul').html(errmsg);
			$('#passwordForgottenForm .errorBox').show();
		} else {
			var user = {
				"userId" : userid,
				"subscriberId" : subscriberId + memberCode
			};
			processSubmission(user);
		}
		return false;
	}

	function validUser(userid)
	{
		var validuser=true;
		if(userid.length<6 || userid.length>128 ||userid.match(/\s/) || !userid.match(/([a-zA-Z0-9+-_@\.])/))
		{
		 validuser=false;
		}
		return validuser;
	}

	function validSIDFormat(subscriberId)
	{

		var validFormat=true;

		var subscriberIdReg = new RegExp('^[a-zA-Z]{1}[a-zA-Z0-9]{3}[0-9]{5,8}|[0-9]{9,9}$');
		if(!subscriberIdReg.test(subscriberId))
		{
			validFormat=false;
		}

		return validFormat;
	}

	function validMemberCode(memberCode)
	{
		var validFormat=true;
		if(memberCode.length!=2 || !memberCode.match(/([0-9])/))
		{
			validFormat=false;
		}
		return validFormat;
	}

	function processSubmission(user) {
		if(typeof processSubmission.ctr == 'undefined'){
			processSubmission.ctr = 0;
		}
		$.post("/members/services/Register/getForgotPasswordQuestion", user, function(dataIn) {
			if(dataIn.error == "null" && dataIn.challengeQuestion) {
				//display the challenge question screen
				displayChallengeQuestion(dataIn);
			} else {
			    // display error
				//fix for 575
			    if(dataIn.error == "2004")
				    var errmsg= "<li><span class='leftMargin20'>Your policy has been terminated for more than 18 months and is no longer eligible for Blue Connect.<br /></li>";
				else
				    var errmsg= "<li><span class='leftMargin20'>The information you entered does not match our records.<br /></li>";
				$('#passwordForgottenForm .errorBox ul').html(errmsg);
				$('#passwordForgottenForm .errorBox').show();
			}
		}, "json");
	}

// Challenge Question
	function displayChallengeQuestion(dataIn) {
		$('#challengeQuestion').text(dataIn.challengeQuestion);
		$('#passwordForgottenForm, #challengeQuestionForm').toggle();
	}

	function validateSecurityInputs() {
		var errmsg = "";
		if(document.forms.challengeQuestionForm.challengeAnswer.value == "") {
			// display error
			$('#challengeQuestionForm .errorBox ul').html('<li>Please enter the answer to your Security Question.</li>');
			$('#challengeQuestionForm .errorBox').show();
		} else {
			processChallengeQuestion();
		}
		return false;
	}

	function processChallengeQuestion() {
		if(typeof processChallengeQuestion.ctr == 'undefined') {
			processChallengeQuestion.ctr = 0;
		}
		var userAnswer = {
			"userId" : document.forms.passwordForgottenForm.userId.value,
			"challengeAnswer" : document.forms.challengeQuestionForm.challengeAnswer.value
		};
		$.post("/members/services/Register/validateQuestionAnswer", userAnswer, function(dataIn) {
			if(dataIn.success) {
				// display the new password screen
				displaySetNewPassword();
			} else {
				// display error
				if(++processChallengeQuestion.ctr < 5) {
					$	('#challengeQuestionForm .errorBox ul').html('<li>The answer you entered does not match our records. Please try again.</li><h6>' + dataIn.error + '</h6>');
					$('#challengeQuestionForm .errorBox').show();
				} else {
					requestNewPassword("");
				}
			}
		}, "json");
	}

// Set New Password
	function displaySetNewPassword() {
		$('#challengeQuestionForm, #setNewPasswordForm').toggle();
	}
// New Password
	function displayNewPassword() {
		$('#challengeQuestionForm, #newPasswordForm').toggle();
	}
	function validatePasswordInputs(frm) {
		var errmsg = "";
		if(frm.name == 'newPasswordForm')
	    {
			if(frm.temppassword.value == "") {
				errmsg +="<li><span class='leftMargin20'>Please enter your temporary password exactly as it is shown in the e-mail you received.</span><br /></li>";
			}
			if(frm.password1.value == "") {
				errmsg += "<li><span class='leftMargin20'>Enter a new password.</span><br /></li>";
			}
		}
		else
		{
			if(frm.password1.value == "") {
				errmsg += "<li><span class='leftMargin20'>Enter a password.</span><br /></li>";
			}
		}

		if(frm.password2.value == "") {
			errmsg += "<li><span class='leftMargin20'>Re-type your Password.</span><br /></li>";
		}
		if(frm.password1.value != frm.password2.value) {
			// display error
			errmsg +="<li><span class='leftMargin20'>Passwords do not match. Re-enter your password.</span></br></li>";

		}

		if($('#resetPassword1').data('validPassword') === false && $('#password1').data('validPassword') === false){
			errmsg +="<li><span class='leftMargin20'>Please select a password that is more secure as indicated by the strength bar.</span></br></li>";
		}

		if(errmsg) {
			// display error
			if(frm.name == 'newPasswordForm')
		    {
				$('#newPasswordForm .errorBox ul').html( errmsg );
				$('#newPasswordForm .errorBox').show();

			}
			else
			{
				$('#setNewPasswordForm .errorBox ul').html( errmsg );
				$('#setNewPasswordForm .errorBox').show();
			}

		} else {
			if(frm.name == 'newPasswordForm')
			{
				processTempPassword();
			}
			else if(frm.name == 'setNewPasswordForm')
			{
				processNewPassword();
			}

		}
		return false;
	}

	function processTempPassword() {
		var tempPassword = {
			"tempPWD" : $('#resetPassword').val(),
			"newPWD" : $('#resetPassword1').val(),
			"reTypePWD" : $('#resetPassword2').val()
		};

		jQuery.post("/members/services/Password/tempPasswordReset", tempPassword, function(dataIn) {

			if(dataIn.success) {
				// display the success message
				displaySuccess(dataIn);
			} else {
				// display error
				var errmsg ="<li><span class='leftMargin20'>Temporary Password is incorrect. Please enter your temporary password exactly as it is shown in the email you received.</span></br></li>";
				$('#newPasswordForm .errorBox ul').html( errmsg );
				$('#newPasswordForm .errorBox').show();
			}
		}, "json");
	}

	function processNewPassword() {
		var newPassword = {
			// "userId" : document.forms.passwordForgottenForm.userId.value,
			"challengeAnswer" : document.forms.challengeQuestionForm.challengeAnswer.value,
			"newPassword" : document.forms.setNewPasswordForm.password1.value
		};
		$.post("/members/services/Register/changePassword", newPassword, function(dataIn) {

			if(dataIn.success) {
				newPassword.userId = document.forms.passwordForgottenForm.userId.value;
				// display the success message
				displaySuccess(newPassword);
			} else {
				// display error
				displayError('setNewPasswordForm', dataIn);
			}
		}, "json");
	}
	function displaySuccess(data) {

		$('#successMessage #userID').val(data['userId']);
		$('#successMessage #password').val(data['newPassword']);
		$('#successMessage').show();
		$('#newPasswordForm, #setNewPasswordForm').hide();

        //change form submit to take user to home page if they have changed a temp password
        if(!data['userId']){
            $('#loginForm').on('submit', function (e) {
							e.preventDefault();

							window.location.href = '/members/secure/welcome.htm';
						});
        }
	}

//	general display error function
	function displayError(errorFormID, dataIn) {
		var errmsg = getErrorMessage(dataIn.error);
		$('#' + errorFormID + ' .errorBox ul').html('<li>' + dataIn.error + ': ' + errmsg + '</li>');
		$('#' + errorFormID + ' .errorBox').show();
	}

	$(function(){
		$('#userId').blur( function(event) {
			$('p').removeClass('input-error');
			$('#top-error-block').hide();
			if($('#userId').val() != "" ) {
				$(this).validateUserId(event);
			}
		});
		$('#subscriberId').blur( function(event) {
			$('p').removeClass('input-error');
			$('#top-error-block').hide();
			if($('#subscriberId').val() != "" ) {
				$(this).validateSubscriberId(event);
			}
		});
	});

    /*********************************************************************/
    // login routines
    // note: this routine is duplicated in member.js, as these js files are
    // loaded exclusively to one another.

    function validateLoginInputs(form) {
        var form = form || document.forms.loginForm,
        userID = form.userID || form.userID2,
        errmsg = "";

        if(userID.value == "" || form.password.value == "") {
        errmsg = "Both User ID and Password are required. Please try again.";
        }

        if(errmsg) {
        // set focus in appropriate input box
        if(userID.value == "") {
        userID.focus();
        } else {
        form.password.focus();
        }
        $('#loginErrorMsg').html(errmsg).show();

        return false;
        } else {
        return true;
        }
    }
