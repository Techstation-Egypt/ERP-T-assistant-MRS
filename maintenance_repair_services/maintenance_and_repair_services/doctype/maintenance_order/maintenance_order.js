// Copyright (c) 2018, Products Maintenance and contributors
// For license information, please see license.txt

{% include 'erpnext/selling/sales_common.js' %}

frappe.ui.form.on('Maintenance Order', {
	refresh: function(frm) {

	},
	onload: function(frm) {

	if (frappe.user.has_role("Maintenance Manager"))
		frm.toggle_display("products_details", true); 
	else if (!frappe.user.has_role("Maintenance Manager") && frappe.user.has_role("Customer"))
		frm.toggle_display("products_details", false); 

	frm.fields_dict.item_code.get_query = function() {
			return {
				filters:{
					'customer': frm.doc.customer
				}
			}
		}


	},

      


});
frappe.ui.form.on("Maintenance Order Items", {
	item_code: function(frm,cdt,cdn) {
		var row = locals[cdt][cdn];
			
			frappe.call({
				method: "frappe.client.get_value",
				args: {
					doctype: "Item Price",
					fieldname: "price_list_rate",
					filters: { item_code:row.item_code,
						   selling:1  }
				},
				callback: function(r) {
					if (r.message) {
			console.log(r.message);
			row.rate = r.message.price_list_rate;
			row.net_rate = row.rate;
			row.amount = flt(row.rate * row.qty);
			refresh_field("net_rate", cdn, "product_for_maintenance");
			refresh_field("amount", cdn, "product_for_maintenance");
			}
		}});
	},
	amount: function(frm,cdt,cdn) {
		var row = locals[cdt][cdn];
			row.net_rate = row.rate;
			row.amount = flt(row.rate * row.qty);
			refresh_field("net_rate", cdn, "product_for_maintenance");
			refresh_field("amount", cdn, "product_for_maintenance");

		
	},
	rate: function(frm,cdt,cdn) {
		var row = locals[cdt][cdn];
			row.net_rate = row.rate;
			row.amount = flt(row.rate * row.qty);
			refresh_field("net_rate", cdn, "product_for_maintenance");
			refresh_field("amount", cdn, "product_for_maintenance");

		
	}

});


erpnext.selling.MaintenanceController = erpnext.selling.SellingController.extend({
onload: function(doc, dt, dn) {
		var me = this;
		this._super(doc, dt, dn);


	},
	refresh: function(doc, dt, dn) {
		this._super(doc, dt, dn);
}
});

