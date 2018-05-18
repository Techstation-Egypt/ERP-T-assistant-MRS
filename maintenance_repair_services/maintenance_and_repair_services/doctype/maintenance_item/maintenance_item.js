// Copyright (c) 2018, Products Maintenance and contributors
// For license information, please see license.txt

frappe.ui.form.on('Maintenance Item', {
	refresh: function(frm) {
	frm.fields_dict.product_category.get_query = function() {
			return {
				filters:{
					'active': 1
				}
			}
		}

	}
});
