# -*- coding: utf-8 -*-
# Copyright (c) 2018, Products Maintenance and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.mapper import get_mapped_doc
from frappe.utils import flt, nowdate, getdate
from frappe.model.document import Document
from frappe import _

#from erpnext.controllers.selling_controller import SellingController

form_grid_templates = {
	"items": "templates/form_grid/item_grid.html"
}

class MaintenanceOrder(Document):
	pass
#	def __init__(self, *args, **kwargs):
#		super(MaintenanceOrder, self).__init__(*args, **kwargs)



@frappe.whitelist()
def make_sales_invoice(source_name, target_doc=None, ignore_permissions=False):
	def postprocess(source, target):
		set_missing_values(source, target)
		#Get the advance paid Journal Entries in Sales Invoice Advance
		target.set_advances()

	def set_missing_values(source, target):
		target.is_pos = 0
		target.ignore_pricing_rule = 1
		target.flags.ignore_permissions = True
		target.run_method("set_missing_values")
		#target.run_method("set_po_nos")
		target.run_method("calculate_taxes_and_totals")

		# set company address
		#target.update(get_company_address(target.company))
		#if target.company_address:
		#	target.update(get_fetch_values("Sales Invoice", 'company_address', target.company_address))

	def update_item(source, target, source_parent):
		target.amount = flt(source.amount) 
		target.base_amount = target.amount 
		target.qty = target.amount / flt(source.rate) if (source.rate) else source.qty

		item = frappe.db.get_value("Item", target.item_code, ["item_group", "selling_cost_center"], as_dict=1)
		#target.cost_center = frappe.db.get_value("Project", source_parent.project, "cost_center") \
		#	or item.selling_cost_center \
		#	or frappe.db.get_value("Item Group", item.item_group, "default_cost_center")

	doclist = get_mapped_doc("Maintenance Order", source_name, {
		"Maintenance Order": {
			"doctype": "Sales Invoice",
			"validation": {
				"docstatus": ["=", 1]
			}
		},
		"Maintenance Order Items": {
			"doctype": "Sales Invoice Item",
			"postprocess": update_item
		}
	}, target_doc, postprocess, ignore_permissions=ignore_permissions)

	return doclist


@frappe.whitelist()
def make_delivery_note(source_name, target_doc=None, ignore_permissions=False):
	def postprocess(source, target):
		set_missing_values(source, target)
		#Get the advance paid Journal Entries in Sales Invoice Advance
		#target.set_advances()

	def set_missing_values(source, target):
		target.is_pos = 0
		target.ignore_pricing_rule = 1
		target.flags.ignore_permissions = True
		target.run_method("set_missing_values")
		#target.run_method("set_po_nos")
		#target.run_method("calculate_taxes_and_totals")

		# set company address
		#target.update(get_company_address(target.company))
		#if target.company_address:
		#	target.update(get_fetch_values("Sales Invoice", 'company_address', target.company_address))

	def update_item(source, target, source_parent):
		target.amount = flt(source.amount) 
		target.base_amount = target.amount 
		target.qty = target.amount / flt(source.rate) if (source.rate) else source.qty

		item = frappe.db.get_value("Item", target.item_code, ["item_group", "selling_cost_center"], as_dict=1)
		#target.cost_center = frappe.db.get_value("Project", source_parent.project, "cost_center") \
		#	or item.selling_cost_center \
		#	or frappe.db.get_value("Item Group", item.item_group, "default_cost_center")

	doclist = get_mapped_doc("Maintenance Order", source_name, {
		"Maintenance Order": {
			"doctype": "Delivery Note",
			"validation": {
				"docstatus": ["=", 1]
			}
		},
		"Maintenance Order Items": {
			"doctype": "Delivery Note Item",
			"postprocess": update_item
		}
	}, target_doc, postprocess, ignore_permissions=ignore_permissions)

	return doclist
