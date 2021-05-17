$(document).ready(function(){  
  $('#forgotPassword').click (function(){	 
	  $('#fpDiv').removeClass('hideme');
	  $('#loginDiv').addClass('hideme');
  })
  $('#cancelFP').click (function(){	 
	  $('#loginDiv').removeClass('hideme');
	  $('#fpDiv').addClass('hideme');
  })
  $('#sendP').click (function(){	 
	  $('#spDiv').removeClass('hideme');
	  $('#fpDiv').addClass('hideme');	  
  })
  $('#backToLogin').click (function(){	 
	  $('#loginDiv').removeClass('hideme');
	  $('#spDiv').addClass('hideme');
  })
  $('#registerNewUser').click (function(){	 
	  $('#registerNewUserDiv').removeClass('hideme');
	  $('#loginDiv').addClass('hideme');
  })
  $('#registerBtn').click (function(){	 
	  $('#registerNewUserDiv').addClass('hideme');
	  $('#registerNewUserConfirmDiv').removeClass('hideme');
	  //$("form :input").prop('required',false);
	  //$(".inputlogin, .floating-select").prop('required',false);
  })
  $('#backToLoginFrmUR').click (function(){	 
	  $('#loginDiv').removeClass('hideme');
	  $('#registerNewUserConfirmDiv').addClass('hideme');
  })
  $('#backToLoginRUlnk').click (function(){	 
	  $('#loginDiv').removeClass('hideme');
	  $('#registerNewUserDiv').addClass('hideme');
  })
})






