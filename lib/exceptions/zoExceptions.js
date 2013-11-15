
var u = require("underscore");
var getError =  function (oRequest){
		$oResponse = u.omit(oRequest,'method', 'params');
		$this = u.omit(this, 'method', 'params','class','id','jsonrpc');
		$oResponse.error = {};
		u.extend($oResponse.error, $this);
		return $oResponse;
};


//INVALID REQUEST TO SERVER
(function (global){
	function invalid_request(settings){
			settings = settings || {};
			this.error = {};
			this.error.code = -32600;
			this.error.message = 'Malformed or invalid_request';
			this.jsonrpc = "2.0";
			this.id = null;
	};
	invalid_request.prototype.getError = getError;
	global.RPC_INVALID_REQUEST = invalid_request;
}(typeof window === 'undefined' ? exports:window));

//METHOD NOT FOUND
(function (global){
	function method_not_found(settings){
			settings = settings || {};
			this.error = {};
			this.id = settings.id || null;
			this.jsonrpc= "2.0";
			this.error.code = -32601;
			var method = settings.method || '';
			this.error.message = 'Method '+ method + ' does not exists.';

	};
	method_not_found.prototype.getError = getError;
	global.RPC_METHOD_NOT_FOUND = method_not_found;
}(typeof window === 'undefined' ? exports:window));

//INVALID PARAMS
(function (global){
	function invalid_params(settings){
			settings = settings || {};
			this.id = settings.id || null;
			this.jsonrpc = "2.0";
			this.error = {};

			this.error.code = -32602;
			this.error.message = 'Invalid Params';

	};
	invalid_params.prototype.getError = getError;
	global.RPC_INVALID_PARAMS = invalid_params;
}(typeof window === 'undefined' ? exports:window));

//SERVER INTERNAL ERROR
(function (global){
	function internal_error(settings){
			settings = settings || {};
			this.id = settings.id || null;
			this.jsonrpc = "2.0";
			this.error = {};
			this.error.code = -32603;
			this.error.message = 'Server Internal Error';

	};
	internal_error.prototype.getError = getError;
	global.RPC_INTERNAL_ERROR = internal_error;
}(typeof window === 'undefined' ? exports:window));


//CLASS NOT FOUND
(function (global){
	function class_not_found(settings){
			settings = settings || {};

			this.id = settings.id || null;
			this.jsonrpc = "2.0";
			this.error = {};
			this.error.code = -32603;
			var Class = settings.class || '';
			this.error.message = 'Class '+ Class + ' does not exists.';

	};
	class_not_found.prototype.getError = getError;
	global.RPC_CLASS_NOT_FOUND = class_not_found;
}(typeof window === 'undefined' ? exports:window));


//CLASS NOT FOUND
(function (global){
	function not_found_data(settings){
			settings = settings || {};
			this.id = settings.id || null;
			this.jsonrpc = "2.0";
			this.error = {};
			this.error.code = -32604;
			this.error.message = 'End Point not found';

	};
	not_found_data.prototype.getError = getError;
	global.RPC_NOT_FOUND_DATA = not_found_data;
}(typeof window === 'undefined' ? exports:window));

