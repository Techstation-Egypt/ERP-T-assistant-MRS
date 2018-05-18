# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe

def get_notification_config():
	notifications =  { "for_doctype":
		{		
			"Maintenance Order": "maintenance_repair_services.notifications.get_expiry_orders"
		}
	}

	doctype = [d for d in notifications.get('for_doctype')]
	for doc in frappe.get_all('DocType',
		fields= ["name"], filters = {"name": ("not in", doctype), 'is_submittable': 1}):
		notifications["for_doctype"][doc.name] = {"docstatus": 0}

	return notifications


def get_expiry_orders():
	if frappe.db.get_value("Expiry Warning Settings", None, "hourly") == '1':
		hourly = frappe.db.get_value("Expiry Warning Settings", None, "expiry_warning_durati")
		if hourly:	
			return frappe.db.sql("""\
				SELECT count(*)
				FROM `tabMaintenance Order`
				WHERE status not in ('Completed', 'Canceled')
				AND TIMESTAMPDIFF(HOUR, CURDATE(), end_date) <=%s
				""",hourly)[0][0]

	if frappe.db.get_value("Expiry Warning Settings", None, "dailly") == '1':
		dailly = frappe.db.get_value("Expiry Warning Settings", None, "expiry_warning_durati2")
		if dailly:	
			return frappe.db.sql("""\
				SELECT count(*)
				FROM `tabMaintenance Order`
				WHERE status not in ('Completed', 'Canceled')
				AND DATEDIFF(CURDATE(),end_date) <=%s
				""",dailly)[0][0]
