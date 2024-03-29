from frappe import _

def get_data():
	return {
		'heatmap': True,
		'heatmap_message': _('This is based on stock movement. See {0} for details')\
			.format('<a href="#query-report/Stock Ledger">' + _('Stock Ledger') + '</a>'),
		'transactions': [

			{
				'label': _('Maintenance'),
				'items': ['Delivery Note', 'Sales Invoice']
			},
			{
				'label': _('Feedback'),
				'items': ['Customers Feedback',  'Maintenance Stuff']
			}
		]
	}
