// Copyright (c) 2018, Products Maintenance and contributors
// For license information, please see license.txt

{% include 'erpnext/selling/sales_common.js' %}

frappe.ui.form.on('Maintenance Order', {
	refresh: function(frm) {
		 frappe.meta.get_docfield("Maintenance Order Items","qty", cur_frm.doc.name).read_only = 0;
	},
	customer: function(frm) {
		frm.set_value('item_code','');
	},
	onload: function(frm) {

	frappe.db.get_value('Maintenance Section', null,'section_name', function(r) {
			console.log(r)
			if (!r)
				frm.toggle_display("section", false); 
			else
				frm.toggle_display("section", true); 
		});

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
			if (row.item_group=='Services') 
				if (row.qty > 1){
					//frappe.msgprint(__("Service Item quantity could not be more than 1"))
					row.qty =1;
					frm.toggle_display("qty", true)
		 frappe.meta.get_docfield("Maintenance Order Items","qty", cur_frm.doc.name).read_only = 1;
					}
			
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
			if (row.qty < 1)
			row.rate = r.message.price_list_rate * row.qty;
			else if (row.qty >= 1) row.rate = r.message.price_list_rate;

			row.net_rate = row.rate;
			row.amount = flt(row.rate * row.qty);
			refresh_field("qty", cdn, "product_for_maintenance");
			refresh_field("rate", cdn, "product_for_maintenance");
			refresh_field("net_rate", cdn, "product_for_maintenance");
			refresh_field("amount", cdn, "product_for_maintenance");
			}
		}});
	},
	qty: function(frm,cdt,cdn) {
		var row = locals[cdt][cdn];
			if (row.item_group=='Services') 
				if (row.qty > 1){
					//frappe.msgprint(__("Service Item quantity could not be more than 1"))
					row.qty =1;
					refresh_field("qty", cdn, "product_for_maintenance");
					frm.toggle_display("qty", true)
		 frappe.meta.get_docfield("Maintenance Order Items","qty", cur_frm.doc.name).read_only = 1;
					return false;
					}

			if (row.qty < 1)
			row.rate = row.rate * row.qty;
			else if (row.qty >= 1) row.rate = row.rate;

			row.net_rate = row.rate;
			row.amount = flt(row.rate * row.qty);
			refresh_field("qty", cdn, "product_for_maintenance");
			refresh_field("rate", cdn, "product_for_maintenance");
			refresh_field("net_rate", cdn, "product_for_maintenance");
			refresh_field("amount", cdn, "product_for_maintenance");

		
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

