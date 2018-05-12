// Copyright (c) 2018, Maintenance and Repair Services and contributors
// For license information, please see license.txt

frappe.ui.form.on('Expiry Warning Settings', {
	refresh: function(frm) {
		
	},
	hourly:function(frm) {
		frm.set_value("dailly",0);	
	},
	dailly:function(frm) {
		frm.set_value("hourly",0);		
	},
});
